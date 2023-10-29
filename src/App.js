import "./App.css";
import {
  Link,
  BrowserRouter as Router,
  Route,
  Routes,
  useLocation,
} from "react-router-dom"; // Importing Routes instead of Switch
import { Auth } from "aws-amplify";
import { Amplify } from "aws-amplify";
import awsExports from "./aws-exports";
import axios from "axios";
import React, { useState, useEffect } from "react";
import { Hub } from "aws-amplify";

// import { useTranslation } from "react-i18next";

//User Services
import LoginPage from "./service/authentication/user/userSignIn";
import UserSignUp from "./service/authentication/user/userSignUp";
import ForgotPassword from "./service/authentication/user/forgotPassword";
import ResendSignup from "./service/authentication/user/resendSignUp";

//Employee Imports (Normal User)
import ProfileForm from "./pages/User pages/completeUser";
import UserHome from "./pages/User pages/userHome";
import EmployeeJobView from "./pages/Jobs/employeejobview";
import UserInfo from "./pages/User pages/userInfo";

//Employer Imports (Recruiter/Company User)
import PostJob from "./pages/Jobs/postJob";
import EmployerHome from "./pages/Employer/EmployerHome";
import JobView from "./pages/Employer/jobView";
import EmployerProfile from "./pages/Employer/employerProfile";
import ViewApplicant from "./pages/Employer/viewApplicant";
import EditEmployer from "./pages/Employer/editEmployer";

//Layout
import NavBar from "./layout/navBar/Navbar2";
import Footer from "./layout/footer/footer";
import CenterNavbar from "./components/centerNavbar/centerNavbar";
import Menu from "./pages/menu/menu";
import Sidebar from "./components/sidebar/sidebar";

//Mutual Pages
import Home from "./pages/home/home";
import LandingPage from "./pages/landingPage/StartingPage";

import ChatApp from "./ChatApp";
import ListOfMatches from "./components/applicants/ListOfMatches";

//Misc
import Loader from "./components/Loader/Loader";
import ListUserMessages from "./components/userMessages/userMessages";
import ScrollToTop from "./components/scrollToTop/scrollToTop";
import OfflinePage from "./components/offline/offlinePage";

//Error Handlers
import NotFound from "./pages/Error/notFound";
import Privacy from "./pages/privacy/privacy";
import About from "./pages/about/about";
import Contact from "./pages/contact/contact";

