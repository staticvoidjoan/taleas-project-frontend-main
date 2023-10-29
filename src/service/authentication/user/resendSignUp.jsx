import React, { useState } from "react";
import { Auth } from "aws-amplify";
import "./user.css";
import "./resendSignUp.css";
import awsExports from "../../../aws-exports";
import { Amplify } from "aws-amplify";
import { useNavigate, Link } from "react-router-dom";
import Text from "../../../components/text/text";
import { useTranslation } from "react-i18next";
import ForgotPsw from "../../../assets/icons/Forgot Password.svg";
import { width } from "@mui/system";

const ForgotPassword = () => {
  const { t } = useTranslation(["Translate"]);
  Amplify.configure(awsExports);
  const [code, setCode] = useState("");
  const [username, setUsername] = useState("");
  const [emailsent, setEmailSent] = useState(false);
  const [confirmationError, setConfirmationError] = useState(null);
  const navigate = useNavigate();

  async function resendSignUp(e) {
    e.preventDefault();
    try {
      console.log("Sending new code");
      await Auth.resendSignUp(username);
      setEmailSent(true);
    } catch (error) {
      setConfirmationError("Error sending code. user does not exist.");
      console.log(error);
    }
  }

  async function confirmSignUp(e) {
    e.preventDefault();
    try {
      console.log(username);
      console.log(code);
      await Auth.confirmSignUp(username, code);
      console.log("Successfully confirmed sign up");
    } catch (error) {
      console.error("Error confirming sign up", error);
      setConfirmationError(
        "Error confirming sign up. Please check the code and try again."
      );
    }
  }

  return (
    <div className="user-register-page-resend">
      <div>
        {window.innerWidth > 901 && (
          <>
            <div className="user-register-title">
              <div style={{ marginBottom: "16px" }}>
                <Text
                  label={t("resend.confirm_acc")}
                  size={"s20"}
                  weight={"medium700"}
                  color={"white"}
                />
              </div>
              <Text
                label={t("resend.lost_msg")}
                size={"s14"}
                weight={"regular"}
                color={"white"}
              />
            </div>
            <img src={ForgotPsw} alt="Contact" className="forgot-photo-page" />
          </>
        )}
      </div>
      <div className="users-forms">
        {window.innerWidth < 900 && (
          <>
            <div className="user-register-title">
              <div style={{ marginBottom: "16px" }}>
                <Text
                  label={t("resend.confirm_acc")}
                  size={"s20"}
                  weight={"medium700"}
                  color={"white"}
                />
              </div>
              <Text
                label={t("resend.lost_msg")}
                size={"s14"}
                weight={"regular"}
                color={"white"}
              />
            </div>
          </>
        )}{" "}
        {emailsent ? (
          <div className="form-box-register">
            <div style={{ marginTop: "10px", marginBottom: "10px" }}>
              <Text
                label={t("resend.enter_code")}
                size={"s20"}
                weight={"medium"}
              />
            </div>
            <form onSubmit={confirmSignUp} className="form-value">
              <div className="inputbox-register">
                <input
                  className="register-input"
                  type="text"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  placeholder={t("resend.type_code")}
                  required
                />
              </div>
              {confirmationError && (
                <p className="error-message">{confirmationError}</p>
              )}
              <button className="register-btn">
                {" "}
                <Text
                  label={t("resend.confirm_btn")}
                  weight={"regular"}
                  color={"white"}
                  size={"s16"}
                />
              </button>
            </form>
          </div>
        ) : (
          <div className="form-box-register">
            <form onSubmit={resendSignUp} id="loginform" className="form-value">
              <div style={{ marginTop: "100px", marginBottom: "10px" }}>
                <Text
                  label={t("resend.enter_email")}
                  size={"s20"}
                  weight={"medium"}
                />
              </div>
              <div className="inputbox-register">
                <input
                  type="email"
                  placeholder="johndoe@gmail.com"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="register-input"
                  required
                />
              </div>
              <button className="register-btn">
                {" "}
                <Text
                  label={t("resend.send_email")}
                  weight={"regular"}
                  color={"white"}
                  size={"s16"}
                />
              </button>
              <div className="backToLogin-resend">
                <Link
                  to="/signin"
                  style={{ textDecoration: "none", color: "#6e46f5" }}
                >
                  <Text
                    label={"Back to Login"}
                    weight={"medium700"}
                    size={"s16"}
                  />
                </Link>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
export default ForgotPassword;
