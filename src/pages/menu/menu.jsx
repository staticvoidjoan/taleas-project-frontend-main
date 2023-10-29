import React from "react";
import "./menu.css";
import { Link, useNavigate } from "react-router-dom";
import Text from "../../components/text/text";
import Animate from "../../animateTransition/AnimateY";
import { useTranslation } from "react-i18next";
const Menu = (props) => {
  const { t } = useTranslation(["Translate"]);
  return (
    <Animate>
      <div style={{ clear: "both", height: "70px" }}></div>
      <div className="menu-content">
        <div className="menu-list">
          <hr className="line-menu" />
          <ul>
            <Link to={"/"}>
              <li>
                <Text
                  label={t("menu.home")}
                  weight={"thin"}
                  lineheight={"lnormal"}
                  size={"s18"}
                  color={"black"}
                />
              </li>
            </Link>

            <li>
              <Link to={"/aboutus"}>
                <Text
                  label={t("menu.about")}
                  weight={"thin"}
                  lineheight={"lnormal"}
                  size={"s18"}
                  color={"black"}
                />
              </Link>
            </li>

            <Link to={"/contact"}>
              <li>
                {" "}
                <Text
                  label={t("menu.contact")}
                  weight={"thin"}
                  lineheight={"lnormal"}
                  size={"s18"}
                  color={"black"}
                />
              </li>
            </Link>

            <Link to={"/terms"}>
              <li>
                {" "}
                <Text
                  label={t("menu.terms")}
                  weight={"thin"}
                  lineheight={"lnormal"}
                  size={"s18"}
                  color={"black"}
                />
              </li>
            </Link>
          </ul>
        </div>
        <hr className="line-menu" />
        <div className="footer-menu">
          <Link to={"/signup"}>
            {" "}
            <button className="btn-register-menu">
              <Text
                label={t("menu.reg_btn")}
                weight={"thin"}
                lineheight={"lnormal"}
                size={"s16"}
                color={"white"}
              />
            </button>
          </Link>

          <div className="start-line-menu">
            <hr className="line-menu" />
            <Text
              label={"or"}
              weight={"thin"}
              lineheight={"lnormal"}
              size={"s16"}
              color={"lightgray"}
            />
            <hr className="line-menu" />
          </div>
          <Link to={"/signin"}>
            {" "}
            <button className="btn-login-menu">
              {" "}
              <Text
                label={t("menu.log_btn")}
                weight={"thin"}
                lineheight={"lnormal"}
                size={"s16"}
                color={"black"}
              />
            </button>
          </Link>
        </div>
      </div>
    </Animate>
  );
};

export default Menu;