function App() {
  // State variables
  const [signingOut, setSigningOut] = useState(false);
  const [authenticated, setAuthenticated] = useState(false);
  const [givenName, setGivenName] = useState("");
  const [lastName, setLastName] = useState("");
  const [checkEmployee, setCheckEmployee] = useState(true);
  const [userRole, setUserRole] = useState("employer");
  const [employee, setEmployee] = useState({});
  const [employer, setEmployer] = useState({});
  const [useremail, setUserEmail] = useState("");
  const [isEmployeeLoaded, setIsEmployeeLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const location = useLocation();

  // const { t, i18n } = useTranslation();
  
  // Configure Amplify
  Amplify.configure(awsExports);

  // Check authentication status on component mount
  useEffect(() => {
    localStorage.setItem("localindex", 0);
    checkAuthenticated();
  }, []);

  // Check if  user is authenticated
  const checkAuthenticated = async () => {
    try {
      const user = await Auth.currentAuthenticatedUser();
      setAuthenticated(Boolean(user));

      const userAttributes = user.attributes || {};
      const userGivenName = userAttributes.given_name || "";
      setGivenName(userGivenName);

      const userLastName = userAttributes.family_name || "";
      setLastName(userLastName);

      const isEmployee = userAttributes["custom:isEmployee"];
      if (isEmployee === "true") {
        setUserRole("employee");
      } else setUserRole("employer");
      setCheckEmployee(isEmployee);

      localStorage.setItem("companyname", userGivenName);

      const email = userAttributes.email || "";
      setUserEmail(email);

      setIsEmployeeLoaded(true); // Set isEmployeeLoaded to true when isEmployee is loaded
    } catch (error) {
      setAuthenticated(false);
      setIsEmployeeLoaded(true); // Set isEmployeeLoaded to true even in case of error
    }
  };

  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);
  // Check if user is employee and save id to storage
  useEffect(() => {
    const saveToStorage = async () => {
      if (userRole === "employee") {
        await saveEmployeeToStorage();
      } else {
        await saveEmployerToStorage();
      }
      setTimeout(() => {
        setIsLoading(false); // Data fetching is complete
      }, 1879);
    };

    if (useremail) {
      saveToStorage();
    }
  }, [checkEmployee, useremail]);

  useEffect(() => {
    // Listen for the sign-out event
    Hub.listen("auth", ({ payload }) => {
      if (payload.event === "signOut") {
        // The user is signing out, set signingOut to true
        setSigningOut(true);
      }
    });

    // Check for the user's authenticated status on component mount
    checkAuthenticated();

    return () => {
      // Clean up the event listener when the component unmounts
      Hub.remove("auth");
    };
  }, []);

  // Save employee data to local storage
  const saveEmployeeToStorage = async () => {
    try {
      const response = await axios.get(
        `https://fxb8z0anl0.execute-api.eu-west-3.amazonaws.com/prod/userByEmail/${useremail}`
      );
      localStorage.setItem("employeeId", response.data.user._id);

      setEmployee(response.data.user);
    } catch (error) {
      console.error("Error fetching employee data:", error);
    }
  };

  // Save employer data to local storage
  const saveEmployerToStorage = async () => {
    try {
      const response = await axios.get(
        `https://fxb8z0anl0.execute-api.eu-west-3.amazonaws.com/prod/employerByEmail/${useremail}`
      );
      localStorage.setItem("employerId", response.data.employer._id);
      setEmployer(response.data.employer);
    } catch (error) {
      console.error("Error fetching employer data:", error);
    }
  };
  function MessageRoute({ userRole, employee, employer }) {
    if (userRole === "employee") {
      return <ListUserMessages user={employee} />;
    } else if (userRole === "employer") {
      return <ListOfMatches employer={employer} />;
    } else {
      // Handle other cases or provide a default component
      return <div>Invalid user role</div>;
    }
  }

  const hideNav =
    location.pathname.startsWith("/profile") ||
    location.pathname.startsWith("/userInfo") ||
    location.pathname.startsWith("/viewjobpost") ||
    location.pathname.startsWith("/postJob") ||
    location.pathname.startsWith("/jobview") ||
    location.pathname.startsWith("/chat") ||
    location.pathname.startsWith("/matches") ||
    location.pathname.startsWith("/userMessasges") ||
    location.pathname.startsWith("/applicant") ||
    location.pathname.startsWith("/completeprofile") ||
    location.pathname.startsWith("/menu");
  const pathsToHideFooter = [
    "/signup",
    "/signin",
    "/userInfo",
    "/passwordreset",
    "/completeprofile",
    "/resendSignUp",
  ];
  const hideFooter = pathsToHideFooter.includes(location.pathname);
  const hideComplete =
    location.pathname.startsWith("/completeprofile") ||
    location.pathname.startsWith("/edit");
  const hideDivider = location.pathname.startsWith("/");
  if (!isEmployeeLoaded) {
    return <Loader />;
  }

  if (signingOut) {
    return <Loader />;
  }

  return (
    <div className="App">
      {hideComplete ? null : isLoading ? (
        <>
          <NavBar
            givenName={givenName}
            lastName={lastName}
            authenticated={authenticated}
            employeeData={employee}
            employerData={employer}
            userRole={userRole}
          />
          {authenticated ? null : hideDivider ? null : (
            <div
              style={{
                clear: "both",
                height: "90px",
                backgroundColor: "#212121",
              }}
            ></div>
          )}
        </>
      ) : hideNav ? (
        <CenterNavbar />
      ) : (
        <>
          <NavBar
            givenName={givenName}
            lastName={lastName}
            authenticated={authenticated}
            employeeData={employee}
            employerData={employer}
            userRole={userRole}
          />
          {location.pathname.startsWith("/postjob") ||
          windowWidth > 768 ? null : (
            <div style={{ clear: "both", height: "90px" }}></div>
          )}
          {!(windowWidth < 768 || location.pathname.startsWith("/postjob")) ? (
            <div style={{ clear: "both", height: "70px" }}></div>
          ) : null}
        </>
        //Test
      )}
      <div
        className={
          !authenticated ||
          location.pathname.startsWith("/profile") ||
          location.pathname.startsWith("/viewjobpost") ||
          location.pathname.startsWith("/postjob") ||
          location.pathname.startsWith("/jobview") ||
          location.pathname.startsWith("/edit")  ||
          location.pathname.startsWith("/completeprofile")||
          location.pathname.startsWith("/applicant")
            ? null
            : "two-column-layout"
        }
      >
        {authenticated ? (
          location.pathname.startsWith("/profile") ||
          location.pathname.startsWith("/viewjobpost") ||
          location.pathname.startsWith("/postjob") ||
          location.pathname.startsWith("/jobview") || 
          location.pathname.startsWith("/edit") ||
          location.pathname.startsWith("/completeprofile") ||
          location.pathname.startsWith("/applicant") ? null : windowWidth >
            768 ? (
            <Sidebar
              employeeData={employee}
              employerData={employer}
              userRole={userRole}
            />
          ) : null
        ) : null}

        <ScrollToTop>
          <Routes>
            {/* ----------------------------------  Home routes ------------------------------------------------------- */}

            <Route exact path={"/aboutus"} element={<About />} />
            <Route exact path={"/terms"} element={<Privacy />} />
            <Route exact path={"/contact"} element={<Contact />} />
            <Route
              exact
              path="/menu"
              element={authenticated ? <NotFound /> : <Menu />}
            />
            <Route
              exact
              path="/"
              element={
                authenticated ? (
                  userRole === "employee" ? (
                    isLoading ? (
                      <Loader />
                    ) : (
                      <UserHome userId={employee._id} employee={employee} />
                    )
                  ) : isLoading ? (
                    <Loader />
                  ) : (
                    <EmployerHome
                      creatorId={employer._id}
                      employer={employer}
                    />
                  )
                ) : (
                  <Home />
                )
              }
            />

            <Route
              exact
              path={`/profile`}
              element={
                isLoading ? (
                  <Loader />
                ) : userRole === "employer" ? (
                  <EmployerProfile
                    employeeData={employee}
                    employerData={employer}
                    employeeCheck={checkEmployee}
                  />
                ) : (
                  <UserInfo userId={employee._id} />
                )
              }
            />

            {/* ----------------------------------------------------------------------------------------------------------------- */}

            {/* ----------------------------------  Auhentication routes ------------------------------------------------------- */}
            <Route
              exact
              path={authenticated ? "/" : "/signin"}
              element={<LoginPage />}
            />
            <Route
              exact
              path={authenticated ? "/" : "/signup"}
              element={<UserSignUp />}
            />
            <Route
              exact
              path={authenticated ? "/" : "/passwordreset"}
              element={<ForgotPassword />}
            />
            <Route exact path="/resendSignUp" element={<ResendSignup />} />

            {/* ------------------------------------------------------------------------------------------------------------------ */}

            {/* ----------------------------------  Employeee routes ------------------------------------------------------- */}
            <Route
              exact
              path="/completeprofile"
              element={
                isLoading ? (
                  <Loader />
                ) : userRole === "employee" ? (
                  <ProfileForm userId={employee._id} />
                ) : (
                  <NotFound />
                )
              }
            />
            <Route exact path="/userInfo/:id" element={<UserInfo />} />
            <Route
              exact
              path="/viewjobpost/:id/:index"
              element={<EmployeeJobView employeeid={employee._id} />}
            />
            {/* --------------------------------------------------------------------------------------------------------------- */}

            {/* ----------------------------------  Employer routes ------------------------------------------------------- */}
            <Route
              exact
              path="/postjob/:id"
              element={
                userRole === "employer" && authenticated ? (
                  <PostJob />
                ) : (
                  <NotFound />
                )
              }
            />
            <Route
              exact
              path="/edit"
              element={
                userRole === "employer" && authenticated ? (
                  <EditEmployer employerData={employer} />
                ) : (
                  <NotFound />
                )
              }
            />
            <Route
              exact
              path="/jobview/:id"
              element={
                userRole === "employer" && authenticated ? (
                  <JobView />
                ) : (
                  <NotFound />
                )
              }
            />

            <Route
              exact
              path="/applicant/:id"
              element={
                isLoading ? (
                  <Loader />
                ) : userRole === "employer" && authenticated ? (
                  <ViewApplicant employerid={employer} />
                ) : (
                  <NotFound />
                )
              }
            />

            {/* ---------------------------------------------------------------------------------------------------- */}
            {/* ----------------------------------  Other routes ------------------------------------------------------- */}
            <Route
              path="/chat/:chatId"
              element={
                isLoading ? (
                  <div>Loading...</div>
                ) : (
                  <ChatApp
                    loggedInUser={userRole === "employee" ? employee : employer}
                    userRole={userRole}
                  />
                )
              }
            />
            {/* <Route path="/matches/:id" element={<ListOfMatches />} /> */}
            <Route
              path="/messages"
              element={
                windowWidth > 768 ? (
                  <NotFound />
                ) : isLoading ? (
                  <div>Loading...</div>
                ) : (
                  <MessageRoute
                    userRole={userRole}
                    employee={employee}
                    employer={employer}
                  />
                )
              }
            />

            <Route
              path="*"
              element={
                authenticated ? (
                  userRole === "employee" ? (
                    isLoading ? (
                      <Loader />
                    ) : (
                      <UserHome userId={employee._id} />
                    )
                  ) : isLoading ? (
                    <Loader />
                  ) : (
                    <EmployerHome creatorId={employer._id} />
                  )
                ) : navigator.onLine ? (
                  <NotFound />
                ) : (
                  <OfflinePage />
                )
              }
            />
          </Routes>
        </ScrollToTop>
        {!authenticated ? null : windowWidth > 756 ? null : (
          <div style={{ clear: "both", height: "90px" }}></div>
        )}

        {authenticated && !hideFooter && windowWidth < 768 ? (
          <Footer userRole={userRole} />
        ) : null}
      </div>
    </div>
  );
}

export default App;
