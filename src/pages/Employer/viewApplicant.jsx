import React, { useEffect, useState } from "react";
import { Button, Modal, Box, Typography, TextField } from "@mui/material"; // Import Button and other necessary components
import Text from "../../components/text/text";
import unicorn from "../../assets/images/Unicorn.png";
import facebook from "../../assets/icons/facebook.svg";
import instagram from "../../assets/icons/ig.svg";
import experience from "../../assets/images/exp.png";
import educationpic from "../../assets/images/educ.png";
import certification from "../../assets/images/certf.png";
import emailpic from "../../assets/icons/email.svg";
import link from "../../assets/icons/link.svg";
import { format } from "date-fns";
import axios from "axios";
import UserSignOut from "../../service/authentication/user/userSignOut";
import Animate from "../../animateTransition/AnimateY";
import "./viewApplicant.css";
import { useParams } from "react-router-dom";
import Swal from "sweetalert2";

const UserInfo = ({ employerid }) => {
  const { id } = useParams();
  const userId = id;
  const [user, setUser] = useState({});
  const [experiences, setExperience] = useState([]);
  const [education, setEducation] = useState([]);
  const [links, setLinks] = useState([]);
  const [certifications, setCertifications] = useState([]);
  const [generalSkills, setGeneralSkills] = useState([]);
  const [reportReason, setReportReason] = useState("");
  //https://fxb8z0anl0.execute-api.eu-west-3.amazonaws.com/prod/report-somethin
  const loadUser = async () => {
    try {
      const response = await axios.get(
        `https://fxb8z0anl0.execute-api.eu-west-3.amazonaws.com/prod/user/${userId}`
      );
      setUser(response.data.user);
      setExperience(response.data.user.experience);
      setCertifications(response.data.user.certifications);
      setEducation(response.data.user.education);
      setLinks(response.data.user.links);
      setGeneralSkills(response.data.user.generalSkills);
      console.log(response.data.user);
      console.log(response.data.user.experience);
      console.log(response.data.user.profilePhoto);
    } catch (error) {
      console.error("something went wrong");
    }
  };

  useEffect(() => {
    loadUser();
  }, []);

  const cardStyle = {
    backgroundImage: `url(${user.profilePhoto ?? unicorn})`,
    position: "relative",
  };

  const [open, setOpen] = useState(false);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    console.log(user._id);
    console.log(employerid._id);
    console.log(reportReason);
    try {
      const response = await axios.post(
        "https://fxb8z0anl0.execute-api.eu-west-3.amazonaws.com/prod/report-something",
        {
          reportedBy: user._id,
          userBeingReported: employerid,
          reportReason: reportReason,
        });
  
      console.log(response);
      setOpen(false);
      Swal.fire({
        icon: "success",
        title: "Report Submitted Successfully",
        text: "Thank you for taking the time to report. Your contribution helps improve the community.",
      });
    } catch (error) {
      setOpen(false);
      
      console.log("error response", error.response?.data);
  
      if (error.response && error.response.data) {

        if (reportReason === "") {
          Swal.fire({
            icon: "error",
            title: `You need a report reason!`,
          });
        } else if (error.response.data.message === "You have already reported this employer") {
          Swal.fire({
            icon: "info",
            title: `You have already reported ${user.name}`,
            text: "We have received your report and will investigate it accordingly. Thank you for helping maintain a safe environment.",
          });
        }
      } else {
        // Handle other unexpected errors
        // Display a generic error message
        console.error("An unexpected error occurred:", error);
      }
    }
  };

  return (
    <>
      <Animate>
        <div className="report-modal">
          <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
          >
            <Box className="centered-modal">
              <Typography id="modal-modal-title" variant="h6" component="h2">
                <Text
                  label={`Report ${user.name}`}
                  size={"s18"}
                  weight={"medium700"}
                />
              </Typography>
              <form onSubmit={handleSubmit}>
                <TextField
                  label="Reason for the report"
                  fullWidth
                  style={{ marginBottom: "20px", marginTop: "20px" }}
                  multiline
                  rowsMax={4}
                  value={reportReason}
                  onChange={(e) => setReportReason(e.target.value)}
                />

                <Button type="submit">Submit</Button>
              </form>
            </Box>
          </Modal>
        </div>

        <div className="userInfo-container">
          <div className="user-image">
            <div className="user-photo" style={cardStyle}>
              <div className="gradient-overlay"></div>
            </div>
          </div>
          <div className="header">
            <div className="applicant-name">
              <Text label={user.name} size={"s18"} weight={"medium700"} />
              <div className="report-btn" onClick={handleOpen}>
                <i class="fa-regular fa-flag" style={{ color: "#ff0000" }}></i>
              </div>
            </div>
            <div className="socials">
              <a href="https://www.facebook.com" target="_blank">
                <img alt="facebook" src={facebook} />
              </a>
              <a href="https://www.instagram.com" target="_blank">
                <img alt="instagram" src={instagram} />
              </a>
            </div>
          </div>
          <div className="position-info">
            <img alt="email" src={emailpic} />
            <div className="email-adress">
              <Text label={user.email} size={"s14"} />
            </div>
          </div>
          <div className="skills">
            <div className="skills-title">
              <Text label={"Skills"} size={"s18"} weight={"medium700"} />
            </div>
            <div className="skills-tabs">
              {generalSkills.map((skill, index) => (
                <div className="skill-tab-name">
                  <Text key={index} label={skill} size={"s14"} />
                </div>
              ))}
            </div>
          </div>
          <div className="experiences">
            <div className="exp">
              <Text label={"Experiences"} size={"s18"} weight={"medium700"} />
            </div>

            {experiences.map((exp, index) => (
              <div className="exp-info">
                <div className="exp-pic">
                  <img className="exp-pic" src={experience}></img>
                </div>
                <div className="exp-content">
                  <div className="exp-position">
                    <Text label={exp.position} size={"s16"} />
                  </div>
                  <div className="details">
                    <div className="details-tabs">
                      <Text key={index} label={exp.employer} size={"s14"} />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="experiences">
            <div className="exp">
              <Text label={"Education"} size={"s18"} weight={"medium700"} />
            </div>
            {education.map((edu, index) => (
              <div className="exp-info">
                <div className="exp-pic">
                  <img className="exp-pic" src={educationpic}></img>
                </div>
                <div className="exp-content">
                  <div className="exp-position">
                    <Text label={edu.degree} size={"s16"} />
                  </div>
                  <div className="details">
                    <Text
                      label={`${(edu.startDate = format(
                        new Date(edu.startDate),
                        "MMMM d, yyyy"
                      ))} - ${(edu.endDate = format(
                        new Date(edu.endDate),
                        "MMMM d, yyyy"
                      ))}`}
                      size={"s14"}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="experiences">
            <div className="exp">
              <Text
                label={"Certifications"}
                size={"s18"}
                weight={"medium700"}
              />
            </div>
            {certifications.map((cert, index) => (
              <div className="exp-info">
                <div className="exp-pic">
                  <img className="exp-pic" src={certification}></img>
                </div>

                <div className="exp-content">
                  <div className="exp-position">
                    <Text label={cert.title} size={"s16"} />
                  </div>
                  <div className="details">
                    <Text
                      label={`${(cert.issueDate = format(
                        new Date(cert.issueDate),
                        "MMMM d, yyyy"
                      ))} - ${(cert.expirationDate = format(
                        new Date(cert.expirationDate),
                        "MMMM d, yyyy"
                      ))}`}
                      size={"s14"}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="projects">
            <Text
              label={"Link to projects"}
              size={"s18"}
              weight={"medium700"}
            />
            {links.map((links1, index) => (
              <div className="project-link">
                <img src={link} />
                <Text label={links1} size={"s16"} />
              </div>
            ))}
          </div>
        </div>
      </Animate>
    </>
  );
};

export default UserInfo;
