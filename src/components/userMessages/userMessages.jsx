import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router";
import "./userMessages.css";
import unicorn from "../../assets/images/Unicorn.png";
import Text from "../text/text";
import chat from "../../assets/icons/chat.svg";
import { getDocs, query, collection, where, orderBy, limit } from "firebase/firestore";
import { db } from "../../firebase";
import Loader from "../Loader/Loader";
import Spinner from "../Loader/spinner";
import {useTranslation} from "react-i18next";

function ListUserMessages({ user }) {
  const navigate = useNavigate();
  const [chatData, setChatData] = useState([]);
  const [isChatDataLoaded, setIsChatDataLoaded] = useState(false);

  const {t} = useTranslation(["Translate"]);

  useEffect(() => {
    fetchData();
  }, [user._id]);

  async function fetchData() {
    try {
      // Fetch matches
      const response = await axios.get(`https://fxb8z0anl0.execute-api.eu-west-3.amazonaws.com/prod/matches/${user._id}`);
      console.log(response.data)
      const matches = response.data.posts;

      // Create an array of unique creatorIds
      const uniqueCreatorIds = [
        ...new Set(
          matches
            .filter((post) => post.creatorId) // Filter out null or undefined creatorId
            .map((post) => post.creatorId._id)
        )
      ];

      // Fetch the last message for each unique creatorId
      const lastMessagesPromises = uniqueCreatorIds.map((creatorId) => getLastMessage(`${user._id}_${creatorId}`));
      const lastMessages = await Promise.all(lastMessagesPromises);

      // Combine matches and last messages into chatData
      const chatData = uniqueCreatorIds.map((creatorId, index) => ({
        creatorId,
        match: matches.find((match) => match.creatorId._id === creatorId),
        lastMessage: lastMessages[index],
      }));

      // Sort the chatData based on the timestamp of the lastMessage (most recent first)
      chatData.sort((a, b) => {
        if (a.lastMessage && b.lastMessage) {
          return b.lastMessage.timestamp - a.lastMessage.timestamp;
        }
        return 0;
      });
      console.log(lastMessages)
      setChatData(chatData);
      setIsChatDataLoaded(true); // Set chat data as loaded
    } catch (error) {
      setIsChatDataLoaded(true); // Set chat data as loaded
    }
  }

  const getLastMessage = async (chatId) => {
    const q = query(
      collection(db, "chats"),
      where("chatId", "==", chatId),
      orderBy("timestamp", "desc"),
      limit(1)
    );

    try {
      const querySnapshot = await getDocs(q);
      if (!querySnapshot.empty) {
        const doc = querySnapshot.docs[0];
        const text = doc.data().text;

        // Check if the message is too long
        if (text.length > 10) { // Adjust the threshold as needed
          return {
            uid: doc.data().uid,
            name: doc.data().name,
            text: `${text.slice(0, 10)}...`, // Truncate long message
            timestamp: doc.data().timestamp,	
          };
        } else {
          return {
            uid: doc.data().uid,
            name: doc.data().name,
            text: text,
            timestamp: doc.data().timestamp,
          };
        }
      }
    } catch (error) {
      console.error('Error fetching last message:', error);
    }

    return null;
  };

  const goToChat = (creatorId) => {
    const chatId = `${user._id}_${creatorId}`;
    const link = `/chat/${chatId}`;
    navigate(link);
  };

  return (
    <div className="big">
    <Text label={t("messages") + ` (${chatData.length})`} size={"s16"} weight={"medium"} color={"black"} />
      {!isChatDataLoaded ? (
        <Spinner />
      ) : (
        <div>
          {chatData.map(({ creatorId, match, lastMessage }) => (
            
            <div key={creatorId} className={`chatContainer`} onClick={() => goToChat(creatorId)}>
              <div className="s">
              <div className="company-photo-chat" style={{ 
                backgroundImage: match && match.creatorId && match.creatorId.profilePhoto
                  ? `url(${match.creatorId.profilePhoto})`
                  : `url(${unicorn})`,
                lightgray: "50%"
              }}>
              </div>

              <div className="info">
                <Text label={match && match.creatorId && match.creatorId.companyName ? match.creatorId.companyName : ""} size={"s16"} weight={"medium"} color={"black"} />
                <Text label={lastMessage ? lastMessage.text : ""} size={"s14"} weight={"thin"} color={"lightgray"} />
              </div>
              </div>
              <div className="newMessage" onClick={() => goToChat(creatorId)}>
              <img src={chat} alt="Chat Icon" />
              {lastMessage && lastMessage.uid === creatorId && <div className="redCircle"></div>}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default ListUserMessages;
