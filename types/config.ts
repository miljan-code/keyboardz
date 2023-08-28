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
  mobileMenu: NavItem[];
};
