import { Inter as FontSans } from "next/font/google";
import localFont from "next/font/local";
import { cn } from "@/lib/utils";
import "@/styles/globals.css";
import type { Metadata } from "next";

const fontSans = FontSans({ subsets: ["latin"], variable: "--font-sans" });

const fontHeading = localFont({
  src: "../assets/fonts/CalSans-SemiBold.woff2",
  variable: "--font-heading",
});

export const metadata: Metadata = {
  title: "Keyboardz",
  description: "Typing test competition",
};

interface RootLayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en" className="dark">
      <body
        className={cn(
          fontSans.variable,
          fontHeading.variable,
          "font-sans antialiased",
        )}
      >
        {children}
      </body>
    </html>
  );
}
