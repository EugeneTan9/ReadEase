import React, { useRef } from 'react';

const HighlightText = ({ content, rendition }) => {
  // Use refs instead of state to avoid race conditions
  const lastHighlightedIndexRef = useRef(-1);  // Track the last highlighted word
  const currentIndexRef = useRef(0);

  const wrapWordsInSpans = (content) => {
    const doc = content.document;
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

    // First, collect all text nodes
    while (node = walker.nextNode()) {
      if (node.textContent.trim()) {
        textNodes.push(node);
      }
    }

    // Process each text node and wrap words in spans for highlighting
    textNodes.forEach(textNode => {
      const parent = textNode.parentNode;
      if (!parent) return;

      const text = textNode.textContent;
      const words = text.match(/\S+|\s+/g) || [];
      
      const fragment = doc.createDocumentFragment();
      words.forEach(word => {
        if (word.trim()) {
          // Create span for each word to enable highlighting
          const span = doc.createElement('span');
          span.className = 'epub-word';
          span.textContent = word;
          span.dataset.index = wordIndex++;
          
          fragment.appendChild(span);
          fullText += word + ' ';
        } else {
          // Preserve whitespace to maintain text formatting
          fragment.appendChild(doc.createTextNode(word));
        }
      });

      parent.replaceChild(fragment, textNode);
    });

    return fullText.trim();
  };

  const handleWordHighlight = (word, charIndex, charLength) => {
    if (!rendition || !word) {
      // Clear highlights when no word is being spoken
      rendition?.getContents().forEach(content => {
        const highlights = content.document.querySelectorAll('.highlight');
        highlights.forEach(h => h.classList.remove('highlight'));
      });
      return;
    }

    rendition.getContents().forEach(content => {
      // Clear previous highlights before setting new one
      const highlights = content.document.querySelectorAll('.highlight');
      highlights.forEach(h => h.classList.remove('highlight'));

      // Find all word spans with matching text
      const matchingWords = Array.from(content.document.querySelectorAll('.epub-word'))
        .filter(span => span.textContent.trim() === word.trim());

      if (matchingWords.length > 0) {
        // Find the next word that's after our last highlighted position
        // This ensures we highlight words in sequence even if they appear multiple times
        const nextWord = matchingWords.find(span => {
          const index = parseInt(span.dataset.index);
          // Only consider words after our last highlighted position
          return index > lastHighlightedIndexRef.current;
        });

        if (nextWord) {
          nextWord.classList.add('highlight');
          const newIndex = parseInt(nextWord.dataset.index);
          lastHighlightedIndexRef.current = newIndex;
          currentIndexRef.current = newIndex;
        }
      }
    });
  };

  const processContent = (renditionInstance) => {
    // Get all content from the rendition
    const contents = renditionInstance.getContents();
    if (!contents.length) return "";

    // Process each content section and combine the text
    let fullText = "";
    contents.forEach(content => {
      fullText += wrapWordsInSpans(content) + " ";
    });

    return fullText.trim();
  };

  return {
    handleWordHighlight,
    processContent,
    wrapWordsInSpans
  };
};

export default HighlightText;