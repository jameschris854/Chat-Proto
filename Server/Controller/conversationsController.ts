import { NextFunction ,Request ,Response } from "express"
import Conversations from "../Model/conversationsModel"
import Message from "../Model/messageModel"

exports.getAllConversationsOfUser = async (req:Request,res:Response,next:NextFunction) : Promise<void> => {

    const {userId} = req.params

    console.log('get conv',req.params,userId)

    try {
        let doc = await Conversations.find({userId}).populate("recentConversations", "_id content status type createdAt updatedAt")
        console.log(doc)
        if(doc){
            res.status(200).json({
                status:true,
                message:`conversations for user ${userId}`,
                data: doc
            })
        }else{
            res.status(404).json({status:false,message:"conversation not found"})
        }
    } catch (error) {
        console.log(error)
        next()
    }
}

exports.getConversationById = async (req:Request,res:Response,next:NextFunction) : Promise<void> => {
    const {id} = req.params
    console.log('get conv',req.params,id)

    try {
        const doc = await Message.find({conversationId:id})
        if(doc){
            res.status(200).json({
                status:true,
                message:`conversations for ${id}`,
                data: doc
            })
        }else{
            res.status(404).json({status:false,message:"conversation not found"})
        }
    } catch (error) {
        console.log(error)
        next()
    }
}