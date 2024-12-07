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

const QnASpeechComponent: React.FC = () => {
    const questions = [
        "What is the difference between `let`, `const`, and `var` in JavaScript?",
        "Explain the box model in CSS and how it affects element sizing.",
        "Describe the different ways to include external CSS files in an HTML document.",
        "What are the different types of selectors in CSS and how are they used?",
        "How can you use JavaScript to dynamically manipulate elements in an HTML document?"
    ];

    const [currentIndex, setCurrentIndex] = useState<number>(0);
    const [answers, setAnswers] = useState<string[]>([]);
    const [isRecording, setIsRecording] = useState<boolean>(false);
    const [speechRate] = useState<number>(0.8); // You can adjust the speech rate if needed
    const recognitionRef = useRef<any>(null);
    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const [interimTranscript, setInterimTranscript] = useState<string>("");
    const [questionText, setQuestionText] = useState<string>("");

    const handleSpeakAndRecord = async () => {
        if (currentIndex >= questions.length) {
            alert("No more questions.");
            return;
        }

        // Text-to-speech for the current question
        if ('speechSynthesis' in window) {
            setQuestionText(questions[currentIndex]);
            const speech = new SpeechSynthesisUtterance(questions[currentIndex]);
            speech.rate = speechRate;
            window.speechSynthesis.speak(speech);

            speech.onend = async () => {
                // Start recording once the question has been spoken
                if ('mediaDevices' in navigator && 'webkitSpeechRecognition' in window) {
                    try {
                        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
                        const mediaRecorder = new MediaRecorder(stream);
                        mediaRecorderRef.current = mediaRecorder;

                        const recognition = new window.webkitSpeechRecognition();
                        recognitionRef.current = recognition;
                        recognition.continuous = true;
                        recognition.interimResults = true;
                        recognition.lang = 'en-US';

                        recognition.onresult = (event: SpeechRecognitionEvent) => {
                            const transcriptText = Array.from(Object.values(event.results))
                                .map(result => result[0].transcript)
                                .join(' ');
                            setInterimTranscript(transcriptText);  // Store interim results but don't save yet
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
        } else {
            alert('Text-to-speech is not supported in your browser.');
        }
    };

    const stopRecording = () => {
        if (mediaRecorderRef.current && isRecording) {
            mediaRecorderRef.current.stop();

            // When recording stops, save the final transcript as the answer for the current question
            setAnswers((prevAnswers) => {
                const newAnswers = [...prevAnswers];
                newAnswers[currentIndex] = interimTranscript.trim();  // Save the final interim transcript
                return newAnswers;
            });

            setInterimTranscript("");  // Reset interim transcript
            setCurrentIndex((prevIndex) => prevIndex + 1);  // Move to the next question
            setQuestionText("");  // Reset question text
        }
    };

    return (
        <div>
            <h2>Q&A Speech Component</h2>
            <div>
                <p><strong>Current Question:</strong> {questionText}</p>
                <button onClick={isRecording ? stopRecording : handleSpeakAndRecord}>
                    {isRecording ? 'Stop Recording' : 'Speak and Record Answer'}
                </button>
            </div>

            <div>
                <h3>Answers:</h3>
                <ul>
                    {answers.map((answer, index) => (
                        <li key={index}>
                            <strong>Question {index + 1}: </strong> {questions[currentIndex]}<br />
                            <strong>Answer: </strong>{answer || 'No answer yet'}
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default QnASpeechComponent;
