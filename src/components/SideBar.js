import React from "react";
import "../sidebar.css";
import ColorContrastDropdown from "./ColorContrastDropdown";
import FontSizeDropdown from "./FontSizeDropdown";
import FontStyleDropdown from "./FontStyleDropdown";
// Importing hamburger icon from react-icons
import { FaBars } from "react-icons/fa"; 

/**
 * Sidebar Component
 * 
 * A collapsible sidebar containing UI settings such as color contrast, font size, 
 * and font style adjustments.
 * 
 * @param {boolean} isOpen - Determines whether the sidebar is open or closed.
 * @param {Function} onClose - Callback function to handle closing the sidebar.
 */
const Sidebar = ({ isOpen, onClose }) => {
  return (
    <div id="sidebar" className={`sidebar ${isOpen ? "open" : ""}`}>
      {/* Button to close the sidebar, styled as a hamburger icon */}
      <button id="close-hamburger" aria-label="close_hamburger_icon" className="close-btn" onClick={onClose}>
        <FaBars size={24} />
      </button>

      {/* Sidebar Title */}
      <h3>Settings</h3>

      {/* Sidebar Content: UI Customization Options */}
      <div className="d-grid gap-3">
        {/* Color Theme Section */}
        <div className="border-top">
          <h5 className="p-2">Color Theme</h5>
          <ColorContrastDropdown />
        </div>

        {/* Font Size Section */}
        <div className="border-top">
          <h5 className="p-2">Font Size</h5>
          <FontSizeDropdown />
        </div>

        {/* Font Style Section */}
        <div className="border-top">
          <h5 className="p-2">Font Style</h5>
          <FontStyleDropdown />
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
