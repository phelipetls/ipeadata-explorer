import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";
import istanbulPlugin from 'vite-plugin-istanbul';

export default defineConfig({
  build: {
    outDir: "build",
    sourcemap: true,
  },
  plugins: [
    tsconfigPaths(),
    istanbulPlugin({
      requireEnv: true,
      cypress: true,
      checkProd: false
    })
  ],
});
