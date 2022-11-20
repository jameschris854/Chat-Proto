import React,{ useState } from "react";
import Config from "../../config";
import './Header.css'

const Header = ({userId}) => {
    
    const [newMessagePopup,setNewMessagePopup] = useState(false)
    const [message,setMessage] = useState("")
    const [mobileNo,setMobileNo] = useState("")

    const onSubmit = async () => {
        const req = await fetch(`${Config.UserDomain}/message`,{
            method:"POST",
            headers: {
              'Content-Type': 'application/json'
              // 'Content-Type': 'application/x-www-form-urlencoded',
            },
            body:JSON.stringify({
                content:message,
                senderId:userId,
                recipientNo:mobileNo,
                type:"USER",
            })
          })
          
          let res = await req.json()
      
          if(res.status){
            setNewMessagePopup(false)
          }
    }

    return <div className="header-container" >
        { !newMessagePopup ? <div className="header-new-message" onClick={setNewMessagePopup.bind(this,true)}>+ New Conversation</div>
        :<div className="new-message-popup-container">
            <div onClick={setNewMessagePopup.bind(this,false)}>Cancel</div>
            <input 
            style={{width:"80%"}}
            value={mobileNo} 
            onChange={(e) => setMobileNo(e.target.value)}
            placeHolder="Mobile Number..." 
            />
            <input 
            style={{width:"80%"}}
            value={message} 
            onChange={(e) => setMessage(e.target.value)}
            placeHolder="Say hi..." 
            />
            <div style={{width:"85%",marginTop:"15px"}} onClick={onSubmit}>
                <div className="border">
                    <div className="btn4">
                        <div className="join-text">Send</div>
                    </div>
                </div>
            </div>
        </div>}
    </div>
}

export default Header