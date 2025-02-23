import React, { useState, useEffect } from "react";

const ColorContrastDropdown = ({ onChange }) => {
  console.log("Inside the colorContrastDropdown");

  const colorCombinations = [
    { label: "White on black", background: "#FFFFFF", text: "#000000" },
    { label: "Black on white", background: "#000000", text: "#FFFFFF" },
    { label: "Dark on and Yellow", background: "#000066", text: "#FFFF00" },
    { label: "Green on Black", background: "#0BFE54", text: "#141414" },
    { label: "Dark Gray on Light Gray", background: "#1E1E1E", text: "#CCCCCC" },
  ];

  // State to store selected colors
  const [selectedColors, setSelectedColors] = useState(colorCombinations[0]);

  // Update the background and text color dynamically
  useEffect(() => {
    document.body.style.backgroundColor = selectedColors.background;
    document.body.style.color = selectedColors.text;
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
