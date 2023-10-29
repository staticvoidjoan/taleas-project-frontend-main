import React from "react";
import notfoundimg from "../../assets/images/404NotFound.svg";
import "./notFound.css";
import Text from "../../components/text/text";
const NotFound = () => {
  return (
    <div className="not-found-container">
      <Text label={"Oops!"} size={"s22"} weight={"bold"} />
      <img src={notfoundimg} alt="" className="notfound-image" />
      <div className="not-found-info">
        <Text
          label={
            "The page you are looking for might have been removed had its named changed or is temporarily unavaliable."
          }
          size={"s18"}
          weight={"regular"}
        />
      </div>
    </div>
  );
};

export default NotFound;
