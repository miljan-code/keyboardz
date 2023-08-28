"use client";

import { ThemeProvider as NextThemeProvider } from "next-themes";

interface ThemeProviderProps {
  children: React.ReactNode;
}

export const ThemeProvider = ({ children }: ThemeProviderProps) => {
  return (
    <NextThemeProvider defaultTheme="dark-blue" storageKey="keyboardz__theme">
      {children}
    </NextThemeProvider>
  );
};
