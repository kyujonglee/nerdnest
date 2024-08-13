import { nextui } from "@nextui-org/theme";
import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./services/**/*.{js,ts,jsx,tsx,mdx}",
    "./shared/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  safelist: [
    "from-[#6886F8]",
    "to-[#6455EC]",
    "from-[#FBAB3C]",
    "to-[#FB8B66]",
    "from-[#0BBC86]",
    "to-[#0AA9AC]",
    "from-[#ED5F6B]",
    "to-[#D23B47]",
    "from-[#1497F2]",
    "to-[#515AE0]",
  ],
  theme: {},
  darkMode: "class",
  plugins: [
    nextui({
      themes: {
        light: {
          colors: {
            primary: { foreground: "#FFFFFF", DEFAULT: "#598ADD" },
          },
        },
      },
    }),
  ],
};
export default config;
