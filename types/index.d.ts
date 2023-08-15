import type { EnvSchema } from "@/lib/env";

declare global {
  namespace NodeJS {
    interface ProcessEnv extends EnvSchema {}
  }
}

export type NavItem = {
  title: string;
  href: string;
  disabled?: boolean;
};

export type SiteConfig = {
  name: string;
  description: string;
  url: string;
  links: {
    github: string;
  };
  nav: NavItem[];
};
