import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";
import { exec } from "child_process";

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
  plugins: [
    react(),
    mode === "development" && componentTagger(),
    {
      name: 'deploy-plugin',
      configureServer(server: any) {
        server.middlewares.use((req: any, res: any, next: any) => {
          if (req.url === '/api/deploy' && req.method === 'POST') {
            console.log('[Deploy] Triggered from dashboard');
            const scriptPath = path.join(process.cwd(), 'AUTOMATION', 'deploy.js');

            exec(`node "${scriptPath}"`, (error: any, stdout: any, stderr: any) => {
              res.setHeader('Content-Type', 'application/json');
              if (error) {
                console.error(`[Deploy] Error: ${error.message}`);
                res.statusCode = 500;
                res.end(JSON.stringify({ success: false, error: error.message, details: stderr }));
              } else {
                console.log(`[Deploy] Success: ${stdout}`);
                res.statusCode = 200;
                res.end(JSON.stringify({ success: true, message: 'Scripts pushed successfully', output: stdout }));
              }
            });
          } else {
            next();
          }
        });
      }
    }
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
