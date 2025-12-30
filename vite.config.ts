import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";
import { spawn } from "child_process";

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
            console.log('\n[Deploy] 🚀 Triggered from dashboard');
            const scriptPath = path.join(process.cwd(), 'AUTOMATION', 'deploy.js');

            const child = spawn('node', [scriptPath]);
            let output = '';
            let errorOutput = '';

            child.stdout.on('data', (data: any) => {
              const str = data.toString();
              process.stdout.write(`[Deploy-Log] ${str}`);
              output += str;
            });

            child.stderr.on('data', (data: any) => {
              const str = data.toString();
              process.stderr.write(`[Deploy-Err] ${str}`);
              errorOutput += str;
            });

            child.on('close', (code: number) => {
              res.setHeader('Content-Type', 'application/json');
              if (code === 0) {
                console.log('[Deploy] ✅ Success');
                res.statusCode = 200;
                res.end(JSON.stringify({ success: true, message: 'Deployment complete', output }));
              } else {
                console.error(`[Deploy] ❌ Failed with code ${code}`);
                res.statusCode = 500;
                res.end(JSON.stringify({
                  success: false,
                  error: `Exit code ${code}`,
                  details: errorOutput || 'Unknown error'
                }));
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
