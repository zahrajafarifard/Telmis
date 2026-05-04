import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
      screens: {
        screen1720: { max: "1720px" },
        screen1680: { max: "1680px" },
        screen1650: { max: "1650px" },
        screen1560: { max: "1560px" },
        screen1540: { max: "1540px" },
        screen1460: { max: "1460px" },
        screen1440: { max: "1440px" },
        screen1360: { max: "1360px" },
        screen1300: { max: "1300px" },
        screen1270: { max: "1270px" },
        screen1250: { max: "1250px" },
        screen1200: { max: "1200px" },
        screen1150: { max: "1150px" },
        screen1100: { max: "1100px" },
        screen1050: { max: "1050px" },
        screen1000: { max: "1000px" },
        screen950: { max: "950px" },
        screen890: { max: "890px" },
        screen850: { max: "850px" },
        screen820: { max: "820px" },
        screen790: { max: "790px" },
        screen770: { max: "770px" },
        screen750: { max: "750px" },
        screen730: { max: "730px" },
        screen705: { max: "705px" },
        screen690: { max: "690px" },
        screen630: { max: "630px" },
        screen550: { max: "550px" },
        screen500: { max: "500px" },
        screen450: { max: "450px" },
        screen400: { max: "400px" },
        screen350: { max: "350px" },
      },
    },
  },
  plugins: [],
};
export default config;
