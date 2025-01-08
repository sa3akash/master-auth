import sessionModel from "@models/sessionModel";
import userModel from "@models/userModel";
import { Role } from "@services/interfaces/enum";
import { IUserDocument } from "@services/interfaces/user.interface";
import { BadRequestError, CustomError } from "@services/utils/errorHandler";
import { jwtService } from "@services/utils/jwt";
import { NextFunction, Request, Response } from "express";
import { JsonWebTokenError } from "jsonwebtoken";

export function authenticateSession(...roles: Role[]): MethodDecorator {
  return (
    target: any,
    propertyKey: string | symbol,
    descriptor: PropertyDescriptor
  ) => {
    const originalMethod = descriptor.value;

    descriptor.value = async function (...args: any[]) {
      const [req, res, next] = args as [Request, Response, NextFunction];

      const token =
        req.headers.authorization?.split(" ")[1] || req.cookies?.accessToken;

      if (!token) {
        throw new BadRequestError("Unauthorized: No token provided", 400);
      }

      const tokenUser = await jwtService.verifyToken(token);
      if (!tokenUser.sessionId) {
        throw new BadRequestError("Unauthorized: Invalid token", 400);
      }

      const sessionInDB = await sessionModel
        .findOne({
          _id: tokenUser.sessionId,
          // userAgent: req.headers["user-agent"],
        })
        .populate("userId");

      if (!sessionInDB) {
        throw new BadRequestError("Unauthorized: User not found", 404);
      }

      if (sessionInDB.resticted) {
        throw new BadRequestError("Unauthorized: Please login back!", 404);
      }

      const currentUser = sessionInDB?.userId as unknown as IUserDocument;
      if (!currentUser.emailVerified) {
        throw new BadRequestError("Email not verified", 403);
      }

      req.user = currentUser;
      req.sessionId = tokenUser.sessionId;

      if (roles.length > 0 && !roles.includes(currentUser.role)) {
        throw new BadRequestError("Forbidden: Insufficient permissions", 403); // Use 403 for forbidden access
      }

      // Call the original method with the updated context
      return await originalMethod.apply(this, args);
    };

    return descriptor;
  };
}
export function authenticateRefresh(...roles: Role[]): MethodDecorator {
  return (
    target: any,
    propertyKey: string | symbol,
    descriptor: PropertyDescriptor
  ) => {
    const originalMethod = descriptor.value;

    descriptor.value = async function (...args: any[]) {
      const [req, res, next] = args as [Request, Response, NextFunction];

      const token =
        req.headers.authorization?.split(" ")[1] || req.cookies?.refreshToken;

      if (!token) {
        throw new BadRequestError("Unauthorized: No token provided", 400);
      }

      const tokenUser = await jwtService.verifyToken(token);
      if (!tokenUser.sessionId) {
        throw new BadRequestError("Unauthorized: Invalid token", 400);
      }

      if (tokenUser?.id) {
        throw new BadRequestError("Please provide valid token", 400);
      }

      const sessionInDB = await sessionModel
        .findOne({
          _id: tokenUser.sessionId,
          userAgent: req.headers["user-agent"],
        })
        .populate("userId");

      if (!sessionInDB) {
        throw new BadRequestError("Unauthorized: User not found", 404);
      }

      if (sessionInDB.resticted) {
        throw new BadRequestError("Unauthorized: Please login back!", 404);
      }

      if (sessionInDB.expiredAt.getTime() <= Date.now()) {
        throw new BadRequestError("Session expire", 404);
      }

      const currentUser = sessionInDB?.userId as unknown as IUserDocument;

      req.user = currentUser;
      req.sessionId = tokenUser.sessionId;

      if (roles.length > 0 && !roles.includes(currentUser.role)) {
        throw new BadRequestError("Forbidden: Insufficient permissions", 403); // Use 403 for forbidden access
      }

      // Call the original method with the updated context
      return await originalMethod.apply(this, args);
    };

    return descriptor;
  };
}
