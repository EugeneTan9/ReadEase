import React, { useEffect, useRef, useState } from "react";
import * as pdfjsLib from "pdfjs-dist/build/pdf";
import TextToSpeech from "./TextToSpeech";
import HighlightText from "./HighlightText";

// Set the worker source to load from the `public/` folder
pdfjsLib.GlobalWorkerOptions.workerSrc = `${window.location.origin}/pdf.worker.min.js`;

const PdfViewer = ({ fileUrl }) => {
  const [textContent, setTextContent] = useState("");
  const textContainerRef = useRef(null);
  const [rendition, setRendition] = useState(null);
  const resizeObserverRef = useRef(null);

  // Create a simple rendition-like object for the PDF text container
  const createPdfRendition = () => ({
    getContents: () => [{
      document: textContainerRef.current
    }]
  });

  // Initialize highlighting functionality
  const highlightText = HighlightText({ rendition });

  const processTextContent = (text) => {
    if (!textContainerRef.current) return;

    // Clear existing content
    textContainerRef.current.innerHTML = '';
    
    // Split text into words and create spans
    const words = text.split(/(\s+)/);
    let wordIndex = 0;

    words.forEach(word => {
      if (word.trim()) {
        // Create span for actual words
        const span = document.createElement('span');
        span.className = 'epub-word';
        span.textContent = word;
        span.dataset.index = wordIndex++;
        textContainerRef.current.appendChild(span);
      } else {
        // Preserve whitespace
        const textNode = document.createTextNode(word);
        textContainerRef.current.appendChild(textNode);
      }
    });

    return text;
  };

  useEffect(() => {
    if (!fileUrl) {
      console.log("No file URL provided.");
      return;
    }
    console.log("Received file URL in PdfViewer:", fileUrl);
    extractTextFromPdf(fileUrl);

    // Cleanup
    return () => {
      if (resizeObserverRef.current) {
        resizeObserverRef.current.disconnect();
      }
    };
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

      // Wrap the text content setting in a requestAnimationFrame
      requestAnimationFrame(() => {
        // Process the text content to add word spans
        processTextContent(extractedText);
        setTextContent(extractedText);
        
        // Create rendition after text is processed
        const newRendition = createPdfRendition();
        setRendition(newRendition);
      });
    } catch (error) {
      console.error("Error extracting text from PDF:", error);
    }
  };

  // Add styles for highlighting
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      .epub-word {
        display: inline;
      }
      .highlight {
        background-color: #ffeb3b;
        border-radius: 3px;
        padding: 0 2px;
      }
    `;
    document.head.appendChild(style);

    // Create ResizeObserver for the text container
    if (textContainerRef.current) {
      resizeObserverRef.current = new ResizeObserver(() => {
        // Handle resize if needed
      });
      resizeObserverRef.current.observe(textContainerRef.current);
    }

    return () => {
      document.head.removeChild(style);
      if (resizeObserverRef.current) {
        resizeObserverRef.current.disconnect();
      }
    };
  }, []);

  return (
    <div>
      <div 
        ref={textContainerRef}
        className="text-center overflow-auto" 
        style={{ 
          whiteSpace: "pre-wrap", 
          padding: "10px",
          maxHeight: "600px" // Add a max height to control scrolling
        }}
      >
        {!textContent && "Loading text..."}
      </div>
      {/* Render TextToSpeech component only if there is text content */}
      {textContent && rendition && (
        <TextToSpeech 
          text={textContent} 
          onWordSpoken={highlightText.handleWordHighlight}
        />
      )}
    </div>
  );
};

export default PdfViewer;