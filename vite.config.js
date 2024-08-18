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

      //You technically don't need to proxy this on dev server, as local domain is whitelisted by mangadex
      //But I am just doing it anyway to be consistent
      '/chapter-image': {
        //Technically not supposed to hardcode target URL like this, as it may get you IP banned since the baseUrl are given by Mangadex based on YOUR geographic location
        //but the very first request always end up being 404 due to the proxy directly using target's url without first modifying, so I had to hardcode it just in case
        target: "https://cmdxd98sb0x3yprd.mangadex.network",
        changeOrigin: true,
        configure: (proxy, options) => {
          proxy.on("proxyReq", (proxyReq, req) => {
            console.log(`Original URL: ${req.url}`);
            // Use the original request path to extract baseUrl
            const match = req.url.match(/(?<=https?:\/\/)[^\/]+(?=\/data)/); // Getting the baseUrl and only the baseUrl from the request
            console.log(`Match: ${match}`);
            if (match) {
              options.target = match.includes('https://') ? `${match}` : `https://${match}`;
              // Rewrite the path here, after extracting the target
              proxyReq.path = proxyReq.path.replace(/^.*(?=\/data)/, ""); //Removing everything before '/data/...' for rewriting path
              console.log(`Options target: ${options.target} ProxyPath: ${proxyReq.path}`);
            }
          });
        },
      },
    }
  }


})
