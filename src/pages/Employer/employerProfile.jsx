import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import unicorn from "../../assets/images/Unicorn.png";
import SignOut from "../../service/authentication/user/userSignOut";
import Text from "../../components/text/text";
import "./employerProfile.css";
import ImageUploader from "../../components/Convert/convertImage";
import axios from "axios";
import emailpic from "../../assets/icons/email.svg";
import locationico from "../../assets/icons/location.svg";
import Animate from "../../animateTransition/Animate";
import CenterNavbar from "../../components/centerNavbar/centerNavbar";
import Swal from "sweetalert2";
import Loader from "../../components/Loader/Loader.jsx";
import edit from "../../assets/icons/edit.svg";
const EmployerProfile = ({ employerData, employeeCheck }) => {
  const [loading, setLoading] = useState(false);
  const [newPhoto, setNewPhoto] = useState({
    profilePhoto: "",
  });

  const navigate = useNavigate();
  useEffect(() => {
    console.log(employerData.profilePhoto);

    console.log("newPhoto:", newPhoto);
    if (newPhoto.profilePhoto) {
      // Automatically submit the form when a new image is selected
      console.log("Submitting form...");
      checkEmployer();
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

  const checkEmployer = async () => {
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
      } else if (
        response.data.textDetectionResponse.TextDetections &&
        response.data.textDetectionResponse.TextDetections.length > 0
      ) {
        Swal.fire({
          icon: "error",
          title: "Attention",
          text: "That picture must not use text!",
          confirmButtonText: "Ok",
        }).then(async (result) => {
          if (result.isConfirmed) {
            window.location.reload();
          }
        });
      } else {
        editEmployer();
      }
    } catch (error) {
      console.log("error", error);
    } finally {
      setLoading(false); // Set loading to false after the operation is completed
    }
  };

  const editEmployer = async (e) => {
    let theAdd = employerData.address;
    if (theAdd) {
      try {
        setLoading(true);
        console.log();
        const employer = await axios.put(
          `https://fxb8z0anl0.execute-api.eu-west-3.amazonaws.com/prod/update-profile/${employerData._id}`,
          {
            profilePhoto: newPhoto.profilePhoto,
            address: theAdd,
            industry: employerData.industry,
            description: employerData.description,
          }
        );
        window.location.reload(true);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false); // Set loading to false after the operation is completed
      }
    }
  };
  

  const cardStyle = {
    backgroundImage: `url(${employerData.profilePhoto || unicorn})`,
    position: "relative",
  };

  const gotoedit = () => {
    navigate("/edit");
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <>
      <Animate>
        <div className="profile-container">
          <div className="photo-container-employer-profile">
            <div className="profile-profile-pic" style={cardStyle}>
              <form className="change-photo-form">
                <input
                  type="file"
                  accept="image/*"
                  className="custom-file-input"
                  onChange={handleImageChange}
                />
              </form>
            </div>
          </div>
          <div className="employer-profile-info">
            <div className="fullname-employer" onClick={gotoedit}>
              <div className="fullname-employer-mini">
                <Text
                  label={employerData.companyName}
                  size={"s18"}
                  color={"#333"}
                  weight={"bold"}
                />
                <div className="edit-profile">
                  <img src={edit}></img>
                </div>
              </div>
              <Text
                label={employerData.industry}
                size={"s16"}
                weight={"regular"}
                color={"black"}
              />
            </div>
            <Text
              label={employerData.description}
              size={"s16"}
              color={"#333"}
              weight={"regular"}
            ></Text>

            <div className="job-title-info">
              <div className="info-bubble">
                <img
                  alt="email"
                  src={emailpic}
                  style={{ marginLeft: "8px", marginRight: "8px" }}
                />

                <Text
                  label={employerData.email}
                  size={"s14"}
                  color={"black"}
                  style={{ marginRight: "8px" }}
                />
              </div>
            </div>
            <div className="job-title-info">
              <div className="info-bubble">
                <img src={locationico} className="location-icon" />
                <div style={{ marginRight: "10px" }}>
                  <Text
                    label={employerData.address}
                    weight={"regular"}
                    color={"lightgray"}
                    size={"s14"}
                  />
                </div>
              </div>
            </div>
            <div className="edit-profile-web" onClick={gotoedit}>
              <button className="edit-profile-web-button">Edit Profile</button>
            </div>
          </div>
          <SignOut />
        </div>
      </Animate>
    </>
  );
};

export default EmployerProfile;
