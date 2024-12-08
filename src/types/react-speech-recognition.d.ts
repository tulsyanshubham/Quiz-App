declare module 'react-speech-recognition' {
  interface SpeechRecognitionProps {
    transcribing?: boolean;
    clearTranscript?: () => void;
    stopListening?: () => void;
    startListening?: () => void;
    browserSupportsSpeechRecognition?: boolean;
    transcript?: string;
  }

  const SpeechRecognition: {
    startListening: () => void;
    stopListening: () => void;
    clearTranscript: () => void;
  };

  export const useSpeechRecognition: () => SpeechRecognitionProps;
  export default SpeechRecognition;
}