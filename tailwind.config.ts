import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./PARTICIPANT_DASHBOARD/**/*.{js,ts,jsx,tsx,mdx}",
    "./JUDGE_DASHBOARD/**/*.{js,ts,jsx,tsx,mdx}",
    "./ORGANISER_DASHBOARD/**/*.{js,ts,jsx,tsx,mdx}",
    "./LOGIN_SIGNIN PAGE/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        border: "hsl(240 3.7% 15.9%)",
      },
    },
  },
  plugins: [],
};

export default config;
