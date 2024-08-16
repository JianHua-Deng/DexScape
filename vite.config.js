import { defineConfig } from 'vite'
import dotenv from 'dotenv';
import react from '@vitejs/plugin-react'

dotenv.config();
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  define: {
    'process.env': process.env
  },
  server: {
    proxy: {
      '/manga': {
        target: 'https://api.mangadex.org',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/manga/, '/manga')
      },

      '/covers': {
        target: 'https://uploads.mangadex.org',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/covers/, '/covers')
      },

      '/at-home': {
        target: 'https://api.mangadex.org',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/at-home/, '/at-home')
      },

      //You technically don't need to proxy this on dev server, as local domain seems to be whitelisted by mangadex
      //But I am just doing it anyway to be consistent
      "/chapter-image": {
        target: "https://api.mangadex.org",
        changeOrigin: true,
        configure: (proxy, options) => {
          proxy.on("proxyReq", (proxyReq, req) => {
            // Use the original request path, not the rewritten one
            const match = req.url.match(/(?<=https?:\/\/)[^\/]+(?=\/data)/); // Getting the baseUrl in the request
            console.log(`Match: ${match}`);
            if (match) {
              options.target = match.includes("https://") ? `${match}` : `https://${match}`;
              // Rewrite the path here, after extracting the target
              proxyReq.path = proxyReq.path.replace(/^.*(?=\/data)/, ""); //Removing everything before /data
              console.log(`Options target: ${options.target} ProxyPath: ${proxyReq.path}`);
            }
          });
        },
      },
    }
  }


})
