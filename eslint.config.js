// @ts-check

import eslint from "@eslint/js";
import next from "@next/eslint-plugin-next";
import react from "eslint-plugin-react";
import vitest from "eslint-plugin-vitest";
import tseslint from "typescript-eslint";

export default [
  {
    ignores: [".next/**", "out/**"],
  },
  ...tseslint.config(
    eslint.configs.recommended,
    ...tseslint.configs.recommended
  ),
  {
    plugins: {
      react,
    },
    rules: {
      ...react.configs.recommended.rules,
      "react/jsx-uses-react": 0,
      "react/react-in-jsx-scope": 0,
    },
    settings: {
      react: {
        version: "detect",
      },
    },
  },
  {
    plugins: {
      "@next/next": next,
    },
    rules: {
      ...next.configs.recommended.rules,
    },
  },
  {
    files: ["__tests__/**"],
    plugins: {
      vitest,
    },
    rules: {
      ...vitest.configs.recommended.rules,
    },
  },
];
