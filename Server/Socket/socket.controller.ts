import { Socket } from "socket.io"
import { createConversation, getConversationById } from "../Service/ConversationService"
import { createMessage } from "../Service/MessageService"
import { getUserById } from "../Service/UserService"
import { io } from "../socket"
import AppError from "../Utils/AppError"

export const joinConversation = (socket:Socket,body:any) => {
    let {conversationId} = body
    socket.join(conversationId)
}

export const sendMessageInConversation = async (socket:any,body:any) => {

    console.log("csad", body)

        let {content,type,conversationId,recipientId} = body
    
        // check if conversation already exist.
        const senderId = socket.handshake?.jwtPayload?.id
        const conversation = await getConversationById(conversationId)
        if(!conversationId && !recipientId){
            return new AppError("recipient data to correct.", 403)
        }

        const getRecipientId = conversation?.members?.find((id:any) => !(id == senderId) )
        const getRecipient:any = await getUserById(getRecipientId)
    
        let recipientIds = []

        if(getRecipient){
            recipientIds = [getRecipient._id]
        } else if(recipientId){
            recipientIds = [recipientId]
        }else{
            return new AppError("Recepient not found.", 404)
        }

        // create new conversation between two users if not available
        if(!conversationId){
            const id = await createConversation(senderId,recipientIds)
            if(id){
                conversationId = id
            }
        }
    
        let doc
    
        if(conversationId){
            doc = await createMessage({
                content,
                status: "SENT",
                sender: senderId,
                recipients: [...recipientIds],
                type: type,
                conversationId
            })
        }else{
            return new AppError("could not create conversation", 422)
        }
        
        console.log("sending mew message to convo",doc)
        io.of("/v1/chat").to(conversationId).emit("RECIEVE_MESSAGE",doc._doc)
}

/**
 * 
 * @param req [AuthorizedHandShake]
 * @param body [Body]
 * @param callback [Function]
 * @returns returns message document created by mongo
 */
export const startNewConversation = async (socket:any,body:any) => {

    let {content,recipientId,type} = body

    // check if conversation already exist.
    const senderId = socket.handshake?.jwtPayload?.id

    let recipientIds = [recipientId]

    console.log('recipientIds',recipientIds,'senderId',senderId)

    let doc = await createConversation(senderId,recipientIds)
  
    if(doc){
        console.log('if doc',doc)
        let conversationId = doc.id
        if(conversationId){
            let messageDoc = await createMessage({
                content,
                status: "SENT",
                sender: senderId,
                recipients: [senderId,...recipientIds],
                type: type,
                conversationId
            })

            console.log("sending mew message to convo",messageDoc)
            io.of("/v1/chat").to(conversationId).emit("RECIEVE_MESSAGE",messageDoc._doc)

        }else{
            return new AppError("could not send message", 422)
        }
    }else{
        return new AppError("could not create conversation", 422)
    }

    
}


export const leaveConversation = (socket:Socket,conversationId:string) => {
    socket.leave(conversationId)
}