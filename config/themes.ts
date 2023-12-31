import { type DEFAULT_COLOR as ChartColors } from "@tremor/react/dist/lib/theme";

export const chartTheme = {
  light: ["blue", "cyan"],
  "dark-blue": ["blue", "cyan"],
  "dark-green": ["green", "lime"],
  yellow: ["yellow", "orange"],
  neutral: ["neutral", "slate"],
  slate: ["slate", "neutral"],
} as Record<string, (typeof ChartColors)[]>;
