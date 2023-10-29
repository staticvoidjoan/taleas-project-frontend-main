import React from "react";
import Text from "../text/text";
import "./cards.css";
import unicorn from "../../assets/images/Unicorn.png";
import { useTranslation } from "react-i18next";

const Card = ({ title, info, category, background }) => {
  const {t} = useTranslation(["Translate"])
  const cardStyle = {
    backgroundImage: `linear-gradient(0deg, #222 0.07%, rgba(34, 34, 34, 0.65) 52.9%, rgba(34, 34, 34, 0.00) 99.93%), url(${
      background ?? unicorn
    })`,
    backgroundSize: "cover",
    backgroundRepeat: "no-repeat",
    backgroundPosition: "center",
    boxShadow: "0px 4px 4px 0px rgba(0, 0, 0, 0.25)",
    flexShrink: 0,
  };

  return (
    <div className="card-container" style={cardStyle} data-testid="card-test">
      <div className="card-content">
        <div className="card-info">
          <div className="job-position">
            <Text
              label={title ?? t("noPosts")}
              weight={"medium700"}
              color={"white"}
              family={"open-sans"}
              size={"s18"}
            />
          </div>
          <div className="job-info">
            <Text
              label={info ?? "--"}
              color={"white"}
              family={"open-sans"}
              size={"s16"}
              weight={"thin"}
            />
          </div>
          <div className="job-location">
            <Text label={category ?? "--"} color={"white"} size={"s14"} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Card;
