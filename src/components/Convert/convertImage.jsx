import React, { useState } from "react";

const ImageUploader = ({ currentImage, setImage }) => {
  const [selectedFile, setSelectedFile] = useState(null);

  const convertToBase64 = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();

    reader.onloadend = () => {
      const base64String = reader.result;
      setSelectedFile(file);
      setImage(base64String);
    };

    if (file) {
      reader.readAsDataURL(file);
    }
  };

  return (
      <input
        type="file"
        accept="image/*"
        onChange={convertToBase64}
        className="form-control form-control-lg"
      />
  );
};

export default ImageUploader;