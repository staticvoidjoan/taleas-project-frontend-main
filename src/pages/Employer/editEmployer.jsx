import React, { useEffect, useState } from "react";
import Text from "../../components/text/text";
import "./editEmployer.css";
import X from "../../assets/icons/closeX.svg";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import Animate from "../../animateTransition/AnimateY";
import Trash from "../../assets/icons/TrashCan.svg";
import Loader from "../../components/Loader/Loader";
import { useTranslation } from "react-i18next";

const EditEmployer = ({ employerData }) => {
  const {t}= useTranslation(["Translate"])
  const { id } = useParams();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  
  // Initialize the state with the existing data
  const [newEmployer, setNewEmployer] = useState({
    profilePhoto: employerData.profilePhoto,
    address: employerData.address,
    description: employerData.description,
    industry: employerData.industry,
  });

  const [descriptionError, setDescriptionError] = useState("");

  useEffect(() => {}, [employerData, newEmployer]);

  const { address, description, industry } = newEmployer;

  const onInputChange = (e) => {
    setNewEmployer({
      ...newEmployer,
      [e.target.name]: e.target.value,
    });
  };

  const waitforSubmit = async (e) => {
    e.preventDefault();
    if (
      newEmployer.description.length < 10 ||
      newEmployer.description.length > 500
    ) {
      setDescriptionError("Description should be between 10 and 500 words.");
      return;
    } else {
      setDescriptionError(""); // Clear any previous error message
    }

    Swal.fire({
      title: t("change"),
      showDenyButton: true,
      confirmButtonText: "Post",
      denyButtonText: "Not Yet",
    }).then((result) => {
      if (result.isConfirmed) {
        onSubmit();
      } else if (result.isDenied) {
        Swal.fire("Job not posted", "", "info");
      }
    });
  };

  const onSubmit = async () => {
    if (!address || !industry || !description) {
      alert(t("fillFields"));
      return;
    }

    const updatedJobPostString = `${newEmployer.description} ${newEmployer.address} ${newEmployer.industry}`.toLowerCase();

    try {
      console.log("Submitting the form...");
      console.log(updatedJobPostString);
      setIsLoading(true);

      const moderationResponse = await axios.post(
        "https://oet3gzct9a.execute-api.eu-west-2.amazonaws.com/prod/analyse",
        { text: updatedJobPostString }
      );
      const sentiment = moderationResponse.data.sentiments.Sentiment;
      console.log(sentiment);
      const profanityDetected = moderationResponse.data.profanityDetected;
      if (sentiment === "NEGATIVE" || profanityDetected === true) {
        Swal.fire({
          icon: "error",
          title: "Attention",
          text: t("inappropriate"),
          footer:
            "Please keep it respectful, and follow our community guidelines",
        });
        return;
      }

      console.log("ModerationResponse", moderationResponse);

      await axios.put(
        `https://fxb8z0anl0.execute-api.eu-west-3.amazonaws.com/prod/update-profile/${employerData._id}`,
        newEmployer
      );

      console.log("Job Successfully posted");
      let timerInterval;
      Swal.fire({
        title: "Updated Successfully!",
        icon: "success",
        timer: 1000,
        didOpen: () => {
          const b = Swal.getHtmlContainer()?.querySelector("b");
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
        navigate("/profile");
        window.location.reload();
      });
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const goBack = () => {
    navigate(-1);
  };

  if (isLoading) {
    return <Loader />;
  }
  return (
    <Animate>
      <div className="post-job-container">
        <div className="post-job-bar">
          <div className="post-job-bar-nav">
            <Text
              label={`Update ${employerData.companyName}`}
              size={"s16"}
              weight={"medium"}
            />
            <img src={X} alt="" onClick={goBack} />
          </div>
          <hr className="post-job-bar-div"></hr>
        </div>
        <div className="post-job-body">
          <form className="job-form" onSubmit={waitforSubmit}>
            <div className="informative">Industry</div>
            <div className="inputbox-register">
              <input
                type="text"
                name="industry"
                value={industry}
                onChange={onInputChange}
                placeholder={t("user-register.industry")}
                className="register-input"
                required
              />
            </div>
            <div className="informative">Address</div>
            <div className="inputbox-register">
              <input
                type="text"
                name="address"
                value={address}
                onChange={onInputChange}
                placeholder={t("user-register.address")}
                className="register-input"
                required
              />
            </div>
            <div className="informative">Description</div>
            <div className="inputbox-register-box">
              <textarea
                name="description"
                value={description}
                onChange={onInputChange}
                placeholder="Description..."
                className="register-input"
                required
              />
            </div>
            {descriptionError && (
              <p className="error-message">{descriptionError}</p>
            )}
            <button className="job-btn">
              <Text label={"Save"} size={"s16"} weight={"regular"} />
            </button>
          </form>
        </div>
      </div>
    </Animate>
  );
};

export default EditEmployer;
