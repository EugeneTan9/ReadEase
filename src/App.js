import React, { useState } from "react";
import UploadPage from "./components/UploadPage";
import "./styles.css";
import "./sidebar.css";
import Sidebar from "./components/SideBar";
import FeedBackForm from "./components/FeedBackForm";
import 'bootstrap/dist/css/bootstrap.min.css';
import NavigationBar from "./components/Nav";

import { FaBars } from "react-icons/fa"; // Hamburger icon from react-icons

function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
   // consists of "upload" or "feedback"
  const [activePage, setActivePage] = useState("upload");
  


  return (
    <div>
      <NavigationBar onNavClick={setActivePage}/>
      {/* Conditionally Render UploadPage or Feedback */}
      {activePage === "upload" ? <UploadPage /> : <FeedBackForm />}

      {/* Hamburger Icon */}
      <button
        className="hamburger"
        id="hamburger"
        onClick={() => setIsSidebarOpen(true)}
      >
        <FaBars size={24} />
      </button>
      {/* Sidebar Component */}
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
    </div>
  );
}

export default App;
