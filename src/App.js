import React from "react";
import UploadPage from "./components/UploadPage";
import "./styles.css";

function App() {
  return (
    <div className="app-container" style={{ maxWidth: "100vw", overflow: "hidden" }}>
      <UploadPage />
    </div>
  );
}

export default App;