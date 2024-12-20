import sessionModel from "@models/sessionModel";
import { authService } from "@services/db/authService";
import {
  authenticateRefresh,
  authenticateSession,
} from "@services/decorators/authenticateSessionDecorators";
import { joiValidation } from "@services/decorators/joiValidationDecorators";
import { authQueue } from "@services/queues/authQueue";
import { signinSchema, signupSchema } from "@services/schemas/auth.schema";
import { thirtyDaysFromNow } from "@services/utils/date-time";
import { BadRequestError } from "@services/utils/errorHandler";
import { jwtService } from "@services/utils/jwt";
import { Request, Response } from "express";

export class AuthController {
  @joiValidation(signupSchema)
  async register(req: Request, res: Response) {
    const { email, password, name } = req.body;

    const existingUser = await authService.getUserByEmail(email);
    if (existingUser) {
      throw new BadRequestError("Email already in use", 400);
    }

    const newUser = await authService.createUser({ email, name, password });

    // todo: send verification email link to your email

    res.status(201).json({
      message: "User registration successful.",
      user: newUser,
    });
  }

  @joiValidation(signinSchema)
  async login(req: Request, res: Response) {
    const { email, password } = req.body;
    const userAgent = req.headers["user-agent"];

    const user = await authService.getUserByEmail(email);
    if (!user || !(await user.comparePassword(password))) {
      throw new BadRequestError("Invalid credentials", 400);
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
        runValidators: true,
      }
    );

    const accessToken = jwtService.signToken(
      {
        id: user._id!,
        sessionId: session?._id!,
      },
      "1h"
    );
    const refreshToken = jwtService.signToken({
      sessionId: session?._id!,
    });

    res.status(200).json({
      message: "Login successful.",
      user,
      accessToken,
      refreshToken,
      mfaRequired: false,
    });
  }
  @authenticateRefresh()
  async refreshTokenGenerate(req: Request, res: Response) {
    const session = await sessionModel.findByIdAndUpdate(req.sessionId, {
      expiredAt: thirtyDaysFromNow(),
    });

    const accessToken = jwtService.signToken(
      {
        id: `${session?.userId!}`,
        sessionId: session?._id!,
      },
      "1h"
    );
    const refreshToken = jwtService.signToken({
      sessionId: session?._id!,
    });

    res.status(200).json({
      message: "RefreshToken successful.",
      accessToken,
      refreshToken,
    });
  }
  @authenticateSession()
  async logOut(req: Request, res: Response) {
    await sessionModel.findByIdAndUpdate(req.sessionId, {
      isOnline: false,
      resticted: true,
      expiredAt: Date.now(),
    });

    res.status(200).json({
      message: "Logout successful.",
    });
  }
  @authenticateSession()
  async deleteSession(req: Request, res: Response) {
    const { sessionId } = req.body;

    if (sessionId === req.sessionId) {
      throw new BadRequestError("Can't delete your own session", 400);
    }

    await sessionModel.findByIdAndDelete(sessionId);

    res.status(200).json({
      message: "Logout successful.",
    });
  }
  @authenticateSession()
  async getAllSession(req: Request, res: Response) {
    const userId = req.user?._id;

    const allSession = await sessionModel.find({
      userId,
    });

    console.log(req.sessionId)

    const formated = allSession.map((session) => ({
      ...session.toJSON(),
      ...(`${session._id}` === `${req.sessionId}` ? { won: true } : {}),
    }));

    res.status(200).json({
      message: "Sessions successful.",
      sessions: formated,
    });
  }
}
