import Message from "../Model/messageModel"
import Conversation from "../Model/conversationsModel"
import Users from "../Model/userModel"
import { NextFunction ,Response ,Request } from "express"
import AppError from "../Utils/AppError"
import {IAuthenticatedRequest } from "../types/ExpressTypes"

const sendMessage = async (req:IAuthenticatedRequest,res:Response,next:NextFunction) : Promise<void | Response> => {

    let {content,recipientNo,recipientEmail,type,conversationId} = req.body

    // check if conversation already exist.
    const senderId = req?.jwtPayload?.id

    let recepientData 

    if(recipientNo){
        recepientData = {mobileNo: recipientNo}
    }else if(recipientEmail) {
        recepientData = {email: recipientEmail}
    } else if(!conversationId){
        return next(new AppError("recipient data to correct.", 403))
    }

    let getRecipient = await Users.findOne(recepientData)

    let recipientIds : any[] = []

    if(getRecipient){
        recipientIds = [getRecipient._id]
    }else{
        return next(new AppError("Recepient not found.", 404))
    }

    if(!conversationId){
        console.log("creating new converation between user")
        let conversation = await Conversation.create({ members: [ senderId , ...recipientIds ]})
        conversationId = conversation.id
    }
    let doc

    if(conversationId){
        doc = await Message.create({
            content,
            status: "SENT",
            sender: senderId,
            recipients: [...recipientIds],
            type: type,
            conversationId
        })
    }else{
        return next(new AppError("could not create conversation", 422))
    }

    if(doc){
        res.status(200).json({status:true,message:"message sent successfully.",conversationId: conversationId})
    }else{
        return next(new AppError("could not send message", 422))
    }
}

export default {sendMessage};