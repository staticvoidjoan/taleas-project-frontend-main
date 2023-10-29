import React, { useState } from "react";
import Text from "../../components/text/text";
import axios from "axios";
import "./contact.css";
import Swal from "sweetalert2";
import About3 from "../../assets/images/about3.svg";
import { useTranslation } from "react-i18next";

const Contact = () => {
  const { t } = useTranslation(["Translate"]);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    message: "",
  });
  const [errors, setErrors] = useState({
    firstName: "",
    lastName: "",
    email: "",
    message: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    setErrors({
      ...errors,
      [name]: "",
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};
    if (!formData.firstName) {
      newErrors.firstName = "First Name is required.";
    }

    if (!formData.lastName) {
      newErrors.lastName = "Last Name is required.";
    }

    if (!formData.email) {
      newErrors.email = "Email is required.";
    }

    if (!formData.message) {
      newErrors.message = "Message is required.";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    if (!emailPattern.test(formData.email)) {
      newErrors.email = "Please enter a valid email address.";
      setErrors(newErrors);
      return;
    }
    try {
      console.log("Adding new  contact...");
      console.log("Form data submitted:", formData);
      // const response = await axios.post(
      //   "https://fxb8z0anl0.execute-api.eu-west-3.amazonaws.com/prod/contact",
      //   formData
      // );
      // console.log("Server response:", response);

      // console.log("Server response:", response.data);
      Swal.fire({
        position: "center",
        icon: "success",
        title: t("formSent"),
        showConfirmButton: false,
        timer: 1500,
      });
    } catch (error) {
      console.error("Error submitting form:", error);
    }
    setFormData({
      firstName: "",
      lastName: "",
      email: "",
      message: "",
    });
  };

  return (
    <>
      <div className="contact-container">
        {window.innerWidth > 901 && (
          <img src={About3} alt="Contact" className="photo-contact-menu" />
        )}
        <div className="contact-stuff">
          <div className="contact-text">
            <Text
              label={t("getInTouch")}
              weight={"bold"}
              lineheight={"lnormal"}
              size={"s24"}
              color={"lightgray"}
            />
            <hr />
            <Text
              label={t("formMessage")}
              weight={"thin"}
              lineheight={"lnormal"}
              size={"s16"}
              color={"lightgray"}
            />
          </div>
          <div className="contact-form">
            <form onSubmit={handleSubmit}>
              <div>
                <label htmlFor="firstName" className="contact-label">
                  <Text
                    label={" Name"}
                    weight={"thin"}
                    lineheight={"lnormal"}
                    size={"s16"}
                    color={"purple"}
                  />{" "}
                </label>
                <input
                  className="contact-input"
                  type="text"
                  id="firstName"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  required
                />
                <span className="error">{errors.firstName}</span>
              </div>
              <div>
                <label htmlFor="lastName" className="contact-label">
                  {" "}
                  <Text
                    label={"Surname"}
                    weight={"thin"}
                    lineheight={"lnormal"}
                    size={"s16"}
                    color={"purple"}
                  />{" "}
                </label>
                <input
                  className="contact-input"
                  type="text"
                  id="lastName"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  required
                />
                <span className="error">{errors.lastName}</span>
              </div>
              <div>
                <label htmlFor="email" className="contact-label">
                  <Text
                    label={"Email"}
                    weight={"thin"}
                    lineheight={"lnormal"}
                    size={"s16"}
                    color={"purple"}
                  />{" "}
                </label>
                <input
                  className="contact-input"
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                />
                <span className="error">{errors.email}</span>
              </div>
              <div>
                <label htmlFor="message" className="contact-label">
                  <Text
                    label={"Message"}
                    weight={"thin"}
                    lineheight={"lnormal"}
                    size={"s16"}
                    color={"purple"}
                  />{" "}
                </label>
                <textarea
                  className="contact-input"
                  id="message"
                  name="message"
                  rows="4"
                  value={formData.message}
                  onChange={handleInputChange}
                  required
                />
                <span className="error">{errors.message}</span>
              </div>
              <button className="btn-register-contact" type="submit">
                <Text
                  label={"Submit"}
                  weight={"thin"}
                  lineheight={"lnormal"}
                  size={"s16"}
                  color={"white"}
                />{" "}
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};
export default Contact;
