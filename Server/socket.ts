import { Server } from "socket.io";
import http from 'http';
import app from "./app";
import Config from "./Config/Config";
import authController from "./Controller/authController";
import chatNameSpace from './Socket/chat.socket'

const server = http.createServer(app);

const port = process.env.port || Config.PORT

const io = new Server(server,{
    cors:{
        origin:`http://localhost:${port}`,
        methods:["GET","POST"]
    }
});


io.of("/v1/chat").use((socket, next) => {
  console.log("socket service started successfully",socket)
  authController.protect(socket.handshake,undefined,next)
});

io.of("/v1/chat").on('connection', (socket:any) => chatNameSpace.chatNameSpaceHandler(socket));


export {server,io};