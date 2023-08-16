import { useEffect, useState } from "react";

export const useCapslockStatus = () => {
  const [isCaps, setIsCaps] = useState(false);

  const handleKeyPress = (e: KeyboardEvent) => {
    const capslockStatus = e.getModifierState("CapsLock");
    setIsCaps(capslockStatus);
  };

  useEffect(() => {
    window.addEventListener("keyup", handleKeyPress);

    return () => window.removeEventListener("keyup", handleKeyPress);
  }, []);

  return { isCaps };
};
