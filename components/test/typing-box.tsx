"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

import { cn, getElementPositionRelativeToParent } from "@/lib/utils";
import { Icons } from "@/components/icons";

interface TypingBoxProps {
  text: string;
}

export const TypingBox = ({ text }: TypingBoxProps) => {
  const [currentText, setCurrentText] = useState("");
  const [isInputFocused, setIsInputFocused] = useState(true);
  const [testFinished, setTestFinished] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const caretRef = useRef<HTMLDivElement>(null);

  const router = useRouter();

  const letters = text.split("");
  const inputLetters = currentText.split("");

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
    setCurrentText("");
    setTestFinished(false);
    resetCaret();
    resetWrapperBox();
    router.refresh();
  }, [router]);

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
  }, [router, resetTest]);

  // Event listener for any keystroke to remove input blur
  useEffect(() => {
    const handleFocusOnKeystroke = (e: KeyboardEvent) => {
      if (!inputRef.current) return null;

      if (document.activeElement !== inputRef.current) {
        e.preventDefault();
        inputRef.current.focus();
        setIsInputFocused(true);
      }

      // Will be useful for timer
      if (!/^[a-zA-Z]$/.test(e.key)) return null;
    };

    window.addEventListener("keydown", handleFocusOnKeystroke);

    return () => window.removeEventListener("keydown", handleFocusOnKeystroke);
  }, []);

  const checkForNewLine = useCallback(() => {
    const newLineLetter = document.querySelector(".new-line");

    if (!newLineLetter || !containerRef.current) return null;

    const { offsetTop } = getElementPositionRelativeToParent(
      newLineLetter,
      containerRef.current,
    );

    const letterHeight = newLineLetter.getBoundingClientRect().height;

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

  const updateCaret = useCallback((type?: "backspace" | "resize") => {
    const newLineLetter = document.querySelector(".new-line");

    if (!newLineLetter || !wrapperRef.current) return null;

    const { offsetLeft, offsetTop } = getElementPositionRelativeToParent(
      newLineLetter,
      wrapperRef.current,
    );

    if (!caretRef.current) return null;

    caretRef.current.style.top = `${offsetTop}px`;

    const letterWidth = newLineLetter.getBoundingClientRect().width;

    if (type === "backspace") {
      caretRef.current.style.left = `${offsetLeft - letterWidth * 2}px`;
    } else if (type === "resize") {
      caretRef.current.style.left = `${offsetLeft - letterWidth}px`;
    } else {
      caretRef.current.style.left = `${offsetLeft}px`;
    }
  }, []);

  useEffect(() => {
    const handleCaretAndLineOnResize = () => {
      checkForNewLine();
      updateCaret("resize");
    };

    window.addEventListener("resize", handleCaretAndLineOnResize);

    return () =>
      window.removeEventListener("resize", handleCaretAndLineOnResize);
  }, [checkForNewLine, updateCaret]);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (testFinished) return null;

      const inputLength = e.currentTarget.value.length;
      const nextLetterToType = text[inputLength - 1];
      const currentLetter = e.currentTarget.value.at(-1);

      if (nextLetterToType === " ") {
        if (currentLetter !== " ") return null;
        if (currentLetter === " ") checkForNewLine();
      }

      if (currentText.length > inputLength) updateCaret("backspace");
      else updateCaret();

      setCurrentText(e.currentTarget.value);
    },
    [testFinished, text, checkForNewLine, updateCaret, currentText],
  );

  // Fixes backspace bug, resets caret if input is empty
  const handleKeyDown = () => {
    if (!currentText.length) resetCaret();
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
      <div ref={containerRef} className="h-[100px] overflow-hidden font-mono">
        <div
          ref={wrapperRef}
          className="-translate-y-0"
          style={{ transform: "translateY(-0px)" }}
        >
          {letters.map((letter, i) => (
            <span
              key={letter + i}
              className={cn("relative text-2xl text-foreground/60", {
                "text-primary":
                  i <= currentText.length && inputLetters[i] === letters[i],
                "text-red-500":
                  i <= currentText.length - 1 && inputLetters[i] !== letters[i],
                "new-line": i === currentText.length + 1,
              })}
            >
              {letter}
            </span>
          ))}
          <div
            ref={caretRef}
            className={cn(
              "absolute inset-0 h-8 w-[3px] rounded-md bg-primary/80",
              {
                "opacity-0 delay-500": !isInputFocused,
                "animate-pulse": !currentText.length,
              },
            )}
          />
        </div>
      </div>
      <div
        className={cn(
          "absolute inset-0 -ml-2 flex items-center justify-center bg-transparent text-white backdrop-blur-sm transition-opacity",
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
      <input
        ref={inputRef}
        className="absolute inset-0 cursor-default opacity-0"
        value={currentText}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        onBlur={handleInputFocus}
        onFocus={handleInputFocus}
        onPaste={(e) => e.preventDefault()}
        autoFocus
      />
    </div>
  );
};
