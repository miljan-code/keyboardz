"use client";

import { useAtom } from "jotai";
import { useTheme } from "next-themes";

import { settingsAtom } from "@/lib/atoms";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";

export const Settings = () => {
  const { theme, setTheme } = useTheme();
  const [settings, setSettings] = useAtom(settingsAtom);

  return (
    <div className="w-1/2 space-y-4">
      <div className="flex items-center justify-between">
        <Label>Theme</Label>
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
            <SelectItem value="dark-green">Dark Green</SelectItem>
            <SelectItem value="yellow">Yellow</SelectItem>
            <SelectItem value="neutral">Neutral</SelectItem>
            <SelectItem value="slate">Slate</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="flex items-center justify-between">
        <Label>Show live wpm</Label>
        <Switch
          checked={settings.liveWpm}
          onCheckedChange={() =>
            setSettings({ ...settings, liveWpm: !settings.liveWpm })
          }
        />
      </div>
    </div>
  );
};
