// speech to text
"use client";
import React, { useState, useRef } from 'react';

// Declare custom types for SpeechRecognition
declare global {
  interface Window {
    webkitSpeechRecognition: any;
  }
  interface SpeechRecognitionEvent extends Event {
    resultIndex: number;
    results: {
      [key: number]: SpeechRecognitionResult;
    };
  }
}

const AudioToText: React.FC = () => {
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [transcript, setTranscript] = useState<string>('');
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);

  const startRecording = async () => {
    if ('mediaDevices' in navigator && 'webkitSpeechRecognition' in window) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const mediaRecorder = new MediaRecorder(stream);
        mediaRecorderRef.current = mediaRecorder;

        const recognition = new window.webkitSpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = false;
        recognition.lang = 'en-US';

        recognition.onresult = (event: SpeechRecognitionEvent) => {
          const current = event.resultIndex;
          const transcriptText = event.results[current][0].transcript;
          setTranscript((prevTranscript) => prevTranscript + ' ' + transcriptText);
        };

        mediaRecorder.onstart = () => {
          setIsRecording(true);
          recognition.start();
        };

        mediaRecorder.onstop = () => {
          setIsRecording(false);
          recognition.stop();
        };

        mediaRecorder.start();
      } catch (error) {
        console.error('Error accessing microphone:', error);
      }
    } else {
      alert('Audio recording or Speech recognition is not supported in your browser.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  return (
    <div>
      <h2>Audio to Text</h2>

      <button onClick={isRecording ? stopRecording : startRecording}>
        {isRecording ? 'Stop Recording' : 'Start Recording'}
      </button>

      <div>
        <h3>Transcript:</h3>
        <p>{transcript}</p>
      </div>
    </div>
  );
};

export default AudioToText;
