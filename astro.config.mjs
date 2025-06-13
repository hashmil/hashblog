// @ts-check
import { defineConfig } from "astro/config";
import vue from "@astrojs/vue";
import tailwind from "@astrojs/tailwind";
import cloudflare from "@astrojs/cloudflare";
import embed from "astro-embed/integration";
import mdx from "@astrojs/mdx";
import rehypeExternalLinks from "rehype-external-links";

// https://astro.build/config
export default defineConfig({
  site: "https://hashblog.pages.dev", // Update to your actual Cloudflare Pages URL
  output: "server", // Server-side rendering for Cloudflare
  adapter: cloudflare({
    imageService: "compile",
    routes: {
      extend: {
        exclude: [{ pattern: "/assets/*" }],
      },
    },
  }),

  integrations: [
    embed(),
    mdx(),
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
    rehypePlugins: [
      [
        rehypeExternalLinks,
        { target: "_blank", rel: ["noopener", "noreferrer"] },
      ],
    ],
  },

  image: {
    domains: [
      "localhost",
      "images.unsplash.com",
      "via.placeholder.com",
      "hashblog.pages.dev",
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
