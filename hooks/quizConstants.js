export const PRACTICE_TIME = 30;
export const SCORED_TIME = 60;
export const INCORRECT_ANSWER_DELAY = 3000;
export const CORRECT_ANSWER_DELAY = 500;
export const REQUIRED_ACCURACY_FOR_HS = 90;
export const DEFAULT_COMPETITIVE_TRIES = 3;
export const PASSWORD = "onDeals";

export const shuffleArray = (array) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
};

export const formatTime = (seconds) => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
};
