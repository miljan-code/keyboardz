"use client";

import { useState } from "react";

import { siteConfig } from "@/config/site";
import { Button } from "@/components/ui/button";

interface CopyLinkButtonProps {
  userId: string;
}

export const CopyLinkButton = ({ userId }: CopyLinkButtonProps) => {
  const [buttonText, setButtonText] = useState<"Copied" | "Copy link">(
    "Copy link",
  );

  const handleCopyLink = () => {
    navigator.clipboard.writeText(`${siteConfig.url}/profile/${userId}`);
    setButtonText("Copied");
    setTimeout(() => {
      setButtonText("Copy link");
    }, 1500);
  };

  return (
    <Button
      disabled={buttonText === "Copied"}
      onClick={handleCopyLink}
      variant="outline"
      size="sm"
    >
      {buttonText}
    </Button>
  );
};
