import Message from "../Model/messageModel"
import Conversation from "../Model/conversationsModel"
import Users from "../Model/userModel"
import { NextFunction ,Response ,Request } from "express"

const sendMessage = async (req:Request,res:Response,next:NextFunction) : Promise<void | Response> => {

    let {content,senderId,recipientNo,type,source,conversationId} = req.body

    // check if conversation already exist.


    let getRecipient = await Users.findOne({mobileNo:recipientNo})

    let recipientIds : any[] = []

    if(getRecipient){
        recipientIds = [getRecipient._id]
    }else{
        res.status(404).json({status:true,message:"Recepient not found."})
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
            source,
            conversationId
        })
    }else{
        return res.status(422).json({status:false,message:"could not create conversation"})
    }

    if(doc){
        res.status(200).json({status:true,message:"message sent successfully.",conversationId: conversationId})
    }else{
        res.status(422).json({status:false,message:"could not send message"})
    }
}

export default {sendMessage};