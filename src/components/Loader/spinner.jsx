import React from 'react'
import ClipLoader from "react-spinners/ClipLoader"
import "../Loader/Loader.css"

const Spinner = () => {
  return (
    <div className='loaderContainer'><ClipLoader color="#36d7b7" /></div>
  )
}

export default Spinner