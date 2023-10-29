import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { signOut } from "firebase/auth";
import { auth } from "../../firebase";
import SearchFirebase from "./searchfirebase";
import ChatsFirebase from "./chatsfirebase";
import ChatFirebase from "./chatfirebase";
import MessagesFirebase from "./messagesfirebase";

const NavbarFirebase = () => {
  const { currentUser } = useContext(AuthContext);

  const handleSignOut = async () => {
    try {
      // Sign out the user
      await signOut(auth);
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return (
    <nav>
      <div className="">
        {currentUser ? (
          <div className="user">
            <span className="user-name">{currentUser.displayName}</span>
            <button onClick={handleSignOut} className="logout-button">
              Sign Out
            </button>
            <SearchFirebase />
            <ChatsFirebase />
            <ChatFirebase />
            <MessagesFirebase />
          </div>
        ) : (
          <ul>
            <li>
              <Link to="/sig">Log In</Link>
            </li>
            <li>
              <Link to="/reg">Register</Link>
            </li>
          </ul>
        )}
      </div>
    </nav>
  );
};

export default NavbarFirebase;
