import React, { useState } from "react";
import UploadPage from "./components/UploadPage";
import ColorContrastDropdown from "./components/ColorContrastDropdown";
import "./styles.css";

function App() {
  const [theme, setTheme] = useState({ background: "#000000", text: "#FFFFFF" });

  return (
    <div>
      <UploadPage backgroundColor={theme.background} textColor={theme.text}/>
      <ColorContrastDropdown onChange={setTheme} />
    </div>
  );
}

export default App;
