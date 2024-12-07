// text to speech
"use client";
import React, { useState } from 'react';

const TextToSpeechArray: React.FC = () => {
  const texts = [
    "What is the difference between `let`, `const`, and `var` in JavaScript?",
    "Explain the box model in CSS and how it affects element sizing.",
    "Describe the different ways to include external CSS files in an HTML document.",
    "What are the different types of selectors in CSS and how are they used?",
    "How can you use JavaScript to dynamically manipulate elements in an HTML document?"
  ];

  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [speechRate, setSpeechRate] = useState<number>(0.8);

  const handleSpeak = () => {
    if (currentIndex >= texts.length) {
      return;
    }
    if ('speechSynthesis' in window) {
      const speech = new SpeechSynthesisUtterance(texts[currentIndex]);
      speech.rate = speechRate;
      window.speechSynthesis.speak(speech);
      setCurrentIndex((prevIndex) => (prevIndex + 1));
    } else {
      alert('Text-to-speech is not supported in your browser.');
    }
  };

  return (
    <div>
      <h2>Text to Speech Array</h2>
      <button onClick={handleSpeak}>Speak Next</button>
    </div>
  );
};

export default TextToSpeechArray;
