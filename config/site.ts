import type { SiteConfig } from "@/types";

export const siteConfig: SiteConfig = {
  name: "Keyboardz",
  description: "Typing test competition",
  url:
    process.env.NODE_ENV === "development"
      ? "http://localhost:3000"
      : "https://keyboardz.miljan.xyz",
  links: {
    github: "https://github.com/miljan-code/keyboardz",
  },
  nav: [
    {
      title: "Leaderboard",
      href: "/leaderboard",
    },
    {
      title: "Lobby",
      href: "/lobby",
    },
    {
      title: "Settings",
      href: "/settings",
    },
  ],
};
