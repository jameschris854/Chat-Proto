import { NextFunction ,Response ,Request} from 'express';
import User from '../Model/userModel';

exports.getAllUsers = async (req:Request,res:Response,next:NextFunction) : Promise<void> => {
    let doc = {};
    try {
      doc = await User.find();
    } catch (err) {
        res.status(404).json({
            status: false,
            message: "users not found"
        })
    }
    res.status(200).json({
      status: "success",
      data: doc,
    });
}