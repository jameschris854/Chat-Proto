import { NextFunction ,Response ,Request} from 'express';
import { ObjectId } from 'mongoose';
import User from '../Model/userModel';

const getAllUsers = async (req:Request,res:Response,next:NextFunction) : Promise<void> => {
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

const addFriend = async (req:Request,res:Response,next:NextFunction) : Promise<void> => {

  let userDoc : any;
  let friendDoc : any;
  let friendId : ObjectId = req.body.friendId;
  let userId : ObjectId = req.jwtPayload.id

  let aliasFriendName : string = req.body.aliasName;

  try{
    
    friendDoc = await User.findById(friendId,"-friends -conversations")

    userDoc = await User.findById(userId)

    if(!userDoc) throw new Error("failed to find user");

    let IsNewFriend = userDoc.friends.find((e:any) => e._id == friendDoc._id)

    if(!IsNewFriend){
      res.status(409).json({
        status:false,
        message:"cannot add friend again!!"
      })
    }else{
      let currentFriends : any[] = userDoc.friends;
      currentFriends.push({
        alias:aliasFriendName,
        ...friendDoc
      })

      let updatedUser = await User.findOneAndUpdate({_id:userDoc._id},{friends:currentFriends})

      res.status(200).json({
        status:true,
        message:"Friend added successfully.",
        data:updatedUser
      })

    }

  }catch(e){
    console.log(e)
    res.status(500).json({
      status:false,
      message: e
    })
  }
}

const removeFriend = async (req:Request,res:Response,next:NextFunction) : Promise<void> => {

  let userDoc : any;
  let friendDoc :any;
  let friendId : ObjectId = req.body.friendId;
  let userId : ObjectId = req.jwtPayload.idp;

  try{
    
    friendDoc = await User.findById(friendId,"-friends -conversations")
    
    userDoc = await User.findById(userId)

    if(!userDoc) throw new Error("failed to find user");


    let isFriendPresent = userDoc.friends.find((e:any) => {
      return e._id.equals(friendDoc._id)
    })


    if(!isFriendPresent){
      res.status(404).json({
        status:false,
        message:"cannot fiend friend"
      })
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

  }catch(e){
    res.status(500).json({
      status:false,
      message: e
    })
  }
}

const updateFriend = async (req:Request,res:Response,next:NextFunction) : Promise<void> => {

  
}

export default {getAllUsers,addFriend,removeFriend,updateFriend};