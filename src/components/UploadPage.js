import React, { useState } from "react";
import PdfViewer from "./PdfViewer";
import EpubViewer from "./EpubViewer";
import AudioPlayer from "./AudioPlayer";

const UploadPage = ({ backgroundColor, textColor }) => {
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
    <div>
      <h1 className="text-center">Upload E-Books</h1>
      <input type="file" accept=".pdf,.epub,.mp3" onChange={handleFileChange} />

      <p>File URL: {fileUrl ? "Loaded Successfully" : "Not Loaded"}</p>
      <p>File Type: {fileType}</p>

      {fileType === "pdf" && <PdfViewer key={fileUrl} fileUrl={fileUrl} />}
      {fileType === "epub" && <EpubViewer key={fileUrl} fileUrl={fileUrl} />}
      {fileType === "audio" && <AudioPlayer key={fileUrl} fileUrl={fileUrl} />}
    </div>
  );
};

export default UploadPage;
