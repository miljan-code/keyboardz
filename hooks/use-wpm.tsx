import { useEffect, useRef } from "react";
import { useTimer } from "@/hooks/use-timer";
import { useAtom, useAtomValue } from "jotai";

import {
  currentTextAtom,
  testModeAtom,
  wpmHistoryAtom,
  wpmStatsAtom,
} from "@/lib/store";
import { initialWpmStats } from "@/lib/store/test-store";

import type { TestMode, WpmHistory } from "@/types/test";

interface UseWPMProps {
  text: string;
}

export const useWpm = ({ text }: UseWPMProps) => {
  const [wpmStats, setWpmStats] = useAtom(wpmStatsAtom);
  const [wpmHistory, setWpmHistory] = useAtom(wpmHistoryAtom);
  const testMode = useAtomValue(testModeAtom);
  const input = useAtomValue(currentTextAtom);

  const { elapsedTime } = useTimer();

  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const { correctWords, inputWords, words } = transformWords({
    input,
    text,
    testMode,
  });

  const elapsedTimeRef = useRef<number>(elapsedTime);
  const correctWordsRef = useRef<number>(correctWords);
  const inputWordsRef = useRef<string[]>(inputWords);

  useEffect(() => {
    elapsedTimeRef.current = elapsedTime;
    correctWordsRef.current = correctWords;
    inputWordsRef.current = inputWords;
  }, [correctWords, elapsedTime, inputWords]);

  const calculateWPM = () => {
    const time = getTestTime({ elapsedTime, testMode, type: "calculate" });
    const { wpm, rawWpm } = getWPM({ correctWords, inputWords, time });
    const { accuracy, correct, incorrect } = calculateAccuracy({
      inputWords,
      words,
    });

    const stats = {
      wpm,
      rawWpm,
      accuracy,
      chars: {
        correct,
        incorrect,
      },
    };

    setWpmStats({ ...wpmStats, ...stats });
  };

  const recordWpm = () => {
    const correctWords = correctWordsRef.current;
    const inputWords = inputWordsRef.current;
    const elapsedTime = elapsedTimeRef.current;

    const time = getTestTime({ elapsedTime, testMode, type: "record" });

    const { wpm, rawWpm } = getWPM({ correctWords, inputWords, time });

    setWpmHistory((prev) => [...prev, { wpm, rawWpm }]);
    setWpmStats({ ...wpmStats, liveWpm: wpm });
  };

  const startMeasuring = () => {
    setWpmStats(initialWpmStats);
    setWpmHistory([]);

    intervalRef.current = setInterval(recordWpm, 1000);
  };

  const stopMeasuring = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);

    const wpmHistoryWithoutZeros = removeLeadingZeros(wpmHistory, 1);

    setWpmHistory(wpmHistoryWithoutZeros);
    recordWpm();
    calculateWPM();
  };

  return {
    startMeasuring,
    stopMeasuring,
    wpmStats,
    wpmHistory,
  };
};

interface TransformWords {
  input: string;
  text: string;
  testMode: TestMode;
}

function transformWords({ input, text, testMode }: TransformWords) {
  const inputWords = input.split(" ");

  let words: string[] = [];
  if (testMode.mode === "words") {
    words = text.split(" ");
  } else {
    words = text.split(" ").slice(0, inputWords.length);
    words.at(-1)?.slice(0, inputWords.at(-1)?.length);
  }

  const correctWords = inputWords.filter((word, i) => word === words[i]).length;

  return { inputWords, correctWords, words };
}

interface CalculateAccuracy {
  inputWords: string[];
  words: string[];
}

function calculateAccuracy({ inputWords, words }: CalculateAccuracy) {
  let correctChars = 0;
  let incorrectChars = 0;

  if (!inputWords.length || !words.length)
    return {
      accuracy: 0,
      correct: 0,
      incorrect: 0,
    };

  for (let i = 0; i < words.length; i++) {
    for (let j = 0; j < inputWords[i]?.length; j++) {
      if (inputWords[i][j] === words[i][j]) correctChars++;
      else incorrectChars++;
    }
  }

  let accuracy = (correctChars / (correctChars + incorrectChars)) * 100;

  if (Number.isNaN(accuracy)) accuracy = 0;

  return {
    accuracy: Math.round(accuracy),
    correct: correctChars,
    incorrect: incorrectChars,
  };
}

function removeLeadingZeros(arr: WpmHistory[], amount: number) {
  const newArr = [...arr];

  for (let i = 0; i < newArr.length; i++) {
    if (i === amount) break;
    if (newArr[i].wpm === 0 && newArr[i].rawWpm === 0) newArr.shift();
    else break;
  }

  return newArr;
}

interface GetWPM {
  correctWords: number;
  inputWords: string[];
  time: number;
}

function getWPM({ correctWords, inputWords, time }: GetWPM) {
  let wpm = Math.round(correctWords / (time / 60));
  let rawWpm = Math.round(inputWords.length / (time / 60));

  if (Number.isNaN(wpm) || !Number.isFinite(wpm)) {
    wpm = 0;
  }
  if (Number.isNaN(rawWpm) || !Number.isFinite(rawWpm)) {
    rawWpm = 0;
  }

  return { wpm, rawWpm };
}

interface GetTestTime {
  elapsedTime: number;
  type: "calculate" | "record";
  testMode: TestMode;
}

function getTestTime({ elapsedTime, type, testMode }: GetTestTime) {
  if (type === "calculate") {
    return testMode.mode === "timer" ? testMode.amount : elapsedTime;
  } else {
    return testMode.mode === "timer"
      ? testMode.amount - elapsedTime
      : elapsedTime;
  }
}
