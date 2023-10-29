import React from "react"
import ContentLoader from "react-content-loader"

const MyLoader = () => (
  <ContentLoader 
    speed={1}
    width={200}
    height={200}
    viewBox="0 0 200 200"
    backgroundColor="#cfe8f7"
    foregroundColor="#ecebeb"

  >
    <rect x="0" y="0" rx="10" ry="10" width="200" height="200" />
  </ContentLoader>
)

export default MyLoader