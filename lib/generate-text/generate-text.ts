import { randomText } from "@/lib/generate-text/text";

import type { TestMode } from "@/types/test";

const randomWords = randomText
  .replace(/[^a-zA-Z ]/g, "")
  .toLowerCase()
  .split(" ");

export function generateRandomText(n: number = 25) {
  const maxNum = randomWords.length;

  let randomNumber: number = maxNum + 1;
  while (randomNumber + n > maxNum) {
    randomNumber = Math.floor(Math.random() * maxNum);
  }

  return randomWords.slice(randomNumber, randomNumber + n).join(" ");
}

export function generateTextByMode(testMode: TestMode) {
  let text = "";

  if (testMode.mode === "words") {
    text = generateRandomText(testMode.amount);
  } else {
    text = generateRandomText(testMode.amount * 6);
  }

  return text;
}
