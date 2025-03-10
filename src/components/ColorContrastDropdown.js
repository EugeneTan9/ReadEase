import React, { useState, useEffect } from "react";

/**
 * ColorContrastDropdown Component
 * 
 * A dropdown menu that allows users to select different color contrast combinations.
 * Dynamically updates the background and text color of the entire document and specific elements.
 */
const ColorContrastDropdown = () => {
  // Predefined color combinations for accessibility
  const color_combinations = [
    { label: "Black on White", background: "#FFFFFF", text: "#000000" },
    { label: "Yellow on Dark Blue", background: "#000066", text: "#FFFF00" },
    { label: "Green on Black", background: "#141414", text: "#0BFE54" },
    { label: " Light Gray on Dark Gray", background: "#1E1E1E", text: "#CCCCCC" },
  ];

  // State to store the currently selected color combination
  const [selected_colors, set_selected_colors] = useState(color_combinations[0]);

  /**
   * Effect hook that updates the document's colors whenever the selected color changes.
   */
  useEffect(() => {
    // Apply colors to the main document body
    document.body.style.backgroundColor = selected_colors.background;
    document.body.style.color = selected_colors.text;

    /**
     * Helper function to safely apply color styles to elements that may not always exist in the DOM.
     * @param {string} id - The ID of the target element.
     * @param {string} styleProperty - The CSS property to modify.
     * @param {string} colorValue - The color value to apply.
     */
    const applyColorToElement = (id, styleProperty, colorValue) => {
      const element = document.getElementById(id);
      if (element) element.style[styleProperty] = colorValue;
    };

    // Apply color settings to various UI elements
    applyColorToElement('navBar', 'backgroundColor', selected_colors.text);
    applyColorToElement('navBar-link', 'color', selected_colors.background);
    applyColorToElement('hamburger', 'color', selected_colors.text);
    applyColorToElement('sidebar', 'color', selected_colors.text);
    applyColorToElement('sidebar', 'backgroundColor', selected_colors.background);
    applyColorToElement('close-hamburger', 'color', selected_colors.text);
    applyColorToElement('viewer', 'color', selected_colors.text);
    applyColorToElement('viewer', 'backgroundColor', selected_colors.background);

    // Apply colors to the PDF viewer container
    const pdfTextContainer = document.querySelector('.pdf-text-container');
    if (pdfTextContainer) {
      pdfTextContainer.style.color = selected_colors.text;
      pdfTextContainer.style.backgroundColor = selected_colors.background;
    }

    /**
     * Injects CSS styles into iframe content to apply the selected color scheme.
     */
    const injectStyleToIframes = () => {
      const iframes = document.querySelectorAll('iframe');

      iframes.forEach(iframe => {
        try {
          if (iframe.contentDocument) {
            const style = iframe.contentDocument.createElement('style');
            style.textContent = `
              body, html {
                color: ${selected_colors.text} !important;
                background-color: ${selected_colors.background} !important;
              }
              
              .epub-container iframe {
                background-color: ${selected_colors.background} !important;
              }
              
              * {
                color: ${selected_colors.text} !important;
              }
              
              .highlight {
                background-color: #ffeb3b !important;
                color: #000 !important;
              }
            `;
            iframe.contentDocument.head.appendChild(style);
          }
        } catch (e) {
          console.warn('Cannot access iframe content:', e);
        }
      });
    };

    // Apply styles to iframes immediately and after a short delay to handle dynamic content
    injectStyleToIframes();
    setTimeout(injectStyleToIframes, 1000);

    // Apply colors to EPUB containers and their internal iframes
    const epubContainers = document.querySelectorAll('.epub-container');
    epubContainers.forEach(container => {
      container.style.backgroundColor = selected_colors.background;

      const epubIframes = container.querySelectorAll('iframe');
      epubIframes.forEach(iframe => {
        try {
          if (iframe.contentDocument) {
            iframe.contentDocument.body.style.backgroundColor = selected_colors.background;
            iframe.contentDocument.body.style.color = selected_colors.text;
          }
        } catch (e) {
          console.warn('Cannot access EPUB iframe content:', e);
        }
      });
    });

  }, [selected_colors]); // Re-run effect when `selected_colors` changes

  return (
    <select
      id="colorSelector" aria-label="color_contrast_dropdown"
      onChange={(e) => {
        // Find the selected color combination based on the dropdown value
        const selected = color_combinations.find(
          (option) => option.label === e.target.value
        );
        set_selected_colors(selected);
      }}
      value={selected_colors.label}
    >
      {color_combinations.map((option, index) => (
        <option key={index} value={option.label}>
          {option.label}
        </option>
      ))}
    </select>
  );
};

export default ColorContrastDropdown;
