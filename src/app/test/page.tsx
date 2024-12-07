// camera
"use client";
import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useAtom } from "jotai";
import { formDataAtom } from "@/hooks/formData-provider";
import Frame from "@/components/Frame";
import Lottie from "lottie-react";
import loader from "@/assets/white loader.json";
import { TypingAnimation } from "@/components/ui/type-animation";
import { themeAtom } from "@/hooks/theme-provider";

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

interface SavedResponse {
    question: string;
    answer_by_user: string;
}

export default function Camera() {
    const [currentIndex, setCurrentIndex] = useState<number>(0);
    const [userResponses, setUserResponses] = useState<SavedResponse[]>([]);
    const [isRecording, setIsRecording] = useState<boolean>(false);
    const [isSpeaking, setIsSpeaking] = useState<boolean>(false); // New state for speech status
    const [speechRate] = useState<number>(0.8);
    const recognitionRef = useRef<any>(null);
    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const [interimTranscript, setInterimTranscript] = useState<string>("");
    const [questionText, setQuestionText] = useState<string>("");
    const [questions, setQuestions] = useState<string[]>([]);
    const [formData] = useAtom(formDataAtom);
    const router = useRouter();
    const [loading, setLoading] = useState<boolean>(true);

    const [siteTheme] = useAtom(themeAtom);
    useEffect(() => {
        if (siteTheme === "dark") document.body.classList.add("dark");
        else document.body.classList.remove("dark");
        return () => {
            document.body.classList.remove(siteTheme);
        };
    }, [siteTheme]);

    useEffect(() => {
        async function fetchQuestions() {
            setQuestions([
                "What are the different ways to style HTML elements using CSS, and what are the advantages and disadvantages of each method?",
                "Explain the difference between `==` and `===` in JavaScript",
                "Describe the box model in CSS and how it affects element layout",
                "What are semantic HTML5 elements and why are they important?",
                "Explain the concept of closures in JavaScript and provide a simple example",
            ]);
            setLoading(false);
        }
        fetchQuestions();
    }, []);

    const handleSpeakAndRecord = async () => {
        if (currentIndex >= questions.length) {
            alert("All questions completed!");
            return;
        }

        if ("speechSynthesis" in window) {
            setQuestionText(questions[currentIndex]);
            const speech = new SpeechSynthesisUtterance(questions[currentIndex]);
            speech.rate = speechRate;

            setIsSpeaking(true); // Set speaking state to true
            window.speechSynthesis.speak(speech);

            speech.onend = async () => {
                setIsSpeaking(false); // Reset speaking state
                if ("mediaDevices" in navigator && "webkitSpeechRecognition" in window) {
                    try {
                        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
                        const mediaRecorder = new MediaRecorder(stream);
                        mediaRecorderRef.current = mediaRecorder;

                        const recognition = new window.webkitSpeechRecognition();
                        recognitionRef.current = recognition;
                        recognition.continuous = true;
                        recognition.interimResults = true;
                        recognition.lang = "en-US";

                        recognition.onresult = (event: SpeechRecognitionEvent) => {
                            const transcriptText = Array.from(Object.values(event.results))
                                .map((result) => result[0].transcript)
                                .join(" ");
                            setInterimTranscript(transcriptText);
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
                        console.error("Error accessing microphone:", error);
                    }
                } else {
                    alert("Audio recording or speech recognition is not supported in your browser.");
                }
            };
        } else {
            alert("Text-to-speech is not supported in your browser.");
        }
    };

    const stopRecording = () => {
        if (mediaRecorderRef.current && isRecording) {
            mediaRecorderRef.current.stop();
            const answer = interimTranscript.trim();
            const currentQuestion = questions[currentIndex];

            setUserResponses((prevResponses) => [
                ...prevResponses,
                { question: currentQuestion, answer_by_user: answer || "No answer provided" },
            ]);

            setInterimTranscript("");
            setCurrentIndex((prevIndex) => prevIndex + 1);
            setQuestionText("");
        }
    };

    const generateResult = () => {
        // setCurrentIndex(0);
        // setUserResponses([]);
        // setQuestionText("");
        // setInterimTranscript("");
        console.log(userResponses);
    };

    return (
        <div>
            {loading ? (
                <Frame className="justify-center">
                    <Lottie
                        animationData={loader}
                        loop={true}
                        className="w-[80vw] mt-2 md:mt-0 md:w-[35vw] drop-shadow-xl max-w-[400px]"
                    />
                </Frame>
            ) : (
                <Frame className="justify-start">
                    <div className="mb-6 px-8 w-full max-w-5xl">
                        <p className="text-2xl text-center py-2 ">
                            <strong>Progress:</strong> {currentIndex}/{questions.length}
                        </p>
                        <div className="w-full bg-gray-200 rounded-lg h-2 md:h-4 overflow-hidden">
                            <div
                                className="bg-green-500 h-full rounded-lg"
                                style={{ width: `${(currentIndex / questions.length) * 100}%` }}
                            ></div>
                        </div>
                    </div>

                    {currentIndex < questions.length ? (
                        <>
                            <div className="mb-6 text-center">
                                <div className="text-gray-100 text-2xl transition-height duration-1000 min-h-20">
                                    <TypingAnimation
                                        className="text-4xl font-bold text-white dark:text-white"
                                        text={questionText || "Your Question will appear here!"}
                                        duration={40}
                                    />
                                </div>
                            </div>
                            <button
                                onClick={isRecording ? stopRecording : handleSpeakAndRecord}
                                className="text-xl px-8 py-3 mt-4 bg-yellow-500 hover:bg-yellow-600 disabled:bg-yellow-700 rounded-full shadow-lg transition duration-300"
                                disabled={isSpeaking} // Disable button when speaking
                            >
                                {isRecording ? "Stop Recording" : (
                                    <span className={isSpeaking ? "text-gray-300" : "text-white"}>{currentIndex === 0 ? "Start Quiz" : "Next Question"}</span>
                                )}
                            </button>
                        </>
                    ) : (
                        <div className="mt-6 text-center">
                            <div className="text-gray-100 text-2xl transition-height duration-1000 min-h-20">
                                <TypingAnimation
                                    className="text-4xl font-bold text-black dark:text-white"
                                    text={"Quiz Completed!"}
                                    duration={40}
                                />
                            </div>
                            <button
                                onClick={generateResult}
                                className="text-xl px-8 py-3 mt-4 bg-yellow-500 hover:bg-yellow-600 rounded-full shadow-lg transition duration-300"
                            >
                                Generate Result
                            </button>
                        </div>
                    )}

                    {userResponses.length > 0 && <div className="mt-6 max-w-6xl">
                        <h3 className="text-2xl text-center font-semibold mb-4">Responses</h3>
                        <ul className=" pl-6 text-lg">
                            {userResponses.map((response, index) => (
                                <li key={index} className="mb-3">
                                    <strong>Q{index + 1}:</strong> {response.question}
                                    <br />
                                    <strong>Your Answer:</strong> {response.answer_by_user}
                                </li>
                            ))}
                        </ul>
                    </div>}
                </Frame>
            )}
        </div>
    );
}
