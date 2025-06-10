// @ts-check
import { defineConfig } from "astro/config";
import vue from "@astrojs/vue";
import tailwind from "@astrojs/tailwind";
import node from "@astrojs/node";

// https://astro.build/config
export default defineConfig({
  site: "https://your-app-name.fly.dev", // Update this with your actual Fly.io app name
  output: "server", // Server-side rendering for Fly.io
  adapter: node({
    mode: "standalone",
  }),

  integrations: [
    vue(),
    tailwind({
      applyBaseStyles: false,
    }),
  ],

  markdown: {
    shikiConfig: {
      theme: "github-dark",
      langs: [],
      wrap: true,
    },
  },

  image: {
    domains: [
      "localhost",
      "images.unsplash.com",
      "via.placeholder.com",
      "your-app-name.fly.dev",
    ],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**.unsplash.com",
      },
    ],
  },

  build: {
    inlineStylesheets: "always",
    assetsPrefix: "/", // Ensure assets are served from root
  },

  compressHTML: true,

  prefetch: {
    prefetchAll: true,
    defaultStrategy: "viewport",
  },

  experimental: {
    clientPrerender: true,
  },

  vite: {
    build: {
      cssMinify: "esbuild",
      rollupOptions: {
        output: {
          assetFileNames: "assets/[name].[hash].[ext]",
          chunkFileNames: "assets/[name].[hash].js",
          entryFileNames: "assets/[name].[hash].js",
        },
      },
    },
    ssr: {
      noExternal: ["fuse.js"],
    },
  },
});
