import { ObjectId, Types } from 'mongoose'
import Message from '../Model/messageModel'

type message = {
        content:string,
        status: string,
        sender: string,
        recipients: Types.ObjectId[],
        type: string,
        conversationId:string
}

export const createMessage = async (body:message) => {
    return await Message.create(body)
}