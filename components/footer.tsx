import { siteConfig } from "@/config/site";
import { Icons } from "@/components/icons";

export const Footer = () => {
  return (
    <footer className="space-y-4 px-8 py-6 text-sm">
      <div className="flex items-center justify-between">
        <a
          href={siteConfig.links.github}
          className="flex items-center gap-1 font-medium text-foreground/60 transition-colors hover:text-foreground/80 sm:text-sm"
          target="_blank"
        >
          <Icons.code size={16} />
          <span>GitHub</span>
        </a>
        <a
          href={siteConfig.links.github}
          className="flex items-center gap-1 font-medium text-foreground/60 transition-colors hover:text-foreground/80 sm:text-sm"
          target="_blank"
        >
          <Icons.git size={16} />
          <span>v0.1.0</span>
        </a>
      </div>
    </footer>
  );
};
