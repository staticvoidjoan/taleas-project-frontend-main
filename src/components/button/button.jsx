import React from "react";
import "./buttton.css";
import Text from "../text/text";

const Button = ({ bgcolor, border, padding, decoration, cursor, label }) => {
  return (
    <>
      <button
        className={`${bgcolor} ${border} ${padding} ${decoration} ${cursor}`}
      >
        <Text label={label} />
      </button>
    </>
  );
};
export default Button;
