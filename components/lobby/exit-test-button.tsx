"use client";

import { useRouter } from "next/navigation";

import { Button } from "../ui/button";

export const ExitTestButton = () => {
  const router = useRouter();

  const handleExitTest = () => {
    router.push("/lobby");
  };

  return (
    <Button size="sm" onClick={handleExitTest} variant="destructive">
      Exit test
    </Button>
  );
};
