import { useCallback, useEffect } from "react";

interface UseUpdateUIProps<T extends HTMLElement> {
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
}: UseUpdateUIProps<T>) => {
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

function getElementPositionRelativeToParent<T extends Element>(
  child: T,
  parent: T,
) {
  const parentTopOffset = parent.getBoundingClientRect().top;
  const parentLeftOffset = parent.getBoundingClientRect().left;

  const childTopOffset = child.getBoundingClientRect().top;
  const childLeftOffset = child.getBoundingClientRect().left;

  const offsetLeft = childLeftOffset - parentLeftOffset;
  const offsetTop = childTopOffset - parentTopOffset;

  return { offsetLeft, offsetTop };
}
