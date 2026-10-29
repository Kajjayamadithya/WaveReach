import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
// Direct CORS connection to Python FastAPI backend (No proxy server in package.json)
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    host: true,
  },
});

