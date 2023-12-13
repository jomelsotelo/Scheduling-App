import React, { useState } from "react";
import dogButtonImage from "../../assets/images/dog.png";
import dogImage from "../../assets/images/dogCSC131.jpg";

function Info() {
  // Developer details
  var developers = [
    { name: "Jomel Sotelo", role: "PO - Backend/Frontend Developer" },
    { name: "Jose Vasquez", role: "Backend Developer" },
    { name: "Angel Ramirez-Garcia", role: "Backend Developer" },
    { name: "Katy Chan", role: "Frontend Developer" },
    { name: "Jenica Chu", role: "Frontend Developer" },
    { name: "Hector Yabes", role: "Frontend Developer" },
  ];

  const [showDogImage, setShowDogImage] = useState(false);

  const containerStyle = {
    width: '100vw',
    height: '100vh',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    overflow: 'hidden',
    background: `
        linear-gradient(#ae445a, transparent),
        linear-gradient(90deg, #451952, transparent),
        linear-gradient(-90deg, #662549, transparent)`,
    backgroundBlendMode: 'screen',
  };

  const whiteBoxStyle = {
    background: "#fff",
    padding: "20px",
    borderRadius: "8px",
    boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
    zIndex: 1,
    transparent: '25%',
  };

  const listStyle = {
    listStyleType: "none",
    padding: "0",
  };

  const boldStyle = {
    fontWeight: "bold",
  };

  const buttonStyle = {
    border: 'none',
    background: `url(${dogButtonImage}) no-repeat center center`,
    backgroundSize: 'cover',
    width: '20px', // Adjust the width as needed
    height: '20px', // Adjust the height as needed
    position: 'absolute',
    top: '10px',
    left: '10px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  };

  const imgStyle = {
    width: '40%', // Adjust the width as needed
    height: 'auto',
    display: showDogImage ? 'block' : 'none',
    position: 'fixed',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    zIndex: 2, // Place the image above the white box
    transition: 'opacity 3s', // Transition for opacity with a longer duration
    opacity: showDogImage ? 1 : 0, // Set initial opacity
  };

  const handleButtonClick = () => {
    setShowDogImage(true);

    // Delay the positioning to make sure setShowDogImage is updated
    setTimeout(() => {
      setShowDogImage(false);
    }, 5000); // Longer delay before fading out
  };

  return (
    <div style={containerStyle}>
      <button style={buttonStyle} onClick={handleButtonClick}></button>
      {showDogImage && (
        <img
          id="dogImage"
          src={dogImage}
          alt="Dog"
          style={imgStyle}
        />
      )}
      <div style={whiteBoxStyle}>
        <h1>Developer Information</h1>
        <ul style={listStyle}>
          {developers.map((developer, index) => (
            <li key={index}>
              <span style={boldStyle}>Name:</span> {developer.name},{" "}
              <span style={boldStyle}>Role:</span> {developer.role}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default Info;
