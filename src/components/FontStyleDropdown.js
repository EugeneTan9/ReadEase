import React, { useState, useEffect } from "react";

const FontStyleDropdown = () => {
    console.log("Inside the fontstyle ddrop");
  const fontFamilies = [
    { label: "Verdana ", style: "Verdana, sans-serif" },
    { label: "Tahoma ", style: "Tahoma, sans-serif" },
    { label: "Arial ", style: "Arial, sans-serif" },
  ];

  // State to store selected colors
  const [selectedFontStyle, setFontStyle] = useState(fontFamilies[0]);

   // Update the background and text color dynamically
    useEffect(() => {
        console.log("came in FONT STYLE");
    let bookContent = document.getElementById("bookContent");
    if (bookContent) {
        bookContent.style.fontFamily = selectedFontStyle.style;
    }
    }, [selectedFontStyle]);
  
    return (
      <select
        id="fontFamilieSelector"
        onChange={(e) => {
          const selected = fontFamilies.find(
            (option) => option.label === e.target.value
          );
          setFontStyle(selected);
        }}
        value={selectedFontStyle.label}
      >
        {fontFamilies.map((option, index) => (
          <option key={index} value={option.label}>
            {option.label}
          </option>
        ))}
      </select>
    );
};

export default FontStyleDropdown;
