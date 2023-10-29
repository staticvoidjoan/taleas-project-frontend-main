import React from "react";
import home from "../../assets/icons/home.svg";
import chat from "../../assets/icons/chat.svg";
import profile from "../../assets/icons/profile.svg";
import footer from "./footer.css";
import { useNavigate } from "react-router-dom";

const Footer = () => {
  const navigate = useNavigate();

  const handleHomeNavigate = () => {
    navigate("/");
  };
  const handleProfileNavigate = () => {
    navigate("/profile");
  };
  const handleChatNavigate = () => {
    navigate("/messages");
  }
  return (
    <div className="footer-component">
      <div className="footer-container">
        <div className="home" onClick={handleHomeNavigate}>
          <img src={home}></img>
        </div>
        <div className="chat" onClick={handleChatNavigate}>
          <img src={chat}></img>
        </div>
        <div className="profile" onClick={handleProfileNavigate}>
          <img src={profile}></img>
        </div>
      </div>
    </div>
  );
};

export default Footer;
