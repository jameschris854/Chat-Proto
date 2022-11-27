import bcrypt from 'bcryptjs';
import { NextFunction } from 'express';
import { Response } from 'express';
import { Request } from 'express';
import { ObjectId } from 'mongoose';
import Config from '../Config/Config';
import User from '../Model/userModel'
import jwt from 'jsonwebtoken'
import AppError from '../Utils/AppError';


/**
 * @param id 
 * @returns jwt token with userId as payload.
 */
const signToken = (id:ObjectId) => {
    const token = jwt.sign({ id }, Config.JWT_SECRET, {
      expiresIn: Config.JWT_EXPIRES_IN
    });
    return token;
  };


/**
 * 
 * @param user 
 * @param statusCode 
 * @param res 
 * 
 * @description creates and sends jsonwebtoken with user document
 */
const createSendToken = async (user, statusCode: number, res: Response) => {
    const token = signToken(user._id);    
    await User.findByIdAndUpdate(user.id,{authToken:token})
  
    res.status(statusCode).json({
      status: 'success',
      token,
      data: {
        user,
      },
    });
};

/**
 * 
 * @param req 
 * @param res 
 * @param next
 * 
 * @description creates new document in user collection and signsup new user. 
 */
const signUp = async (req:Request,res:Response,next:NextFunction) : Promise<void> => {
    if(req.body){
        const doc = await User.create(req.body)
        createSendToken(doc,201,res)
    }else{
        return next(new AppError("invalid request body.", 400))
    }
}

/**
 * 
 * @param req 
 * @param res 
 * @param next
 * 
 * @description logs in existing user and provides token in response 
 */
const login = async (req:Request,res:Response,next:NextFunction) : Promise<void> => {
    const user = await User.findOne({email:req.body.email}).select("+password")
    if(user){
        let isValid = await bcrypt.compare(req.body.password,user.password)
        if(isValid){
            createSendToken(user,201,res)
        }else{
            return next(new AppError("Login failed ,please check email and password", 404))
        }
    } else {
        return next(new AppError("user does not exist, signup first!!.", 404))
    }

}

/**
 * 
 * @param req 
 * @param res 
 * @param next 
 * @returns new AppError if authentication fails.
 * 
 * @description used to protect routes based on the supploed jwt token.
 */
const protect = async (req:Request,res:Response,next:NextFunction) => {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    } 
    if(!token){
        return next(new AppError('You are not logged in!please login to get access', 401))
    }
    
    try{
        const decoded = jwt.verify(token,Config.JWT_SECRET);
        const user = await User.findById(decoded.id).select("+authToken")
        if(user.authToken === token){
            req.jwtPayload = user;
            next()
        }else{
            return next(new AppError("Authentication failed ,invalid token.", 401))
        }
    }catch(e){
        return next(new AppError(e.message, 401))
    }
}

export default {signUp ,login ,protect}