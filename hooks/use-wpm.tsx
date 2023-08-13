import { useCallback, useEffect } from "react";
import { atom, useAtom } from "jotai";

import { TestMode } from "@/types/test";

interface UseWPMProps {
  text: string;
  testMode: TestMode;
  elapsedTime: number;
  input: string;
}

const wpmAtom = atom(0);
const rawWpmAtom = atom(0);
const liveWpmAtom = atom(0);
const calculateLiveAtom = atom(false);

export const useWpm = ({ text, testMode, elapsedTime, input }: UseWPMProps) => {
  const [wpm, setWpm] = useAtom(wpmAtom);
  const [rawWpm, setRawWpm] = useAtom(rawWpmAtom);
  const [liveWpm, setLiveWpm] = useAtom(liveWpmAtom);
  const [calculateLive, setCalculateLive] = useAtom(calculateLiveAtom);

  const inputWords = input.split(" ");

  let words: string[] = [];
  if (testMode.mode === "words") {
    words = text.split(" ");
  } else {
    words = text.split(" ").slice(0, inputWords.length);
  }

  const correctWords = inputWords.filter((word, i) => word === words[i]).length;

  const calculateWPM = () => {
    const time = testMode.mode === "timer" ? testMode.amount : elapsedTime;

    setWpm(Math.round(correctWords / (time / 60)));
    setRawWpm(Math.round(inputWords.length / (time / 60)));
  };

  const calculateLiveWPM = useCallback(() => {
    const time =
      testMode.mode === "timer" ? testMode.amount - elapsedTime : elapsedTime;

    let liveWpm = Math.round(correctWords / (time / 60));

    if (Number.isNaN(liveWpm) || !Number.isFinite(liveWpm)) {
      liveWpm = 0;
    }

    setLiveWpm(liveWpm);
  }, [correctWords, elapsedTime, setLiveWpm, testMode.amount, testMode.mode]);

  const liveCalculation = (bool: boolean) => setCalculateLive(bool);

  useEffect(() => {
    let liveWpmInterval: NodeJS.Timeout;

    if (calculateLive) {
      liveWpmInterval = setInterval(calculateLiveWPM, 500);
    }

    return () => clearInterval(liveWpmInterval);
  }, [calculateLive, calculateLiveWPM]);

  return {
    calculateWPM,
    calculateLiveWPM,
    liveCalculation,
    wpm,
    rawWpm,
    liveWpm,
  };
};
