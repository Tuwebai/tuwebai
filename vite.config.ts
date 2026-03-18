import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import type { Plugin } from "vite";

import { buildBlogPosts } from "./scripts/blog-content-utils.mjs";

const BLOG_VIRTUAL_MODULE_ID = "virtual:blog-posts";
const RESOLVED_BLOG_VIRTUAL_MODULE_ID = `\0${BLOG_VIRTUAL_MODULE_ID}`;

function blogContentPlugin(): Plugin {
  const docsDir = path.resolve(__dirname, "./docs-blogs");
  const markdownGlob = path.join(docsDir, "**/*.md");
  const isBlogContentFile = (file: string) => file.startsWith(docsDir) && file.endsWith(".md");

  return {
    name: "tuwebai-blog-content",
    resolveId(id) {
      if (id === BLOG_VIRTUAL_MODULE_ID) {
        return RESOLVED_BLOG_VIRTUAL_MODULE_ID;
      }

      return null;
    },
    load(id) {
      if (id !== RESOLVED_BLOG_VIRTUAL_MODULE_ID) {
        return null;
      }

      const posts = buildBlogPosts(docsDir);
      return `export const blogPosts = ${JSON.stringify(posts, null, 2)};`;
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

        const virtualModule = server.moduleGraph.getModuleById(RESOLVED_BLOG_VIRTUAL_MODULE_ID);
        if (virtualModule) {
          server.moduleGraph.invalidateModule(virtualModule);
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

      const virtualModule = context.server.moduleGraph.getModuleById(RESOLVED_BLOG_VIRTUAL_MODULE_ID);
      if (virtualModule) {
        context.server.moduleGraph.invalidateModule(virtualModule);
      }

      context.server.ws.send({ type: "full-reload" });
    },
  };
}

// https://vitejs.dev/config/
export default defineConfig({
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
          // Firebase SDK — chunk propio para no contaminar el bundle principal
          if (id.includes('node_modules/firebase') || id.includes('node_modules/@firebase')) {
            return 'firebase';
          }
          // framer-motion — chunk propio (~100kB separado del boot)
          if (id.includes('node_modules/framer-motion')) {
            return 'motion';
          }
          // Radix UI — chunk propio para componentes UI pesados
          if (id.includes('node_modules/@radix-ui')) {
            return 'radix';
          }
          // Dejar que Vite maneje React, React-DOM, y React-Router nativamente
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
});
