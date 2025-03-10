import React, { useState } from "react";
import PdfViewer from "./PdfViewer";
import EpubViewer from "./EpubViewer";
import AudioPlayer from "./AudioPlayer";

/**
 * UploadPage Component
 * 
 * Allows the user to upload and render the file (pdf, epub, audio)
 * and display it on the page.
 */
const UploadPage = () => {
  // State to store the selected file type (pdf, epub, audio)
  const [fileType, setFileType] = useState("");

  // State to store the file URL or ArrayBuffer for rendering
  const [fileUrl, setFileUrl] = useState("");

  /**
   * Handles file input changes and processes the selected file.
   * Determines the file type and reads its content appropriately.
   * 
   * @param {Event} event - The file input change event.
   */
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (!file) return; // Exit if no file is selected

    const fileReader = new FileReader();

    fileReader.onload = (e) => {
      // Prevents potential issues with ArrayBuffer detachment
      const arrayBuffer = e.target.result.slice(0);
      
      // Store the processed file data and determine the file type
      setFileUrl(arrayBuffer);
      setFileType(getFileType(file.name));
    };

    // Read file as appropriate data format based on its extension
    if (file.name.endsWith(".pdf") || file.name.endsWith(".epub")) {
      fileReader.readAsArrayBuffer(file); // PDFs and EPUBs require an ArrayBuffer
    } else if (file.name.endsWith(".mp3")) {
      fileReader.readAsDataURL(file); // MP3 files need to be read as a Data URL
    }
  };

  /**
   * Determines the file type based on the file extension.
   * 
   * @param {string} fileName - The name of the uploaded file.
   * @returns {string} - Returns "pdf", "epub", or "audio" based on the file type.
   */
  const getFileType = (fileName) => {
    const ext = fileName.split(".").pop().toLowerCase();
    if (ext === "pdf") return "pdf";
    if (ext === "epub") return "epub";
    if (ext === "mp3") return "audio";
    return ""; // Return empty string if file type is unsupported
  };

  return (
    <div className="container mx-auto" style={{ maxWidth: "900px", padding: "20px" }}>
      <h1 className="text-center mb-4">Upload E-Books</h1>
      
      {/* File input section */}
      <div className="mb-3 d-flex justify-content-center">
        <div style={{ maxWidth: "500px", width: "100%" }}>
          <input aria-label="upload_ebook_btn" 
            type="file" 
            accept=".pdf,.epub,.mp3" 
            onChange={handleFileChange} 
            className="form-control"
          />
        </div>
      </div>

      {/* Display file status when a file is successfully loaded */}
      {fileUrl && (
        <div className="text-center mb-4">
          <p>File Status: Loaded Successfully</p>
          <p>File Type: {fileType}</p>
        </div>
      )}

      {/* Render appropriate viewer/player based on file type */}
      <div style={{ width: "100%", maxWidth: "900px", margin: "0 auto" }}>
        {fileType === "pdf" && <PdfViewer key={fileUrl} fileUrl={fileUrl} />}
        {fileType === "epub" && <EpubViewer key={fileUrl} fileUrl={fileUrl} />}
        {fileType === "audio" && <AudioPlayer key={fileUrl} fileUrl={fileUrl} />}
      </div>
    </div>
  );
};

export default UploadPage;
