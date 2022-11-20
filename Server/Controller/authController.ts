import { NextFunction } from 'express';
import { Response } from 'express';
import { Request } from 'express';
import User from '../Model/userModel'

type fn = (arg0: Request,arg1: Response,arg2: NextFunction) => Response

exports.signUp = async (req:Request,res:Response,next:NextFunction) : Promise<void> => {

    if(req.body){
        const doc = await User.create(req.body)
        res.status(200).json({
            status:true,
            message:"user created successfully",
            user: doc
        })
    }else{
        res.status(400).json({status:false,message:'invalid request body.'})
    }

}

exports.login = async (req:Request,res:Response,next:NextFunction) : Promise<void> => {

    const user = await User.findOne({mobileNo:req.body.mobileNo})

    if(user){
        res.status(200).json({
            status: true,
            message: "user successfully logged in!",
            data: user
        })
    } else {
        res.status(404).json({
            status: false,
            message: "user does not exist, signup first!!."
        })
    }

}