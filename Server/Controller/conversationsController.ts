import { NextFunction ,Response } from "express"
import Conversations from "../Model/conversationsModel"
import Message from "../Model/messageModel"
import { IAuthenticatedRequest } from "../types/ExpressTypes"
import AppError from "../Utils/AppError"

/**
 * 
 * @param req 
 * @param res 
 * @param next 
 * @returns new AppError
 * 
 * @description gets all conversations of a user
 */
const getAllConversationsOfUser = async (req:IAuthenticatedRequest,res:Response,next:NextFunction) : Promise<void> => {
    const userId = req?.jwtPayload?.id
    try {
        let doc = await Conversations.find({userId}).populate("recentConversations", "_id content status type createdAt updatedAt")
        if(doc){
            res.status(200).json({
                status:true,
                message:`conversations for user ${userId}`,
                data: doc
            })
        }else{
            return next(new AppError("conversation not found", 404))
        }
    } catch (e:any) {
        return next(new AppError(e.message, 500))
    }
}


/**
 * 
 * @param req 
 * @param res 
 * @param next 
 * @returns new AppError
 * 
 * @description gets a conversation by conversation id.
 */
const getConversationById = async (req:IAuthenticatedRequest,res:Response,next:NextFunction) : Promise<void> => {
    const userId = req?.jwtPayload?.id
    const {id} = req.params
    try {
        const doc = await Message.find({conversationId:id,members: {"$in": [userId]}}).sort({updatedAt:-1})
        if(doc){
            res.status(200).json({
                status:true,
                message:`conversations for ${id}`,
                data: doc
            })
        }else{
            return next(new AppError("conversation not found", 404))
        }
    } catch (e:any) {
        return next(new AppError(e?.message, 500))
    }
}

export default {getAllConversationsOfUser ,getConversationById}