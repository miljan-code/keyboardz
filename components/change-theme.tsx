"use client";

import { useTheme } from "next-themes";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export const ChangeTheme = () => {
  const { theme, setTheme } = useTheme();

  return (
    <Select
      defaultValue={theme ?? "dark-blue"}
      onValueChange={(value) => setTheme(value)}
    >
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Theme" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="light">Light</SelectItem>
        <SelectItem value="dark-blue">Dark Blue</SelectItem>
        {/* <SelectItem value="dark-green">Dark Green</SelectItem> */}
      </SelectContent>
    </Select>
  );
};
