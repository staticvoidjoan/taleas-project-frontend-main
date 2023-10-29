import React, { useState } from "react";
import { Auth } from "aws-amplify";
import "./user.css";
import "./forgotPassword.css";
import awsExports from "../../../aws-exports";
import { Amplify } from "aws-amplify";
import { Link, useNavigate } from "react-router-dom";
import Text from "../../../components/text/text";
import ForgotPsw from "../../../assets/icons/Forgot Password.svg";
import { useTranslation } from "react-i18next";
import show from "../../../assets/icons/eye-regular.svg";
import notShow from "../../../assets/icons/eye-slash-regular.svg";

const ForgotPassword = () => {
  const { t } = useTranslation(["Translate"]);
  Amplify.configure(awsExports);
  const [error, setError] = useState(false);
  const [success, setSuccess] = useState(false);
  const [passwordError, setPasswordError] = useState(null);
  const [code, setCode] = useState("");
  const [password, setPassword] = useState("");
  const [repeatpass, setRepeatPass] = useState("");
  const [username, setUsername] = useState("");
  const [emailsent, setEmailSent] = useState(false);
  const navigate = useNavigate();
  const [isResettingPassword, setIsResettingPassword] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [confirmationError, setConfirmationError] = useState(null);
  const handleShowPassword = () => {
    setShowPassword(!showPassword);
  };
  async function getEmail(e) {
    e.preventDefault();
    console.log(username);
    try {
      await Auth.forgotPassword(username);
      setEmailSent(true);
    } catch (error) {
      console.log(error);
    }
  }

  async function forgotPasswordSubmit(e) {
    e.preventDefault();
    if (password === repeatpass) {
      try {
        setIsResettingPassword(true); // Disable the button on click
        const data = await Auth.forgotPasswordSubmit(username, code, password);
        setSuccess(true);
        navigate("/signin");
        console.log(data);
      } catch (err) {
        console.log(err);
        setConfirmationError(
          "Incorrect code , does not match. Please check the code again."
        );
      } finally {
        setIsResettingPassword(false); // Clear the flag after the password reset attempt
      }
    } else {
      setPasswordError("Passwords do not match. Please check the passwords.");
    }
  }

  return (
    <div className="user-register-page-forgot">
      <div>
        {window.innerWidth > 901 && (
          <>
            {" "}
            <div className="user-register-title-forgot">
              <div style={{ marginBottom: "16px" }}>
                <Text
                  label={t("user-forgot.header")}
                  size={"s20"}
                  weight={"medium700"}
                  color={"white"}
                />
              </div>
              <Text
                label={t("user-forgot.subHead")}
                size={"s14"}
                weight={"regular"}
                color={"white"}
              />
              <div style={{ marginBottom: "16px" }}></div>
            </div>
            <img src={ForgotPsw} alt="Contact" className="forgot-photo-page" />
          </>
        )}
      </div>
      <div className="users-forms">
        {window.innerWidth < 900 && (
          <>
            {" "}
            <div className="user-register-title-forgot">
              <div style={{ marginBottom: "16px" }}>
                <Text
                  label={t("user-forgot.header")}
                  size={"s20"}
                  weight={"medium700"}
                  color={"white"}
                />
              </div>
              <Text
                label={t("user-forgot.subHead")}
                size={"s14"}
                weight={"regular"}
                color={"white"}
              />
              <div style={{ marginBottom: "16px" }}></div>
            </div>
          </>
        )}{" "}
        {emailsent ? (
          <div className="form-box-register">
            <form
              onSubmit={forgotPasswordSubmit}
              id="loginform"
              className="form-value"
            >
              <div style={{ marginTop: "10px", marginBottom: "10px" }}>
                <Text
                  label={t("user-forgot.enter_head")}
                  size={"s18"}
                  weight={"medium"}
                />
              </div>
              <div className="inputbox-register">
                <input
                  className="register-input"
                  type="text"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  required
                  placeholder={t("user-forgot.code")}
                />
              </div>
              {confirmationError && (
                <p className="error-message">{confirmationError}</p>
              )}
              <div class="inputbox-register">
                <input
                  placeholder={t("user-forgot.new_psw")}
                  type={showPassword ? "text" : "password"}
                  className="register-input"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <div
                  onClick={handleShowPassword}
                  style={{
                    width: "20px",
                    position: "inherit",
                    top: "14.5px",
                    left: "-16px",
                  }}
                >
                  {showPassword ? <img src={show} /> : <img src={notShow} />}
                </div>
              </div>
              <div class="inputbox-register">
                <input
                  className="register-input"
                  placeholder={t("user-forgot.confirm_psw")}
                  type={showPassword ? "text" : "password"}
                  value={repeatpass}
                  onChange={(e) => setRepeatPass(e.target.value)}
                  required
                />
                <div
                  onClick={handleShowPassword}
                  style={{
                    width: "20px",
                    position: "inherit",
                    top: "14.5px",
                    left: "-16px",
                  }}
                >
                  {showPassword ? <img src={show} /> : <img src={notShow} />}
                </div>
              </div>

              <button
                className="register-btn"
                disabled={isResettingPassword}
                style={{ background: isResettingPassword ?? "gray" }}
              >
                <Text
                  label={t("user-forgot.change_psw")}
                  weight={"regular"}
                  color={"white"}
                  size={"s16"}
                />
              </button>
              {passwordError && (
                <p className="error-message">{passwordError}</p>
              )}
            </form>
          </div>
        ) : (
          <div className="form-box-register-forgot">
            <form onSubmit={getEmail} id="loginform1" className="form-value">
              <div
                style={{
                  marginTop: "30px",
                  marginBottom: "30px",
                  marginLeft: "20px",
                }}
              >
                <Text
                  label={t("user-forgot.email")}
                  size={"s20"}
                  weight={"medium"}
                />
              </div>
              <div className="register-form-second">
                <div className="inputbox-register">
                  <input
                    type="email"
                    className="register-input"
                    value={username}
                    placeholder="johndoe@gmail.com"
                    onChange={(e) => setUsername(e.target.value)}
                    required
                  />
                </div>
                <button className="register-btn-2">
                  {" "}
                  <Text
                    label={t("user-forgot.send_email")}
                    weight={"regular"}
                    color={"white"}
                    size={"s16"}
                  />
                </button>
              </div>
              <div className="backToLogin">
                <Link
                  to="/signin"
                  style={{ textDecoration: "none", color: "#6e46f5" }}
                >
                  <Text
                    label={t("backtoLoginin")}
                    weight={"medium700"}
                    size={"s16"}
                  />
                </Link>
              </div>
            </form>
          </div>
        )}
        {/* TODO ADD ALERTS FOR SUCCES AND ERROR  */}
      </div>
    </div>
  );
};

export default ForgotPassword;
