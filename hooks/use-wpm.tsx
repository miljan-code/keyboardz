import { useEffect, useRef } from "react";
import { atom, useAtom } from "jotai";

import { currentTextAtom } from "@/components/test/typing-box";
import { testModeAtom } from "@/components/test/typing-mode-dialog";
import { useTimer } from "./use-timer";

import type { TestMode, WpmHistory, WpmStats } from "@/types/test";

const initialWpmStats = {
  wpm: 0,
  rawWpm: 0,
  liveWpm: 0,
  accuracy: 0,
  chars: {
    correct: 0,
    incorrect: 0,
  },
};

const wpmStatsAtom = atom<WpmStats>(initialWpmStats);
const wpmHistoryAtom = atom<WpmHistory[]>([]);

export interface UseWPMProps {
  text: string;
}

export const useWpm = ({ text }: UseWPMProps) => {
  const [wpmStats, setWpmStats] = useAtom(wpmStatsAtom);
  const [wpmHistory, setWpmHistory] = useAtom(wpmHistoryAtom);
  const [testMode] = useAtom(testModeAtom);
  const [input] = useAtom(currentTextAtom);

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
    const time = testMode.mode === "timer" ? testMode.amount : elapsedTime;

    const wpm = Math.round(correctWords / (time / 60));
    const rawWpm = Math.round(inputWords.length / (time / 60));
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

  const calculateLiveWPM = () => {
    const correctWords = correctWordsRef.current;
    const inputWords = inputWordsRef.current;
    const elapsedTime = elapsedTimeRef.current;

    const time =
      testMode.mode === "timer" ? testMode.amount - elapsedTime : elapsedTime;

    let liveWpm = Math.round(correctWords / (time / 60));
    let liveRawWpm = Math.round(inputWords.length / (time / 60));

    if (Number.isNaN(liveWpm) || !Number.isFinite(liveWpm)) {
      liveWpm = 0;
    }
    if (Number.isNaN(liveRawWpm) || !Number.isFinite(liveRawWpm)) {
      liveRawWpm = 0;
    }

    setWpmHistory((prev) => [...prev, { wpm: liveRawWpm, rawWpm: liveWpm }]);
  };

  const startMeasuring = () => {
    setWpmStats(initialWpmStats);
    setWpmHistory([]);

    intervalRef.current = setInterval(calculateLiveWPM, 1000);
  };

  const stopMeasuring = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);

    const wpmHistoryArr = [...wpmHistory];

    for (let i = 0; i < wpmHistoryArr.length; i++) {
      if (wpmHistoryArr[i].wpm === 0 || wpmHistoryArr[i].rawWpm === 0)
        wpmHistoryArr.shift();
      else break;
    }

    setWpmHistory(wpmHistoryArr);
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

  const accuracy = (correctChars / (correctChars + incorrectChars)) * 100;

  return {
    accuracy: Math.round(accuracy),
    correct: correctChars,
    incorrect: incorrectChars,
  };
}
