import { NextFunction ,Response ,Request} from 'express';
import { ObjectId } from 'mongoose';
import User from '../Model/userModel';
import {IAuthenticatedRequest } from '../types/ExpressTypes';
import AppError from '../Utils/AppError';

/**
 * 
 * @param req 
 * @param res 
 * @param next 
 * @returns new AppError
 * 
 * @description gets all users
 */
const getAllUsers = async (req:IAuthenticatedRequest,res:Response,next:NextFunction) : Promise<void> => {
    let doc = {};
    try {
      doc = await User.find();
    } catch (err) {
        return(next(new AppError("resource not found",404)))
    }
    res.status(200).json({
      status: "success",
      data: doc,
    });
}


/**
 * 
 * @param req 
 * @param res 
 * @param next 
 * @returns new AppError
 * 
 * @description adds a new friend to user. 
 */
const addFriend = async (req:IAuthenticatedRequest,res:Response,next:NextFunction) : Promise<void> => {
  let userDoc : any;
  let friendDoc : any;
  let friendId : ObjectId = req.body.friendId;
  let userId : ObjectId | undefined = req?.jwtPayload?.id
  let aliasFriendName : string = req.body.aliasName;
  try{
    friendDoc = await User.findById(friendId,"-friends -conversations")
    userDoc = await User.findById(userId)
    if(!userDoc) return(next(new AppError("cannot find user",404)))
    let IsNewFriend = userDoc.friends.find((e:any) => e._id == friendDoc._id)
    if(IsNewFriend){
      return(next(new AppError("cannot add friend again!!",409)))
    }else{
      let currentFriends : any[] = userDoc.friends;
      currentFriends.push({
        alias:aliasFriendName,
        ...friendDoc
      })
      await User.findOneAndUpdate({_id:userDoc._id},{friends:currentFriends})
      res.status(200).json({
        status:true,
        message:"Friend added successfully.",
      })
    }
  }catch(e:any){
    return(next(new AppError(e.message,500)));
  }
}

/**
 * 
 * @param req 
 * @param res 
 * @param next 
 * @returns new AppError
 * 
 * @description removes a friend from user.
 */
const removeFriend = async (req:IAuthenticatedRequest,res:Response,next:NextFunction) : Promise<void> => {
  let userDoc : any;
  let friendDoc :any;
  let friendId : ObjectId = req.body.friendId;
  let userId : ObjectId | undefined= req?.jwtPayload?.id;
  try{
    friendDoc = await User.findById(friendId,"-friends -conversations")
    userDoc = await User.findById(userId)
    if(!userDoc) return(next(new AppError("cannot find user",404)))
    let isFriendPresent = userDoc.friends.find((e:any) => e._id.equals(friendDoc._id))
    if(!isFriendPresent){
      return(next(new AppError("cannot add friend again!!",409)))
    }else{
      let currentFriends : any[] = userDoc.friends;
      currentFriends = currentFriends.filter((e:any) => !e._id.equals(friendDoc._id))
      await User.findOneAndUpdate({_id:userDoc._id},{friends:currentFriends})
      res.status(200).json({
        status:true,
        message:"Friends removed successfully.",
        data: currentFriends
      })
    }
  }catch(e:any){
    return(next(new AppError(e.message,500)));
  }
}

const updateFriend = async (req:IAuthenticatedRequest,res:Response,next:NextFunction) : Promise<void> => {
  //update friend for user.
}

export default {getAllUsers,addFriend,removeFriend,updateFriend};