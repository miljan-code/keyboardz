"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useCapslockStatus } from "@/hooks/use-capslock-status";
import { useModal } from "@/hooks/use-modal";
import { useTimer } from "@/hooks/use-timer";
import { useUpdateUI } from "@/hooks/use-update-ui";
import { useWpm } from "@/hooks/use-wpm";
import { useAtom } from "jotai";

import { currentTextAtom, testModeAtom } from "@/lib/atoms";
import { cn } from "@/lib/utils";
import { Icons } from "@/components/icons";
import { TestResult } from "@/components/test/test-result";

interface TypingBoxProps {
  text: string;
}

const MAX_WRONG_LETTERS = 8;

export const TypingBox = ({ text }: TypingBoxProps) => {
  const [isInputFocused, setIsInputFocused] = useState(true);
  const [testFinished, setTestFinished] = useState(false);
  const [testStarted, setTestStarted] = useState(false);
  const [letters, setLetters] = useState<string[]>([]);
  const [addedLetters, setAddedLetters] = useState(0);

  const [currentText, setCurrentText] = useAtom(currentTextAtom);
  const [testMode] = useAtom(testModeAtom);

  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const caretRef = useRef<HTMLDivElement>(null);
  const letterRef = useRef<HTMLSpanElement>(null);
  const isInitialRenderRef = useRef(true);

  const router = useRouter();
  const { updateCaret, resetWrapperBox, checkForNewLine } = useUpdateUI({
    caretRef,
    wrapperRef,
    letterRef,
    containerRef,
  });
  const { startTimer, stopTimer, resetTimer, elapsedTime } = useTimer();
  const { startMeasuring, stopMeasuring } = useWpm({ text });
  const { isModalOpen } = useModal();
  const { isCaps } = useCapslockStatus();

  const inputLetters = currentText.split("");
  const inputWords = currentText.split(" ");

  useEffect(() => setLetters(text.split("")), [text]);

  const resetTest = useCallback(() => {
    const time = testMode.mode === "timer" ? testMode.amount : 0;

    setCurrentText("");
    setTestStarted(false);
    setTestFinished(false);
    setAddedLetters(0);
    stopTimer();
    resetTimer(time);
    updateCaret("reset");
    resetWrapperBox();
    stopMeasuring();
    router.refresh();
  }, [
    router,
    stopTimer,
    resetTimer,
    testMode.amount,
    testMode.mode,
    stopMeasuring,
    setCurrentText,
    updateCaret,
    resetWrapperBox,
  ]);

  // Event listener for Tab key to reset the test
  useEffect(() => {
    const handleResetTest = (e: KeyboardEvent) => {
      if (e.key === "Tab") {
        e.preventDefault();
        resetTest();
      }
    };

    window.addEventListener("keydown", handleResetTest);

    return () => window.removeEventListener("keydown", handleResetTest);
  }, [resetTest]);

  // resets test when mode is changed
  useEffect(() => {
    if (!isInitialRenderRef.current) {
      resetTest();
    } else {
      isInitialRenderRef.current = false;
    }
    // eslint-disable-next-line
  }, [testMode.amount, testMode.mode]);

  // Event listener for any keystroke to remove input blur
  useEffect(() => {
    const handleFocusOnKeystroke = (e: KeyboardEvent) => {
      if (!inputRef.current) return null;

      // focuses and starts the test only on a-z keys
      if (!/^[a-zA-Z]$/.test(e.key)) return null;

      if (document.activeElement !== inputRef.current) {
        e.preventDefault();
        inputRef.current.focus();
        setIsInputFocused(true);
        return;
      }

      // starts test
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

    if (!isModalOpen) {
      window.addEventListener("keydown", handleFocusOnKeystroke);
    }

    return () => window.removeEventListener("keydown", handleFocusOnKeystroke);
  }, [
    isModalOpen,
    startTimer,
    testFinished,
    testMode.amount,
    testMode.mode,
    testStarted,
    startMeasuring,
    isCaps,
  ]);

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

    const inputLength = e.currentTarget.value.length;
    const nextLetterToType = letters[inputLength - 1];
    const currentLetter = e.currentTarget.value.at(-1);

    // Checks if space is pressed
    if (currentLetter === " ") {
      // if yes reset added words and check if theres need for new line
      if (nextLetterToType === " ") {
        checkForNewLine();
        setAddedLetters(0);
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
      if (addedLetters > MAX_WRONG_LETTERS) return null;

      const arr = [...letters];
      arr.splice(inputLength - 1, 0, currentLetter?.toUpperCase() || "_");
      setLetters(arr);
      setAddedLetters((prev) => prev + 1);
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
      setAddedLetters((prev) => prev - 1);
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

  const handleInputFocus = (e: React.FocusEvent<HTMLInputElement, Element>) => {
    if (e.type === "blur") setIsInputFocused(false);
    else setIsInputFocused(true);
  };

  if (testFinished) {
    return <TestResult text={text} />;
  }

  return (
    <div className="relative">
      <div className="flex items-center justify-between">
        <div
          className={cn(
            "mb-2 flex items-center gap-2 text-lg font-medium text-primary transition-opacity",
            {
              "opacity-0": !testStarted,
            },
          )}
        >
          {testMode.mode === "words" && (
            <span>
              {inputWords.length - 1}/{testMode.amount}
            </span>
          )}
          <span>{elapsedTime}</span>
        </div>
        <div
          className={cn(
            "flex -translate-y-10 items-center gap-2 rounded-md bg-primary px-4 py-2 transition-opacity",
            {
              "opacity-0": !isCaps,
            },
          )}
        >
          <span className="font-medium text-background">CapsLock</span>
          <Icons.lock size={16} className="text-background" />
        </div>
        <div />
      </div>
      <div
        ref={containerRef}
        className="relative h-[100px] overflow-hidden font-mono"
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
                "opacity-0 delay-500": !isInputFocused,
                "animate-pulse": !currentText.length && isInputFocused,
              },
            )}
          />
        </div>
        <div
          className={cn(
            "absolute inset-0 flex items-center justify-center bg-transparent text-white backdrop-blur-sm transition-opacity",
            {
              "opacity-0": isInputFocused,
              "delay-500": !isInputFocused,
            },
          )}
        >
          <span className="flex items-center gap-2 bg-background/50 p-2">
            <Icons.pointer /> Click here or start typing to focus
          </span>
        </div>
      </div>
      <input
        ref={inputRef}
        className="absolute inset-0 cursor-default opacity-0"
        value={currentText}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        onKeyUp={handleKeyUp}
        onBlur={handleInputFocus}
        onFocus={handleInputFocus}
        onPaste={(e) => e.preventDefault()}
        autoFocus
      />
    </div>
  );
};
