import { useCallback, useEffect } from "react";

import { getElementPositionRelativeToParent } from "@/lib/utils";

interface UseCaretProps<T extends HTMLElement> {
  caretRef: React.RefObject<T>;
  letterRef: React.RefObject<T>;
  wrapperRef: React.RefObject<T>;
  containerRef: React.RefObject<T>;
}

export const useUpdateUI = <T extends HTMLElement>({
  caretRef,
  letterRef,
  wrapperRef,
  containerRef,
}: UseCaretProps<T>) => {
  const updateCaret = useCallback(
    (
      type?: "backspace" | "resize" | "space" | "reset",
      distance: number = 0,
    ) => {
      if (!letterRef.current || !wrapperRef.current) return null;

      const { offsetLeft, offsetTop } = getElementPositionRelativeToParent(
        letterRef.current,
        wrapperRef.current,
      );

      if (!caretRef.current) return null;

      caretRef.current.style.top = `${offsetTop}px`;

      const letterWidth = letterRef.current.getBoundingClientRect().width;

      if (type === "backspace") {
        caretRef.current.style.left = `${offsetLeft - letterWidth * 2}px`;
      } else if (type === "resize") {
        caretRef.current.style.left = `${offsetLeft - letterWidth}px`;
      } else if (type === "space") {
        caretRef.current.style.left = `${
          offsetLeft + letterWidth * distance
        }px`;
      } else if (type === "reset") {
        caretRef.current.style.top = "0px";
        caretRef.current.style.left = "0px";
      } else {
        caretRef.current.style.left = `${offsetLeft}px`;
      }
    },
    [caretRef, letterRef, wrapperRef],
  );

  const resetWrapperBox = useCallback(() => {
    if (!wrapperRef.current) return null;

    wrapperRef.current.style.transform = `translateY(0px)`;
  }, [wrapperRef]);

  const checkForNewLine = useCallback(() => {
    if (!letterRef.current || !containerRef.current) return null;

    const { offsetTop } = getElementPositionRelativeToParent(
      letterRef.current,
      containerRef.current,
    );

    const letterHeight = letterRef.current.getBoundingClientRect().height;

    if (offsetTop < 0) resetWrapperBox();

    if (offsetTop > letterHeight) {
      if (!wrapperRef.current) return null;

      const currentTranslateY = parseInt(
        wrapperRef.current.style.transform.slice(11),
      );
      const newTranslateY = currentTranslateY - 32;
      wrapperRef.current.style.transform = `translateY(${newTranslateY}px)`;
    }
  }, [containerRef, letterRef, wrapperRef, resetWrapperBox]);

  useEffect(() => {
    const handleCaretAndLineOnResize = () => {
      checkForNewLine();
      updateCaret("resize");
    };

    window.addEventListener("resize", handleCaretAndLineOnResize);

    return () =>
      window.removeEventListener("resize", handleCaretAndLineOnResize);
  }, [checkForNewLine, updateCaret]);

  return { updateCaret, resetWrapperBox, checkForNewLine };
};
