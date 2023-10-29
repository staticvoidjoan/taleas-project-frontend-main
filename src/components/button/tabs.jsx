import React from "react";
import "./tabs.css";
import Text from "../text/text";
const Tabs = ({ buttonName, selected, onClick }) => {
  const buttonClassName = `AllButton ${selected ? "selected" : ""}`;
  return (
    <button className={buttonClassName} onClick={onClick}>
    

      <Text label={`${buttonName}`} size={"s16"} weight={"medium"} style={{margin:"10px"}}/>
    
    </button>
  );
};

export default Tabs;
