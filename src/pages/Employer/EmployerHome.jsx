import React, { useEffect, useState } from "react";
import Text from "../../components/text/text";
import axios from "axios";
import JobCard from "../../components/jobCard/jobCard";
import "./employerHome.css";
import { useNavigate } from "react-router-dom";
import Loader from "../../components/Loader/Loader";
import Animate from "../../animateTransition/Animate";
import back from "../../assets/icons/back.svg";
import debounce from "lodash.debounce"; // Import lodash debounce function
import EmployerLoader from "../../components/Loader/EmployerLoader";
import Sidebar from "../../components/sidebar/sidebar";
import EmploterWebLoader from "../../components/Loader/EmployerWebLoader";
import ContentLoader from "react-content-loader";
import EmployerWebLoaderL from "../../components/Loader/EmployerWebLoaderL";
import { useTranslation } from "react-i18next";

const EmployerHome = ({ creatorId, employer }) => {
  const navigate = useNavigate();
  const [userposts, setuserPosts] = useState([]);
  const [postCount, setPostCount] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(10);
  const [loading, setLoading] = useState(false); // Track loading state

  const { t } = useTranslation(["Translate"]);

  // Define the getAllPosts function
  const getAllPosts = async () => {
    let limit = 4;
    if (window.innerWidth >= 1200) {
      limit = 8;
    }
    try {
      setLoading(true); // Set loading to true while fetching data
      const response = await axios.get(
        `https://fxb8z0anl0.execute-api.eu-west-3.amazonaws.com/prod/posts/creator/${creatorId}?page=${page}&limit=${limit}`
      );
      setuserPosts(response.data.posts);
      console.log(response.data.posts);
      setPostCount(response.data.count);
      setTotalPages(response.data.pageCount);
    } catch (error) {
      // Handle errors
    } finally {
      setLoading(false); // Set loading to false when data fetching is complete
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
  useEffect(() => {
    getAllPosts();
  }, [page]); // Fetch data when page changes

  // Debounce the getAllPosts function to avoid rapid API requests
  const debouncedGetAllPosts = debounce(getAllPosts, 300);

  const nextPage = () => {
    if (page < totalPages) {
      setPage(page + 1);
    } else {
      setPage(1);
    }
  };

  const previousPage = () => {
    if (page > 1) {
      setPage(page - 1);
    } else {
      setPage(totalPages);
    }
  };

  const addNewPost = () => {
    navigate(`/postjob/${creatorId}`);
  };

  const [isSidebarVisible, setIsSidebarVisible] = useState(
    window.innerWidth > 768
  );
  useEffect(() => {
    const handleResize = () => {
      setIsSidebarVisible(window.innerWidth > 768);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      // Clean up the event listener on unmount
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <Animate>
      <div className="empl-home">
        {isSidebarVisible ? null : (
          <div>
            <div className="add-job-btn-container">
              <button className="employer-btn" onClick={addNewPost}>
                <Text label={t("addJob")} size={"s16"} weight={"regular"} />
              </button>
            </div>
          </div>
        )}
        {loading && isSidebarVisible === false ? (
          <EmployerLoader />
        ) : (
          <div>
            {isSidebarVisible && (
              <div className="company-container-on-web">
                <div>
                  <Text
                    label={t("myJobs") + `(${postCount})`}
                    size={"s20"}
                    weight={"medium"}
                  />
                </div>
                <div className="navigate-bubble-row">
                  <button className="left-button" onClick={previousPage}>
                    <img src={back} alt="Previous" />
                  </button>
                  <Text label={page} weight={"bold"} size={"s22"} />
                  <button className="right-button" onClick={nextPage}>
                    <img src={back} alt="Next" className="right" />
                  </button>
                </div>
                <div className="add-job-btn-container">
                  <button className="employer-btn" onClick={addNewPost}>
                    <Text label={t("addJob")} size={"s16"} weight={"regular"} />
                  </button>
                </div>
              </div>
            )}
            <div className="job-card-column">
              {userposts.map((post, index) =>
                loading ? (
                  windowWidth > 1200 ? (
                    <EmployerWebLoaderL />
                  ) : (
                    <EmploterWebLoader />
                  )
                ) : (
                  <JobCard
                    postId={userposts[index]._id}
                    profilePhoto={post.creatorId.profilePhoto}
                    position={post.position}
                    category={post.category.name}
                    address={post.creatorId.address}
                    likes={post.likedBy}
                    key={post._id}
                  />
                )
              )}
            </div>
            {isSidebarVisible ? null : (
              <div className="navigate-bubble-row">
                <button className="left-button" onClick={previousPage}>
                  <img src={back} alt="Previous" />
                </button>
                <Text label={page} weight={"bold"} size={"s22"} />
                <button className="right-button" onClick={nextPage}>
                  <img src={back} alt="Next" className="right" />
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </Animate>
  );
};

export default EmployerHome;
