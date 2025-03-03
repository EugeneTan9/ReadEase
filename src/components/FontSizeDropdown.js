import React, { useState, useEffect } from "react";

const FontSizeDropdown = () => {
    console.log("Inside the fontSize ddrop");
  const fontSizes = [
    { label: "16px", size: "16" },
    { label: "17px", size: "17" },
    { label: "18px", size: "18" },
    { label: "19px", size: "19" },
    { label: "20px", size: "20" },
    { label: "21px", size: "21" },
  ];

  // State to store the selected font size
  const [selectedFontSize, setFontSize] = useState(fontSizes[0]);

   // Update the background and text color dynamically
    useEffect(() => {
        console.log("came in FONT USE");
    let bookContent = document.getElementById("bookContent");
    if (bookContent) {
        bookContent.style.fontSize = selectedFontSize.size + "px";
    }
    }, [selectedFontSize]);
  
    return (
      <select
        id="fontSizeSelector"
        onChange={(e) => {
          const selected = fontSizes.find(
            (option) => option.label === e.target.value
          );
          setFontSize(selected);
        }}
        value={selectedFontSize.label}
      >
        {fontSizes.map((option, index) => (
          <option key={index} value={option.label}>
            {option.label}
          </option>
        ))}
      </select>
    );
};

export default FontSizeDropdown;
