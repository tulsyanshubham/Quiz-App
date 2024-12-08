# Quiz App

The **Quiz App** is an interactive web application built using **Next.js** and the **Gemini API**. It allows users to customize their quiz experience by selecting a domain, difficulty level, and topics. Questions are dynamically generated, presented in text and audio formats, and answered through audio. The app leverages advanced technologies for scoring and providing detailed explanations.

---

## Features

- **Customizable Quizzes**: Users can select the domain, difficulty level, topics, and number of questions.
- **Audio Interaction**: 
  - Questions are presented in both text and audio formats.
  - Users respond to questions using audio, which is converted to text using speech recognition.
- **Dynamic Question Generation**: The Gemini API generates a set of questions based on user preferences.
- **Automated Evaluation**:
  - User responses are scored using the Gemini API.
  - Provides detailed explanations of the scoring criteria.

---

## Tech Stack

- **Frontend**: [Next.js](https://nextjs.org/)
- **API Integration**: [Gemini API](https://gemini.openai.com/)
- **Speech Recognition**: Browser-based audio-to-text conversion.
