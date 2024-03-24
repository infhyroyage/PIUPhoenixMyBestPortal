import { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{css,js,ts,jsx,tsx}"],
  plugins: [require("tailwindcss"), require("autoprefixer")],
};

module.exports = config;
