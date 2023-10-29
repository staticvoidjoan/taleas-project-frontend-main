import React from "react";
import "./text.css";
const Text = ({ label, family, weight, size, color, lineheight,style }) => {
  return (
    <div className={`${family} ${weight} ${size} ${color} ${lineheight} ` } style={style}>
      <div dangerouslySetInnerHTML={{ __html: label }} />
    </div>
  );
};
export default Text;
