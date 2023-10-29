import React from "react";
import { Link } from "react-router-dom";
import "./StartingPage.css";
import Text from "../../components/text/text";
import ConnectImg from "../../assets/images/connectTeam.svg";

const StartingPage = (props) => {
  return (
    <>
      <div className="starting">
        <div className="content">
          <div className="main-tittle">
            <Text
              label={"Swipe your way"}
              weight={"medium700"}
              lineheight={"lnormal"}
              size={"s32"}
              color={"black"}
            />
            <Text
              label={"to your dream job!"}
              weight={"medium700"}
              lineheight={"lnormal"}
              size={"s32"}
              color={"purple"}
            />
          </div>
          <div>
            {" "}
            <img src={ConnectImg} alt="" className="start-img" />
          </div>
        </div>

        <div className="footer-landpage">
          <Text
            label={"Start Now"}
            weight={"thin"}
            lineheight={"lnormal"}
            size={"s16"}
            color={"black"}
          />
          <Link to={"/signup"}>
            {" "}
            <button className="btn-register">
              <Text
                label={"Register"}
                weight={"thin"}
                lineheight={"lnormal"}
                size={"s16"}
                color={"white"}
              />
            </button>
          </Link>

          <div className="start-line">
            <hr className="line" />
            <Text
              label={"or"}
              weight={"thin"}
              lineheight={"lnormal"}
              size={"s16"}
              color={"lightgray"}
            />
            <hr className="line" />
          </div>
          <Link to={"/signin"}>
            {" "}
            <button className="btn-login">
              {" "}
              <Text
                label={"Login"}
                weight={"thin"}
                lineheight={"lnormal"}
                size={"s16"}
                color={"black"}
              />
            </button>
          </Link>
        </div>
      </div>
    </>
  );
};
export default StartingPage;
