import React from "react";
import RedXImage from '../../assets/images/red-x.png';
import ReleaseNotes from '../../assets/ReleaseNotes.txt';

function Info() {
  // Function to open the release notes file
  const openReleaseNotes = () => {
    window.open(ReleaseNotes, '_blank');
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>

      {/* Button grid */}
      <div style={{ position: "absolute", top: "300px", left: "50%", transform: "translate(-50%, -50%)", display: "grid", gridTemplateColumns: "1fr", gap: "10px" }}>
        <button style={{ padding: "10px", backgroundColor: "red", color: "#000", border: "none", borderRadius: "5px", cursor: "pointer", textAlign: "center" }} onClick={openReleaseNotes}>
          <span>Release notes</span>
        </button>
      </div>
    </div>
  );
}

export default Info;
