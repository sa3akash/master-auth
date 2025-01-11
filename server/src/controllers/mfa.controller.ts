import userModel from "@models/userModel";
import { authenticateSession } from "@services/decorators/authenticateSessionDecorators";
import { Request, Response } from "express";
import speakeasy from "speakeasy";
import qrcode from "qrcode";
import { joiValidation } from "@services/decorators/joiValidationDecorators";
import { mfaVerifySchema } from "@services/schemas/auth.schema";
import { authService } from "@services/db/authService";
import sessionModel from "@models/sessionModel";
import { thirtyDaysFromNow } from "@services/utils/date-time";
import { jwtService } from "@services/utils/jwt";
import { ServerError } from "error-express";



export class MFAController {
  @authenticateSession()
  async generate(req: Request, res: Response) {
    const user = req.user;

    if (user?.userPreferences.enable2FA) {
      throw new ServerError(
        "Two-factor authentication is already enabled.",
        400
      );
    }

    let mfaSecret = user?.userPreferences.twoFactorSecret;

    if (!mfaSecret) {
      const secret = speakeasy.generateSecret({
        name: "master-auth",
      });
      mfaSecret = secret.base32;

      await userModel.findByIdAndUpdate(`${user?._id}`, {
        $set: {
          "userPreferences.twoFactorSecret": secret.base32,
        },
      });
    }

    const url = speakeasy.otpauthURL({
      secret: mfaSecret,
      encoding: "base32",
      label: `MA-${user?.email}`,
    });

    const qrcodeImage = await qrcode.toDataURL(url);

    res.status(201).json({
      message: "Scan the qrcode or setup secret key",
      secretKey: mfaSecret,
      qrcodeImage: qrcodeImage,
    });
  }
  @authenticateSession()
  @joiValidation(mfaVerifySchema)
  async verify(req: Request, res: Response) {
    const { code, secretKey } = req.body;
    const user = req.user;

    if (user?.userPreferences.enable2FA) {
      throw new ServerError(
        "Two-factor authentication is already enabled.",
        400
      );
    }
    
    const isValid = speakeasy.totp.verify({
      secret: secretKey,
      encoding: "base32",
      token: code,
      // window: 1
    });

    if (!isValid) {
      throw new ServerError("Invalid code.", 400);
    }

    await userModel.findByIdAndUpdate(user?._id, {
      $set: {
        "userPreferences.enable2FA": true,
      },
    });

    res.status(200).json({
      message: "Two-factor authentication successful.",
      enable2FA: true,
    });
  }

  async login2FA(req: Request, res: Response) {
    const { code, email } = req.body;
    const userAgent = req.headers["user-agent"];

    if (!code || !email) {
      throw new ServerError("All are is required", 404);
    }

    const user = await authService.getUserByEmail(`${email}`);
    if (!user) {
      throw new ServerError("User not found", 404);
    }

    const isValid = speakeasy.totp.verify({
      secret: user.userPreferences.twoFactorSecret,
      encoding: "base32",
      token: code,
      // window: 1
    });

    if (!isValid) {
      throw new ServerError("Invalid code.", 400);
    }

    const ip =
      req.ip || req.headers["x-forwarded-for"] || req.socket.remoteAddress;

    const session = await sessionModel.findOneAndUpdate(
      { userId: user._id, userAgent },
      {
        userId: user._id,
        userAgent: userAgent,
        ipAddress: `${ip}`,
        resticted: false,
        isOnline: true,
        expiredAt: thirtyDaysFromNow(),
      },
      {
        upsert: true,
        new: true,
        // runValidators: true,
      }
    );

    const accessToken = jwtService.signToken(
      {
        id: user._id!,
        sessionId: session?._id!,
      },
      "1d"
    );
    const refreshToken = jwtService.signToken({
      sessionId: session?._id!,
    });

    res.cookie('accessToken',accessToken,{httpOnly:true})
    res.cookie('refreshToken',refreshToken,{httpOnly:true})

    res.status(200).json({
      message: "Login successful.",
      user,
      accessToken,
      refreshToken,
    });
  }
  @authenticateSession()
  async off2FA(req: Request, res: Response) {
    const user = req.user;

    if (!user?.userPreferences.enable2FA) {
      throw new ServerError(
        "Two-factor authentication is already disabled.",
        400
      );
    }

    await userModel.findByIdAndUpdate(user._id, {
      $set: {
        "userPreferences.enable2FA": false,
      },
    });

    res.status(200).json({
      message: "2FA Authentication disabled.",
    });
  }
}
