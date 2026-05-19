// @ts-check
import { defineConfig } from "astro/config";
import vue from "@astrojs/vue";
import cloudflare from "@astrojs/cloudflare";
import embed from "astro-embed/integration";
import mdx from "@astrojs/mdx";
import rehypeExternalLinks from "rehype-external-links";
import tailwindcss from "@tailwindcss/vite";

// https://astro.build/config
export default defineConfig({
  site: "https://hashir.blog", // Updated to actual custom domain
  output: "server", // Server-side rendering for Cloudflare
  adapter: cloudflare({
    imageService: "compile",
    prerenderEnvironment: "node",
  }),

  integrations: [
    embed(),
    mdx(),
    vue(),
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
      "hashir.blog",
      "hashblog.pages.dev", // Keep for compatibility during transition
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
    plugins: [tailwindcss()],
    build: {
      cssMinify: "esbuild",
    },
    environments: {
      client: {
        build: {
          rollupOptions: {
            output: {
              assetFileNames: "assets/[name].[hash].[ext]",
              chunkFileNames: "assets/[name].[hash].js",
              entryFileNames: "assets/[name].[hash].js",
            },
          },
        },
      },
    },
    ssr: {
      noExternal: ["fuse.js"],
    },
  },
});
