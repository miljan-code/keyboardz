import type { NavItem, SiteConfig } from "@/types";

const nav: NavItem[] = [
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
];

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
  nav,
  mobileMenu: [
    {
      title: "Practice",
      href: "/",
    },
    ...nav,
    {
      title: "Profile",
      href: "/profile",
    },
  ],
};
