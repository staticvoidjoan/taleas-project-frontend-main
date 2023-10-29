import React from "react";
import ContentLoader from "react-content-loader";

const UserInfoLoader = () => (
  <ContentLoader
    speed={2}
    width={800}
    height={600}
    viewBox="0 0 800 600"
    backgroundColor="#999999"
    foregroundColor="#ecebeb"
    className="userInfoLoader" 
  >
    {/* {User profile photo} */}
    <rect x="20" y="20" rx="3" ry="3" width="350" height="231" />

    {/* User's Name */}
    <rect x="20" y="20" rx="3" ry="3" width="200" height="30" />

    {/* User's Email */}
    <rect x="20" y="70" rx="3" ry="3" width="250" height="20" />

    {/* Social Icons */}
    <rect x="20" y="120" rx="15" ry="15" width="30" height="30" />
    <rect x="70" y="120" rx="15" ry="15" width="30" height="30" />

    {/* Skills */}
    <rect x="20" y="170" rx="5" ry="5" width="100" height="20" />
    <rect x="140" y="170" rx="5" ry="5" width="100" height="20" />

    {/* Experiences */}
    <rect x="20" y="220" rx="3" ry="3" width="50" height="20" />
    <rect x="80" y="220" rx="3" ry="3" width="250" height="20" />
    <rect x="80" y="220" rx="3" ry="3" width="250" height="20" />


    {/* Education */}
    <rect x="20" y="270" rx="3" ry="3" width="50" height="20" />
    <rect x="80" y="270" rx="3" ry="3" width="250" height="20" />
    <rect x="80" y="220" rx="3" ry="3" width="250" height="20" />


    {/* Certifications */}
    <rect x="20" y="320" rx="3" ry="3" width="50" height="20" />
    <rect x="80" y="320" rx="3" ry="3" width="250" height="20" />
    <rect x="80" y="220" rx="3" ry="3" width="250" height="20" />


    {/* Links */}
    <rect x="20" y="370" rx="15" ry="15" width="30" height="30" />
    <rect x="80" y="370" rx="3" ry="3" width="250" height="20" />
    <rect x="80" y="220" rx="3" ry="3" width="250" height="20" />

  </ContentLoader>
);

export default UserInfoLoader;
