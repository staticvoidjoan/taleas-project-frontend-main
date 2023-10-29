import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Text from "../../components/text/text";
import "./employeejobview.css";
import locationico from "../../assets/icons/location.svg";
import unicorn from "../../assets/images/Unicorn.png";
import axios from "axios";
import { format } from "date-fns";
import CenterNavbar from "../../components/centerNavbar/centerNavbar";
import Animate from "../../animateTransition/AnimateY";
import { Button, Modal, Box, Typography, TextField } from "@mui/material";
import Swal from "sweetalert2";
const JobProfile = ({employeeid}) => {
  const [post, setPost] = useState({});
  const [company, setCompany] = useState({});
  const [category, setCategory] = useState({});
  const [postDate, setPostDate] = useState("");
  const [reportReason, setReportReason] = useState("");
  const navigate = useNavigate();
  const { id } = useParams();
  useEffect(() => {
    loadPost();
    console.log(localStorage.getItem("localindex"));
  }, []);

  useEffect(() => {
    // This code will run whenever 'post' changes.
    console.log("Updated post state:", post);
  }, [post]);

  const loadPost = async () => {
    try {
      const response = await axios.get(
        `https://fxb8z0anl0.execute-api.eu-west-3.amazonaws.com/prod/posts/${id}`
      );

      console.log("API response data:", response.data);

      setPost(response.data.post);

      console.log("Updated post state:", post);
      if (response.data.post.creatorId) {
        setCompany(response.data.post.creatorId);
      }

      setCategory(response.data.post.category);
      const dateString = response.data.post.createdAt;
      const formattedDate = format(new Date(dateString), "MMMM d, yyyy");
      setPostDate(formattedDate);
    } catch (error) {
      console.log(error);
    }
  };

  const cardStyle = {
    backgroundImage: `url(${company.profilePhoto ?? unicorn} )`,
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
                  label={`Report ${company.companyName}`}
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
        <div className="job-post-container">
          <div className="photo-container">
            <div className="job-company-photo" style={cardStyle}>
              <div className="gradient-overlay"></div>
            </div>
          </div>
          <div className="job-info-view">
            <div className="job-title">
              <Text
                label={post.position ?? "Loading..."}
                weight={"bold"}
                color={"black"}
                size={"s18"}
              />
              <div className="job-report-row">
                <Text
                  label={company.companyName}
                  weight={"medium"}
                  color={"black"}
                  size={"s16"}
                />
                <div className="report-btn" onClick={handleOpen}>
                  <i
                    class="fa-regular fa-flag"
                    style={{ color: "#ff0000" }}
                  ></i>
                </div>
              </div>
              <Text
                label={company.industry}
                weight={"regular"}
                color={"black"}
                size={"s16"}
              />
              <div className="job-title-info">
                <div className="info-bubble">
                  <img src={locationico} className="location-icon" />
                  <div style={{ marginRight: "10px" }}>
                    <Text
                      label={company.address}
                      weight={"regular"}
                      color={"lightgray"}
                      size={"s14"}
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="job-describtion">
              <div style={{ marginBottom: "12px" }}>
                <Text
                  label={"Job Description"}
                  weight={"bold"}
                  color={"black"}
                  size={"s16"}
                />
              </div>
              <Text
                label={category.name}
                weight={"regular"}
                color={"black"}
                size={"s16"}
              />
              <Text
                label={post.description}
                weight={"regular"}
                color={"lightgray"}
                size={"s14"}
              />
              <div style={{ marginTop: "16px" }}>
                <Text
                  label={`Posted on ${postDate}`}
                  weight={"regular"}
                  color={"lightgray"}
                  size={"s14"}
                />
              </div>
            </div>
            <div className="job-requirements">
              <div style={{ marginBottom: "12px" }}>
                <Text label={"Requirements"} weight={"bold"} size={"s16"} />
              </div>
              <ul>
                {post.requirements &&
                  post.requirements.map((requirement, index) => (
                    <li
                      key={index}
                      style={{ marginLeft: "15px", marginBottom: "5px" }}
                    >
                      <Text
                        label={requirement}
                        weight={"regular"}
                        size={"s16"}
                      />
                    </li>
                  ))}
              </ul>
            </div>
          </div>
        </div>
      </Animate>
    </>
  );
};

export default JobProfile;
