"use client";

import type { Session } from "next-auth";
import { signIn, signOut } from "next-auth/react";

import { Button } from "@/components/ui/button";

interface AuthButtonProps {
  session: Session | null;
}

export const AuthButton = ({ session }: AuthButtonProps) => {
  if (!session)
    return (
      <Button variant="secondary" size="sm" onClick={() => signIn("google")}>
        Sign In
      </Button>
    );

  return (
    <Button variant="secondary" size="sm" onClick={() => signOut()}>
      Sign Out
    </Button>
  );
};
