import { Server } from "socket.io";
import http from 'http';
import app from "./app";

const server = http.createServer(app);

const io = new Server(server,{
    cors:{
        origin:"http://localhost:3000",
        methods:["GET","POST"]
    }
});

let users : Array<any> = []

const getRoomIds = async (room: string) => await io.in(room).fetchSockets()

io.on('connection', (socket) => {

    

  socket.on("join_room",async (data) => {
    console.log(socket.rooms,data)
    await socket.join(data.room)
    users.push({state:"IDLE",author:data.author,id:socket.id,room:data.room})
    socket.to(data.room).emit("room_events",{type:"MEMBER_JOINED",...data})
    io.sockets.in(data.room).emit("room_events",{type:"ROOM_COUNT",count:(await getRoomIds(data.room))?.length})
  })

  socket.on("send_message",(data) => {
    socket.to(data.room).emit("receive_messages",data)
  })

  socket.on("disconnect",async () => {
    console.log("user disconnected",socket.id,users)
     const user = users.find((user) => user.id == socket.id )
        if (user) {
            users = users.filter((user) => user.id == socket.id)
            io.to(user.room).emit('room_events',{type:"MEMBER_LEFT",...user});
            console.log("user disconnected",{...user})
            io.sockets.in(user.room).emit("room_events",{type:"ROOM_COUNT",count:(await getRoomIds(user.room))?.length})
          }
        })

  socket.on("update_user_state",(data) => {
    console.log("update_user_state",data)
    switch (data.type) {
      case "TYPING":
        io.to(data.room).emit("room_events",{type:"USERS_STATE",users:users.map((user => user.id == socket.id ? {...user,state:data.type} : user))})
        break;
      case "IDLE":
        io.to(data.room).emit("room_events",{type:"USERS_STATE",users:users.map((user => user.id == socket.id ? {...user,state:data.type} : user))})
      default:
        break;
    }
  })

});

export {server};