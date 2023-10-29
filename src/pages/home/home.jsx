import React from "react";
import { Link } from "react-router-dom";
import "./home.css";
import Text from "../../components/text/text";
import ConnectImg from "../../assets/images/connectTeam.svg";
import { useTranslation } from "react-i18next";
const StartingPage = (props) => {
  const { t } = useTranslation(["Translate"]);
  return (
    <>
      <div className="starting-home">
        <div className="content-home">
          <div className="main-tittle-home">
            <Text
              label={"Swipe your way"}
              weight={"medium700"}
              lineheight={"lnormal"}
              size={"s32"}
              color={"black"}
            />
            <Text
              label={"to your dreams"}
              weight={"medium700"}
              lineheight={"lnormal"}
              size={"s32"}
              color={"purple"}
            />
          </div>
          <div>
            {" "}
            <img src={ConnectImg} alt="" className="start-img-home" />
          </div>
        </div>

        <div className="footer-container-home">
          <Text
            label={t("footer-home.start")}
            weight={"thin"}
            lineheight={"lnormal"}
            size={"s16"}
            color={"black"}
          />
          <Link to={"/signup"}>
            {" "}
            <button className="btn-register-home">
              <Text
                label={t("footer-home.start-register")}
                weight={"thin"}
                lineheight={"lnormal"}
                size={"s16"}
                color={"white"}
              />
            </button>
          </Link>

          <div className="start-line-home">
            <hr className="line-home" />
            <Text
              label={t("footer-home.start-or")}
              weight={"thin"}
              lineheight={"lnormal"}
              size={"s16"}
              color={"lightgray"}
            />
            <hr className="line-home" />
          </div>
          <Link to={"/signin"}>
            {" "}
            <button className="btn-login-home">
              {" "}
              <Text
                label={t("footer-home.start-login")}
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
