import React from "react";
import { render, screen } from "@testing-library/react";
import '@testing-library/jest-dom'
import { MemoryRouter } from "react-router-dom";
import Applicants from "../components/applicants/applicants";
import Unicorn from "../assets/images/Unicorn.png";

test("Should render applicant component", () => {
  render(
    <MemoryRouter>
      <Applicants
        name={"TestName"}
        lastname={"TestLastName"}
        profilePhoto={Unicorn}
        role={"TestRole"}
      />
    </MemoryRouter>
  );
  const applicantElement = screen.getByTestId("applicant-test");
  expect(applicantElement).toBeInTheDocument();
});
