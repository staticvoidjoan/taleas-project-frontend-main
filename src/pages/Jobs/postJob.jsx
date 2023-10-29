import React, { useEffect, useState } from "react";
import Text from "../../components/text/text";
import "./postJob.css";
import X from "../../assets/icons/closeX.svg";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import Animate from "../../animateTransition/AnimateY";
import Trash from "../../assets/icons/TrashCan.svg";
import Loader from "../../components/Loader/Loader";
import {useTranslation} from "react-i18next";

const PostJob = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false); 
  const [jobPost, setJobPost] = useState({
    category: "",
    position: "",
    requirements: [],
    description: "",
  });

  const {t}= useTranslation(["Translate"]);
  const [categories, setCategories] = useState({});
  const [newRequirement, setNewRequirement] = useState("");
  const [requirements, setRequirements] = useState([]);

  const { category, position, description } = jobPost;

  useEffect(() => {
    getCategoryNames();
  }, []);

  const onAddRequirement = () => {
    if (newRequirement.trim() !== "") {
      const uniqueId = Date.now();
      setRequirements((prevRequirements) => [
        ...prevRequirements,
        { text: newRequirement, id: uniqueId },
      ]);
      setNewRequirement("");
    }
  };

  const onInputChange = (e) => {
    setJobPost({
      ...jobPost,
      [e.target.name]: e.target.value,
    });
  };

  const getCategoryNames = async () => {
    try {
      const response = await axios.get(
        "https://fxb8z0anl0.execute-api.eu-west-3.amazonaws.com/prod/category"
      );
      setCategories(response.data.categories);
    } catch (error) {
      console.error(error);
    }
  };

  const waitforSubmit = async (e) => {
    e.preventDefault();
    Swal.fire({
      title: "Do you want to post this job?",
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
    if (!category || !position || !description) {
      alert("Please fill in all required fields.");
      return;
    }

    // Create a new array of requirement strings without the 'text' property
    const requirementsWithoutText = requirements.map(({ text }) => text);

    const updatedJobPost = {
      ...jobPost,
      requirements: requirementsWithoutText,
    };
    const requirementsString = updatedJobPost.requirements.join(', ');
    const updatedJobPostString = `${updatedJobPost.description} ${requirementsString} ${updatedJobPost.position}`.toLowerCase();

    try {
      console.log("Submitting the form...");
      console.log(category, id, position, requirementsWithoutText, description);
      console.log(updatedJobPostString);
      setIsLoading(true);

      const moderationResponse = await axios.post(
        'https://oet3gzct9a.execute-api.eu-west-2.amazonaws.com/prod/analyse', {text:updatedJobPostString}
      )
      const sentiment = moderationResponse.data.sentiments.Sentiment
      console.log(sentiment)
      const profanityDetected = moderationResponse.data.profanityDetected
      if(sentiment === "NEGATIVE" || profanityDetected === true){
        Swal.fire({
          icon: 'error',
          title: 'Attention',
          text: 'Your content contains inappropriate language.!',
          footer: 'Please keep it respectful, and follow our community guidelines'
        })
        return;
      }

      console.log("ModerationResponse", moderationResponse)

      await axios.post(
        `https://fxb8z0anl0.execute-api.eu-west-3.amazonaws.com/prod/posts/creator/${id}`,
        updatedJobPost
      );

      console.log("Job Successfully posted");
      let timerInterval;
      Swal.fire({
        title: "Job Posted!",
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
        navigate(-1);
      });
    } catch (error) {
      console.error(error);
    }finally{
      setIsLoading(false);
    }
  };

  const removeRequirement = (idToRemove) => {
    setRequirements((prevRequirements) =>
      prevRequirements.filter((req) => req.id !== idToRemove)
    );
  };

  const goBack = () => {
    navigate(-1);
  };

  if(isLoading){
    return <Loader/>
  }
  return (
    <Animate>
      <div className="post-job-container">
        <div className="post-job-bar">
          <div className="post-job-bar-nav">
            <Text label={t("addJob")} size={"s16"} weight={"medium"} />
            <img src={X} alt="" onClick={goBack} />
          </div>
          <hr className="post-job-bar-div"></hr>
        </div>
        <div className="post-job-body">
          <form className="job-form" onSubmit={waitforSubmit}>
            <div className="inputbox-register">
              {categories.length > 0 ? (
                <select
                  name="category"
                  value={category}
                  onChange={onInputChange}
                  className="register-input"
                  placeholder="Select a Category"
                  required
                >
                  <option value="" disabled>
                    {t("select")}
                  </option>
                  {categories.map((category) => (
                    <option key={category._id} value={category._id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              ) : (
                <p>{t("loadingCategories")}</p>
              )}
            </div>
            <div className="inputbox-register">
              <input
                type="text"
                name="position"
                value={position}
                onChange={onInputChange}
                placeholder={t("position")}
                className="register-input"
                required
              />
            </div>
            <div className="inputbox-register-box">
              <textarea
                name="description"
                value={description}
                onChange={onInputChange}
                placeholder={t("description")}
                className="register-input"
                required
              />
            </div>
            <div className="inputbox-register">
              <div className="requirement-input">
                <input
                  type="text"
                  placeholder={t("addReq")}
                  className="register-input"
                  value={newRequirement}
                  onChange={(e) => setNewRequirement(e.target.value)}
                />
                <button
                  type="button"
                  className="add-button"
                  onClick={onAddRequirement}
                >
                  <Text label={t("add")} size={"s14"} weight={"regular"} />
                </button>
              </div>
            </div>
            <div className="requirements-list">
              <ul>
                {requirements.map((requirement) => (
                  <li key={requirement.id}>
                    {requirement.text}
                    <button
                      className="remove-req-button"
                      onClick={() => removeRequirement(requirement.id)}
                    >
                      <img src={Trash} alt="" />
                    </button>
                  </li>
                ))}
              </ul>
            </div>
            <button className="job-btn">
              <Text label={t("save")} size={"s16"} weight={"regular"} />
            </button>
          </form>
        </div>
      </div>
    </Animate>
  );
};

export default PostJob;