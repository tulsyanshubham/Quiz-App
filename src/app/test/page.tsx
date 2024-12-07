// camera
"use client";
import { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { useAtom } from 'jotai';
import { formDataAtom } from '@/hooks/formData-provider';

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

interface savedResponse {
    question: string;
    answer: string;
}

export default function Camera() {

    const [currentIndex, setCurrentIndex] = useState<number>(0); // current question index
    const [answers, setAnswers] = useState<string[]>([]); // answers to questions
    const [userResponse, setUserResponse] = useState<savedResponse[]>([]); // answers to questions
    const [isRecording, setIsRecording] = useState<boolean>(false); // recording status
    const [speechRate] = useState<number>(0.8); // speech rate
    const recognitionRef = useRef<any>(null); // SpeechRecognition instance
    const mediaRecorderRef = useRef<MediaRecorder | null>(null); // MediaRecorder instance
    const [interimTranscript, setInterimTranscript] = useState<string>(""); // interim speech-to-text transcript
    const [questionText, setQuestionText] = useState<string>(""); // current question text
    const [questions, setQuestions] = useState<string[]>([]); // current question text
    const [formData] = useAtom(formDataAtom);
    const router = useRouter();

    useEffect(() => {
        if(formData.domain === "" || formData.topics.length === 0) {
            router.push('/choosedomain');
        }
        async function fetchQuestion() {
            const response = await axios.post('/api/get_questions', { ...formData });
            console.log(formData);
            console.log(response.data);
            setQuestions(response.data.questions);
        }
        fetchQuestion();
    }, []);

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
                // temp.answer = interimTranscript.trim();  // Save the final interim transcript
                return newAnswers;
            });
            setUserResponse([...userResponse, { question: questions[currentIndex], answer: interimTranscript.trim() }]);

            setInterimTranscript("");  // Reset interim transcript
            setCurrentIndex((prevIndex) => prevIndex + 1);  // Move to the next question
            setQuestionText("");  // Reset question text
        }
    };

    return (
        <div>
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
                        {userResponse.map((data, index) => (
                            <li key={index}>
                                <strong>Question {index + 1}: </strong> {data.question}<br />
                                <strong>Answer: </strong>{data.answer || 'No answer yet'}
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
};

