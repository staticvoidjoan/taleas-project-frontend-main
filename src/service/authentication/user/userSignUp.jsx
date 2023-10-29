import React, { useEffect, useState } from "react";
import { Auth } from "aws-amplify";
import { Amplify } from "aws-amplify";
import awsExports from "../../../aws-exports";
import ConfirmSignup from "./confirmSignup";
import { Link, useNavigate } from "react-router-dom";
import Text from "../../../components/text/text";
import Button from "../../../components/button/button";
import show from "../../../assets/icons/eye-regular.svg";
import LoginPhoto from "../../../assets/icons/ACCESS ACCOUNT.svg";
import notShow from "../../../assets/icons/eye-slash-regular.svg";
// Alerts
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./user.css";
import TextField from "@mui/material/TextField";
// import LinkedInOAuth from "../../../linkedinOAuth";
import { useTranslation } from "react-i18next";

function RegistrationForm() {
  Amplify.configure(awsExports);
  const { t } = useTranslation(["Translate"]);
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState("employer");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isEmployee, setIsEmployee] = useState(true);
  const [fullName, setFullName] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordEmployer, setShowPasswordEmployer] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    lastname: "",
    birthday: "",
    password: "",
    email: "",
    companyName: "",
    industry: "",
    address: "",
  }); // Create the user object

  const [errors, setErrors] = useState({
    name: "",
    birthday: "",
    email: "",
    lastname: "",
    password: "",
  });

  useEffect(() => {
    console.log(isEmployee);
  }, []);

  const [registrationSuccess, setRegistrationSuccess] = useState(false);
  const {
    name,
    birthday,
    email,
    lastname,
    password,
    companyName,
    industry,
    address,
  } = formData;

  const validateForm = () => {
    let formIsValid = true;
    const newErrors = { ...errors };

    const emailRegEx = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const passwordRegex =
      /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;
    const birthDate = new Date(birthday);
    const today = new Date();
    const age = today.getFullYear() - birthDate.getFullYear();
    if (!lastname) {
      if (isEmployee) {
        formIsValid = false;
        newErrors.lastname = "Please put both first and last name";
      }
    }
    if (age < 16) {
      formIsValid = false;
      newErrors.birthday = "You must be at least 16 years old to register";
    } else {
      newErrors.birthday = "";
    }

    if (!email) {
      formIsValid = false;
      newErrors.email = "Email is required";
    } else if (!emailRegEx.test(email)) {
      formIsValid = false;
      newErrors.email = "Email provided is not in the correct format";
    } else {
      newErrors.email = "";
    }

    if (!password) {
      formIsValid = false;
      newErrors.password = "Password is required";
    } else if (!passwordRegex.test(password)) {
      formIsValid = false;
      newErrors.password =
        "Invalid password format! Password must be at least 8 characters long and should contain at least one number, one letter, and one symbol.";
    } else {
      newErrors.password = "";
    }

    setErrors(newErrors);
    return formIsValid;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: "",
    }));
  };

  const handleShowPassword = () => {
    setShowPassword(!showPassword);
  };
  const togglePassword = () => {
    setShowPasswordEmployer(!showPasswordEmployer);
  };

  const handleFullName = (event) => {
    const { value } = event.target;
    setFullName(value);
    // Split the fullName into first and last names based on space
    const [first, ...rest] = value.split(" ");
    setFormData({
      ...formData,
      name: first,
      lastname: rest.join(" "),
    });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      setIsSubmitting(true);
      // Correct the logic here
      if (selectedCategory === "employer") {
        setIsEmployee(false);
      } else {
        setIsEmployee(true); // Assuming the default is "employee"
      }
      try {
        await Auth.signUp({
          username: formData.email,
          password: formData.password,
          attributes: {
            email: formData.email,
            given_name: formData.name,
            family_name: formData.lastname,
            birthdate: formData.birthday,
            "custom:isEmployee": isEmployee ? "true" : "false", // Use isEmployee here
          },
        });

        console.log("Registration successful");
        toast.success("Registration successful", { autoClose: 5000 });
        setRegistrationSuccess(true);
      } catch (error) {
        alert(error);
        toast.error(error.message);
        console.error("Error during signup:", error);
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const handleEmployerSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await Auth.signUp({
        username: formData.email,
        password: formData.password,
        attributes: {
          email: formData.email,
          given_name: formData.name,
          "custom:isEmployee": "false", // Use isEmployee here
        },
      });

      console.log("Registration successful");
      toast.success("Registration successful", { autoClose: 5000 });
      setRegistrationSuccess(true);
    } catch (error) {
      alert(error);
      toast.error(error.message);
      console.error("Error during signup:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCategorySelection = (category) => {
    setSelectedCategory(category);
    // Set isEmployee here based on the selected category
    setIsEmployee(category === "employee");
  };

  return (
    <div className="user-register-page">
      <div style={{ marginTop: "100px" }}>
        {window.innerWidth > 901 && (
          <>
            <div className="user-register-title">
              <div style={{ marginBottom: "16px" }}>
                <Text
                  label={t("user-register.header")}
                  size={"s20"}
                  weight={"medium700"}
                  color={"white"}
                />
              </div>
              <Text
                label={
                  selectedCategory === "employee"
                    ? t("user-register.subEmployee")
                    : t("user-register.subEmployer")
                }
                size={"s16"}
                weight={"regular"}
                color={"white"}
              />
            </div>
            <img
              src={LoginPhoto}
              alt="Contact"
              className="register-photo-page"
            />
          </>
        )}
      </div>

      <div className="forms-users">
        {" "}
        {!registrationSuccess ? (
          <>
            <div className="form-box-register">
              <div className="form-category">
                <div
                  className={`employer-category ${
                    selectedCategory === "employee" ? "selected" : ""
                  }`}
                  onClick={() => handleCategorySelection("employee")}
                >
                  <div style={{ marginBottom: "10px" }}>
                    <Text label={"Employee"} />
                  </div>
                </div>
                <div
                  className={`employee-category ${
                    selectedCategory === "employer" ? "selected" : ""
                  }`}
                  onClick={() => handleCategorySelection("employer")}
                >
                  <div style={{ marginBottom: "10px" }}>
                    <Text label={"Employer"} />
                  </div>
                </div>
              </div>
              {selectedCategory === "employee" ? (
                <form
                  onSubmit={handleSubmit}
                  className="form-value"
                  autoComplete="off"
                >
                  {errors.name && (
                    <div className="error-message">{errors.name}</div>
                  )}
                  {errors.lastname && (
                    <div className="error-message">{errors.lastname}</div>
                  )}
                  <div className="inputbox-register">
                    <input
                      type="text"
                      name="fullName"
                      value={fullName}
                      onChange={handleFullName}
                      placeholder={t("user-register.fullname")}
                      className="register-input"
                      required
                    />
                  </div>

                  {errors.email && (
                    <div className="error-message">{errors.email}</div>
                  )}
                  <div className="inputbox-register">
                    <input
                      type="text"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="Email"
                      required
                      className="register-input"
                    />
                  </div>
                  {errors.birthday && (
                    <div className="error-message">{errors.birthday}</div>
                  )}
                  <div className="inputbox-register-birthday">
                    {/* <label htmlFor="birthday" className="register-input-label">
                    {formData.birthday ? "Date of Birth" : "Birthday"}
                  </label> */}
                    <TextField
                      label={t("user-register.birthday")}
                      id="outlined-basic"
                      variant="outlined"
                      type="date"
                      name="birthday"
                      value={formData.birthday}
                      onChange={handleInputChange}
                      className="register-input"
                      required
                      InputLabelProps={{ shrink: true }}
                    />
                  </div>
                  <div className="inputbox-register">
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      placeholder={t("user-register.password")}
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
                      {showPassword ? (
                        <img src={show} />
                      ) : (
                        <img src={notShow} />
                      )}
                    </div>
                  </div>
                  {errors.password && (
                    <div className="error-message">{errors.password}</div>
                  )}
                  <div className="radio-terms">
                    <input
                      type="checkbox"
                      name="agree-to-terms"
                      required
                      className="terms-button"
                    />
                    <div className="terms-text">
                      <div style={{ marginRight: "5px" }}>
                        <Text
                          label={t("accept")}
                          weight={"thin"}
                        />
                      </div>
                      <Text
                        label={t("terms")}
                        weight={"bold"}
                      />
                    </div>
                  </div>
                  <button
                    className={`register-btn ${isSubmitting ? "disabled" : ""}`}
                    disabled={isSubmitting}
                  >
                    <Text
                      label={t("user-register.register")}
                      weight={"regular"}
                      color={"white"}
                      size={"s16"}
                    />
                  </button>

                  <div className="goto-login">
                    <Text
                      label={t("user-register.haveAcc")}
                      weight={"regular"}
                      color={"black"}
                      size={"s16"}
                    />
                    <Link style={{ textDecoration: "none" }} to={"/signin"}>
                      <Text
                        label={t("user-register.login")}
                        weight={"medium700"}
                        color={"purple"}
                        size={"s16"}
                      />
                    </Link>
                  </div>
                </form>
              ) : (
                <form
                  onSubmit={handleEmployerSubmit}
                  className="form-value"
                  autoComplete="off"
                >
                  {errors.name && (
                    <div className="error-message">{errors.name}</div>
                  )}
                  <div className="inputbox-register">
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder={t("user-register.company")}
                      className="register-input"
                      required
                    />
                  </div>

                  {errors.industry && (
                    <div className="error-message">{errors.industry}</div>
                  )}
                  <div className="inputbox-register">
                    <input
                      type="text"
                      name="industry"
                      value={formData.industry}
                      onChange={handleInputChange}
                      placeholder={t("user-register.industry")}
                      className="register-input"
                      required
                    />
                  </div>
                  {errors.address && (
                    <div className="error-message">{errors.address}</div>
                  )}
                  <div className="inputbox-register">
                    <input
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      placeholder={t("user-register.address")}
                      className="register-input"
                      required
                    />
                  </div>
                  {errors.email && (
                    <div className="error-message">{errors.email}</div>
                  )}
                  <div className="inputbox-register">
                    <input
                      type="text"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="Email"
                      className="register-input"
                      required
                    />
                  </div>
                  {errors.password && (
                    <div className="error-message">{errors.password}</div>
                  )}
                  <div className="inputbox-register">
                    <input
                      type={showPasswordEmployer ? "text" : "password"}
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      placeholder={t("user-register.password")}
                      className="register-input"
                      required
                    />
                    <div
                      onClick={togglePassword}
                      style={{
                        width: "20px",
                        position: "inherit",
                        top: "14.5px",
                        left: "-16px",
                      }}
                    >
                      {showPasswordEmployer ? (
                        <img src={show} />
                      ) : (
                        <img src={notShow} />
                      )}
                    </div>
                  </div>
                  <div className="radio-terms">
                    <input
                      type="checkbox"
                      name="agree-to-terms"
                      required
                      className="terms-button"
                    />
                    <div className="terms-text">
                      <div style={{ marginRight: "5px" }}>
                        <Text label={t("accept")} weight={"thin"} />
                      </div>
                      <Text label={t("terms")} weight={"bold"} />
                    </div>
                  </div>
                  <button
                    className={`register-btn ${isSubmitting ? "disabled" : ""}`}
                    disabled={isSubmitting}
                  >
                    <Text
                      label={t("user-register.register")}
                      weight={"regular"}
                      color={"white"}
                      size={"s16"}
                    />
                  </button>

                  <div className="goto-login">
                    <Text
                      label={t("user-register.haveAcc")}
                      weight={"regular"}
                      color={"black"}
                      size={"s16"}
                    />
                    <Link style={{ textDecoration: "none" }} to={"/signin"}>
                      <Text
                        label={t("user-register.login")}
                        weight={"medium700"}
                        color={"purple"}
                        size={"s16"}
                      />
                    </Link>
                  </div>
                </form>
              )}
            </div>
          </>
        ) : (
          <>
            <ConfirmSignup
              username={formData.email}
              password={formData.password}
              lastName={formData.lastname}
              name={formData.name}
              isEmployee={isEmployee}
              industry={formData.industry}
              address={formData.address}
            />
            <div style={{ clear: "both", height: "90px" }}></div>
          </>
        )}
        {window.innerWidth < 901 && (
          <div className="user-register-title">
            <div style={{ marginBottom: "16px" }}>
              <Text
                label={t("user-register.header")}
                size={"s20"}
                weight={"medium700"}
                color={"white"}
              />
            </div>
            <Text
              label={
                selectedCategory === "employee"
                  ? t("user-register.subEmployee")
                  : t("user-register.subEmployer")
              }
              size={"s16"}
              weight={"regular"}
              color={"white"}
            />
          </div>
        )}
        <div style={{ clear: "both", height: "150px" }}></div>
      </div>
    </div>
  );
}

export default RegistrationForm;
