import React, { useEffect, useState } from "react";
import Text from "../../components/text/text";
import unicorn from "../../assets/images/Unicorn.png";
import facebook from "../../assets/icons/facebook.svg";
import instagram from "../../assets/icons/ig.svg";
import experience from "../../assets/images/exp.png";
import educationpic from "../../assets/images/educ.png";
import certification from "../../assets/images/certf.png";
import emailpic from "../../assets/icons/email.svg";
import edit from "../../assets/icons/edit.svg";
import link from "../../assets/icons/link.svg";
import { format } from "date-fns";
import "./userInfo.css";
import axios from "axios";
import UserSignOut from "../../service/authentication/user/userSignOut";
import Animate from "../../animateTransition/AnimateY";
import CenterNavbar from "../../components/centerNavbar/centerNavbar";
import { useNavigate } from "react-router-dom";
import UserInfoLoader from "../../components/Loader/UserInfoLoader";
import Loader from "../../components/Loader/Loader";
import {useTranslation} from "react-i18next";
import { Button, Modal, Box, Typography, TextField } from "@mui/material";


const UserInfo = ({ userId }) => {
  const [user, setUser] = useState({});
  const [experiences, setExperience] = useState([]);
  const [education, setEducation] = useState([]);
  const [links, setLinks] = useState([]);
  const [certifications, setCertifications] = useState([]);
  const [generalSkills, setGeneralSkills] = useState([]);
  const [languages, setLanguages] = useState([])
  const [loading, setLoading] = useState();
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [reportReason, setReportReason] = useState("");
  
  const {t} = useTranslation(["Translate"])

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const navigate = useNavigate();
  const editNav = () => {
    navigate("/completeprofile");
  };

  const loadUser = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `https://fxb8z0anl0.execute-api.eu-west-3.amazonaws.com/prod/user/${userId}`
      );
      setUser(response.data.user);
      setExperience(response.data.user.experience);
      setCertifications(response.data.user.certifications);
      setEducation(response.data.user.education);
      setLinks(response.data.user.links);
      setGeneralSkills(response.data.user.generalSkills);
      setLanguages(response.data.user.languages)
      setTimeout(() => {
        setLoading(false);
      }, 1000);
      console.log(response.data.user);
      console.log(response.data.user.experience);
      console.log(response.data.user.profilePhoto);
    } catch (error) {
      console.error("something went wrong");
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    console.log(company._id);
    console.log(employeeid);
    console.log(reportReason);
    try {
      const response = await axios.post(
        "https://fxb8z0anl0.execute-api.eu-west-3.amazonaws.com/prod/report-something",
        {
          reportedBy: employeeid,
          userBeingReported: company._id,
          reportReason: reportReason,
        }
      );

      console.log(response);
      setOpen(false);
      Swal.fire({
        icon: "success",
        title: "Report Submitted Successfully",
        text: "Thank you for taking the time to report. Your contribution helps improve the community.",
      });
      setTimeout(() => {
        navigate(`/`);
        window.location.reload(true);
      }, 1500);
    } catch (error) {
      setOpen(false);

      console.log("error response", error.response?.data);

      if (error.response && error.response.data) {
        if (reportReason === "") {
          Swal.fire({
            icon: "error",
            title: `You need a report reason!`,
          });
        } else if (
          error.response.data.message ===
          "You have already reported this employer"
        ) {
          Swal.fire({
            icon: "info",
            title: `You have already reported ${company.companyName}`,
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

  useEffect(() => {
    loadUser();
  }, []);

  const handleClose = () => {
    setOpen(false);
  };

  const handleOpen = () => {
    setOpen(true);
  };

  const [open, setOpen] = useState(false);

  const cardStyle = {
    backgroundImage: `url(${user.profilePhoto ?? unicorn})`,
    position: "relative",
  };
  return (
    <>
      {loading ? (
      windowWidth > 400 ? (
         <Loader />
      ) : (
       <UserInfoLoader />
      )
    ) : (
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
            <div className="edit-profile-web" onClick={editNav}>
              <button className="edit-profile-web-button">Edit Profile</button>
            </div>
            <div className="user-image">
              <div className="user-photo" style={cardStyle}>
                <div className="gradient-overlay"></div>
              </div>
            </div>
{/* {HEADER} */}
            <div className="header">
              
              <div className="fullname" onClick={editNav}>
                <Text
                  label={`${user.name} ${user.lastname} `}
                  size={"s18"}
                  weight={"medium700"}
                />
                <div className="edit-profile">
                  <img src={edit}></img>
                </div>
              </div>
              <div className="socials">
                <a href="https://www.instagram.com" target="_blank">
                  <img alt="facebook" src={facebook} />
                </a>
                <a href="https://www.facebook.com" target="_blank">
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
{/* SKILLS */}
            <div className="skills">
              <div className="skills-title">
                <Text label={t("skills")} size={"s18"} weight={"medium700"} />
              </div>
              <div className="skills-tabs">
                {generalSkills.map((skill, index) => (
                  <div className="skill-tab-name">
                    <Text key={index} label={skill} size={"s14"} />
                  </div>
                ))}
              </div>
            </div>
{/* EXPERIENCES */}
            <div className="experiences">
              <div className="exp">
                <Text label={t("experiences")} size={"s18"} weight={"medium700"} />
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
                      <div className="exp-date" >
                      <Text
                        label={`${exp.startDate} / ${exp.endDate}`}
                        size={"s14"}
                      />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
{/* EDUCATION */}
            <div className="experiences">
              <div className="exp">
                <Text label={t("education")} size={"s18"} weight={"medium700"} />
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
                    <div className="details-tabs">
                        <Text key={index} label={edu.institution} size={"s14"} />
                      </div>
                      <div className="exp-date">
                      <Text
                        label={`${edu.startDate} / ${edu.endDate}`}
                        size={"s14"}
                      />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
{/* CERTIFICATIONS  */}
            <div className="experiences">
              <div className="exp">
                <Text
                  label={t("certifications")}
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
                    <div className="details-tabs">
                        <Text key={index} label={cert.organization} size={"s14"} />
                      </div>
                      <div className="exp-date">
                      <Text
                        label={`${cert.issueDate} / ${cert.expirationDate}`}
                        size={"s14"}
                      />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="lang">
              <Text
                label={t("languages")}
                size={"s18"}
                weight={"medium700"}
              />
              <div className="lang-div">
              {languages.map((lang, index) => (
                <div className="lang-tabs">
                  <Text label={lang} size={"s14"} />
                </div>
              ))}
              </div>
            </div>
{/* links */}
            <div className="projects">
              <Text
                label={t("links")}
                size={"s18"}
                weight={"medium700"}
              />
              {links.map((links1, index) => (
                <div className="project-link">
                  <img src={link} />
                  <a href={links1} target="_blank" className="link-tab"><Text label={links1} size={"s16"} /></a>
                </div>
              ))}
            </div>
            <div className="signout">
              <UserSignOut />
            </div>
          </div>
        </Animate>
      )}
    </>
  );
};

export default UserInfo;
