import React, { useState } from "react";
import UploadPage from "./components/UploadPage";
import "./styles.css";
import "./sidebar.css";
import Sidebar from "./components/SideBar";
import FeedBackForm from "./components/FeedBackForm";
import 'bootstrap/dist/css/bootstrap.min.css';
import NavigationBar from "./components/Nav";
// Hamburger icon from react-icons
import { FaBars } from "react-icons/fa"; 

function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
   // Consists of "upload" or "feedback" to determine which component to show
  const [activePage, setActivePage] = useState("upload");
  


  return (
    <div className="app-container" style={{ maxWidth: "100vw", overflow: "hidden" }}>
      <NavigationBar onNavClick={setActivePage}/>
      {/* Conditionally Render UploadPage or Feedback */}
      {activePage === "upload" ? <UploadPage /> : <FeedBackForm />}

      {/* Hamburger Icon */}
      <button
        className="hamburger" aria-label="open_hamburger"
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