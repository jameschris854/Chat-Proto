import './App.css';
import {useState} from 'react'
import io from "socket.io-client"
import Chat from './Chats';

const socket = io.connect("http://localhost:3001")


function App() {

  const [userName, setUserName] = useState("")
  const [room, setRoom] = useState("")

  const [isRoomJoined,setIsRoomJoined] = useState(false)

  const joinRoom = () => {
    console.log(userName,room)
    if(userName != "" && room != ""){
      socket.emit("join_room",{room,author:userName})
        setIsRoomJoined(true)
    }
  }

  

  return (
    <div className="App">
      { !isRoomJoined ? 
        <div className="Intro-Container">
          <h3 className="title"> Join a chat </h3>
          <input onChange={(e) => {setUserName(e.target.value)}} type={"text"} placeholder="Name..." />
          <input onChange={(e) => {setRoom(e.target.value)}} type={"text"} placeholder="Room ID..." />
          
          <div className="valorant" onClick={joinRoom}>
            <div className="border">
              <div className="btn4">
                <div className="join-text">Join/Create Room</div>
              </div>
            </div>
          </div>

        </div>
        : <Chat socket={socket} room={room} username={userName} />
      }
    </div>
  );
}

export default App;
