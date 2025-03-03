import React, { useState, useEffect } from "react";

const ColorContrastDropdown = () => {
  console.log("Inside the colorContrastDropdown");

  const colorCombinations = [
    { label: "White on black", background: "#FFFFFF", text: "#000000" },
    { label: "Dark on and Yellow", background: "#000066", text: "#FFFF00" },
    { label: "Black on Green", background: "#141414", text: "#0BFE54" },
    { label: "Dark Gray on Light Gray", background: "#1E1E1E", text: "#CCCCCC" },
  ];

  // State to store selected colors
  const [selectedColors, setSelectedColors] = useState(colorCombinations[0]);

  // Update the background and text color dynamically
  useEffect(() => {
    console.log("came in FONT color");
    document.body.style.backgroundColor = selectedColors.background;
    document.body.style.color = selectedColors.text;
    document.getElementById('navBar').style.backgroundColor = selectedColors.text;
    document.getElementById('navBar-link').style.color = selectedColors.background;
    document.getElementById('hamburger').style.color = selectedColors.text;
    document.getElementById('sidebar').style.color = selectedColors.text;
    document.getElementById('sidebar').style.backgroundColor = selectedColors.background;
    document.getElementById('close-hamburger').style.color = selectedColors.text;

    var viewer = document.getElementById('viewer');
    if (viewer) {
      console.log("came in viewer")
      viewer.style.color = selectedColors.text;
    }

  }, [selectedColors]);

  return (
    <select
      id="colorSelector"
      onChange={(e) => {
        const selected = colorCombinations.find(
          (option) => option.label === e.target.value
        );
        setSelectedColors(selected);
      }}
      value={selectedColors.label}
    >
      {colorCombinations.map((option, index) => (
        <option key={index} value={option.label}>
          {option.label}
        </option>
      ))}
    </select>
  );
};

export default ColorContrastDropdown;
