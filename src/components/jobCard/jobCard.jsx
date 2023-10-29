import React, { useState, useEffect } from "react";
import unicorn from "../../assets/images/Unicorn.png";
import Text from "../text/text";
import axios from "axios";
import locationico from "../../assets/icons/whitelocation.svg";
import "./jobCard.css";
import heart from "../../assets/icons/redHeart.svg";
import { useNavigate } from "react-router-dom";
const JobCard = ({postId, profilePhoto, position,category, likes, address }) => {

  const navigate = useNavigate();


  const navigateToView = () => {
    console.log(postId)
    setTimeout(() => {
      navigate(`/jobview/${postId}`);
    }, 150);
  };


  const cardStyle = {
    backgroundImage: `url(${profilePhoto ?? unicorn} )`,
    position: "relative",
  };

  return (
    <div className="job-card-container" onClick={navigateToView}>
      <div className="card-photo-container">
        <div className="post-card-photo" style={cardStyle}>
          <div className="gradient-overlay"></div>
        </div>
      </div>
      <div className="post-card-info">
        <Text
          label={position ?? "Loading..."}
          color={"white"}
          size={"s18"}
          weight={"medium"}
        />
        <Text
          label={category}
          color={"white"}
          size={"s16"}
          weight={"regular"}
        />
        <div className="post-info-bubble">
          <img src={locationico} className="location-icon" />
          <div style={{ marginRight: "10px" }}>
            <Text
              label={address ?? "Loading..."}
              weight={"regular"}
              color={"white"}
              size={"s14"}
            />
          </div>
        </div>
        <div className="job-card-likes">
          <img src={heart} alt="" />
          <div style={{ marginLeft: "10px" }}>
            <Text
              label={likes.length ?? "Loading..."}
              weight={"regular"}
              color={"white"}
              size={"s16"}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobCard;
