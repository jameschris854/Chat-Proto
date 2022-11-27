import { NextFunction, Request, Response } from "express";
import AppError from "../Utils/AppError";

const globalErrorHandler = (err: AppError, req:Request,res: Response, next: NextFunction) => {
    console.log("error controller err",err)
    res.status(err.statusCode).json({
        status: err.statusCode.toString().startsWith("4") ? false : true,
        msg: err.msg || "something went wrong"
    })
}

export default globalErrorHandler