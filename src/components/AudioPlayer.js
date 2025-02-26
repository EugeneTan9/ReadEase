import React from "react";

const AudioPlayer = ({ fileUrl }) => {
  return (
    <div className="container mx-auto text-center" style={{ maxWidth: "800px" }}>
      <h2 className="mb-4">Audio Player</h2>
      <div className="audio-container" style={{ width: "100%", maxWidth: "600px", margin: "0 auto" }}>
        <audio controls style={{ width: "100%" }}>
          <source src={fileUrl} type="audio/mpeg" />
          Your browser does not support the audio element.
        </audio>
      </div>
    </div>
  );
};

export default AudioPlayer;