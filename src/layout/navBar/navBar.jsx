import React, { useState, useEffect } from "react";
import Text from "../../components/text/text";
import { Link, useLocation } from "react-router-dom";
import "./navBar.css";
import { Auth } from "aws-amplify";
function Navbar() {
  const [click, setClick] = useState(false);
  const [button, setButton] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);
  const [givenName, setGivenName] = useState("");
  const [lastName, setLastName] = useState("");
  const location = useLocation();
  const handleClick = () => setClick(!click);
  const closeMobileMenu = () => setClick(false);

  const showButton = () => {
    if (window.innerWidth <= 960) {
      setButton(false);
    } else {
      setButton(true);
    }
  };

  useEffect(() => {
    checkAuthenticated();
    showButton();
  }, []);

    const checkAuthenticated = async () => {
      try {
        const user = await Auth.currentAuthenticatedUser();
        if (user) {
          setAuthenticated(true);
        } else {
          setAuthenticated(false);
        }

        const userAttributes = user.attributes || {};
        const userGivenName = userAttributes.given_name || "";
        setGivenName(userGivenName);
        const userLastName = userAttributes.family_name || "";
        setLastName(userLastName);
      } catch (error) {
        setAuthenticated(false);
      }
    };

  window.addEventListener("resize", showButton);

  return (
    <>
      <nav className="navbar-main">
        <div className="navbar-container">
          <div className="navbar-logo">
            <Link to="/" onClick={closeMobileMenu} style={{textDecoration:"none"}}>
              <Text
                label={"CAREERCRUSH"}
                weight={"medium"}
                size={"s22"}
                color={"white"}
              />
            </Link>
            <i class="fa-regular fa-heart" style={{ color: "white", marginLeft:"5px" }}></i>
            <i class="fa-solid fa-suitcase" style={{ color: "white", marginLeft:"5px" }}></i>
          </div>
          <div className="menu-icon" onClick={handleClick}>
            <i className={click ? "fas fa-times" : "fas fa-bars"} />
          </div>
          <ul className={click ? "nav-menu active" : "nav-menu"}>
            <li className="nav-item">
              <Link className="nav-links" onClick={closeMobileMenu}>
                Safety
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-links" onClick={closeMobileMenu}>
                Support
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-links" onClick={closeMobileMenu}>
                About Us
              </Link>
            </li>
    
            {authenticated ? (
              <li className="nav-item">
                   <Link className="nav-links" onClick={closeMobileMenu}>
                {givenName} {lastName}
              </Link>
              </li>
            ) : null}
          </ul>
        </div>
      </nav>
    </>
  );
}

export default Navbar;
