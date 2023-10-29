import React from "react";
import Text from "../../components/text/text";
import "./about.css";
import { Link } from "react-router-dom";
import About1 from "../../assets/images/aboutus1.svg";
import About2 from "../../assets/images/about2.svg";
import About3 from "../../assets/images/about3.svg";
import { useTranslation } from "react-i18next";

const About = (props) => {
  const { t } = useTranslation(["Translate"]);
  return (
    <>
      <div className="about-container">
        <div className="welcome-about">
          <Text
            label={t("about.header")}
            weight={"bold"}
            lineheight={"lnormal"}
            size={"s24"}
            color={"black"}
          />
          <Text
            label={t("about.header2")}
            weight={"bold"}
            lineheight={"lnormal"}
            size={"s24"}
            color={"purple"}
          />
        </div>
        <div className="welcome-text">
          <Text
            label={t("about.welcome_text")}
            weight={"thin"}
            lineheight={"lnormal"}
            size={"s18"}
            color={"lightgray"}
          />
          <img src={About1} alt="" className="photo-welcome" />
        </div>
        {/* <div className="vision-content">
          <Text
            label={"Our Vision"}
            weight={"bold"}
            lineheight={"lnormal"}
            size={"s24"}
            color={"purple"}
          />
        </div> */}
        <div className="vision-content">
          <div className="vision-text">
            <Text
              label={t("about.vision_head")}
              weight={"bold"}
              lineheight={"lnormal"}
              size={"s24"}
              color={"purple"}
            />
            {""}
            <Text
              label={t("about.vision_text")}
              weight={"thin"}
              lineheight={"lnormal"}
              size={"s18"}
              color={"lightgray"}
            />
          </div>

          <img src={About2} alt="" className="photo-welcome" />
        </div>
        <div className="offer-content">
          <div className="offer-text">
            <Text
              label={t("about.offer_head")}
              weight={"bold"}
              lineheight={"lnormal"}
              size={"s24"}
              color={"purple"}
            />
            <Text
              label={t("about.offer_text")}
              weight={"thin"}
              lineheight={"lnormal"}
              size={"s18"}
              color={"lightgray"}
            />
            <Text
              label={t("about.offer_text2")}
              weight={"thin"}
              lineheight={"lnormal"}
              size={"s18"}
              color={"lightgray"}
            />
          </div>
        </div>

        <div className="contact-content">
          <img src={About3} alt="" className="photo-contact" />
          <div className="contact-text">
            <Text
              label={t("about.contact_head")}
              weight={"bold"}
              lineheight={"lnormal"}
              size={"s24"}
              color={"purple"}
            />{" "}
            <Text
              label={t("about.contact_text")}
              weight={"thin"}
              lineheight={"lnormal"}
              size={"s18"}
              color={"lightgray"}
            />
            <Link to={"/contact"}>
              <button className="btn-register-contact">
                {" "}
                <Text
                  label={t("about.contact_btn")}
                  weight={"thin"}
                  lineheight={"lnormal"}
                  size={"s18"}
                  color={"white"}
                />
              </button>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};
export default About;
