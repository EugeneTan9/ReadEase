import React from "react";

/**
 * AudioPlayer Component
 * 
 * A simple audio player that plays an audio file from a given URL.
 * 
 * @param {Object} props - Component properties.
 * @param {string} props.fileUrl - The URL of the audio file to be played.
 */
const AudioPlayer = ({ fileUrl }) => {
  return (
    <div 
      className="container mx-auto text-center" 
      style={{ maxWidth: "800px" }} // Limits the overall width for better UI control
    >
      <h2 className="mb-4">Audio Player</h2>
      
      <div 
        className="audio-container" 
        style={{ width: "100%", maxWidth: "600px", margin: "0 auto" }} // Ensures the player is centered and responsive
      >
        <audio controls style={{ width: "100%" }}> 
          <source src={fileUrl} type="audio/mpeg" />
          {/* Fallback text for browsers that do not support the <audio> element */}
          Your browser does not support the audio element.
        </audio>
      </div>
    </div>
  );
};

export default AudioPlayer;
