import type { Metadata } from "next";

import { Settings } from "@/components/settings";

export const metadata: Metadata = {
  title: "Settings",
};

export default async function SettingsPage() {
  return (
    <section className="space-y-6 px-8">
      <div className="flex flex-col gap-2">
        <h2 className="text-3xl font-bold leading-tight tracking-tighter md:text-5xl lg:leading-[1.1]">
          Settings
        </h2>
        <span className="text-foreground/60">Customize app to your needs.</span>
      </div>
      <Settings />
    </section>
  );
}
