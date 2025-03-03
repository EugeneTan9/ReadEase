import React from "react";
import "../sidebar.css";
import ColorContrastDropdown from "./ColorContrastDropdown";
import FontSizeDropdown from "./FontSizeDropdown";
import FontStyleDropdown from "./FontStyleDropdown";
// Hamburger icon from react-icons
import { FaBars } from "react-icons/fa"; 
const Sidebar = ({ isOpen, onClose }) => {
  return (
    <div id="sidebar" className={`sidebar ${isOpen ? "open" : ""}`}>
      <button id="close-hamburger" className="close-btn" onClick={onClose}>
        <FaBars size={24} />
      </button>
      <h3>Settings</h3>

      <div className="d-grid gap-3">
        <div className="border-top">
          <h5 className="p-2">Color Theme</h5>
          <ColorContrastDropdown />
        </div>

        <div className="border-top">
          <h5 className="p-2">Font Size</h5>
          <FontSizeDropdown />
        </div>

        <div className="border-top">
          <h5 className="p-2">Font Style</h5>
          <FontStyleDropdown />
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
