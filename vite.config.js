import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  base: "/inab-app/",
  plugins: [react()],
  server: {
    hmr: true,
  },
});
