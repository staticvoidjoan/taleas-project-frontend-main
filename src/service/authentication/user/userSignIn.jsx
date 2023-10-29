import React, { useState } from "react";
import { Auth } from "aws-amplify";
// import "./user.css";
import "./userSignIn.css";
import { Amplify } from "aws-amplify";
import { Link, useNavigate } from "react-router-dom";
import awsExports from "../../../aws-exports";
import Text from "../../../components/text/text";
import Swal from "sweetalert2";
import show from "../../../assets/icons/eye-regular.svg";
import Login from "../../../assets/icons/LogIn.svg";
import notShow from "../../../assets/icons/eye-slash-regular.svg";
import { useTranslation } from "react-i18next";
const LoginPage = () => {
  const { t } = useTranslation(["Translate"]);
  Amplify.configure(awsExports);
  const [selectedCategory, setSelectedCategory] = useState("employer");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);
  const [success, setSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [confirmationError, setConfirmationError] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      console.log(username);

      const user = await Auth.signIn(username, password);

      console.log("Logged in user:", user);
      if (!user) {
        throw new Error("Invalid user object or access token");
      }

      const idToken = user.signInUserSession.idToken.jwtToken;
      const accessToken = user.signInUserSession.accessToken.jwtToken;

      localStorage.setItem("idToken", idToken);
      localStorage.setItem("accessToken", accessToken);
      console.log(username);
      goToHome();
    } catch (err) {
      setError("An error occurred while logging in.");
      setConfirmationError(true);
      setSuccess(false);
    }
  };

  const handleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const goToHome = async () => {
    try {
      const user = await Auth.currentAuthenticatedUser();
      const userAttributes = user.attributes || {};
      let timerInterval;

      Swal.fire({
        title: "Sign in successful!",
        icon: "success",
        timer: 900,
        didOpen: () => {
          const b = Swal.getHtmlContainer()?.querySelector("b"); // Check if it exists
          if (b) {
            timerInterval = setInterval(() => {
              b.textContent = Swal.getTimerLeft();
            }, 100);
          }
        },
        willClose: () => {
          clearInterval(timerInterval);
        },
      }).then((result) => {
        if (result.dismiss === Swal.DismissReason.timer) {
          console.log("I was closed by the timer");
        }
        // Handle other actions as needed
        window.location.reload();
        window.location.href = "/";
      });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="user-register-page-login">
      <div>
        {window.innerWidth > 901 && (
          <>
            <div className="user-register-title">
              <div style={{ marginBottom: "16px" }}>
                <Text
                  label={t("user-login.header")}
                  size={"s18"}
                  weight={"medium700"}
                  color={"white"}
                />
              </div>
              <Text
                label={t("user-login.subHead")}
                size={"s14"}
                weight={"regular"}
                color={"white"}
              />
            </div>
            <img src={Login} alt="Contact" className="login-photo-page" />
          </>
        )}
      </div>

      <div className="users-forms">
        {window.innerWidth < 900 && (
          <>
            <div className="user-register-title">
              <div style={{ marginBottom: "16px" }}>
                <Text
                  label={t("user-login.header")}
                  size={"s18"}
                  weight={"medium700"}
                  color={"white"}
                />
              </div>
              <Text
                label={t("user-login.subHead")}
                size={"s14"}
                weight={"regular"}
                color={"white"}
              />
            </div>
          </>
        )}

        <div className="form-box-register-login">
          <div className="form-category">
            <div
              className={`employee-category ${
                selectedCategory === "employer" ? "selected" : ""
              }`}
              onClick={() => setSelectedCategory("employer")}
            >
              <div style={{ marginBottom: "10px" }}>
                <Text label={t("user-login.login")} />
              </div>
            </div>
          </div>
          <form
            onSubmit={handleSubmit}
            className="form-value"
            autoComplete="off"
          >
            <div className="inputbox-register">
              <input
                type="text"
                name="email"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Email"
                required
                className="register-input"
              />
            </div>

            <div className="inputbox-register">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={t("user-login.password")}
                className="register-input"
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
            <div className="forgot-password">
              <Link style={{ textDecoration: "none" }} to={"/passwordreset"}>
                <Text
                  label={t("user-login.forgot_password")}
                  weight={"medium700"}
                  color={"purple"}
                  size={"s16"}
                />
              </Link>
            </div>
            <button className="register-btn">
              <Text
                label={t("user-login.login")}
                weight={"regular"}
                color={"white"}
                size={"s16"}
              />
            </button>

            {confirmationError ? (
              <div className="login-error">
                <Text label={t("user-login.login_error")} />
                <Link to={"/resendSignUp"}>
                  <Text label={t("user-login.click_here")} />
                </Link>
              </div>
            ) : null}

            <div className="goto-login">
              <Text
                label={t("user-login.not_acc")}
                weight={"regular"}
                color={"black"}
                size={"s16"}
              />
              <Link style={{ textDecoration: "none" }} to={"/signup"}>
                <Text
                  label={t("user-login.register")}
                  weight={"medium700"}
                  color={"purple"}
                  size={"s16"}
                />
              </Link>
            </div>
            {/* <Button bgcolor={"primary"} label={"register"}/> */}
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
