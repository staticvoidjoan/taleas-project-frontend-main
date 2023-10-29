import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Text from "../../components/text/text";
import Card from "../../components/cards/cards";
import Tabs from "../../components/button/tabs";
import heart from "../../assets/icons/heart.svg";
import back from "../../assets/icons/back.svg";
import x from "../../assets/icons/x.svg";
import "./userHome.css";
import Animate from "../../animateTransition/Animate";
import ContLoader from "../../components/Loader/ContLoader";
import axios from "axios";
import { useMediaQuery } from "@mui/material";
import Sidebar from "../../components/sidebar/sidebar";
import { useTranslation } from "react-i18next";

const UserHome = ({ userId, employee }) => {
  const [posts, setPosts] = useState([]);
  const [currentPost, setCurrentPost] = useState({});
  const [selectedButton, setSelectedButton] = useState("All");
  const [categories, setCategories] = useState([]);
  const [categoryId, setCategoryId] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [postlength, setPostLength] = useState(0);
  const [animate, setAnimate] = useState(false);
  const [loading, setLoading] = useState(false);
  const [viewingMessages, setViewingMessages] = useState(false);

  const isLargerScreen = useMediaQuery("(min-width: 768px)");

  const { t } = useTranslation(["Translate"]);

  // State to control sidebar visibility
  const [isSidebarVisible, setSidebarVisible] = useState(isLargerScreen);

  const navigate = useNavigate();

  const handleJobCardClick = (id) => {
    navigate(`/viewjobpost/${id}/${currentIndex}`);
  };

  const { index } = useParams();

  useEffect(() => {
    loadTabs();
    if (index) {
      loadPosts(parseInt(index, 10));
    } else {
      loadPosts();
    }
  }, [index]);

  const loadTabs = async () => {
    try {
      const response = await axios.get(
        "https://fxb8z0anl0.execute-api.eu-west-3.amazonaws.com/prod/category"
      );
      setCategories(response.data.categories);
      setCategoryId(response.data.categories.id);
    } catch (error) {
      console.error(error);
    }
  };

  const filter = async (categoryName, categoryId) => {
    if (categoryName === "All") {
      loadPosts(); // Load all posts
    } else {
      try {
        const response = await axios.get(
          `https://fxb8z0anl0.execute-api.eu-west-3.amazonaws.com/prod/posts/category/${categoryId}?id=${userId}`
        );
        setPosts(response.data.posts);
        setPostLength(response.data.posts.length);
        if (response.data.posts.length > 0) {
          setCurrentPost(response.data.posts[0]);
        } else {
          setCurrentPost({}); // Set to an empty object if no posts
        }
      } catch (error) {
        console.error("Cancel API Error:", error);
      }
    }
    setSelectedButton(categoryName);
  };

  const loadPosts = async (index = 0) => {
    try {
      setLoading(true);
      const response = await axios.get(
        `https://fxb8z0anl0.execute-api.eu-west-3.amazonaws.com/prod/posts/user/${userId}`
      );
      setPosts(response.data);
      setPostLength(response.data.length);
      if (response.data.length > 0) {
        setCurrentPost(response.data[0]);
      } else {
        setCurrentPost({}); // Set to an empty object if no posts
      }
      setTimeout(() => {
        setLoading(false);
      }, 1000);
    } catch (error) {
      console.error(error);
    }
  };

  const next = async () => {
    setAnimate(true);
    setTimeout(() => {
      setAnimate(false);
    }, 500);
    if (currentIndex < postlength - 1) {
      const nextIndex = currentIndex + 1;
      setCurrentIndex(nextIndex);
      if (posts[nextIndex]) {
        setCurrentPost(posts[nextIndex]);
      } else {
        setCurrentPost({}); // Set to an empty object if no more posts
      }
    } else {
      setPostLength(0);
    }
  };

  const previous = () => {
    setAnimate(true);
    setTimeout(() => {
      setAnimate(false);
    }, 500);
    if (currentIndex > 0) {
      const previousIndex = currentIndex - 1;
      setCurrentIndex(previousIndex);
      if (posts[previousIndex]) {
        setCurrentPost(posts[previousIndex]);
      } else {
        setCurrentPost({}); // Set to an empty object if no previous posts
      }
    } else {
      const lastIndex = postlength - 1;
      setCurrentIndex(lastIndex);
      if (posts[lastIndex]) {
        setCurrentPost(posts[lastIndex]);
      } else {
        setCurrentPost({}); // Set to an empty object if no previous posts
      }
    }
  };

  const handleAction = async (action) => {
    if (!currentPost._id) return; // No post to interact with
    try {
      switch (action) {
        case "like":
          await axios.put(
            `https://fxb8z0anl0.execute-api.eu-west-3.amazonaws.com/prod/like/${userId}?id=${currentPost._id}`
          );
          break;
        case "dislike":
          await axios.put(
            `https://fxb8z0anl0.execute-api.eu-west-3.amazonaws.com/prod/dislike/${userId}?id=${currentPost._id}`
          );
          break;
        default:
          break;
      }

      if (currentIndex < postlength - 1) {
        const nextIndex = currentIndex + 1;
        setCurrentIndex(nextIndex);
        if (posts[nextIndex]) {
          setCurrentPost(posts[nextIndex]);
        } else {
          setCurrentPost({}); // Set to an empty object if no more posts
        }
        setAnimate(true);
        setTimeout(() => {
          setAnimate(false);
        }, 500);
      } else {
        setPostLength(0);
      }
    } catch (error) {
      console.error("API Error:", error);
    }
  };

  return (
    <div className="main-content">

        <div className="button-row">
          <Tabs
            buttonName={t("category1")}
            selected={selectedButton === "All"}
            onClick={() => filter("All")}
          />
          {categories.map((buttonName, index) => (
            <Tabs
              buttonName={buttonName.name}
              key={index}
              selected={selectedButton === buttonName.name}
              onClick={() => filter(buttonName.name, buttonName._id)}
            />
          ))}
        </div>
        {loading ? (
          <div className="loader">
            <ContLoader />
          </div>
        ) : postlength === 0 ? (
          <div className="post-alert">
            <Text label={"No more posts. Check back soon!"} />
          </div>
        ) : (
          <div>
            <Animate>
              <div
                className={`card-component ${animate ? "animate" : ""}`}
                onClick={() => handleJobCardClick(currentPost._id)}
              >
                <Card
                  id={currentPost._id}
                  category={currentPost.category?.name}
                  title={currentPost.position}
                  info={currentPost.creatorId?.companyName}
                  background={currentPost.creatorId?.profilePhoto}
                />
              </div>
            </Animate>
            <div className="card-buttons">
              <button className="left-button" onClick={previous}>
                <img src={back} alt="back" />
              </button>
              <button
                className="cancel"
                onClick={() => handleAction("dislike")}
              >
                <img src={x} alt="x" />
              </button>
              <button className="like" onClick={() => handleAction("like")}>
                <img src={heart} alt="heart" />
              </button>
              <button className="right-button" onClick={next}>
                <img src={back} className="right" alt="back" />
              </button>
            </div>
          </div>
        )}
      </div>
  );
};

export default UserHome;
