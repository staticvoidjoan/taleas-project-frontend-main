import React from "react";
import "./modal.css";
import {useTranslation} from "react-i18next";

function Modal(props,{label}) {
  const {t}= useTranslation(["Translate"]);

  return (
    <div className={`modal ${props.open  ? "display-block" : "display-none"}`}>
      <div className="modal-main">
        <div className="modal-head">
          {label}
        </div>
        <div className="modal-body">{props.children}</div>
        <div className="btn-container">
          <button type="button" className="btn" onClick={props.onClose}>
            {t("Close")}
          </button>
        </div>
      </div>
    </div>
  );
}

export default Modal;
