import { Icons } from "@/components/icons";
import { TestSettings } from "@/components/test/test-settings";

export const Footer = () => {
  return (
    <footer className="space-y-4 text-sm">
      <div className="flex items-center justify-center gap-12">
        <div className="flex cursor-default gap-1.5">
          <span className="rounded-md bg-foreground px-1.5 font-medium text-background">
            tab
          </span>
          <span>&mdash;</span>
          <span className="font-medium">restart test</span>
        </div>
        <TestSettings />
      </div>
      <div className="flex items-center justify-between">
        <a
          href="https://github.com/miljan-code/keyboardz"
          className="flex items-center gap-1 font-medium text-foreground/60 transition-colors hover:text-foreground/80 sm:text-sm"
          target="_blank"
        >
          <Icons.code size={16} />
          <span>GitHub</span>
        </a>
        <a
          href="https://github.com/miljan-code/keyboardz"
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
