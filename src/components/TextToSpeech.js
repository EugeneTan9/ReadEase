import React, { useState, useEffect } from 'react';
import { Play, Pause, Square } from 'lucide-react';

/**
 * TextToSpeech Component
 * 
 * This component utilizes the Web Speech API to convert text to speech, allowing 
 * users to control playback, adjust voice settings, and track spoken words.
 * 
 * @param {string} text - The text to be converted into speech.
 * @param {Function} onWordSpoken - Callback function triggered when a word is spoken.
 */
const TextToSpeech = ({ text, onWordSpoken }) => {
  const [isPaused, setIsPaused] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [utterance, setUtterance] = useState(null);
  const [voice, setVoice] = useState(null);
  const [pitch, setPitch] = useState(1);
  const [speed, setSpeed] = useState(1);
  const [volume, setVolume] = useState(1);

  useEffect(() => {
    // Initialize speech synthesis and retrieve available voices
    const synth = window.speechSynthesis;
    const updateVoices = () => {
      const voices = synth.getVoices();
      if (voices.length > 0) {
        setVoice(voices[0]); // Set the first available voice as default
      }
    };

    // Handle asynchronous voice loading in Chrome
    if (speechSynthesis.onvoiceschanged !== undefined) {
      speechSynthesis.onvoiceschanged = updateVoices;
    }
    updateVoices();

    // Cleanup function to stop any ongoing speech on component unmount
    return () => {
      if (utterance) {
        synth.cancel();
      }
    };
  }, []);

  useEffect(() => {
    // Create a new SpeechSynthesisUtterance instance whenever text or settings change
    if (text) {
      const newUtterance = new SpeechSynthesisUtterance(text);
      newUtterance.voice = voice;
      newUtterance.pitch = pitch;
      newUtterance.rate = speed;
      newUtterance.volume = volume;

      // Trigger callback for highlighting words as they are spoken
      newUtterance.onboundary = (event) => {
        if (event.name === 'word') {
          const word = text.slice(event.charIndex, event.charIndex + event.charLength);
          onWordSpoken(word, event.charIndex, event.charLength);
        }
      };

      // Reset playback states when speech ends
      newUtterance.onend = () => {
        setIsPlaying(false);
        setIsPaused(false);
        onWordSpoken('', 0, 0); // Clear word highlight
      };

      // Update playback states based on speech synthesis events
      newUtterance.onpause = () => setIsPaused(true);
      newUtterance.onresume = () => setIsPaused(false);
      newUtterance.onstart = () => setIsPlaying(true);

      setUtterance(newUtterance);
    }
  }, [text, voice, pitch, speed, volume]);

  /**
   * Handles play, pause, and resume functionality for text-to-speech.
   */
  const togglePlayPause = () => {
    const synth = window.speechSynthesis;

    if (isPlaying) {
      synth.pause();
      setIsPaused(true);
      setIsPlaying(false);
    } else if (isPaused) {
      synth.resume();
      setIsPaused(false);
      setIsPlaying(true);
    } else {
      synth.cancel(); // Ensure no overlapping speech instances
      synth.speak(utterance);
    }
  };

  /**
   * Stops speech playback and resets relevant states.
   */
  const handleStop = () => {
    const synth = window.speechSynthesis;
    synth.cancel();
    setIsPlaying(false);
    setIsPaused(false);
    onWordSpoken('', 0, 0); // Clear word highlight
  };

  /**
   * Updates the selected voice for speech synthesis.
   */
  const handleVoiceChange = (event) => {
    const voices = window.speechSynthesis.getVoices();
    setVoice(voices[event.target.value]);
  };

  return (
    <div className="border p-4">
      <h3 className="mb-4">Text to Speech Controls</h3>
      
      {/* Playback Controls */}
      <div className="mb-4 d-flex gap-2">
        <button 
          onClick={togglePlayPause}
          style={{width: 200, height: 100, backgroundColor: '#0C090A'}}
          className="btn rounded text-white"
        >
          {isPlaying ? <Pause size={80} /> : <Play size={80} />}
        </button>
        
        <button 
          onClick={handleStop}
          style={{width: 200, height: 100, backgroundColor: '#0C090A'}}
          className="btn rounded text-white"
        >
          <Square size={80} />
        </button>
      </div>

      {/* Voice Selection Dropdown */}
      <div className="mb-4">
        <label className="d-block mb-2">Voice:</label>
        <select onChange={handleVoiceChange} className="form-select">
          {window.speechSynthesis.getVoices().map((voice, index) => (
            <option key={voice.name} value={index}>
              {voice.name}
            </option>
          ))}
        </select>
      </div>

      {/* Speech Speed Control */}
      <div className="mb-4">
        <label className="d-block mb-2">Speed: {speed}</label>
        <input 
          type="range" 
          min="0.1" 
          max="10" 
          step="0.1" 
          value={speed}
          onChange={(e) => setSpeed(parseFloat(e.target.value))}
          className="form-range"
        />
      </div>

      {/* Speech Pitch Control */}
      <div className="mb-4">
        <label className="d-block mb-2">Pitch: {pitch}</label>
        <input 
          type="range" 
          min="0" 
          max="2" 
          step="0.1" 
          value={pitch}
          onChange={(e) => setPitch(parseFloat(e.target.value))}
          className="form-range"
        />
      </div>

      {/* Speech Volume Control */}
      <div className="mb-4">
        <label className="d-block mb-2">Volume: {volume}</label>
        <input 
          type="range" 
          min="0" 
          max="1" 
          step="0.01" 
          value={volume}
          onChange={(e) => setVolume(parseFloat(e.target.value))}
          className="form-range"
        />
      </div>
    </div>
  );
};

export default TextToSpeech;
