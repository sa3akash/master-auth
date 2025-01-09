import { CustomError } from "@services/utils/errorHandler";
import { NextFunction, Request, Response } from "express";

export const globalErrorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if (err instanceof CustomError) {
      if(err.serializeErrors().statusCode === 401){
        res.clearCookie('accessToken')
        res.clearCookie('refreshToken')
      }
      res.status(err.serializeErrors().statusCode).json(err.serializeErrors());
    }
  } catch (error) {
    res.status(500).json({
      message: "Something went wrong",
      statusCode: 500,
    });
  }
};
