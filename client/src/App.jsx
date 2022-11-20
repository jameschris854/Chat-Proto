import './App.css';
import { useState } from 'react'
import io from "socket.io-client"
import Register from './Pages/Register/Register';
import Home from './Pages/Home/Home';
import Config from './config';

const socket = io.connect("http://localhost:3001")


function App() {

  const [userName, setUserName] = useState("")
  const [mobileNo, setMobileNo] = useState("")
  const [userId, setUserId] = useState("")

  const [isRoomJoined, setIsRoomJoined] = useState(false)

  const onSubmit = async (type) => {



    const req = await fetch(`${Config.AccountsDomain}/${type}`,{
      method:"POST",
      headers: {
        'Content-Type': 'application/json'
        // 'Content-Type': 'application/x-www-form-urlencoded',
      },
      body:JSON.stringify({
        mobileNo: mobileNo,
        name: userName
      })
    })
    
    let res = await req.json()

    if(res.status){
      setUserId(res.data._id)
      setIsRoomJoined(true)
    }
    
  }



  return (
    <div className="App">
      {!isRoomJoined ?
        <Register userName={userName} setUserName={setUserName} mobileNo={mobileNo} setMobileNo={setMobileNo} onSubmit={onSubmit}/>
        : <Home  mobileNo={mobileNo} userId={userId}  name={userName} />
      }
    </div>
  );
}

export default App;
