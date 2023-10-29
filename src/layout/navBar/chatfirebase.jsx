import React, { useContext } from "react";
import { ChatContext } from "../../context/ChatContext";
import MessagesFirebase from "./messagesfirebase";
import Input from "./input";
const ChatFirebase = () => {
  const { data } = useContext(ChatContext);
  return (
    <div className="chat-firebase">
      <div className="chatInfo-firebase">
        <span>{data.user?.displayName}</span>
      </div>
      <MessagesFirebase />
      <Input />
    </div>
  );
};
export default ChatFirebase;
