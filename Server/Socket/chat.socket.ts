import IUserDoc from "../types/DBTypes";
import { AuthorizedSocket, SocketMembers } from '../types/Socket';
import querySocket from "./query.socket";
import { joinConversation, sendMessageInConversation, startNewConversation } from "./socket.controller";

// all online socket members
let members : SocketMembers = {}

// master socket handler for namespace [chat]
const chatNameSpaceHandler = async (socket:AuthorizedSocket) => {

        console.log("new socket connection made for user",socket.id)
        
        const user : IUserDoc = socket.handshake.jwtPayload;
      
        // add user to global user List
        members[`${user._id}`] = {socketId:socket.id};
      
        querySocket.NotifyOnline(members,socket,"ONLINE")

        // middleware
        socket.use(([event,...args],next) => {
          console.log(members,event)
          next()
        })
      

        socket.emit("PROFILE",socket.handshake.jwtPayload);
        const conversations = await querySocket.queryConversationsByUser(socket.handshake);
        socket.emit("CONVERSATIONS",conversations);
        socket.emit("ONLINE_COUNT",{count:members.length});
        socket.emit("CONNECTION_COMPLETE",{count:members.length});
        socket.on("SEND_MESSAGE",(arg) => querySocket.sendMessage(socket.handshake,arg,(message:any) => {
          socket.emit("RECIEVE_MESSAGE",message)
        }));


        //Personal Chat events
        socket.on("START_CONVERSATION",(body) => startNewConversation(socket,body))
        socket.on("JOIN_CONVERSATION",(body) => joinConversation(socket,body))
        socket.on("SEND_PERSONAL_MESSAGE",(body) => sendMessageInConversation(socket,body))
        socket.on("LEAVE_CONVERSATION",(body) => joinConversation(socket,body))
        
        // handle user disconnect
        socket.on("disconnect",() => {
          console.log("user disconnected",socket.id)
          querySocket.NotifyOnline(members,socket,"OFFLINE")
          delete members[`${socket.handshake.jwtPayload._id}`]
        })
      
}

export default {chatNameSpaceHandler};