import { defineConfig, loadEnv, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath, URL } from 'node:url';

function resendApiPlugin(): Plugin {
  return {
    name: 'resend-api-middleware',
    configureServer(server) {
      server.middlewares.use('/api/send-email', async (req, res, next) => {
        if (req.method === 'OPTIONS') {
          res.setHeader('Access-Control-Allow-Origin', '*');
          res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
          res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
          res.statusCode = 200;
          res.end();
          return;
        }

        if (req.method === 'POST') {
          let body = '';
          req.on('data', (chunk) => {
            body += chunk;
          });
          req.on('end', async () => {
            res.setHeader('Content-Type', 'application/json');
            res.setHeader('Access-Control-Allow-Origin', '*');
            try {
              const data = JSON.parse(body || '{}');
              const env = loadEnv('development', process.cwd(), '');
              const { processContactSubmission } = await server.ssrLoadModule('/api/send-email.ts');
              const result = await processContactSubmission(data, {
                apiKey: env.RESEND_API_KEY,
                adminEmail: env.ADMIN_EMAIL,
                fromEmail: env.FROM_EMAIL,
              });
              res.statusCode = 200;
              res.end(JSON.stringify(result));
            } catch (err: any) {
              res.statusCode = 400;
              res.end(JSON.stringify({ success: false, error: err?.message || 'Failed to process inquiry' }));
            }
          });
          return;
        }

        next();
      });
    },
  };
}

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), resendApiPlugin()],
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
        secure: false,
        // Bypass /api/send-email if local middleware is handling it
        bypass: (req) => {
          if (req.url?.startsWith('/api/send-email')) {
            return req.url;
          }
          return null;
        }
      }
    }
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
});
