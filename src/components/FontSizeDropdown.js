import React, { useState, useEffect } from "react";

/**
 * FontSizeDropdown Component
 * 
 * This component provides a dropdown menu for users to select a font size.
 * It dynamically updates the font size of various elements in the document,
 * including the main content, PDF viewers, and EPUB iframes.
 */
const FontSizeDropdown = () => {
  // Font size options for user
  const fontSizes = [
    { label: "16px", size: "16" },
    { label: "18px", size: "18" },
    { label: "20px", size: "20" },
    { label: "22px", size: "22" },
    { label: "24px", size: "24" },
  ];

  // State to track the selected font size (default: 16px)
  const [selectedFontSize, setFontSize] = useState(fontSizes[0]);

  /**
   * Updates the font size dynamically for various elements.
   * Runs whenever the selectedFontSize state changes.
   */
  useEffect(() => {
    // Apply font size to the body element to ensure inheritance
    document.body.style.fontSize = selectedFontSize.size + "px";

    /**
     * Helper function to apply a given font size to all elements matching a selector.
     * 
     * @param {string} selector - CSS selector for target elements
     * @param {string} size - Font size in pixels
     */
    const applyStyleToElement = (selector, size) => {
      const elements = document.querySelectorAll(selector);
      elements.forEach(element => {
        element.style.fontSize = size;
      });
    };

    // Apply the font size to the containers
    applyStyleToElement('.pdf-text-container', selectedFontSize.size + "px");
    applyStyleToElement('#viewer', selectedFontSize.size + "px");
    applyStyleToElement('#bookContent', selectedFontSize.size + "px");
    applyStyleToElement('.pdf-line', selectedFontSize.size + "px");
    applyStyleToElement('.pdf-page-header', selectedFontSize.size + "px");

    /**
     * Applies the font size to the content of all iframes (for EPUB support).
     * This function is wrapped in a try-catch block to handle cross-origin iframe restrictions.
     */
    const applyToIframes = () => {
      const iframes = document.querySelectorAll('iframe');
      iframes.forEach(iframe => {
        try {
          // Get the iframe content
          if (iframe.contentDocument) {
            // Create a style element in the iframe's document
            let style = iframe.contentDocument.getElementById('user-font-size');
            if (!style) {
              style = iframe.contentDocument.createElement('style');
              style.id = 'user-font-size';
              iframe.contentDocument.head.appendChild(style);
            }

            // Apply font size styles to all common text elements
            style.textContent = `
              body, p, div, span, h1, h2, h3, h4, h5, h6, li, td, th {
                font-size: ${selectedFontSize.size}px !important;
              }
            `;
          }
        } catch (e) {
          console.warn('Cannot access iframe content:', e);
        }
      });
    };

    // Apply font size to iframes immediately and after a short delay
    applyToIframes();
    setTimeout(applyToIframes, 500);

    /**
     * Creates or updates a global style element in the document's head.
     * Ensures consistent font size across all specified elements.
     */
    let globalStyle = document.getElementById('global-font-size');
    if (!globalStyle) {
      globalStyle = document.createElement('style');
      globalStyle.id = 'global-font-size';
      document.head.appendChild(globalStyle);
    }

    // Update global styles for font size
    globalStyle.textContent = `
      .pdf-text-container, #viewer, .pdf-line, .pdf-page-header, #bookContent {
        font-size: ${selectedFontSize.size}px !important;
      }
    `;

    // Dispatch a custom event for other components to listen for font size changes
    const event = new CustomEvent('fontSizeChanged', { 
      detail: { size: selectedFontSize.size } 
    });
    window.dispatchEvent(event);

  }, [selectedFontSize]);

  return (
    <select
      id="fontSizeSelector" aria-label="font_size_dropdown"
      onChange={(e) => {
        const selected = fontSizes.find(
          (option) => option.label === e.target.value
        );
        setFontSize(selected);
      }}
      value={selectedFontSize.label}
    >
      {/* Render dropdown options dynamically */}
      {fontSizes.map((option, index) => (
        <option key={index} value={option.label}>
          {option.label}
        </option>
      ))}
    </select>
  );
};

export default FontSizeDropdown;
