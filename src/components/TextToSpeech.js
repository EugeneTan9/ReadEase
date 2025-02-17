import React, { useState, useEffect } from 'react';
import { Play, Pause, Square } from 'lucide-react';

const TextToSpeech = ({ text }) => {
  const [isPaused, setIsPaused] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [utterance, setUtterance] = useState(null);
  const [voice, setVoice] = useState(null);
  const [pitch, setPitch] = useState(1);
  const [speed, setSpeed] = useState(1);
  const [volume, setVolume] = useState(1);

  useEffect(() => {
    // Initialize speech synthesis and get available voices
    const synth = window.speechSynthesis;
    const updateVoices = () => {
      const voices = synth.getVoices();
      setVoice(voices[0]); // Set default voice
    };

    // Chrome loads voices asynchronously
    if (speechSynthesis.onvoiceschanged !== undefined) {
      speechSynthesis.onvoiceschanged = updateVoices;
    }
    updateVoices();

    // Cleanup
    return () => {
      if (utterance) {
        synth.cancel();
      }
    };
  }, []);

  useEffect(() => {
    // Create new utterance when text changes
    if (text) {
      const newUtterance = new SpeechSynthesisUtterance(text);
      newUtterance.voice = voice;
      newUtterance.pitch = pitch;
      newUtterance.rate = speed; // Changed from speed to rate
      newUtterance.volume = volume;

      newUtterance.onend = () => {
        setIsPlaying(false);
        setIsPaused(false);
      };

      newUtterance.onpause = () => setIsPaused(true);
      newUtterance.onresume = () => setIsPaused(false);
      newUtterance.onstart = () => setIsPlaying(true);

      setUtterance(newUtterance);
    }
  }, [text, voice, pitch, speed, volume]);

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
      synth.cancel(); // Cancel any ongoing speech
      synth.speak(utterance);
    }
  };

  const handleStop = () => {
    const synth = window.speechSynthesis;
    synth.cancel();
    setIsPlaying(false);
    setIsPaused(false);
  };

  const handleVoiceChange = (event) => {
    const voices = window.speechSynthesis.getVoices();
    setVoice(voices[event.target.value]);
  };

  return (
    <div className="card p-4">
      <h3 className="mb-4">Text to Speech Controls</h3>
      
      <div className="mb-4 d-flex gap-2">
        <button 
          onClick={togglePlayPause}
        //   Custom size and background color
          style={{width: 200, height: 100, backgroundColor: '#0C090A'}}
          className="btn rounded text-white"
        >
          {isPlaying ? <Pause size={80} /> : <Play size={80} />}
        </button>
        
        <button 
          onClick={handleStop}
          //   Custom size and background color
          style={{width: 200, height: 100, backgroundColor: '#0C090A'}}
          className="btn rounded text-white"
        >
          <Square size={80} />
        </button>
      </div>

      <div className="mb-4">
        <label className="d-block mb-2">Voice:</label>
        <select 
          onChange={handleVoiceChange}
          className="form-select"
        >
          {window.speechSynthesis.getVoices().map((voice, index) => (
            <option key={voice.name} value={index}>
              {voice.name}
            </option>
          ))}
        </select>
      </div>

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