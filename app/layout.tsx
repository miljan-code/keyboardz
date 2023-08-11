import { Inter as FontSans } from "next/font/google";
import localFont from "next/font/local";

import { cn } from "@/lib/utils";
import { Footer } from "@/components/footer";
import { Header } from "@/components/header";

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
    <html lang="en">
      <body
        className={cn(
          fontSans.variable,
          fontHeading.variable,
          "dark font-sans antialiased",
        )}
      >
        <main className="mx-auto grid min-h-screen max-w-7xl grid-flow-row grid-rows-[auto_1fr_auto] gap-6 px-8 py-6">
          <Header />
          {children}
          <Footer />
        </main>
      </body>
    </html>
  );
}
