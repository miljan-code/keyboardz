import { useCallback, useEffect } from "react";
import { atom, useAtom } from "jotai";

import type { TestMode, WpmStats } from "@/types/test";

const initialWpmStats = {
  wpm: 0,
  rawWpm: 0,
  liveWpm: 0,
  wpmHistory: [],
  accuracy: 0,
  chars: {
    correct: 0,
    incorrect: 0,
  },
};

const wpmStatsAtom = atom<WpmStats>(initialWpmStats);
const calculateLiveAtom = atom(false);

export interface UseWPMProps {
  text: string;
  testMode: TestMode;
  elapsedTime: number;
  input: string;
}

export const useWpm = ({ text, testMode, elapsedTime, input }: UseWPMProps) => {
  const [wpmStats, setWpmStats] = useAtom(wpmStatsAtom);
  const [calculateLive, setCalculateLive] = useAtom(calculateLiveAtom);

  const { correctWords, inputWords, words } = transformWords({
    input,
    text,
    testMode,
  });

  const calculateWPM = () => {
    const time = testMode.mode === "timer" ? testMode.amount : elapsedTime;

    const wpm = Math.round(correctWords / (time / 60));
    const rawWpm = Math.round(inputWords.length / (time / 60));
    const wpmHistory = [...wpmStats.wpmHistory, { wpm, rawWpm }];
    const { accuracy, correct, incorrect } = calculateAccuracy({
      inputWords,
      words,
    });

    const stats = {
      wpm,
      rawWpm,
      accuracy,
      wpmHistory,
      chars: {
        correct,
        incorrect,
      },
    };

    setWpmStats({ ...wpmStats, ...stats });
  };

  const calculateLiveWPM = useCallback(() => {
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

    const wpmHistory = [
      ...wpmStats.wpmHistory,
      { wpm: liveWpm, rawWpm: liveRawWpm },
    ];

    const stats = {
      liveWpm,
      wpmHistory,
    };

    setWpmStats({ ...wpmStats, ...stats });
  }, [
    correctWords,
    elapsedTime,
    testMode.amount,
    testMode.mode,
    setWpmStats,
    wpmStats,
    inputWords.length,
  ]);

  const startMeasuring = () => {
    const stats = {
      liveWpm: 0,
      wpmHistory: [],
    };

    setWpmStats({ ...wpmStats, ...stats });
    setCalculateLive(true);
  };

  const stopMeasuring = () => {
    setCalculateLive(false);

    const wpmHistory = [...wpmStats.wpmHistory];

    for (let i = 0; i < wpmHistory.length; i++) {
      if (wpmHistory[i].wpm === 0 || wpmHistory[i].rawWpm === 0)
        wpmHistory.shift();
      else break;
    }

    setWpmStats({ ...wpmStats, wpmHistory });
  };

  useEffect(() => {
    let liveWpmInterval: NodeJS.Timeout;

    if (calculateLive) {
      liveWpmInterval = setInterval(calculateLiveWPM, 1000);
    }

    return () => clearInterval(liveWpmInterval);
  }, [calculateLive, calculateLiveWPM]);

  return {
    calculateWPM,
    calculateLiveWPM,
    startMeasuring,
    stopMeasuring,
    wpmStats,
  };
};

function transformWords({
  input,
  text,
  testMode,
}: Omit<UseWPMProps, "elapsedTime">) {
  const inputWords = input.split(" ");

  let words: string[] = [];
  if (testMode.mode === "words") {
    words = text.split(" ");
  } else {
    words = text.split(" ").slice(0, inputWords.length);
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
    for (let j = 0; j < inputWords[i].length; j++) {
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
