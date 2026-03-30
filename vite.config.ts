import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import type { Plugin } from "vite";

import { buildBlogPosts } from "./scripts/blog-content-utils.mjs";

const BLOG_INDEX_VIRTUAL_MODULE_ID = "virtual:blog-posts-index";
const BLOG_FULL_VIRTUAL_MODULE_ID = "virtual:blog-posts-full";
const RESOLVED_BLOG_INDEX_VIRTUAL_MODULE_ID = `\0${BLOG_INDEX_VIRTUAL_MODULE_ID}`;
const RESOLVED_BLOG_FULL_VIRTUAL_MODULE_ID = `\0${BLOG_FULL_VIRTUAL_MODULE_ID}`;

function isVendorModule(id: string): boolean {
  const normalizedId = id.replace(/\\/g, "/");

  return (
    normalizedId.includes('/node_modules/react/') ||
    normalizedId.includes('/node_modules/react-dom/') ||
    normalizedId.includes('/node_modules/react-router/') ||
    normalizedId.includes('/node_modules/react-router-dom/') ||
    normalizedId.includes('/node_modules/@remix-run/router/') ||
    normalizedId.includes('/node_modules/@tanstack/react-query/')
  );
}

function blogContentPlugin(): Plugin {
  const docsDir = path.resolve(__dirname, "./docs-blogs");
  const markdownGlob = path.join(docsDir, "**/*.md");
  const isBlogContentFile = (file: string) => file.startsWith(docsDir) && file.endsWith(".md");

  return {
    name: "tuwebai-blog-content",
    resolveId(id) {
      if (id === BLOG_INDEX_VIRTUAL_MODULE_ID) {
        return RESOLVED_BLOG_INDEX_VIRTUAL_MODULE_ID;
      }

      if (id === BLOG_FULL_VIRTUAL_MODULE_ID) {
        return RESOLVED_BLOG_FULL_VIRTUAL_MODULE_ID;
      }

      return null;
    },
    load(id) {
      const posts = buildBlogPosts(docsDir);

      if (id === RESOLVED_BLOG_INDEX_VIRTUAL_MODULE_ID) {
        const postsIndex = posts.map(({ html, markdown, headings, ...summary }) => summary);
        return `export const blogPostsIndex = ${JSON.stringify(postsIndex, null, 2)};`;
      }

      if (id === RESOLVED_BLOG_FULL_VIRTUAL_MODULE_ID) {
        return `export const blogPostsFull = ${JSON.stringify(posts, null, 2)};`;
      }

      return null;
    },
    buildStart() {
      this.addWatchFile(docsDir);
      this.addWatchFile(markdownGlob);
    },
    configureServer(server) {
      server.watcher.add(docsDir);
      server.watcher.add(markdownGlob);

      const triggerReload = (file: string) => {
        if (!isBlogContentFile(file)) {
          return;
        }

        const virtualModules = [
          server.moduleGraph.getModuleById(RESOLVED_BLOG_INDEX_VIRTUAL_MODULE_ID),
          server.moduleGraph.getModuleById(RESOLVED_BLOG_FULL_VIRTUAL_MODULE_ID),
        ];

        for (const virtualModule of virtualModules) {
          if (virtualModule) {
            server.moduleGraph.invalidateModule(virtualModule);
          }
        }

        server.ws.send({ type: "full-reload" });
      };

      server.watcher.on("add", triggerReload);
      server.watcher.on("unlink", triggerReload);
    },
    handleHotUpdate(context) {
      if (!isBlogContentFile(context.file)) {
        return;
      }

      const virtualModules = [
        context.server.moduleGraph.getModuleById(RESOLVED_BLOG_INDEX_VIRTUAL_MODULE_ID),
        context.server.moduleGraph.getModuleById(RESOLVED_BLOG_FULL_VIRTUAL_MODULE_ID),
      ];

      for (const virtualModule of virtualModules) {
        if (virtualModule) {
          context.server.moduleGraph.invalidateModule(virtualModule);
        }
      }

      context.server.ws.send({ type: "full-reload" });
    },
  };
}

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');

  return {
    define: {
      __GA_MEASUREMENT_ID__: JSON.stringify(env.GA_MEASUREMENT_ID ?? ''),
    },
    plugins: [react(), blogContentPlugin()],
  root: "./client",
  envDir: "..",
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./client/src"),
    },
  },
  build: {
    outDir: "../dist",
    emptyOutDir: true,
    sourcemap: false,
    modulePreload: {
      resolveDependencies: (_url: string, deps: string[]) =>
        deps.filter(
          (dep) =>
            !dep.includes('firebase-') &&
            !dep.includes('motion-') &&
            !dep.includes('radix-'),
        ),
    },
    // Aumentar el límite de warning para chunks lazy (no afecta el index)
    chunkSizeWarningLimit: 600,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (isVendorModule(id)) {
            return 'vendor';
          }
          // Firebase SDK — chunk propio para no contaminar el bundle principal
          if (id.includes('node_modules/firebase') || id.includes('node_modules/@firebase')) {
            return 'firebase';
          }
          // framer-motion — chunk propio (~100kB separado del boot)
          if (id.includes('node_modules/framer-motion')) {
            return 'motion';
          }
          // Radix UI — chunk propio para componentes UI pesados
          if (id.includes('/node_modules/@radix-ui/')) {
            return 'radix';
          }
        },
      },
    },
  },
    server: {
      port: 5173,
      host: true,
      watch: {
        // En Windows, el watcher puede perder eventos; polling evita reinicios manuales.
        usePolling: true,
        interval: 100,
      },
    },
  };
});
