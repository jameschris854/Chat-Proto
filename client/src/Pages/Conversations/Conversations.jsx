import React from "react";

import './Conversations.css'

const Conversations = ({ conversations }) => {

    console.log(conversations)

    return (
        <div className="conversations-wrapper">
            {conversations.length ?
                <>
                    {conversations.map(data => {
                        return (
                            <div className="conversation-container">
                                <span className="convo-recipient">{data.members[0]}</span>
                                <span className="convo-content">{data.conversations.length ? data.conversations[0].content:""}</span>
                                <span className="convo-time">{data.conversations.length ? new Date(data.conversations[0].createdAt).toDateString():""}</span>
                            </div>
                        )
                    })}
                </>
                : <div className="conversations-wrapper-empty">
                    <img className="no-convo-img" src="https://cdni.iconscout.com/illustration/premium/thumb/chat-2467500-2040718.png" />
                    <span>
                        No Conversations Yet!!
                    </span>
                </div>}
        </div>
    )
}

export default Conversations