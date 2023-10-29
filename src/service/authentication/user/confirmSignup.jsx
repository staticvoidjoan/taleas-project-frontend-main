import React, { useState } from "react";
import { Auth, Hub } from "aws-amplify";
import "./user.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Text from "../../../components/text/text";
import { useTranslation } from "react-i18next";

const ConfirmSignup = ({
  username,
  password,
  name,
  lastName,
  industry,
  address,
  isEmployee,
}) => {
  const [code, setCode] = useState("");
  const [confirmationError, setConfirmationError] = useState(null);
  const [isButtonDisabled, setButtonDisabled] = useState(false); // Add state to disable the button
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { t } = useTranslation(["Translate"]);

  async function confirmSignUp(e) {
    e.preventDefault();
    try {
      setIsLoading(true);
      setButtonDisabled(true); // Disable the button on click
      await Auth.confirmSignUp(username, code);
      console.log("Successfully confirmed sign up");
      await logIn();
      console.log(username);
      console.log(isEmployee);

      // Wait for updateEmployer to finish before reloading
      await updateEmployer();

      navigate("/profile");
      window.location.reload();
    } catch (error) {
      console.error("Error confirming sign up", error);
      setConfirmationError(
        "Error confirming sign up. Please check the code and try again."
      );
    } finally {
      setIsLoading(false); // Clear the flag after confirmation attempt
    }
  }

  const logIn = async () => {
    try {
      const user = await Auth.signIn(username, password);

      console.log("Logged in user:", user);
      if (!user) {
        throw new Error("Invalid user object or access token");
      }

      const idToken = user.signInUserSession.idToken.jwtToken;
      const accessToken = user.signInUserSession.accessToken.jwtToken;

      localStorage.setItem("idToken", idToken);
      localStorage.setItem("accessToken", accessToken);
      if (isEmployee === false) {
        updateEmployer();
      }
    } catch (err) {
      console.log(err);
    }
  };

  const updateEmployer = async () => {
    try {
      const response = await axios.get(
        `https://fxb8z0anl0.execute-api.eu-west-3.amazonaws.com/prod/employerByEmail/${username}`
      );
      const userid = response.data.employer._id;
      console.log(userid);
      if (userid) {
        await axios.put(
          `https://fxb8z0anl0.execute-api.eu-west-3.amazonaws.com/prod/update-profile/${userid}`,
          {
            profilePhoto:
              "https://userprofilephotobucket.s3.eu-west-3.amazonaws.com/folder/1696198483421.jpg",
            address: address,
            industry: industry,
            description: ""
          }
        );
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="user-register-page">
      <div style={{ clear: "both", height: "90px" }}></div>
      <div className="form-box-register">
        <form
          onSubmit={confirmSignUp}
          className="form-value-confirm"
          style={{ marginTop: "20px" }}
        >
          <div style={{ marginBottom: "20px", marginTop: "20px" }}>
            <Text
              label={t("user-confirm.header")}
              size={"s20"}
              weight={"bold"}
            />
          </div>
          <div className="inputbox-register">
            <input
              className="register-input"
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder={t("user-confirm.enter_code")}
              required
            />
          </div>
          {confirmationError && (
            <p className="error-message">{confirmationError}</p>
          )}
          <button
            className="register-btn"
            disabled={isLoading} // Disable the button when isLoading is true
            style={{ background: isLoading ? "gray" : "" }} // Optionally set a gray background when disabled
          >
            <Text
              label={t("user-confirm.confirm_btn")}
              size={"s16"}
              weight={"medium17"}
            />
          </button>
        </form>
      </div>
    </div>
  );
};

export default ConfirmSignup;
