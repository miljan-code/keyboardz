"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Session } from "next-auth";
import { signIn, signOut } from "next-auth/react";

import { cn } from "@/lib/utils";
import { siteConfig } from "@/config/site";
import { Icons } from "@/components/icons";

interface MobileMenuProps {
  session: Session | null;
}

export const MobileMenu = ({ session }: MobileMenuProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const pathname = usePathname();

  useEffect(() => {
    setIsMenuOpen(false);
  }, [pathname]);

  return (
    <>
      <div className="md:hidden">
        {isMenuOpen ? (
          <Icons.close
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="cursor-pointer"
            size={28}
          />
        ) : (
          <Icons.menu
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="cursor-pointer"
            size={28}
          />
        )}
      </div>
      <div
        className={cn(
          "fixed left-0 top-[60px] z-50 flex h-full w-full translate-x-full flex-col border-t bg-background/90 backdrop-blur-sm transition-transform",
          {
            "translate-x-0": isMenuOpen,
          },
        )}
      >
        {siteConfig.mobileMenu.map((item) => (
          <Link
            key={item.title}
            href={item.href}
            className="border-b px-8 py-4 text-2xl font-medium transition-colors hover:text-muted-foreground"
          >
            {item.title}
          </Link>
        ))}
        {session ? (
          <button
            onClick={() => signOut()}
            className="border-b px-8 py-4 text-left text-2xl font-medium transition-colors hover:text-muted-foreground"
          >
            Logout
          </button>
        ) : (
          <button
            onClick={() => signIn("google")}
            className="border-b px-8 py-4 text-left text-2xl font-medium transition-colors hover:text-muted-foreground"
          >
            Sign in
          </button>
        )}
      </div>
    </>
  );
};
