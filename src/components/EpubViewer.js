import React, { useEffect, useRef, useState } from "react";
import ePub from "epubjs";
import TextToSpeech from "./TextToSpeech";
import HighlightText from "./HighlightText";

const EpubViewer = ({ fileUrl }) => {
  const viewerRef = useRef(null);
  const bookInstanceRef = useRef(null);
  const [rendition, setRendition] = useState(null);
  const [textContent, setTextContent] = useState("");
  
  // Create highlight text instance
  const highlightText = HighlightText({ rendition });

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
          height: "600px",
        });

        renditionInstance.themes.register("default", {
          ".epub-word": {
            "display": "inline",
          },
          ".highlight": {
            "background-color": "#ffeb3b",
            "border-radius": "3px",
            padding: "0 2px"
          }
        });
        renditionInstance.themes.select("default");

        const processAndSetContent = async () => {
          if (!mounted) return;
          const newTextContent = highlightText.processContent(renditionInstance);
          setTextContent(newTextContent);
        };

        if (mounted) {
          setRendition(renditionInstance);
          await renditionInstance.display();
          await processAndSetContent();
          renditionInstance.on('relocated', processAndSetContent);
        }
      } catch (error) {
        console.error("Error initializing EPUB:", error);
      }
    };

    initializeEpub();

    // Cleanup function
    return () => {
      mounted = false;
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

  // Clear memory when component unmounts
  useEffect(() => {
    return () => {
      if (bookInstanceRef.current) {
        bookInstanceRef.current.destroy();
        bookInstanceRef.current = null;
      }
      if (rendition) {
        rendition.destroy();
      }
    };
  }, []);

  return (
    <div>
      <h2>EPUB Viewer</h2>
      <div ref={viewerRef} id="viewer"></div>
      {rendition && (
        <>
          <button onClick={() => rendition.prev()}>⬅️ Previous</button>
          <button onClick={() => rendition.next()}>Next ➡️</button>
        </>
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