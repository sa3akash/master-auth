import { authenticateSession } from "@services/decorators/authenticateSessionDecorators";
import { Request, Response } from "express";

export class MFAController {
  @authenticateSession()
  async generate(req: Request, res: Response) {
    const { email, password, name } = req.body;

    if(req.user?.userPreferences.enable2FA){
      throw new Error("Two-factor authentication is already enabled.");
    }

    res.status(201).json({
      message: "Check your mailbox and verify your account.",
      email: email,
    });
  }
}
