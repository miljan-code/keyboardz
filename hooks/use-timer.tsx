"use client";

import { useEffect, useState } from "react";

export const useTimer = () => {
  const [time, setTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [countdown, setCountdown] = useState(false);

  useEffect(() => {
    let intervalId: NodeJS.Timeout;
    if (isRunning) {
      intervalId = setInterval(() => {
        if (countdown) {
          if (time > 0) setTime(time - 1);
          else setTime(0);
        } else {
          setTime(time + 1);
        }
      }, 1000);
    }
    return () => clearInterval(intervalId);
  }, [isRunning, time, countdown]);

  const elapsedTime = Math.floor(time % 6000);

  const startTimer = (
    initialTime: number = 0,
    shouldCountdown: boolean = false,
  ) => {
    setTime(initialTime);
    setCountdown(shouldCountdown);
    setIsRunning(true);
  };

  const stopTimer = () => {
    setIsRunning(false);
  };

  const resetTimer = (time: number = 0) => {
    setTime(time);
  };

  return { elapsedTime, startTimer, stopTimer, resetTimer };
};
