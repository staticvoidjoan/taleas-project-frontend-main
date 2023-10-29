import React from "react";
import "./applicants.css";
import unicorn from "../../assets/images/Unicorn.png";
import Text from "../text/text";
import { useNavigate } from "react-router-dom";
const Applicants = ({userid, postId, name, lastname, role, profilePhoto }) => {
  const navigate = useNavigate();

  const viewApplicant = () =>{
    navigate(`/applicant/${userid}`)
  }

  return (

      <div className="applicants-desc" onClick={viewApplicant} data-testid="applicant-test" >
        <div className="applicant-photo" style={{ backgroundImage: `url(${profilePhoto ?? unicorn})`, lightgray:"50%" }} >
        </div>
        <div className="applicant-info-job">
          <Text label={`${name} ${lastname}`} size={"s16"} weight={"medium"} color={"black"}/>
          <Text label={`${role}`} size={"s14"} weight={"regular"} color={"black"}/>
        </div>
      </div>
      
  );
};

export default Applicants;
