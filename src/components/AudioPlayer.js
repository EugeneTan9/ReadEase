import React from "react";

const AudioPlayer = ({ fileUrl }) => {
  return (
    <div>
      <audio controls>
        <source src={fileUrl} type="audio/mpeg" />
        Your browser does not support the audio element.
      </audio>
    </div>
  );
};

export default AudioPlayer;
