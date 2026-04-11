import { defineConfig } from 'vitest/config';
import { svelte } from '@sveltejs/vite-plugin-svelte';
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [
      tailwindcss(),
      svelte()
  ],
  test: {
      environment: "jsdom"
  },
  resolve: process.env.VITEST
    ? { conditions: ["browser"] }
    : undefined
})
