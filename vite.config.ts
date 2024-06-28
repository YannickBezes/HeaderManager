import {defineConfig} from "vite";
import vue from "@vitejs/plugin-vue";
import {crx} from "@crxjs/vite-plugin";
import svgLoader from "vite-svg-loader";
import manifest from "./manifest.config";

export default defineConfig({
  build: {
    outDir: "HeaderManager"
  },
  server: {
    port: 5173,
    strictPort: true,
    hmr: {
      port: 5173
    }
  },
  plugins: [
    svgLoader(),
    vue(),
    crx({manifest: manifest})
  ]
});
