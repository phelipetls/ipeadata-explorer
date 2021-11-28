import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  build: {
    outDir: "build",
    sourcemap: true,
  },
  plugins: [tsconfigPaths()],
});
