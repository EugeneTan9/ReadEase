import React, { useEffect, useRef, useState } from "react";
import * as pdfjsLib from "pdfjs-dist/build/pdf";
import TextToSpeech from "./TextToSpeech";

// Set the worker source to load from the `public/` folder
pdfjsLib.GlobalWorkerOptions.workerSrc = `${window.location.origin}/pdf.worker.min.js`;

const PdfViewer = ({ fileUrl }) => {
  const [textContent, setTextContent] = useState("");

  useEffect(() => {
    if (!fileUrl) {
      console.log("No file URL provided.");
      return;
    }
    console.log("Received file URL in PdfViewer:", fileUrl);
    extractTextFromPdf(fileUrl);
  }, [fileUrl]);

  const extractTextFromPdf = async (fileData) => {
    try {
      console.log("Extracting text from PDF:", fileData);
      if (!fileData) return;

      // Convert ArrayBuffer to Uint8Array
      const pdfData = new Uint8Array(fileData.slice(0));
      const loadingTask = pdfjsLib.getDocument({ data: pdfData });
      console.log("Loading task created:", loadingTask);

      const pdf = await loadingTask.promise;
      console.log("PDF loaded successfully:", pdf);

      let extractedText = "";
      for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
        const page = await pdf.getPage(pageNum);
        const textContent = await page.getTextContent();
        
        // Convert text content into readable format
        const pageText = textContent.items.map(item => item.str).join(" ");
        extractedText += `\nPage ${pageNum}:\n${pageText}\n`;
      }

      setTextContent(extractedText);
      console.log("Extracted PDF text:", extractedText);
    } catch (error) {
      console.error("Error extracting text from PDF:", error);
    }
  };

  return (
    <div>
      <div className="text-center" style={{ whiteSpace: "pre-wrap", padding: "10px"}}>
        {textContent || "Loading text..."}
      </div>
      {/* Render .TextToSpeech component only if there is text content */}
      {textContent && <TextToSpeech text={textContent} />}
    </div>
  );
};

export default PdfViewer;
