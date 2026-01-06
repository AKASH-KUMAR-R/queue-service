import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": "/src",
      "@app": "/src/app",
      "@shared": "/src/shared",
      "@features": "/src/features",
      "@entities": "/src/entities",
      "@widgets": "/src/widgets",
      "@pages": "/src/pages",
    },
  },
});
