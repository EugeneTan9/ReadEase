import React, { useState } from "react";
import PdfViewer from "./PdfViewer";
import EpubViewer from "./EpubViewer";
import AudioPlayer from "./AudioPlayer";

const UploadPage = () => {
  console.log("📂 UploadPage Rendered - Checking if fileUrl is causing re-mount"); // Debug log

  const [fileType, setFileType] = useState("");
  const [fileUrl, setFileUrl] = useState("");

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    console.log("Selected file:", file);
    console.log("File type detected:", getFileType(file.name));

    const fileReader = new FileReader();

    fileReader.onload = (e) => {
      console.log("File successfully read.");
      const arrayBuffer = e.target.result.slice(0); // Prevents ArrayBuffer detachment
      setFileUrl(arrayBuffer);
      setFileType(getFileType(file.name));
    };

    if (file.name.endsWith(".pdf") || file.name.endsWith(".epub")) {
      fileReader.readAsArrayBuffer(file);
    } else if (file.name.endsWith(".mp3")) {
      fileReader.readAsDataURL(file);
    }
  };

  const getFileType = (fileName) => {
    const ext = fileName.split(".").pop().toLowerCase();
    if (ext === "pdf") return "pdf";
    if (ext === "epub") return "epub";
    if (ext === "mp3") return "audio";
    return "";
  };

  return (
    <div className="container mx-auto" style={{ maxWidth: "900px", padding: "20px" }}>
      <h1 className="text-center mb-4">Upload E-Books</h1>
      
      <div className="mb-3 d-flex justify-content-center">
        <div style={{ maxWidth: "500px", width: "100%" }}>
          <input 
            type="file" 
            accept=".pdf,.epub,.mp3" 
            onChange={handleFileChange} 
            className="form-control"
          />
        </div>
      </div>

      {fileUrl && (
        <div className="text-center mb-4">
          <p>File Status: Loaded Successfully</p>
          <p>File Type: {fileType}</p>
        </div>
      )}

      <div style={{ width: "100%", maxWidth: "900px", margin: "0 auto" }}>
        {fileType === "pdf" && <PdfViewer key={fileUrl} fileUrl={fileUrl} />}
        {fileType === "epub" && <EpubViewer key={fileUrl} fileUrl={fileUrl} />}
        {fileType === "audio" && <AudioPlayer key={fileUrl} fileUrl={fileUrl} />}
      </div>
    </div>
  );
};

export default UploadPage;