import React, { useEffect } from "react";
import "./chatNavBar.css";
import unicorn from "../assets/images/Unicorn.png";
import { useNavigate } from "react-router-dom";
function ChatNavBar({ employer, employee }) {

  const navigate = useNavigate();
  useEffect(() => {
    console.log("employee", employee);
    console.log("employer", employer);
    console.log(displayName);
  }, []);
  const navigateToProfile = () => {
    if(employee){
      navigate(`/applicant/${employee._id}`);
    }else{
      
    }
  }
  const displayName = employee ? employee.name : employer.companyName;
  const profilePic = employee ? employee.profilePhoto : employer.profilePhoto;
  return (
    <div className="chatNavBar">
      <div
        className="chatNavBar-image"
        style={{ backgroundImage: `url(${profilePic ?? unicorn})` }}
        alt="unicorn"
        onClick={navigateToProfile}
      >
        {" "}
      </div>

      <span className="chatNavBar-name">{displayName}</span>
    </div>
  );
}

export default ChatNavBar;
