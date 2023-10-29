import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Chat from "./chat/Chat";
import ChatNavBar from "./chat/Navbar";
import axios from "axios";
import Loader from "./components/Loader/Loader";
function ChatApp({ loggedInUser, userRole }) {
  const [user, setUser] = useState(loggedInUser);
  const [talkingToEmployer, setTalkingToEmployer] = useState(null);
  const [talkingToEmployee, setTalkingToEmployee] = useState(null);
  const { chatId } = useParams();
  const [isLoading, setIsLoading] = useState(true);

  const checkWhoTalkingTo = async (chatId) => {
    try {
      const ids = chatId.split("_");
      if (loggedInUser._id === ids[0]) {
        const response = await axios.get(
          "https://fxb8z0anl0.execute-api.eu-west-3.amazonaws.com/prod/employer/" +
            ids[1]
        );
        setTalkingToEmployer(response.data.employer);
      } else {
        const response = await axios.get(
          "https://fxb8z0anl0.execute-api.eu-west-3.amazonaws.com/prod/user/" +
            ids[0]
        );
        setTalkingToEmployee(response.data.user);
      }
      setIsLoading(false); // Set isLoading to false when data is fetched
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    if (user) {
      checkWhoTalkingTo(chatId);
    }
  }, [loggedInUser, chatId]);

  return (
    <div className="chat-container-messages">
      {isLoading ? (
        <Loader />
      ) : (
        <>
          {user && (talkingToEmployee || talkingToEmployer) ? (
            talkingToEmployee ? (
              <ChatNavBar employer={null} employee={talkingToEmployee} />
            ) : (
              <ChatNavBar employer={talkingToEmployer} employee={null} />
            )
          ) : (
            <Loader />
          )}
          {user ? <Chat user={user} /> : <Loader />}
        </>
      )}
    </div>
  );
}

export default ChatApp;
