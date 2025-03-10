import React, { useEffect, useRef, useState } from "react";
import ePub from "epubjs";
import TextToSpeech from "./TextToSpeech";
import HighlightText from "./HighlightText";

/**
 * EpubViewer Component
 * 
 * This component renders an EPUB file using epub.js, applies dynamic color themes,
 * and integrates text highlighting and text-to-speech functionality.
 */
const EpubViewer = ({ fileUrl }) => {
  const viewerRef = useRef(null);
  const bookInstanceRef = useRef(null);
  const [rendition, setRendition] = useState(null);
  const [textContent, setTextContent] = useState("");
  
  // Create highlight text instance
  const highlightText = HighlightText({ rendition });

  /**
   * Function to apply the current color theme to the EPUB content.
   * Retrieves the colors from the main document and applies them to the EPUB rendering.
   * 
   * @param {Object} renditionInstance - The epub.js rendition instance.
   */
  const applyColorTheme = (renditionInstance) => {
    if (!renditionInstance) return;
    
    // Get current theme from body (set by ColorContrastDropdown)
    const body_bg_color = getComputedStyle(document.body).backgroundColor;
    const body_text_color = getComputedStyle(document.body).color;
    
    // Register and apply theme
    renditionInstance.themes.register("user-theme", {
      "body": {
        "background-color": `${body_bg_color} !important`,
        "color": `${body_text_color} !important`
      },
      "p, div, span, h1, h2, h3, h4, h5, h6": {
        "color": `${body_text_color} !important`
      },
      ".epub-word": {
        "display": "inline",
      },
      ".highlight": {
        "background-color": "#ffeb3b !important",
        "border-radius": "3px",
        "padding": "0 2px",
        "color": "#000 !important"
      }
    });
    
    renditionInstance.themes.select("user-theme");
  };

  useEffect(() => {
    let mounted = true;

    const initializeEpub = async () => {
      if (!fileUrl) return;

      // Clean up previous instance
      if (bookInstanceRef.current) {
        bookInstanceRef.current.destroy();
        bookInstanceRef.current = null;
      }

      try {
        const book = ePub(fileUrl);
        if (!mounted) {
          book.destroy();
          return;
        }

        bookInstanceRef.current = book;

        const renditionInstance = book.renderTo(viewerRef.current, {
          width: "100%",
          height: "500px",
          allowScriptedContent: true, // Allow scripts for style injection
        });

        // Apply initial theme
        applyColorTheme(renditionInstance);

        /**
         * Process and set content for text-to-speech and highlighting.
         */
        const processAndSetContent = async () => {
          if (!mounted) return;
          const newTextContent = highlightText.processContent(renditionInstance);
          setTextContent(newTextContent);
          
          // Re-apply theme when content changes
          applyColorTheme(renditionInstance);
        };

        if (mounted) {
          setRendition(renditionInstance);
          await renditionInstance.display();
          await processAndSetContent();
          renditionInstance.on('relocated', processAndSetContent);
          
          // Watch for style changes to dynamically update the theme
          const observer = new MutationObserver(() => {
            applyColorTheme(renditionInstance);
          });
          
          observer.observe(document.body, {
            attributes: true, 
            attributeFilter: ['style']
          });
        }
      } catch (error) {
        console.error("Error initializing EPUB:", error);
      }
    };

    initializeEpub();

    /**
     * Event listener to reapply colors when the EPUB iframe loads.
     */
    const handleIframeLoad = () => {
      setTimeout(() => applyColorTheme(rendition), 100);
    };
    
    window.addEventListener('message', handleIframeLoad);

    // Cleanup function to properly destroy instances and remove event listeners
    return () => {
      mounted = false;
      window.removeEventListener('message', handleIframeLoad);
      if (bookInstanceRef.current) {
        bookInstanceRef.current.destroy();
        bookInstanceRef.current = null;
      }
      if (rendition) {
        rendition.destroy();
      }
      setRendition(null);
      setTextContent("");
    };
  }, [fileUrl]);

  return (
    <div className="container mx-auto" style={{ maxWidth: "800px" }}>
      <h2>EPUB Viewer</h2>
      <div 
        ref={viewerRef} 
        id="viewer" 
        style={{ 
          width: "100%", 
          maxWidth: "800px", 
          backgroundColor: "inherit",
          color: "inherit"
        }}
      ></div>
      
      {rendition && (
        <div style={{ marginTop: "10px", marginBottom: "10px" }}>
          <button onClick={() => rendition.prev()} style={{ marginRight: "10px" }}>⬅️ Previous</button>
          <button onClick={() => rendition.next()}>Next ➡️</button>
        </div>
      )}
      
      {textContent && rendition && (
        <TextToSpeech 
          text={textContent}
          onWordSpoken={highlightText.handleWordHighlight}
        />
      )}
    </div>
  );
};

export default EpubViewer;
