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
  const [isLoading, setIsLoading] = useState(true);

  // Create a simple rendition-like object for the PDF text container
  const createPdfRendition = () => ({
    getContents: () => [{
      document: textContainerRef.current
    }]
  });

  // Initialize highlighting functionality
  const highlightText = HighlightText({ rendition });

  // Process all pages of text content to create structured DOM
  const processTextContent = (pagesContent) => {
    if (!textContainerRef.current || !pagesContent || pagesContent.length === 0) {
      return "";
    }

    // Clear existing content
    textContainerRef.current.innerHTML = '';
    let fullText = "";
    let wordIndex = 0;
    
    // Process each page in order
    pagesContent.forEach((pageData, pageIndex) => {
      const { pageNum, textItems } = pageData;
      
      // Add page header/separator
      const pageHeader = document.createElement('div');
      pageHeader.className = 'pdf-page-header';
      pageHeader.textContent = `Page ${pageNum}`;
      textContainerRef.current.appendChild(pageHeader);
      
      // Add to full text for TTS
      if (pageIndex > 0) {
        fullText += `\n\nPage ${pageNum}:\n\n`;
      } else {
        fullText += `Page ${pageNum}:\n\n`;
      }
      
      // Group text items by line based on vertical position
      const lines = groupItemsByYPosition(textItems);
      
      // Create container for this page's content
      const pageContainer = document.createElement('div');
      pageContainer.className = 'pdf-page';
      pageContainer.dataset.pageNum = pageNum;
      
      // Process each line in this page
      lines.forEach(line => {
        const lineDiv = document.createElement('div');
        lineDiv.className = 'pdf-line';
        
        // Sort items within line by x-position
        line.sort((a, b) => {
          const xA = a.transform ? a.transform[4] : 0;
          const xB = b.transform ? b.transform[4] : 0;
          return xA - xB;
        });
        
        // Combine all text in this line
        const lineText = line.map(item => item.str).join(" ");
        const words = lineText.split(/(\s+)/);
        
        // Create word spans for highlighting
        words.forEach(word => {
          if (word.trim()) {
            // Create span for actual words
            const span = document.createElement('span');
            span.className = 'epub-word';
            span.textContent = word;
            span.dataset.index = wordIndex++;
            span.dataset.page = pageNum;
            lineDiv.appendChild(span);
            fullText += word + ' ';
          } else if (word) {
            // Preserve whitespace
            const textNode = document.createTextNode(word);
            lineDiv.appendChild(textNode);
          }
        });
        
        // Add the line to the page container
        pageContainer.appendChild(lineDiv);
        fullText += '\n';
      });
      
      // Add this page's content to the main container
      textContainerRef.current.appendChild(pageContainer);
    });

    return fullText;
  };

  // Group text items by vertical position to form lines
  const groupItemsByYPosition = (textItems) => {
    if (!textItems || textItems.length === 0) return [];
    
    // Sort items by vertical position
    const sortedItems = [...textItems].sort((a, b) => {
      const yA = a.transform ? a.transform[5] : 0;
      const yB = b.transform ? b.transform[5] : 0;
      return yB - yA; // Reverse order because PDF coordinates start from bottom
    });

    const lines = [];
    let currentLine = [];
    let previousY = null;
    const yThreshold = 3; // Threshold to determine if items are on the same line
    
    // Group items into lines
    sortedItems.forEach(item => {
      const y = item.transform ? item.transform[5] : 0;
      
      if (previousY === null || Math.abs(y - previousY) > yThreshold) {
        if (currentLine.length > 0) {
          lines.push([...currentLine]);
        }
        currentLine = [item];
      } else {
        currentLine.push(item);
      }
      
      previousY = y;
    });
    
    // Add the last line if it has items
    if (currentLine.length > 0) {
      lines.push(currentLine);
    }
    
    return lines;
  };

  useEffect(() => {
    if (!fileUrl) {
      console.log("No file URL provided.");
      return;
    }
    
    console.log("Received file URL in PdfViewer:", fileUrl);
    setIsLoading(true);
    extractTextFromPdf(fileUrl);

    // No need for resize observer - removing it to prevent resize loops
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
      console.log("PDF loaded successfully, pages:", pdf.numPages);
      
      // Array to hold the content of each page
      const pagesContent = [];
      let plainTextContent = "";

      // Process pages SEQUENTIALLY to maintain order
      for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
        console.log(`Processing page ${pageNum}...`);
        const page = await pdf.getPage(pageNum);
        const textContent = await page.getTextContent();
        
        // Add page data to our array
        pagesContent.push({
          pageNum,
          textItems: textContent.items
        });
        
        // Build plain text version for TTS
        if (pageNum > 1) {
          plainTextContent += `\n\nPage ${pageNum}:\n\n`;
        } else {
          plainTextContent += `Page ${pageNum}:\n\n`;
        }
        plainTextContent += textContent.items.map(item => item.str).join(" ") + "\n";
      }

      // Process text content inside requestAnimationFrame for better performance
      requestAnimationFrame(() => {
        // Process the structured page content
        const processedText = processTextContent(pagesContent);
        
        // Store the plain text for TTS
        setTextContent(plainTextContent);
        
        // Create rendition object for highlighting
        const newRendition = createPdfRendition();
        setRendition(newRendition);
        setIsLoading(false);
      });
    } catch (error) {
      console.error("Error extracting text from PDF:", error);
      setIsLoading(false);
    }
  };

  // Add styles for highlighting and structure
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      .pdf-page-header {
        font-weight: bold;
        border-bottom: 1px solid #ccc;
        margin: 20px 0 10px 0;
        padding-bottom: 5px;
      }
      .pdf-page {
        margin-bottom: 20px;
      }
      .pdf-line {
        display: block;
        text-align: left;
        margin-bottom: 4px;
        line-height: 1.5;
      }
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

    return () => {
      document.head.removeChild(style);
    };
  }, []);

  return (
    <div className="container mx-auto" style={{ maxWidth: "800px" }}>
      <div 
        ref={textContainerRef}
        className="pdf-text-container" 
        style={{ 
          padding: "20px",
          height: "500px",
          maxHeight: "500px",
          overflowY: "auto",
          backgroundColor: "#fff",
          border: "1px solid #ddd",
          borderRadius: "4px",
          width: "100%"
        }}
      >
        {isLoading && "Loading text..."}
      </div>
      
      {/* Render TextToSpeech component only if there is text content */}
      {textContent && rendition && (
        <div style={{ maxWidth: "800px" }}>
          <TextToSpeech 
            text={textContent} 
            onWordSpoken={highlightText.handleWordHighlight}
          />
        </div>
      )}
    </div>
  );
};

export default PdfViewer;