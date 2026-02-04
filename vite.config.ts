import { defineConfig } from "vite";

// https://vitejs.dev/config/
export default defineConfig({
  base: "/korzh-developer/",
  build: {
    assetsDir: "",
  },
  resolve: {
    alias: {
      '@/': new URL('./src/', import.meta.url).pathname
    }
  }
});
