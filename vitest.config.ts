import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vitest/config";

export default defineConfig({
  plugins: [tailwindcss()],
  test: {
    coverage: {
      all: false,
      enabled: true,
      provider: "v8",
      reporter: "text",
      thresholds: {
        statements: 80,
      },
    },
    environment: "node",
    watch: false,
  },
});
