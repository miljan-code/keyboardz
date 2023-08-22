import Link from "next/link";

import { getSession } from "@/lib/auth";
import { siteConfig } from "@/config/site";
import { AuthButton } from "@/components/auth/auth-button";
import { Icons } from "@/components/icons";
import { MobileMenu } from "@/components/mobile-menu";

export const Header = async () => {
  const session = await getSession();

  return (
    <header className="after:bg-header-separator sticky top-0 z-50 flex justify-between bg-background px-8 py-4 after:absolute after:bottom-0 after:left-0 after:h-[1px] after:w-full md:grid md:grid-cols-[auto_1fr_auto] md:gap-10">
      <Link href="/" className="flex items-center gap-2">
        <Icons.logo className="-mt-0.5" />
        <span className="font-bold">{siteConfig.name}</span>
      </Link>
      <nav className="hidden gap-6 md:flex">
        {siteConfig.nav.map((navItem) => (
          <Link
            key={navItem.title}
            href={navItem.href}
            className="flex items-center text-lg font-medium text-foreground/60 transition-colors hover:text-foreground/80 sm:text-sm"
          >
            {navItem.title}
          </Link>
        ))}
      </nav>
      <div className="hidden gap-6 md:flex">
        {session ? (
          <Link
            href="/profile"
            className="flex items-center gap-1 font-medium text-foreground/60 transition-colors hover:text-foreground/80 sm:text-sm"
          >
            <Icons.user size={16} />
            <span>{session.user.name}</span>
          </Link>
        ) : null}
        <AuthButton session={session} />
      </div>
      <MobileMenu session={session} />
    </header>
  );
};
