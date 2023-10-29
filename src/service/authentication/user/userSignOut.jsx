import React from 'react';
import {Auth} from "aws-amplify"
import { useNavigate } from 'react-router-dom';
import Text from "../../../components/text/text"
import "./user.css"
const UserSignOut = () => {
    const navigate = useNavigate();

    async function signOut() {
        try {
            await Auth.signOut();
            console.log("Signing out")
            localStorage.clear();
            navigate("/");
            window.location.reload();
        } catch (error) {
            console.log("error signing out:", error);
        }
    }


    return (
        <button onClick={signOut} className='logout-btn'><Text label={"Sign Out"} size={"s16"}/></button>    
    );
}

export default UserSignOut;
