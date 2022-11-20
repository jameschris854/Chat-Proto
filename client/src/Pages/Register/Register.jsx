import React from "react";
import "./Register.css"

const Register = ({ userName, setUserName, mobileNo, setMobileNo, onSubmit }) => {


    return (
        <div className="Register-Container">
            <div className="Intro-Container">
                <h3 className="title"> Signup </h3>
                <input value={userName} onChange={(e) => { setUserName(e.target.value) }} type={"text"} placeholder="Name..." />
                <input value={mobileNo} onChange={(e) => { setMobileNo(e.target.value) }} type={"text"} placeholder="Mobile No..." />

                <div className="valorant" onClick={onSubmit.bind(this,"signup")}>
                    <div className="border">
                        <div className="btn4">
                            <div className="join-text">Signup</div>
                        </div>
                    </div>
                </div>

            </div>
            <div className="Intro-Container">
                <h3 className="title"> Login </h3>
                <input value={userName} onChange={(e) => { setUserName(e.target.value) }} type={"text"} placeholder="Name..." />
                <input value={mobileNo} onChange={(e) => { setMobileNo(e.target.value) }} type={"text"} placeholder="Mobile No..." />

                <div className="valorant" onClick={onSubmit.bind(this,"login")}>
                    <div className="border">
                        <div className="btn4">
                            <div className="join-text">Login</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Register;