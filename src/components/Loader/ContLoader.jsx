import React from 'react';
import ContentLoader from 'react-content-loader';
import "../Loader/contLoader.css"
const ContLoader = ({ ...rest }) => (
  <div className='loader'>
    <ContentLoader viewBox=" 0 360 800" height={700} backgroundColor="#cfe8f7"
    foregroundColor="#ecebeb" width={400}>
    {/* Card Photo */}
    <rect x="20" y="10" rx="10" ry="10" width="350" height="480" />
    
    {/* Buttons */}
    <circle cx="50" cy="550" r="30" />
    <circle cx="150" cy="550" r="30" />
    <circle cx="240" cy="550" r="30" />
    <circle cx="340" cy="550" r="30" />
  </ContentLoader>
  </div>
)



export default ContLoader;