"use client";

import { useCallback, useRef, useState } from "react";

import { cn } from "@/lib/utils";
import { Icons } from "../icons";

interface TypingBoxProps {
  text: string;
}

const LINE_BREAK_HEIGHT = 40;

export const TypingBox = ({ text }: TypingBoxProps) => {
  const [currentText, setCurrentText] = useState("");

  const [isInputFocused, setIsInputFocused] = useState(true);
  // const [testFinished, setTestFinished] = useState(false);

  const letters = text.split("");
  const inputLetters = currentText.split("");

  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const checkForNewLine = useCallback(() => {
    const activeLetter = document.querySelector(".new-line");

    if (!activeLetter || !containerRef.current) return null;

    const letterTopOffset = activeLetter.getBoundingClientRect().top;

    const divTopOffset = containerRef.current.getBoundingClientRect().top;

    if (letterTopOffset - divTopOffset > LINE_BREAK_HEIGHT) {
      if (!wrapperRef.current) return null;

      const currentTranslateY = parseInt(
        wrapperRef.current.style.transform.slice(11),
      );
      const newTranslateY = currentTranslateY - 32;
      wrapperRef.current.style.transform = `translateY(${newTranslateY}px)`;
    }
  }, []);

  const handleOnChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      // if (testFinished) return null;

      const nextLetterToType = text[e.currentTarget.value.length - 1];
      const currentLetter = e.currentTarget.value.at(-1);

      if (nextLetterToType === " " && currentLetter !== " ") {
        return null;
      }
      if (nextLetterToType === " " && currentLetter === " ") {
        checkForNewLine();
      }

      setCurrentText(e.currentTarget.value);
    },
    [text, checkForNewLine],
  );

  const handleInputFocus = useCallback(
    (e: React.FocusEvent<HTMLInputElement, Element>) => {
      if (e.type === "blur") {
        setIsInputFocused(false);
      } else if (e.type === "focus") {
        setIsInputFocused(true);
      }
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
        </div>
      </div>
      {!isInputFocused && (
        <div className="absolute inset-0 -ml-2 flex items-center justify-center bg-transparent text-white backdrop-blur-sm">
          <span className="flex items-center gap-2 bg-background/50 p-2">
            <Icons.pointer /> Click here or start typing to focus
          </span>
        </div>
      )}
      <input
        ref={inputRef}
        className="absolute inset-0 cursor-default opacity-0"
        value={currentText}
        onChange={handleOnChange}
        onBlur={handleInputFocus}
        onFocus={handleInputFocus}
        onPaste={(e) => e.preventDefault()}
        autoFocus
      />
    </div>
  );
};
