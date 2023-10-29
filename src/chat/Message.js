import React from 'react';
import './message.css'; // Import the CSS file
import { Timestamp } from 'firebase/firestore'; // Import the Timestamp object from Firebase
import Text from '../components/text/text';
const Message = ({ message, user }) => {
  const messageClass = message.uid === user._id ? 'sent' : 'received';

  // Convert Firebase Timestamp to JavaScript timestamp
  const jsTimestamp = message.timestamp instanceof Timestamp
    ? message.timestamp.toMillis()
    : message.timestamp;

  return (
    <div>
      <div className={`message ${messageClass}`}>
        <Text label={message.text}></Text>
        <div className="timestamp">
        <Text label={formatTimestamp(jsTimestamp)}></Text>
        </div>
      </div>
    </div>
  );
};

// Helper function to format the timestamp (you can customize this)
const formatTimestamp = (timestamp) => {
  const date = new Date(timestamp);
  const hours = date.getHours();
  const minutes = date.getMinutes();

  // You can customize the timestamp format as needed
  return `${hours}:${minutes}`;
};

export default Message;
