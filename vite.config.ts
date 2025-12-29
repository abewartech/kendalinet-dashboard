import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    // Proxy ke router OpenWrt saat development,
    // supaya call ke /cgi-bin dan /ubus tidak kena CORS / 404 di localhost
    proxy: {
      "/cgi-bin": {
        target: "http://192.168.2.1",
        changeOrigin: true,
      },
      "/ubus": {
        target: "http://192.168.2.1",
        changeOrigin: true,
      },
    },
  },
  base: "./",
  plugins: [react(), mode === "development" && componentTagger()].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
