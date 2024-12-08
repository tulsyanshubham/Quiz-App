import { GoogleGenerativeAI } from "@google/generative-ai";

export async function POST(req) {
    try {
        const { data } = await req.json();

        const questionsAndAnswers = data.map(item => `{
            "question": "${item.question}",
            "answer_by_user": "${item.answer_by_user}"
        }`).join(", ");

        const prompt = `I have a list of questions and answers provided by a user. I want you to evaluate each answer, provide the correct answer with explanation, and give a score from 0 to 100. As the user's answer is converted form speech to text so neglect any small spelling mistakes or involvement of special characters like comma, full stop, inverted comma The response should be formatted in a single string for each question like this: "correct_answer_with_explanation1 ~~ Score1 || correct_answer_with_explanation2 ~~ Score2 || ...".
        no need to include the keys like "correct_answer" or "score" in the response, just drictly provide the correct answer and score.
        also do not make the text bold or italic by using "*" or "_" in the response.
        Please evaluate the following data:
        [${questionsAndAnswers}]
        Make sure the response is in the requested string format.`;

        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        const result = await model.generateContent(prompt);
        const msg = result.response.candidates?.[0]?.content.parts?.[0]?.text || "";

        const responseArray = msg.split("||").map(item => item.trim());

        const evaluatedData = responseArray.map((item, index) => {
            const [correctAnswer, score] = item.split("~~").map(part => part.trim());
            return {
                question: data[index].question,
                answer_by_user: data[index].answer_by_user,
                explanation: correctAnswer,
                score: parseFloat(score)
            };
        });

        return new Response(JSON.stringify({
            success: true,
            message: evaluatedData
        }), { status: 200 });

    } catch (error) {
        console.error("An unexpected error occurred:", error);

        return new Response(JSON.stringify({
            success: false,
            message: "An unexpected error occurred."
        }), { status: 500 });
    }
}
