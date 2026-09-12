import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// If you deploy to GitHub Pages as a project site
// (https://<user>.github.io/<repo>/), set base to "/<repo>/".
// If you deploy to a custom domain or a user/organization page
// (https://<user>.github.io/), leave base as "/".
export default defineConfig({
  plugins: [react()],
  base: "/liste/",
});
