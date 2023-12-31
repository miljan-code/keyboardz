import { Roboto_Mono as FontMono, Inter as FontSans } from "next/font/google";
import localFont from "next/font/local";

import { cn } from "@/lib/utils";
import { siteConfig } from "@/config/site";
import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { Providers } from "@/components/providers";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/toaster";

import "@/styles/globals.css";

import type { Metadata } from "next";

const fontSans = FontSans({ subsets: ["latin"], variable: "--font-sans" });

const fontMono = FontMono({ subsets: ["latin"], variable: "--font-mono" });

const fontHeading = localFont({
  src: "../assets/fonts/CalSans-SemiBold.woff2",
  variable: "--font-heading",
});

export const metadata: Metadata = {
  title: {
    default: siteConfig.name,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  keywords: [
    "Typing",
    "Typing test",
    "Typing test multiplayer",
    "Typing challenge",
  ],
  authors: [
    {
      name: "miljan",
      url: "https://miljan.xyz",
    },
  ],
  creator: "miljan",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "black" },
  ],
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteConfig.url,
    title: siteConfig.name,
    description: siteConfig.description,
    siteName: siteConfig.name,
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.name,
    description: siteConfig.description,
    images: [`${siteConfig.url}/og.jpg`],
    creator: "@miljan",
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png",
  },
  manifest: `${siteConfig.url}/site.webmanifest`,
  metadataBase: new URL(siteConfig.url),
};

interface RootLayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <Providers>
      <html lang="en" suppressHydrationWarning>
        <body
          className={cn(
            fontSans.variable,
            fontHeading.variable,
            fontMono.variable,
            "theme-blue font-sans antialiased",
          )}
        >
          <ThemeProvider>
            <main className="mx-auto grid min-h-screen max-w-7xl grid-flow-row grid-rows-[auto_1fr_auto] gap-6 md:gap-8">
              <Header />
              {children}
              <Footer />
            </main>
            <Toaster />
          </ThemeProvider>
        </body>
      </html>
    </Providers>
  );
}
