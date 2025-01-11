import { config } from "@root/config";
import { ServerError } from "error-express";
import jwt from "jsonwebtoken";

class JWTService {
  public signToken(data: { id?: string; sessionId: string }, expire?: string) {
    const token = jwt.sign(data, config.JWT_SEC!, {
      expiresIn: expire || "30d",
    });

    return token;
  }

  public async verifyToken(
    token: string
  ): Promise<{ id: string; sessionId: string }> {
    return new Promise((resolve, reject) => {
      jwt.verify(token, config.JWT_SEC!, (err, user) => {
        if (err) {
          return reject(new ServerError(err.message, 401));
        }
        resolve(user as { id: string; sessionId: string });
      });
    });
  }
}

export const jwtService: JWTService = new JWTService();
