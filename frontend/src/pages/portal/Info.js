// Info.js

import React from "react";

function Info() {
  // Developer details
  var developers = [
    { name: "Jomel Sotelo", role: "PO - Backend Developer" },
    { name: "Jose Vasquez", role: "Backend Developer" },
    { name: "Angel Ramirez-Garcia", role: "Backend Developer" },
    { name: "Katy Chan", role: "Frontend Developer" },
    { name: "Jenica Chu", role: "Frontend Developer" },
    { name: "Hector Yabes", role: "Frontend Developer" },
  ];

  // Display information in the console
  console.log("Developers:");

  developers.forEach(function (developer) {
    console.log("- Name: " + developer.name + ", Role: " + developer.role);
  });

  // Inline styles for centering and removing list bullets
  const centeredContainerStyle = {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh", // 100% of viewport height
  };

  const listStyle = {
    listStyleType: "none",
    padding: "0",
  };

  const boldStyle = {
    fontWeight: "bold",
  };

  return (
    <div style={centeredContainerStyle}>
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
  );
}

export default Info;
