import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getElementPositionRelativeToParent<T extends Element>(
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
