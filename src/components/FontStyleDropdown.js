import React, { useState, useEffect } from "react";

/**
 * FontStyleDropdown Component
 * 
 * This component provides a dropdown menu for users to select a font families.
 * It dynamically updates the font families of various elements in the document,
 * including the main content, PDF viewers, and EPUB iframes.
 */
const FontStyleDropdown = () => {
  const fontFamilies = [
    { label: "Verdana", style: "Verdana, sans-serif" },
    { label: "Times New Roman", style: "'Times New Roman', serif" },
    { label: "Arial", style: "Arial, sans-serif" },
  ];

  // State to store selected font style
  const [selectedFontStyle, setFontStyle] = useState(fontFamilies[0]);

  // Update the font family dynamically
  useEffect(() => {
    // Apply to body first (for inheritance)
    document.body.style.fontFamily = selectedFontStyle.style;
    
    // Function to safely apply style to an element
    const applyStyleToElement = (selector, property, value) => {
      const elements = document.querySelectorAll(selector);
      elements.forEach(element => {
        element.style[property] = value;
      });
    };
    
    // Apply to specific containers
    applyStyleToElement('.pdf-text-container', 'fontFamily', selectedFontStyle.style);
    applyStyleToElement('#viewer', 'fontFamily', selectedFontStyle.style);
    applyStyleToElement('#bookContent', 'fontFamily', selectedFontStyle.style);
    
    // Apply to PDF viewer content
    applyStyleToElement('.pdf-line', 'fontFamily', selectedFontStyle.style);
    applyStyleToElement('.pdf-page-header', 'fontFamily', selectedFontStyle.style);
    
    // Apply to all iframes (for EPUB)
    const applyToIframes = () => {
      const iframes = document.querySelectorAll('iframe');
      iframes.forEach(iframe => {
        try {
          if (iframe.contentDocument) {
            // Create or update style element
            let style = iframe.contentDocument.getElementById('user-font-family');
            if (!style) {
              style = iframe.contentDocument.createElement('style');
              style.id = 'user-font-family';
              iframe.contentDocument.head.appendChild(style);
            }
            
            style.textContent = `
              body, p, div, span, h1, h2, h3, h4, h5, h6, li, td, th {
                font-family: ${selectedFontStyle.style} !important;
              }
            `;
          }
        } catch (e) {
          console.warn('Cannot access iframe content:', e);
        }
      });
    };
    
    // Apply to iframes immediately and after a short delay
    applyToIframes();
    setTimeout(applyToIframes, 500);
    
    // Create a global style for the font family that will affect all elements
    let globalStyle = document.getElementById('global-font-family');
    if (!globalStyle) {
      globalStyle = document.createElement('style');
      globalStyle.id = 'global-font-family';
      document.head.appendChild(globalStyle);
    }
    
    globalStyle.textContent = `
      .pdf-text-container, #viewer, .pdf-line, .pdf-page-header, #bookContent {
        font-family: ${selectedFontStyle.style} !important;
      }
    `;
    
    // Dispatch a custom event that our viewers can listen for
    const event = new CustomEvent('fontStyleChanged', { 
      detail: { fontFamily: selectedFontStyle.style } 
    });
    window.dispatchEvent(event);
    
  }, [selectedFontStyle]);
  
  return (
    <select
      id="fontFamilieSelector" aria-label="font_families_dropdown"
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