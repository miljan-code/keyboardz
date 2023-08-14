"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useModal } from "@/hooks/use-modal";
import { useTimer } from "@/hooks/use-timer";
import { useWpm } from "@/hooks/use-wpm";

import { cn, getElementPositionRelativeToParent } from "@/lib/utils";
import { Icons } from "@/components/icons";

import type { TestMode } from "@/types/test";

interface TypingBoxProps {
  text: string;
  testMode: TestMode;
}

const MAX_WRONG_LETTERS = 8;

export const TypingBox = ({ text, testMode }: TypingBoxProps) => {
  const [currentText, setCurrentText] = useState("");
  const [isInputFocused, setIsInputFocused] = useState(true);
  const [testFinished, setTestFinished] = useState(false);
  const [testStarted, setTestStarted] = useState(false);
  const [letters, setLetters] = useState<string[]>([]);
  const [addedLetters, setAddedLetters] = useState(0);

  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const caretRef = useRef<HTMLDivElement>(null);
  const newLineLetterRef = useRef<HTMLSpanElement>(null);

  const router = useRouter();

  const { startTimer, stopTimer, resetTimer, elapsedTime } = useTimer();

  const { calculateWPM, startMeasuring, stopMeasuring, wpmStats } = useWpm({
    testMode,
    text,
    elapsedTime,
    input: currentText,
  });

  const { isModalOpen } = useModal();

  const inputLetters = currentText.split("");
  const inputWords = currentText.split(" ");

  useEffect(() => setLetters([...text.split(""), "_"]), [text]);

  const resetCaret = () => {
    if (!caretRef.current) return null;

    caretRef.current.style.top = "0px";
    caretRef.current.style.left = "0px";
  };

  const resetWrapperBox = () => {
    if (!wrapperRef.current) return null;

    wrapperRef.current.style.transform = `translateY(0px)`;
  };

  const resetTest = useCallback(() => {
    const time = testMode.mode === "timer" ? testMode.amount : 0;

    setCurrentText("");
    setTestStarted(false);
    setTestFinished(false);
    setAddedLetters(0);
    stopTimer();
    resetTimer(time);
    resetCaret();
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

  // Event listener for any keystroke to remove input blur
  useEffect(() => {
    const handleFocusOnKeystroke = (e: KeyboardEvent) => {
      if (!inputRef.current) return null;

      if (document.activeElement !== inputRef.current) {
        e.preventDefault();
        inputRef.current.focus();
        setIsInputFocused(true);
      }

      // TODO: add space also
      if (!/^[a-zA-Z]$/.test(e.key)) return null;

      if (!testStarted && !testFinished) {
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
  ]);

  // resets test when mode is changed
  // eslint-disable-next-line
  useEffect(() => resetTest(), [testMode.amount, testMode.mode]);

  const checkForNewLine = useCallback(() => {
    if (!newLineLetterRef.current || !containerRef.current) return null;

    const { offsetTop } = getElementPositionRelativeToParent(
      newLineLetterRef.current,
      containerRef.current,
    );

    const letterHeight =
      newLineLetterRef.current.getBoundingClientRect().height;

    if (offsetTop < 0) resetWrapperBox();

    if (offsetTop > letterHeight) {
      if (!wrapperRef.current) return null;

      const currentTranslateY = parseInt(
        wrapperRef.current.style.transform.slice(11),
      );
      const newTranslateY = currentTranslateY - 32;
      wrapperRef.current.style.transform = `translateY(${newTranslateY}px)`;
    }
  }, []);

  const updateCaret = useCallback(
    (type?: "backspace" | "resize" | "space", distance: number = 0) => {
      if (!newLineLetterRef.current || !wrapperRef.current) return null;

      const { offsetLeft, offsetTop } = getElementPositionRelativeToParent(
        newLineLetterRef.current,
        wrapperRef.current,
      );

      if (!caretRef.current) return null;

      caretRef.current.style.top = `${offsetTop}px`;

      const letterWidth =
        newLineLetterRef.current.getBoundingClientRect().width;

      if (type === "backspace") {
        caretRef.current.style.left = `${offsetLeft - letterWidth * 2}px`;
      } else if (type === "resize") {
        caretRef.current.style.left = `${offsetLeft - letterWidth}px`;
      } else if (type === "space") {
        caretRef.current.style.left = `${
          offsetLeft + letterWidth * distance
        }px`;
      } else {
        caretRef.current.style.left = `${offsetLeft}px`;
      }
    },
    [],
  );

  useEffect(() => {
    const handleCaretAndLineOnResize = () => {
      checkForNewLine();
      updateCaret("resize");
    };

    window.addEventListener("resize", handleCaretAndLineOnResize);

    return () =>
      window.removeEventListener("resize", handleCaretAndLineOnResize);
  }, [checkForNewLine, updateCaret]);

  const handleEndTest = useCallback(() => {
    stopTimer();
    stopMeasuring();
    calculateWPM();

    setTestFinished(true);
    setTestStarted(false);

    // check if authed - save to db

    // show result
  }, [stopTimer, calculateWPM, stopMeasuring]);

  useEffect(() => {
    if (testMode.mode === "words") return;

    if (elapsedTime === 0 && testStarted) handleEndTest();
  }, [elapsedTime, handleEndTest, testStarted, testMode.mode]);

  const checkForEndTestWordsMode = useCallback(
    (input: string) => {
      if (input.length === letters.length - 1 && testMode.mode === "words") {
        setCurrentText(input);
        handleEndTest();
        return null;
      }
    },
    [testMode.mode, letters.length, handleEndTest],
  );

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (testFinished) return null;

      const inputLength = e.currentTarget.value.length;
      const nextLetterToType = letters[inputLength - 1];
      const currentLetter = e.currentTarget.value.at(-1);

      if (currentLetter === " ") {
        if (nextLetterToType === " ") {
          checkForNewLine();
          setAddedLetters(0);
        } else {
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
    },
    [
      testFinished,
      checkForNewLine,
      updateCaret,
      currentText,
      letters,
      addedLetters,
    ],
  );

  // Fixes backspace bug, resets caret if input is empty
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!testStarted) return null;
    if (!currentText.length) resetCaret();

    const index = e.currentTarget.value.length - 1;
    if (e.key === "Backspace") {
      const letter = letters[index];

      if (letter === " " || !letter) return null;
      if (letter !== letter.toUpperCase()) return null;

      setLetters([...letters].splice(index, 1));
      setAddedLetters((prev) => prev - 1);
    }

    if (e.key === "Backspace" && e.ctrlKey) {
      const arr = [...letters];
      for (let i = index; i >= 0; i--) {
        if (letters[i] === " ") break;
        else if (letters[i] === letters[i].toUpperCase()) {
          arr.splice(i, 1);
        } else break;
      }

      setAddedLetters(0);
      setLetters(arr);
      updateCaret();
    }
  };

  const handleKeyUp = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && e.ctrlKey) {
      updateCaret("resize");
    }

    checkForEndTestWordsMode(e.currentTarget.value);
  };

  const handleInputFocus = useCallback(
    (e: React.FocusEvent<HTMLInputElement, Element>) => {
      if (e.type === "blur") setIsInputFocused(false);
      else setIsInputFocused(true);
    },
    [],
  );

  return (
    <div className="relative">
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
              ref={i === currentText.length + 1 ? newLineLetterRef : null}
              className={cn("relative text-2xl text-foreground/60", {
                "text-primary":
                  i <= currentText.length && inputLetters[i] === letters[i],
                "text-red-500":
                  i <= currentText.length - 1 && inputLetters[i] !== letters[i],
                "new-line": i === currentText.length + 1,
                invisible: i === letters.length - 1,
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
