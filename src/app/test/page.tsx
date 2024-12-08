// camera
"use client";
import { Fragment, useEffect, useRef, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useAtom } from "jotai";
import { formDataAtom } from "@/hooks/formData-provider";
import Frame from "@/components/Frame";
import Lottie from "lottie-react";
import loader from "@/assets/white loader.json";
import smallLoader from "@/assets/loader.gif";
import { TypingAnimation } from "@/components/ui/type-animation";
import { themeAtom } from "@/hooks/theme-provider";
import { resultDataAtom } from "@/hooks/result-provider";
import Image from "next/image";

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
    const [fetchedResult, setFetchedResult] = useAtom(resultDataAtom);
    const [isGeneratingResult, setIsGeneratingResult] = useState<boolean>(false);
    const [resultGenerated, setResultGenerated] = useState<boolean>(false);

    const [siteTheme] = useAtom(themeAtom);
    useEffect(() => {
        if (siteTheme === "dark") document.body.classList.add("dark");
        else document.body.classList.remove("dark");
        return () => {
            document.body.classList.remove(siteTheme);
        };
    }, [siteTheme]);

    useEffect(() => {
        if (formData.domain === "" || formData.topics.length === 0) {
            router.push("/choosedomain");
        }
        async function fetchQuestions() {
            const response = await axios.post("/api/get_questions", { ...formData });
            setQuestions(response.data.questions);
            // setQuestions([
            //     "What are the different ways to style HTML elements using CSS, and what are the advantages and disadvantages of each method?",
            //     "Explain the difference between `==` and `===` in JavaScript",
            //     "Describe the box model in CSS and how it affects element layout",
            //     "What are semantic HTML5 elements and why are they important?",
            //     "Explain the concept of closures in JavaScript and provide a simple example",
            // ]);
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
            // Stop the media recorder
            mediaRecorderRef.current.stop();

            // Stop all audio tracks to turn off the microphone
            const stream = mediaRecorderRef.current.stream;
            stream.getTracks().forEach((track) => track.stop());

            // Save the user's response
            const answer = interimTranscript.trim();
            const currentQuestion = questions[currentIndex];

            setUserResponses((prevResponses) => [
                ...prevResponses,
                { question: currentQuestion, answer_by_user: answer || "No answer provided" },
            ]);

            // Reset interim transcript and prepare for the next question
            setInterimTranscript("");
            setCurrentIndex((prevIndex) => prevIndex + 1);
            setQuestionText("");
        }
    };

    const generateResult = async () => {
        setIsGeneratingResult(true);
        const response = await axios.post("/api/check_answers", { data : userResponses });
        setFetchedResult(response.data.message);
        setIsGeneratingResult(false);
        setResultGenerated(true);
        console.log(userResponses);
    };
    
    const viewResult = () => {
        setIsGeneratingResult(true);
        router.push("/result");
    }

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
                        <div className="w-full bg-gray-900/30 dark:bg-gray-100/20 rounded-lg h-1 md:h-3 overflow-hidden">
                            <div
                                className="bg-green-500 h-full rounded-lg"
                                style={{ width: `${(currentIndex / questions.length) * 100}%` }}
                            ></div>
                        </div>
                    </div>

                    {currentIndex < questions.length ? (
                        <>
                            <div className="mb-6 text-center">
                                <div className="text-gray-100 text-2xl transition-height duration-1000 min-h-56 md:min-h-20">
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
                            <div className="text-gray-100 text-2xl transition-height duration-1000 min-h-56 md:min-h-20">
                                <TypingAnimation
                                    className="text-4xl font-bold text-white dark:text-white"
                                    text={"🎊Quiz Completed🎊"}
                                    duration={40}
                                />
                            </div>
                            <button
                                onClick={resultGenerated ? viewResult : generateResult}
                                className="text-xl px-8 py-3 mt-4 bg-yellow-500 hover:bg-yellow-600 rounded-full shadow-lg transition duration-300"
                                disabled={isGeneratingResult}
                            >
                                {resultGenerated ? "View Result" : (
                                    <span>{isGeneratingResult ? (
                                        <Image src={smallLoader} alt="microphone" width={80} height={80} />
                                    ) : "Generate Result"}</span>
                                )}
                            </button>
                        </div>
                    )}

                    {userResponses.length > 0 &&
                        <div className="mt-6 max-w-5xl mx-auto px-4">
                            <h3 className="text-3xl text-center font-semibold mb-6">Responses</h3>
                            <div className="overflow-x-auto">
                                <table className="w-full table-auto border-collapse border border-gray-300 rounded-xl overflow-hidden shadow-md">
                                    <tbody>
                                        {userResponses.map((response, index) => (
                                            <Fragment key={index}>
                                                {/* Question Row */}
                                                <tr className="bg-gray-50/30">
                                                    <td className="border border-gray-300 px-3 py-4 text-left align-top font-bold whitespace-nowrap">
                                                        Q{index + 1}.
                                                    </td>
                                                    <td className="border border-gray-300 px-3 py-4 text-left align-top">
                                                        {response.question}
                                                    </td>
                                                </tr>
                                                {/* Answer Row */}
                                                <tr className="bg-gray-200/10">
                                                    <td className="border border-gray-300 px-3 py-4 text-left align-top font-bold whitespace-nowrap">
                                                        Ans
                                                    </td>
                                                    <td className="border border-gray-300 px-3 py-4 text-left align-top">
                                                        {response.answer_by_user}
                                                    </td>
                                                </tr>
                                            </Fragment>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>


                    }
                </Frame>
            )}
        </div>
    );
}
