import { CustomError } from "@services/utils/errorHandler";
import { NextFunction, Request, Response } from "express";


export const globalErrorHandler = (err:any,req:Request,res:Response,next:NextFunction)=>{
    if(err instanceof CustomError){
        res.status(err.serializeErrors().statusCode).json(err.serializeErrors())
    }
    res.status(500).json({
        message: "Something went wrong",
        statusCode: 500
    })
}