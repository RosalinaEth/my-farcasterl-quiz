// utils/logic.ts (This replaces the content of utils/kv.ts)
import { quiz } from "../quiz";

// Helper function to get the next question object
export function getNextQuestion(index: number) {
  return quiz.questions[index];
}

// Helper function to get the image URL for a question
export function getQuestionImage(index: number) {
  // We use the first image you provided (the OG image) for all question screens
  return "https://res.cloudinary.com/dzdas1gyp/image/upload/v1750974302/og-clean_h21k6u.jpg";
}

// Helper function to calculate the final result based on the answers string
export function calculateResult(answersString: string) {
  const answers = answersString.split("-").map(Number); // [0, 3, 1, 2, ...]

  const scores: { [key: string]: number } = {
    Water: 0,
    Air: 0,
    Earth: 0,
    Fire: 0,
  };

  answers.forEach((answerIndex, questionIndex) => {
    if (questionIndex < quiz.questions.length) {
      const question = quiz.questions[questionIndex];
      const selectedElement = question.answers[answerIndex].element;
      scores[selectedElement] += 1;
    }
  });

  // Find the element with the highest score
  let maxScore = -1;
  let resultElement = "Water"; // Default to Water

  for (const element in scores) {
    if (scores[element] > maxScore) {
      maxScore = scores[element];
      resultElement = element;
    }
  }

  // The result is the element with the highest score
  return quiz.results[resultElement];
}
