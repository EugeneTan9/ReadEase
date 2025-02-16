import React, { useEffect, useRef, useState } from "react";
import ePub from "epubjs";

const EpubViewer = ({ fileUrl }) => {
  const viewerRef = useRef(null);
  const bookInstanceRef = useRef(null); // Keeps track of book instance
  const [rendition, setRendition] = useState(null);

  useEffect(() => {
    if (!fileUrl) return;

    console.log("📂 Received EPUB Blob URL:", fileUrl);

    // 🛑 Prevent double rendering: Check if book is already loaded
    if (bookInstanceRef.current) {
      console.log("🗑 Clearing previous EPUB content...");
      bookInstanceRef.current.destroy();
      bookInstanceRef.current = null;
    }

    // Initialize a new book only if needed
    const book = ePub(fileUrl);
    bookInstanceRef.current = book; // Save the book instance
    console.log("📖 EPUB Book Instance:", book);

    const renditionInstance = book.renderTo(viewerRef.current, {
      width: "100%",
      height: "600px",
    });

    setRendition(renditionInstance);
    renditionInstance.display(); // Show first page

    console.log("✅ EPUB is fully loaded.");

    return () => {
      console.log("🗑 Cleaning up EPUB instance...");
      renditionInstance.destroy();
      setRendition(null);
    };
  }, [fileUrl]);

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
    </div>
  );
};

export default EpubViewer;
