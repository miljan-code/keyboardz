"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useCapslockStatus } from "@/hooks/use-capslock-status";
import { useTimer } from "@/hooks/use-timer";
import { useUpdateUI } from "@/hooks/use-update-ui";
import { useWpm } from "@/hooks/use-wpm";
import { useAtom, useAtomValue } from "jotai";

import { currentTextAtom } from "@/lib/store";
import { multiplayerTextAtom } from "@/lib/store/multiplayer-store";
import { cn } from "@/lib/utils";
import { MultiplayerResults } from "@/components/lobby/multiplayer-results";
import { TestInfo } from "@/components/test/test-info";

import type { TestMode } from "@/types/test";

const MAX_WRONG_LETTERS = 8;

interface MutliplayerTestProps {
  testMode: TestMode;
}

export const MutliplayerTest = ({ testMode }: MutliplayerTestProps) => {
  const [testFinished, setTestFinished] = useState(false);
  const [testStarted, setTestStarted] = useState(false);
  const [letters, setLetters] = useState<string[]>([]);
  const [extraLetters, setExtraLetters] = useState(0);

  const [currentText, setCurrentText] = useAtom(currentTextAtom);
  const text = useAtomValue(multiplayerTextAtom);

  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const caretRef = useRef<HTMLDivElement>(null);
  const letterRef = useRef<HTMLSpanElement>(null);

  const { updateCaret, checkForNewLine } = useUpdateUI({
    caretRef,
    wrapperRef,
    letterRef,
    containerRef,
  });
  const { startTimer, stopTimer, elapsedTime } = useTimer();
  const { startMeasuring, stopMeasuring, wpmStats } = useWpm({ text });
  const { isCaps } = useCapslockStatus();

  const inputLetters = currentText.split("");
  const inputWords = currentText.split(" ");

  useEffect(() => setLetters(text.split("")), [text]);

  const handleStartTest = () => {
    if (!testStarted && !testFinished && !isCaps) {
      setTestStarted(true);
      startMeasuring();
      if (testMode.mode === "timer") {
        startTimer(testMode.amount, true);
      } else {
        startTimer();
      }
    }
  };

  const handleEndTest = useCallback(() => {
    stopTimer();
    stopMeasuring();
    setTestFinished(true);
    setTestStarted(false);
  }, [stopTimer, stopMeasuring]);

  // Check if test is finished on timer mode
  useEffect(() => {
    if (testMode.mode === "words") return;

    if (elapsedTime === 0 && testStarted) handleEndTest();
  }, [elapsedTime, handleEndTest, testStarted, testMode.mode]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (testFinished || isCaps) return null;

    handleStartTest();

    const inputLength = e.currentTarget.value.length;
    const nextLetterToType = letters[inputLength - 1];
    const currentLetter = e.currentTarget.value.at(-1);

    // Checks if space is pressed
    if (currentLetter === " ") {
      // if yes reset added words and check if theres need for new line
      if (nextLetterToType === " ") {
        checkForNewLine();
        setExtraLetters(0);
      } else {
        // if no skip current word
        e.preventDefault();
        const isStart = !currentText.length;
        const isNewWord = currentText.at(-1) === " ";

        if (isStart || isNewWord) return null;

        const startingIndex = currentText.length - 1;
        let distance = 0;
        for (let i = startingIndex; i < letters.length; i++) {
          if (letters[i] === " ") {
            distance = i - startingIndex;
            break;
          }
        }

        const newText = currentText + "_".repeat(distance - 1) + " ";
        setCurrentText(newText);
        updateCaret("space", distance - 1);
        return null;
      }
    }

    // displays missed letters to the ui
    if (nextLetterToType === " " && currentLetter !== " ") {
      if (extraLetters > MAX_WRONG_LETTERS) return null;

      const arr = [...letters];
      arr.splice(inputLength - 1, 0, currentLetter?.toUpperCase() || "_");
      setLetters(arr);
      setExtraLetters((prev) => prev + 1);
    }

    if (currentText.length > inputLength) updateCaret("backspace");
    else updateCaret();

    setCurrentText(e.currentTarget.value);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!testStarted) return null;
    if (!currentText.length) updateCaret("reset");

    const forbbidenKeys = ["Delete", "ArrowLeft", "ArrowRight"];

    if (forbbidenKeys.includes(e.key)) {
      e.preventDefault();
      return null;
    }

    // Handle backspace + ctrl
    const index = e.currentTarget.value.length - 1;
    if (e.key === "Backspace" && e.ctrlKey) {
      e.preventDefault();
    }

    // Handle backspace
    if (e.key === "Backspace") {
      const letter = letters[index];

      if (letter === " " || !letter) return null;
      if (letter !== letter.toUpperCase()) return null;

      const arr = [...letters];
      arr.splice(index, 1);
      setLetters(arr);
      setExtraLetters((prev) => prev - 1);
    }
  };

  const handleKeyUp = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && e.ctrlKey) {
      updateCaret("resize");
    }

    // Checks if test is finished
    if (
      e.currentTarget.value.length === letters.length &&
      testMode.mode === "words"
    ) {
      setCurrentText(e.currentTarget.value);
      handleEndTest();
      return null;
    }
  };

  if (testFinished) {
    return <MultiplayerResults />;
  }

  return (
    <div className="relative">
      <TestInfo
        wpmStats={wpmStats}
        testStarted={testStarted}
        inputWords={inputWords}
      />
      <div
        ref={containerRef}
        className="relative h-[100px] animate-enter-opacity overflow-hidden font-mono"
      >
        <div
          ref={wrapperRef}
          className="ml-1 -translate-y-0"
          style={{ transform: "translateY(-0px)" }}
        >
          {letters.map((letter, i) => (
            <span
              key={letter + i}
              ref={i === currentText.length + 1 ? letterRef : null}
              className={cn("relative text-2xl text-foreground/60", {
                "text-primary":
                  i <= currentText.length && inputLetters[i] === letters[i],
                "text-red-500":
                  (i <= currentText.length - 1 &&
                    inputLetters[i] !== letters[i]) ||
                  !/^[a-z]$/.test(letters[i]),
              })}
            >
              {letter.toLowerCase()}
            </span>
          ))}
          <div
            ref={caretRef}
            className={cn(
              "absolute inset-0 h-8 w-[3px] rounded-md bg-primary/80",
              {
                "animate-pulse": !currentText.length,
              },
            )}
          />
        </div>
      </div>
      <input
        ref={inputRef}
        className="absolute inset-0 cursor-default opacity-0"
        value={currentText}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        onKeyUp={handleKeyUp}
        onPaste={(e) => e.preventDefault()}
        autoFocus
      />
    </div>
  );
};
