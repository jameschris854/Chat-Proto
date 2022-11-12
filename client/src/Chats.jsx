import React,{useState,useEffect} from "react";
import "./Chats.css"

const Chat = ({socket,username,room}) => {

    const [currentMessage,setCurrentMessage] = useState("")

    const [chat,setChat] = useState([])

    const [roomCount,setRoomCount] = useState([])

    const [roomActivities,setRoomActivities] = useState({typing: ""})

    useEffect(() => {
        socket.on("receive_messages",(data) => {
            setChat((prev) => ([...prev,data]))
        })

        socket.on("room_events",(data) => {
            console.log(data,"rom=-events")
            switch (data.type) {
                case "MEMBER_JOINED":
                    if(data.author != username){
                        setChat(prev => [...prev,{type:data.type,author:"system",room,message: `${data.author} has joined the chat!!`,
                        time: new Date(Date.now()).getHours() + ":" + new Date(Date.now()).getMinutes()}])
                    }
                    break;
                case "ROOM_COUNT":
                    setRoomCount(data.count)
                    break;
                case "MEMBER_LEFT":
                    setChat(prev => [...prev,{type:data.type,author:"system",room,message: `${data.author} has Left the chat...`,time: new Date(Date.now()).getHours() + ":" + new Date(Date.now()).getMinutes()}])
                    break;
                case "USERS_STATE":
                    console.log(data.users,"USERS_STATE")
                    if(data.users){
                        const typing = data.users.filter((user) => user.state == "TYPING" && user.author !== username)
                        console.log('typing data.users',typing)
                        if(typing.length == 0){
                            setRoomActivities({typing:""})
                        }else{
                            setRoomActivities({typing:typing.length == 1 ? `${typing[0].author} is typing...` : typing.length == 2 ? `${data.users[0].author} & ${data.users[1]} are typing...` : "multiple typing..."})
                        }
                    }
                    break
                default:
                    break;
            }

        })

        return(() => {
            socket.off("receive_messages",(data) => {
                console.log("off",data)
                setChat((prev) => ([...prev,data]))
            })
            socket.off("room_events")
        })
    }, [])
    

    const handleSubmit = async () => {
        if(currentMessage != ""){
            const messageData = {
                type: "USER_CHAT",
                room,
                author: username,
                message: currentMessage,
                time: new Date(Date.now()).getHours() + ":" + new Date(Date.now()).getMinutes()
            }

            console.log('emitting messages',messageData)
            
            await socket.emit("send_message",messageData)
            setChat((prev) => ([...prev,messageData]))
            setRoomCount(1)
            setCurrentMessage("")
        }
    }

    return (
        <div className="chat-container">
            <div className="chat-title"><span>Live chat{`(${(roomCount < 1 ? 0 : roomCount - 1)})`}</span> <div className="dot" /> <span>#{room}</span></div>
            <div className="chat-body">
                {chat.map((chat) => {
                    const isAuthor = username == chat.author
                    const isSys = chat.author == "system"
                    console.log(chat)
                    return(
                        <div className="chat-message-container">
                            {(() =>{
                                if(isSys){
                                    return <div className={`chat-message sys`}>{chat.message}</div>
                                } else {
                                    return(
                                        <>
                                             { !isAuthor && <img className="author-chat-img" src="https://thumbs.dreamstime.com/b/default-avatar-profile-icon-vector-social-media-user-image-182145777.jpg" />}
                                            <div className={`chat-message ${isAuthor ? 'author' : ""}`}>{chat.message}</div>
                                            { isAuthor && <img className="author-chat-img" src="https://thumbs.dreamstime.com/b/default-avatar-profile-icon-vector-social-media-user-image-182145777.jpg" />}
                                        </>
                                    )
                                }
                            })()}
                        </div>
                    )
                })}
                <div style={{margin: '1px auto'}}>{roomActivities.typing}</div>
            </div>
            <div className="send-button-container">
                <input 
                onChange={(event) => {setCurrentMessage(event.target.value)}} 
                type={"text"} 
                placeholder={"Type Something..."} 
                value={currentMessage}
                onFocus={() => socket.emit("update_user_state",{type:"TYPING",author:username,room})}
                onBlur={() => socket.emit("update_user_state",{type:"IDLE",author:username,room})}
                />
                <div className="Send-Button" onClick={handleSubmit}>Send</div> 
            </div>
        </div>
    )
}

export default Chat;