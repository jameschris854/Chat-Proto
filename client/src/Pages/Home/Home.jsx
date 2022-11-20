import React, { useEffect,useState } from "react";
import Header from "../../Components/Header/Header";
import Config from "../../config";
import Conversations from "../Conversations/Conversations";

import './Home.css'

const Home = ({userId,mobileNo}) => {

    const [conversations,setConversations] = useState([])

    useEffect(() => {
       init()
    },[])

    const init = async () => {
        const req = await fetch(`${Config.UserDomain}/conversations/${userId}`,{
            method:"GET",
            headers: {'Content-Type': 'application/json'},
          })
          
          let res = await req.json()
      
          if(res.status){
            setConversations(res.data)
          }
    }

    return (
        <div className="Home-Container">
            <Header userId={userId}/>
            <Conversations conversations={conversations} />
        </div>
    )
}

export default Home