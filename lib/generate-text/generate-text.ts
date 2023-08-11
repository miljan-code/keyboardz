import { randomText } from "@/lib/generate-text/text";

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
