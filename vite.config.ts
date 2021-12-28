import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";
import istanbulPlugin from 'vite-plugin-istanbul';
import reactRefresh from '@vitejs/plugin-react-refresh'

export default defineConfig({
  build: {
    outDir: "build",
    sourcemap: true,
  },
  plugins: [
    tsconfigPaths(),
    reactRefresh(),
    istanbulPlugin({
      requireEnv: true,
      cypress: true,
      checkProd: false
    })
  ],
});
