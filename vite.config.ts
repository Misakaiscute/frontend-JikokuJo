import { defineConfig } from 'vitest/config';
import { svelte } from '@sveltejs/vite-plugin-svelte';
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [
      tailwindcss(),
      svelte()
  ],
  test: {
    projects: [{
      plugins: [svelte()],
      resolve: process.env.VITEST
        ? { conditions: ["browser"] }
        : undefined,
      test: {
        name: "component",
        environment: "jsdom",
        include: ["tests/**/component/**/*.svelte.test.ts", "tests/**/component/**/*.svelte.test.js"],
        globals: true,
        setupFiles: ["tests/componentTest.setup.ts"]
      }
    },
    {
      test: {
        name: "unit",
        environment: "node",
        include: ["tests/**/unit/**/*.test.ts", "tests/**/unit/**/*.test.js"]
      }
    }]
  }
})
