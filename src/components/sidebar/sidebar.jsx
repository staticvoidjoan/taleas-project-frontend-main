import React from "react";
import home from "../../assets/icons/home.svg";
import chat from "../../assets/icons/chat.svg";
import profile from "../../assets/icons/profile.svg";
import sidebar from "./sidebar.css"; // Create a new CSS file for your sidebar styles
import { useNavigate } from "react-router-dom";
import ChatApp from "../../chat/Chat";
import ListOfMatches from "../applicants/ListOfMatches";
import ListUserMessages from "../userMessages/userMessages";
import Text from "../text/text";
import { useTranslation } from "react-i18next";

const Sidebar = ({userRole, employeeData, employerData}) => {
  const {t} = useTranslation(["Translate"])

  return (
    <div className="sidebar-component">
      <div className="sidebar-messages">
        {userRole === "employee" ? (
      <ListUserMessages user={employeeData} />
        ) : userRole === "employer" ? (
        <ListOfMatches employer={employerData} />
        ) : (
        <div>Invalid user role</div>
        )}
        </div>
      <div className="sidebar-info">
       <Text label={t("support")} size={"s12"}/>
      </div>
      </div>
  );
};

export default Sidebar;
