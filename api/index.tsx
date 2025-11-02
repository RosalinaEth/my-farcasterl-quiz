// api/quiz/index.tsx
import { FrameContext, FrameHandler, FrameRequest } from "dappykit";
import { getNextQuestion, getQuestionImage, calculateResult } from "../../utils/logic";
import { quiz } from "../../quiz";

// --- State Management: Using Query Params (No KV needed) ---
// State format: 'a=1-2-3-4&q=5' where 'a' is answers and 'q' is question index

const handler: FrameHandler = async (context: FrameContext) => {
  const { request } = context;
  const { searchParams } = new URL(request.url);
  const currentQuestionIndex = parseInt(searchParams.get("q") || "0");
  const currentAnswers = searchParams.get("a") || ""; // Format: "1-2-3-4" (Answer index for each question)

  // 1. Handle POST request (User clicked a button)
  if (request.method === "POST") {
    const { buttonIndex } = request as FrameRequest;

    // The button index is 1-based, so the answer index is buttonIndex - 1
    const selectedAnswerIndex = buttonIndex - 1;

    // Append the new answer to the answers string
    const newAnswers = currentAnswers
      ? ${currentAnswers}-${selectedAnswerIndex}
      : ${selectedAnswerIndex};

    const nextQuestionIndex = currentQuestionIndex + 1;

    // Check if the quiz is finished
    if (nextQuestionIndex >= quiz.questions.length) {
      // Quiz finished, calculate result
      const result = calculateResult(newAnswers);

      // Result Frame
      return {
        image: result.image_url,
        buttons: [
          {
            label: Your Result: ${result.title},
            action: "post",
          },
          {
            label: "Share on Farcaster",
            action: "link",
            target: https://warpcast.com/~/compose?text=I%20am%20the%20${result.title.replace(/ /g, "%20")}!%20Take%20the%20quiz%20to%20find%20your%20element!&embeds[]=${process.env.NEXT_PUBLIC_URL},
          },
        ],
      };
    }

    // Not finished, go to next question
    const nextQuestion = getNextQuestion(nextQuestionIndex);
    const nextAnswersQuery = a=${newAnswers}&q=${nextQuestionIndex};

    return {
      image: getQuestionImage(nextQuestionIndex),
      buttons: nextQuestion.answers.map((answer) => ({
        label: answer.text,
        action: "post",
      })),
      postUrl: /api/quiz?${nextAnswersQuery},
    };
  }

  // 2. Handle GET request (Initial frame)
  const initialQuestion = getNextQuestion(0);

  return {
    image: getQuestionImage(0),
    buttons: initialQuestion.answers.map((answer) => ({
      label: answer.text,
      action: "post",
    })),
    postUrl: /api/quiz?a=&q=0,
  };
};

export default handler;
