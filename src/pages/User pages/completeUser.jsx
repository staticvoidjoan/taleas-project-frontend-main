import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./complete.css";
import Text from "../../components/text/text";
import X from "../../assets/icons/closeX.svg";
import down from "../../assets/icons/down-arrow.svg";
import profilePic from "../../assets/images/profilePic.png";
import { Link } from "react-router-dom";
import linkPic from "../../assets/icons/link.svg";
import Swal from "sweetalert2";
import TextField from "@mui/material/TextField";
import Animate from "../../animateTransition/AnimateY";
import error from "../../assets/icons/exclamation-mark-svgrepo-com.svg"
import Loader from "../../components/Loader/Loader";
const ProfileForm = ({ userId }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    lastname: "",
    headline: "",
    education: [
      {
        degree: "",
        institution: "",
        startDate: "",
        endDate: "",
      },
    ],
    experience: [
      {
        position: "",
        employer: "",
        startDate: "",
        endDate: "",
      },
    ],
    certifications: [
      {
        title: "",
        organization: "",
        issueDate: "",
        expirationDate: "",
      },
    ],
    languages: [],
    generalSkills: [],
    links: [],
  });
  const [fullName, setFullName] = useState("");
  const [isEducationCollapsed, setIsEducationCollapsed] = useState(true);
  const [isExperienceCollapsed, setIsExperienceCollapsed] = useState(true);
  const [isCertificationCollapsed, setIsCertificationCollapsed] =
    useState(true);
  const [isLanguageCollapsed, setIsLanguageCollapsed] = useState(true);
  const [isSkillsCollapsed, setIsSkillsCollapsed] = useState(true);
  const [isLinkCollapsed, setIsLinkCollapsed] = useState(true);
  const [isGeneralCollapsed, setIsGeneralCollapsed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [loading, setLoading] = useState(false);

  const loadUser = async () => {
    try {
      const response = await axios.get(
        `https://fxb8z0anl0.execute-api.eu-west-3.amazonaws.com/prod/user/${userId}`
      );
      setFormData(response.data.user);
    } catch (error) {
      console.error("Error fetching data: ", error);
    }
  };

  const waitforSumbit = (e) => {
    e.preventDefault();
    Swal.fire({
      title: "Do you want to save the changes?",
      showDenyButton: true,
      confirmButtonText: "Save",
      denyButtonText: `Don't save`,
    }).then((result) => {
      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
        handleSubmit();
      } else if (result.isDenied) {
        Swal.fire("Changes are not saved", "", "info");
      }
    });
  };

  const handleRemoveEdu = (index, id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        handleRemoveEducation(index, id);
        Swal.fire("Deleted!", "Your file has been deleted.", "success");
      }
    });
  };

  const handleRemoveExp = (index, id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        handleRemoveExperience(index, id);
        Swal.fire("Deleted!", "Your file has been deleted.", "success");
      }
    });
  };

  const checkEmployee = async () => {
    try {
      setLoading(true);
      console.log("Trying to check image content");

      const response = await axios.post(
        "https://oet3gzct9a.execute-api.eu-west-2.amazonaws.com/prod/analyse-image",
        { imageUrl: newPhoto.profilePhoto },
        {
          headers: {
            "Content-Type": "application/json",
            // Other custom headers, if needed
          },
        }
      );
      console.log("Image content checked successfully");
      console.log(response);
      if (response.data.detectionStatus === "Bad") {
        Swal.fire({
          icon: "error",
          title: "Attention",
          text: "That picture is against our community guidelines!",
          confirmButtonText: "Ok",
        }).then(async (result) => {
          if (result.isConfirmed) {
            window.location.reload();
          }
        });
      } else {
        editUser();
      }
    } catch (error) {
      console.log("error", error);
    } finally {
      setLoading(false); // Set loading to false after the operation is completed
    }
  };

  if(isLoading) {
    return <Loader/>
  }
  const handleRemoveCert = (index, id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        handleRemoveCertification(index, id);
        Swal.fire("Deleted!", "Your file has been deleted.", "success");
      }
    });
  };

  useEffect(() => {
    loadUser();
  }, []);

  useEffect(() => {
    if (formData.education.length === 0) {
      handleAddEducation();
    }
    if (formData.experience.length === 0) {
      handleAddExperience();
    }
    if (formData.certifications.length === 0) {
      handleAddCertification();
    }
  }, [formData.education, formData.experience, formData.certifications]);

  const [newPhoto, setNewPhoto] = useState({
    profilePhoto: "",
  });
  useEffect(() => {
    console.log("newPhoto:", newPhoto);
    if (newPhoto.profilePhoto) {
      // Automatically submit the form when a new image is selected
      console.log("Submitting form...");
      checkEmployee();
    }
  }, [newPhoto]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Read the selected file as a data URL (base64)
      const reader = new FileReader();
      reader.onload = (event) => {
        const base64String = event.target.result;
        setNewPhoto({
          ...newPhoto,
          profilePhoto: base64String,
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const editUser = async (e) => {
    const imageUrlWithoutQuotes = newPhoto.profilePhoto.replace(/"/g, "");
    try {
      await axios.put(
        `https://fxb8z0anl0.execute-api.eu-west-3.amazonaws.com/prod/${userId}`,
        {
          ...formData,
          profilePhoto: imageUrlWithoutQuotes,
        }
      );
      loadUser();
    } catch (error) {
      console.error(error);
    }
  };

  const handleInputChange = (e, index, section, field) => {
    const { value } = e.target;
    const list = [...formData[section]];
    list[index][field] = value;
  
    // Perform date validation if the field is 'startDate' or 'endDate'
    if (field === 'startDate' || field === 'endDate') {
      const startDate = new Date(list[index]['startDate']);
      const endDate = new Date(list[index]['endDate']);
      const currentDate = new Date();
  
      if (field === 'startDate' && startDate > currentDate) {
        list[index]['error'] = 'Start date should not be later than current date';
      }
      else if (list[index]['startDate'] && list[index]['endDate']) {
        if (endDate < startDate) {
          list[index]['error'] = 'End date should be earlier than start date';
        } else {
          list[index]['error'] = '';
        }
      }
    }

    if (field === 'issueDate' || field === 'expirationDate') {
      const issueDate = new Date(list[index]['issueDate']);
      const expirationDate = new Date(list[index]['expirationDate']);
      const currentDate = new Date();
  
      if (field === 'issueDate' && issueDate > currentDate) {
        list[index]['error'] = 'Issue date should not be later than current date';
      }
      else if (list[index]['issueDate'] && list[index]['expirationDate']) {
        if (expirationDate < issueDate) {
          list[index]['error'] = 'Expiration date should be earlier than issue date';
        } else {
          list[index]['error'] = '';
        }
      }
    }
  
    setFormData((prevState) => ({ ...prevState, [section]: list }));
  };
  
  const onInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const [newLanguage, setNewLanguage] = useState("");
  const [newSkill, setNewSkill] = useState("");
  const [newLink, setNewLink] = useState("");

  const onAddItem = (arrayName, newItem) => {
    if (newItem.trim() !== "") {
      setFormData((formData) => ({
        ...formData,
        [arrayName]: [...formData[arrayName], newItem],
      }));
    }
  };

  const handleRemoveArrayField = (index, section) => {
    const list = [...formData[section]];
    list.splice(index, 1);
    setFormData((prevState) => ({ ...prevState, [section]: list }));
  };

  const handleAddEducation = (id) => {
    setFormData((prevState) => ({
      ...prevState,
      education: [
        ...prevState.education,
        { degree: "", institution: "", startDate: "", endDate: "" },
      ],
    }));
  };

  const handleRemoveEducation = async (index, id) => {
    console.log(id);
    try {
      if (id) {
        const response = await axios.delete(
          `https://fxb8z0anl0.execute-api.eu-west-3.amazonaws.com/prod/education/${id}`
        );
      }
      const list = [...formData.education];
      list.splice(index, 1);
      setFormData((prevState) => ({ ...prevState, education: list }));
    } catch (error) {
      console.log("Something went wrong");
    }
  };

  const handleAddExperience = () => {
    setFormData((prevState) => ({
      ...prevState,
      experience: [
        ...prevState.experience,
        { position: "", company: "", startDate: "", endDate: "" },
      ],
    }));
  };

  const handleRemoveExperience = async (index, id) => {
    try {
      if (id) {
        await axios.delete(
          `https://fxb8z0anl0.execute-api.eu-west-3.amazonaws.com/prod/experience/${id}`
        );
      }
      const list = [...formData.experience];
      list.splice(index, 1);
      setFormData((prevState) => ({ ...prevState, experience: list }));
    } catch (error) {
      console.log("Something went wrong");
    }
  };

  const handleAddCertification = () => {
    setFormData((prevState) => ({
      ...prevState,
      certifications: [
        ...prevState.certifications,
        { title: "", organization: "", issueDate: "", expirationDate: "" },
      ],
    }));
  };

  const handleRemoveCertification = async (index, id) => {
    try {
      
      if (id) {
        await axios.delete(
          `https://fxb8z0anl0.execute-api.eu-west-3.amazonaws.com/prod/certifications/${id}`
        );
      }
      const list = [...formData.certifications];
      list.splice(index, 1);
      setFormData((prevState) => ({ ...prevState, certifications: list }));
    } catch (error) {
      console.log("Something went wrong");
    }
  };

  const handleSubmit = async (e) => {
    try {
      setIsLoading(true);
      console.log(formData);
      const edit = await axios.put(
        `https://fxb8z0anl0.execute-api.eu-west-3.amazonaws.com/prod/${userId}`,
        formData
      );
      console.log("Form data to be sent:", formData);
      let timerInterval;
      Swal.fire({
        title: "Your changes has been saved!",
        icon: "success",
        timer: 1000,
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
        navigate("/profile");
      });
    } catch (error) {
      console.log(error);
    }finally{
      setIsLoading(false);
    }
  };
  
  if (isLoading) {
    return <Loader/>
  }

  return (
    <Animate>
    <div className="compete-profile-main">
      <div className="complete-profile-bar">
        <div className="complete-profile-bar-nav">
          <Text label={"Edit Profile"} size={"s16"} weight={"medium"} />
          <Link to="/profile">
            <img src={X} alt="" />
          </Link>
        </div>
        <hr className="complete-profile-bar-div"></hr>
      </div>
      <div className="complete-profile-body">
        <form className="profile-form">
          <div className="generalData">
            <div
              className="main-label"
              onClick={() => setIsGeneralCollapsed(!isGeneralCollapsed)}
            >
              <label className="labels">
                <Text
                  label={"General Information"}
                  size={"s16"}
                  weight={"bold"}
                  lineheight={"l22"}
                />
              </label>
              <img
                src={down}
                className="img"
                alt="down-icon"
                style={
                  isGeneralCollapsed ? { rotate: "0deg" } : { rotate: "180deg" }
                }
              />
            </div>
            <hr />
            {!isGeneralCollapsed && (
              <>
                <div className="profilePhoto">
                  <div className="profile-photo">
                    {!formData.profilePhoto ? (
                      <img src={"https://userprofilephotobucket.s3.eu-west-3.amazonaws.com/folder/1696198483421.jpg"} className="profile-image" />
                    ) : (
                      <img
                        src={formData.profilePhoto.replace(/"/g, "")}
                        alt="profile-photo"
                        className="profile-image"
                      />
                    )}
                    <input
                      type="file"
                      accept="image/*"
                      id="fileInput"
                      style={{ display: "none" }}
                      onChange={handleImageChange}
                    />
                    <a
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        document.getElementById("fileInput").click();
                      }}
                    >
                      Change photo
                    </a>
                  </div>
                </div>
                <div class="general-data">
                  <TextField
                    id="outlined-basic"
                    label="Name"
                    variant="outlined"
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={onInputChange}
                    className="update-input-fields"
                    InputProps={{
                      readOnly: true,
                    }}
                  />
                </div>
                <div class="general-data">
                  <TextField
                    id="outlined-basic"
                    label="Lastname"
                    variant="outlined"
                    type="text"
                    name="lastname"
                    value={formData.lastname}
                    onChange={onInputChange}
                    className="update-input-fields"
                    InputProps={{
                      readOnly: true,
                    }}
                  />
                </div>
                <div class="general-data">
                  <TextField
                    id="outlined-basic"
                    label="Role"
                    variant="outlined"
                    type="text"
                    name="headline"
                    value={formData.headline}
                    onChange={onInputChange}
                    className="update-input-fields"
                    required
                  />
                </div>{" "}
                <hr />
              </>
            )}
          </div>
          <div className="education-form">
            <div
              className="main-label"
              onClick={() => setIsEducationCollapsed(!isEducationCollapsed)}
            >
              <label className="labels">
                <Text label={"Educations"} size={"s16"} weight={"bold"} />
              </label>
              <img
                src={down}
                className="img"
                alt="down-icon"
                style={
                  isEducationCollapsed
                    ? { rotate: "0deg" }
                    : { rotate: "180deg" }
                }
              />
            </div>
            <hr />
            {!isEducationCollapsed && (
              <>
                {formData.education.map((edu, index) => (
                  <div key={index} className="fields-form">
                    <div className="education-data">
                      <TextField
                        id="outlined-basic"
                        label="Degree"
                        variant="outlined"
                        name="degree"
                        className="update-input-fields"
                        value={edu.degree}
                        onChange={(e) =>
                          handleInputChange(e, index, "education", "degree")
                        }
                      />
                    </div>
                    <div className="education-data">
                      <TextField
                        id="outlined-basic"
                        label="Institution"
                        variant="outlined"
                        name="institution"
                        className="update-input-fields"
                        value={edu.institution}
                        onChange={(e) =>
                          handleInputChange(
                            e,
                            index,
                            "education",
                            "institution"
                          )
                        }
                      />
                    </div>
                    <div className="education-data">
                      <TextField
                        id="outlined-basic"
                        label="Start Date"
                        variant="outlined"
                        name="startDate"
                        className="update-input-fields"
                        type="date"
                        value={edu.startDate}
                        onChange={(e) =>
                          handleInputChange(e, index, "education", "startDate")
                        }
                        InputLabelProps={{
                          shrink: true,
                        }}
                      />
                    </div>
                    <div className="education-data">
                      <TextField
                        id="outlined-basic"
                        label="End Date"
                        variant="outlined"
                        name="endDate"
                        className="update-input-fields"
                        type="date"
                        value={edu.endDate}
                        onChange={(e) =>
                          handleInputChange(e, index, "education", "endDate")
                        }
                        InputLabelProps={{
                          shrink: true,
                        }}
                      />
                       <div className="validation">{edu.error && (<div className="error-message"><img className="error-icon" src={error} alt="error" /><p>{edu.error}</p></div>)} </div>
                    </div>
                    <div className="remove-fields-button">
                      <button
                        type="button"
                        className="remove-button"
                        onClick={() => handleRemoveEdu(index, edu._id)}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
                <button
                  type="button"
                  className="add-button-fields"
                  onClick={handleAddEducation}
                >
                  Add
                </button>
              </>
            )}
          </div>
          <div className="experience-form">
            <div
              className="main-label"
              onClick={() => setIsExperienceCollapsed(!isExperienceCollapsed)}
            >
              <label className="labels">
                <Text label={"Experiences"} size={"s16"} weight={"bold"} />
              </label>
              <img
                src={down}
                className="img"
                alt="down-icon"
                style={
                  isExperienceCollapsed
                    ? { rotate: "0deg" }
                    : { rotate: "180deg" }
                }
              />
            </div>
            <hr />
            {!isExperienceCollapsed && (
              <>
                {formData.experience.map((exp, index) => (
                  <div key={index} className="fields-form">
                    <div className="experience-data">
                      <TextField
                        id="outlined-basic"
                        label="Position"
                        variant="outlined"
                        name="position"
                        className="update-input-fields"
                        value={exp.position}
                        onChange={(e) =>
                          handleInputChange(e, index, "experience", "position")
                        }
                      />
                    </div>
                    <div className="experience-data">
                      <TextField
                        id="outlined-basic"
                        label="Employer"
                        variant="outlined"
                        name="employer"
                        className="update-input-fields"
                        value={exp.employer}
                        onChange={(e) =>
                          handleInputChange(e, index, "experience", "employer")
                        }
                      />
                    </div>
                    <div className="experience-data">
                      <TextField
                        id="outlined-basic"
                        label="Start Date"
                        variant="outlined"
                        name="startDate"
                        className="update-input-fields"
                        type="date"
                        value={exp.startDate}
                        onChange={(e) =>
                          handleInputChange(e, index, "experience", "startDate")
                        }
                        InputLabelProps={{
                          shrink: true,
                        }}
                      />
                    </div>
                    <div className="experience-data">
                      <TextField
                        id="outlined-basic"
                        label="End Date"
                        variant="outlined"
                        name="endDate"
                        className="update-input-fields"
                        type="date"
                        value={exp.endDate}
                        onChange={(e) =>
                          handleInputChange(e, index, "experience", "endDate")
                        }
                        InputLabelProps={{
                          shrink: true,
                        }}
                      />
                    </div><div className="validation">{exp.error && (<div className="error-message"><img className="error-icon" src={error} alt="error" /><p>{exp.error}</p></div>)} </div>
                    <div className="remove-fields-button">
                      <button
                        type="button"
                        className="remove-button"
                        onClick={() => handleRemoveExp(index, exp._id)}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
                <button
                  type="button"
                  className="add-button-fields"
                  onClick={handleAddExperience}
                >
                  Add
                </button>
                <hr />
              </>
            )}
          </div>
          <div className="certifications-form">
            <div
              className="main-label"
              onClick={() =>
                setIsCertificationCollapsed(!isCertificationCollapsed)
              }
            >
              <label className="labels">
                <Text label={"Certifications"} size={"s16"} weight={"bold"} />
              </label>
              <img
                src={down}
                className="img"
                alt="down-icon"
                style={
                  isCertificationCollapsed
                    ? { rotate: "0deg" }
                    : { rotate: "180deg" }
                }
              />
            </div>
            <hr />
            {!isCertificationCollapsed && (
              <>
                {formData.certifications.map((cert, index) => (
                  <div key={index} className="fields-form">
                    <div className="certifications-data">
                      <TextField
                        id="outlined-basic"
                        label="Title"
                        variant="outlined"
                        name="title"
                        className="update-input-fields"
                        value={cert.title}
                        onChange={(e) =>
                          handleInputChange(e, index, "certifications", "title")
                        }
                      />
                    </div>
                    <div className="certifications-data">
                      <TextField
                        id="outlined-basic"
                        label="Organization"
                        variant="outlined"
                        name="organization"
                        className="update-input-fields"
                        value={cert.organization}
                        onChange={(e) =>
                          handleInputChange(
                            e,
                            index,
                            "certifications",
                            "organization"
                          )
                        }
                      />
                    </div>
                    <div className="certifications-data">
                      <TextField
                        name="issueDate"
                        label="Issue Date"
                        type="date"
                        className="update-input-fields"
                        value={cert.issueDate.split("/").join("-")}
                        onChange={(e) =>
                          handleInputChange(
                            e,
                            index,
                            "certifications",
                            "issueDate"
                          )
                        }
                        InputLabelProps={{
                          shrink: true,
                        }}
                      />
                    </div>
                    <div className="certifications-data">
                      <TextField
                        id="outlined-basic"
                        label="Expiration Date"
                        variant="outlined"
                        name="expirationDate"
                        className="update-input-fields"
                        type="date"
                        value={cert.expirationDate}
                        onChange={(e) =>
                          handleInputChange(
                            e,
                            index,
                            "certifications",
                            "expirationDate"
                          )
                        }
                        InputLabelProps={{
                          shrink: true,
                        }}
                      /><div className="validation">{cert.error && (<div className="error-message"><img className= 'error-icon'src={error} alt="error" /><p>{cert.error}</p></div>)} </div>
                    </div>
                    <div className="remove-fields-button">
                      <button
                        type="button"
                        className="remove-button"
                        onClick={() => handleRemoveCert(index, cert._id)}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
                <button
                  type="button"
                  className="add-button-fields"
                  onClick={handleAddCertification}
                >
                  Add
                </button>
                <hr />
              </>
            )}
          </div>
          <div className="languages">
            <div
              className="main-label"
              onClick={() => setIsLanguageCollapsed(!isLanguageCollapsed)}
            >
              <label className="labels">
                {" "}
                <Text label={"Languages"} size={"s16"} weight={"bold"} />{" "}
              </label>
              <img
                src={down}
                className="img"
                alt="down-icon"
                style={
                  isLanguageCollapsed
                    ? { rotate: "0deg" }
                    : { rotate: "180deg" }
                }
              />
            </div>
            <hr />
            {!isLanguageCollapsed && (
              <>
                <div className="inputbox-update">
                  {/* Input for new requirements */}
                  <TextField
                    id="outlined-basic"
                    variant="outlined"
                    label="Language"
                    type="text"
                    className="update-input"
                    value={newLanguage}
                    onChange={(e) => setNewLanguage(e.target.value)}
                  />
                  <button
                    type="button"
                    className="add-button-update"
                    onClick={() => {
                      onAddItem("languages", newLanguage);
                      setNewLanguage("");
                    }}
                  >
                    <Text label={"Add"} size={"s16"} weight={"regular"} />
                  </button>
                </div>
                <div className="tags-div">
                  {formData.languages.map((lang, index) => (
                    <div className="tags-list">
                      <div key={index}>
                        <Text
                          label={lang}
                          size={"s14"}
                          weight={"regular"}
                          color={"black"}
                        />
                      </div>
                      <button
                        type="button"
                        className="remove-list-button"
                        onClick={() =>
                          handleRemoveArrayField(index, "languages")
                        }
                      >
                        {" "}
                        <img className="remove-img" src={X} alt="Remove" />{" "}
                      </button>
                    </div>
                  ))}
                </div>
                <hr />
              </>
            )}
          </div>
          <div className="skills-complete">
            <div
              className="main-label"
              onClick={() => setIsSkillsCollapsed(!isSkillsCollapsed)}
            >
              <label className="labels">
                <Text
                  label={"Skills"}
                  size={"s16"}
                  weight={"bold"}
                  color={"black"}
                />
              </label>
              <img
                src={down}
                className="img"
                alt="down-icon"
                style={
                  isSkillsCollapsed ? { rotate: "0deg" } : { rotate: "180deg" }
                }
              />
            </div>
            <hr />
            {!isSkillsCollapsed && (
              <>
                <div className="inputbox-update">
                  <TextField
                    label="Skill"
                    id="outlined-basic"
                    variant="outlined"
                    type="text"
                    className="update-input"
                    value={newSkill}
                    onChange={(e) => setNewSkill(e.target.value)}
                  />
                  <button
                    type="button"
                    className="add-button-update"
                    onClick={(e) => {
                      onAddItem("generalSkills", newSkill);
                      setNewSkill("");
                    }}
                  >
                    <Text label={"Add"} size={"s16"} weight={"regular"} />
                  </button>
                </div>
                <div className="tags-div">
                  {formData.generalSkills.map((skills, index) => (
                    <div className="tags-list">
                      <div key={index}>
                        <Text label={skills} size={"s14"} weight={"regular"} />
                      </div>
                      <button
                        type="button"
                        className="remove-list-button"
                        onClick={() =>
                          handleRemoveArrayField(index, "generalSkills")
                        }
                      >
                        <img className="remove-img" src={X} alt="Remove" />
                      </button>
                    </div>
                  ))}
                </div>
                <hr />
              </>
            )}
          </div>
          <div className="link">
            <div
              className="main-label"
              onClick={() => setIsLinkCollapsed(!isLinkCollapsed)}
            >
              <label className="labels">
                <Text
                  label={"Links"}
                  size={"s16"}
                  weight={"bold"}
                  color={"black"}
                />{" "}
              </label>
              <img
                src={down}
                className="img"
                alt="down-icon"
                style={
                  isLinkCollapsed ? { rotate: "0deg" } : { rotate: "180deg" }
                }
              />
            </div>
            <hr />
            {!isLinkCollapsed && (
              <>
                <div className="inputbox-update">
                  <TextField
                    label="Link"
                    variant="outlined"
                    id="outlined-basic"
                    type="text"
                    placeholder="Add Link"
                    className="update-input"
                    value={newLink}
                    onChange={(e) => setNewLink(e.target.value)}
                  />
                  <button
                    type="button"
                    className="add-button-update"
                    onClick={() => {
                      onAddItem("links", newLink);
                      setNewLink("");
                    }}
                  >
                    <Text label={"Add"} size={"s16"} weight={"regular"} />
                  </button>
                </div>
                <div className="links-list">
                  {formData.links.map((link, index) => (
                    <ul>
                      <li className="link-list">
                        <img src={linkPic} alt="link" />
                        <div key={index}>
                          <Text
                            label={link}
                            size={"s14"}
                            weight={"regular"}
                            color={"black"}
                          />
                        </div>
                        <button
                          type="button"
                          className="remove-list-button"
                          onClick={() => handleRemoveArrayField(index, "links")}
                        >
                          <img className="remove-img" src={X} alt="Remove" />
                        </button>
                      </li>
                    </ul>
                  ))}
                </div>
                <hr />
              </>
            )}
          </div>
          <br />
          <div className="submit-cancel">
            <button
              type="submit"
              className="submit-button"
              onClick={waitforSumbit}
            >
              Submit
            </button>
            <button className="cancel-button">
              <Link to='/profile'>
              Cancel
              </Link>
            </button>
          </div>
        </form>
      </div>
    </div>
    </Animate>
  );
};

export default ProfileForm;
