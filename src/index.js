import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { BrowserRouter as Router } from "react-router-dom";
import { Auth } from "aws-amplify";
import axios from "axios";
import "./i18n";
import { Suspense } from "react";

async function getToken() {
  const session = await Auth.currentSession();
  const token = session.getIdToken().getJwtToken();
  return token;
}

axios.interceptors.request.use(async (request) => {
  const token = await getToken();
  request.headers.Authorization = token;
  return request;
});

axios.interceptors.response.use(async (response) => {
  const token = await getToken(); // Await the getToken() function
  response.headers.Authorization = token;
  return response;
});
const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <React.StrictMode>
    <Suspense fallback={null}>
      <Router>
        <App />
      </Router>
    </Suspense>
  </React.StrictMode>
);
