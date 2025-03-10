import React, { useRef } from 'react';

/**
 * HighlightText Component
 * 
 * A karaoke style highlights for the word that is being spoken of
 * when using text-to-speech.
 */
const HighlightText = ({ content, rendition }) => {
  // Use refs instead of state to avoid unnecessary re-renders and race conditions
  const lastHighlightedIndexRef = useRef(-1);  // Tracks the last highlighted word to ensure sequential highlighting
  const currentIndexRef = useRef(0);  // Keeps track of the current index of the word being highlighted

  /**
   * Wraps each word in the given EPUB document content with a `<span>` element.
   * This allows for individual words to be highlighted dynamically during speech playback.
   * 
   * @param {Document} content - The EPUB document's content.
   * @returns {string} - The full text of the document after processing.
   */
  const wrapWordsInSpans = (content) => {
    const doc = content.document;
    
    // Create a tree walker to traverse text nodes within the document body
    const walker = doc.createTreeWalker(
      doc.body,
      NodeFilter.SHOW_TEXT,
      null,
      false
    );

    let fullText = "";
    let textNodes = [];
    let node;
    let wordIndex = 0;

    // Collect all text nodes from the document
    while ((node = walker.nextNode())) {
      if (node.textContent.trim()) {
        textNodes.push(node);
      }
    }

    // Process each text node and wrap words in spans for highlighting
    textNodes.forEach(textNode => {
      const parent = textNode.parentNode;
      if (!parent) return;

      const text = textNode.textContent;
      const words = text.match(/\S+|\s+/g) || [];  // Split text into words and spaces
      
      const fragment = doc.createDocumentFragment();
      words.forEach(word => {
        if (word.trim()) {
          // Create a span for each word to enable highlighting
          const span = doc.createElement('span');
          span.className = 'epub-word';
          span.textContent = word;
          span.dataset.index = wordIndex++;  // Assign a unique index to each word
          
          fragment.appendChild(span);
          fullText += word + ' ';
        } else {
          // Preserve whitespace to maintain the original text structure
          fragment.appendChild(doc.createTextNode(word));
        }
      });

      parent.replaceChild(fragment, textNode);
    });

    return fullText.trim();
  };

  /**
   * Highlights the currently spoken word in the EPUB content.
   * Ensures that words are highlighted in sequence even if they appear multiple times in the text.
   * 
   * @param {string} word - The word currently being spoken.
   * @param {number} charIndex - The character index of the spoken word.
   * @param {number} charLength - The length of the spoken word.
   */
  const handleWordHighlight = (word, charIndex, charLength) => {
    if (!rendition || !word) {
      // Clear all highlights if no word is currently being spoken
      rendition?.getContents().forEach(content => {
        const highlights = content.document.querySelectorAll('.highlight');
        highlights.forEach(h => h.classList.remove('highlight'));
      });

      // Reset tracking indexes to restart highlighting from the beginning
      lastHighlightedIndexRef.current = -1;
      currentIndexRef.current = 0;
      
      return;
    }

    rendition.getContents().forEach(content => {
      // Remove previous highlights before applying new ones
      const highlights = content.document.querySelectorAll('.highlight');
      highlights.forEach(h => h.classList.remove('highlight'));

      // Retrieve all words wrapped in <span> elements
      const matchingWords = Array.from(content.document.querySelectorAll('.epub-word'))
        .filter(span => span.textContent.trim() === word.trim());

      if (matchingWords.length > 0) {
        // Find the next occurrence of the word that hasn't been highlighted yet
        const nextWord = matchingWords.find(span => {
          const index = parseInt(span.dataset.index);
          return index > lastHighlightedIndexRef.current;  // Ensure sequential highlighting
        });

        if (nextWord) {
          nextWord.classList.add('highlight');  // Apply highlighting class
          const newIndex = parseInt(nextWord.dataset.index);
          lastHighlightedIndexRef.current = newIndex;
          currentIndexRef.current = newIndex;
        }
      }
    });
  };

  /**
   * Processes the EPUB rendition and applies word-wrapping for highlighting support.
   * 
   * @param {Object} renditionInstance - The EPUB.js rendition instance.
   * @returns {string} - The full processed text of the EPUB.
   */
  const processContent = (renditionInstance) => {
    const contents = renditionInstance.getContents();
    if (!contents.length) return "";

    // Apply word wrapping and collect the processed text
    let fullText = "";
    contents.forEach(content => {
      fullText += wrapWordsInSpans(content) + " ";
    });

    return fullText.trim();
  };

  // Return functions to be used externally in the parent component
  return {
    handleWordHighlight,
    processContent,
    wrapWordsInSpans
  };
};

export default HighlightText;
