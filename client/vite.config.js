import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  define: {
    "process.env": {},
  },
  build: {
    // Customize as needed
    outDir: 'dist',  // The output directory for build files
  },
});
