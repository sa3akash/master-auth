import sessionModel from "@models/sessionModel";  
import userModel from "@models/userModel";  
import { Role } from "@services/interfaces/enum";  
import { BadRequestError } from "@services/utils/errorHandler";  
import { jwtService } from "@services/utils/jwt";  
import { NextFunction, Request, Response } from "express";  

export function authenticate(...roles: Role[]): MethodDecorator {  
  return (target: any, propertyKey: string | symbol, descriptor: PropertyDescriptor) => {  
    const originalMethod = descriptor.value;  

    descriptor.value = async function (...args: any[]) {  
      const [req, res, next] = args as [Request, Response, NextFunction];  

      try {  
        const token =  
          req.headers.authorization?.split(" ")[1] || req.cookies?.accessToken;  

        if (!token) {  
          throw new BadRequestError("Unauthorized: No token provided", 400);  
        }  

        const tokenUser = await jwtService.verifyToken(token);  
        if (!tokenUser) {  
          throw new BadRequestError("Unauthorized: Invalid token", 401);  
        }  

        const userInDB = await userModel.findById(tokenUser.id);  

        if (!userInDB) {  
          throw new BadRequestError("Unauthorized: User not found", 404);  
        }  

        req.user = userInDB;  
        req.sessionId = tokenUser.sessionId;  

        if (roles.length > 0 && !roles.includes(userInDB.role)) {  
          throw new BadRequestError("Forbidden: Insufficient permissions", 403); // Use 403 for forbidden access  
        }  

        // Call the original method with the updated context  
        return await originalMethod.apply(this, args);  
      } catch (error) {  
        // if (error instanceof BadRequestError) {  
        //   return next(error);  
        // }  
        // next();  

        throw new BadRequestError("Unauthorized: Invalid or expired token", 401)
      }  
    };  

    return descriptor;  
  };  
}