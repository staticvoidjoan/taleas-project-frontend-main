import React from 'react';
import DotLoader from "react-spinners/DotLoader"
import "./Loader.css"
import cclogo from "../../assets/images/cclogo.svg"
import Animate from '../../animateTransition/AnimateY';
const Loader = () => {
    return (
        
        <div className='loader-container'>
            <img src={cclogo} alt="" className='careercrush-logo'/>
            <DotLoader color="#6E46F5" />
        </div>

    );
}

export default Loader;
