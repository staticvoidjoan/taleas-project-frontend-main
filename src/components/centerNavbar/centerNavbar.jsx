import React from "react";
import "./centerNavbar.css";
import Text from "../text/text";
import { Link, useNavigate, useLocation, Navigate } from "react-router-dom";
import TurnBack from "../../assets/icons/back.svg";

const CenterNavbar = (props) => {
  const navigate = useNavigate();
  const location = useLocation();

  const TurnBackOnePage = () => {
    if (location.pathname.startsWith("/profile") ) {
      navigate("/");
    } else {
      navigate(-1);
    }
  };

  return (
    <>
    
    <div className="navbar-container-center">
      <div className="navbar-center">
        <div className="turn-back">
          <img src={TurnBack} alt="" onClick={TurnBackOnePage} />
        </div>
        <div className="app-name-center">
          <Text
            label={"Career"}
            weight={"medium800"}
            lineheight={"l24"}
            size={"s20"}
          />
          <Text
            label={"Crush"}
            weight={"medium800"}
            lineheight={"l24"}
            size={"s20"}
            color={"purple"}
          />
        </div>
        <div style={{ flex: "1, 1, 1" }}></div>
      </div>
    </div>
    <div style={{clear:"both", height:"76px"}}></div>
    </>
  );
};

export default CenterNavbar;
