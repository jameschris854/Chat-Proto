import { Schema } from "mongoose"
import Conversations from "../Model/conversationsModel"

export const getConversationById = async (conversationId:string) => {
    return await Conversations.findById(conversationId)
}

export const createConversation = async (senderId:Schema.Types.ObjectId,recipientIds:string[]) => {
        console.log("creating new converation between user")
        let conversation = await Conversations.create({ members: [ senderId , ...recipientIds ]})
        return conversation.id
}