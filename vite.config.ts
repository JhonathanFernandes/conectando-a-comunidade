import { jsxLocPlugin } from "@builder.io/vite-plugin-jsx-loc";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import fs from "node:fs";
import path from "node:path";
import { defineConfig, type Plugin, type ViteDevServer } from "vite";
import { createRequire } from "node:module";
const require = createRequire(import.meta.url);
import { vitePluginManusRuntime } from "vite-plugin-manus-runtime";

// =============================================================================
// Manus Debug Collector - Vite Plugin
// Writes browser logs directly to files, trimmed when exceeding size limit
// =============================================================================

const PROJECT_ROOT = import.meta.dirname;
const LOG_DIR = path.join(PROJECT_ROOT, ".manus-logs");
const MAX_LOG_SIZE_BYTES = 1 * 1024 * 1024; // 1MB per log file
const TRIM_TARGET_BYTES = Math.floor(MAX_LOG_SIZE_BYTES * 0.6); // Trim to 60% to avoid constant re-trimming

type LogSource = "browserConsole" | "networkRequests" | "sessionReplay";

function ensureLogDir() {
  if (!fs.existsSync(LOG_DIR)) {
    fs.mkdirSync(LOG_DIR, { recursive: true });
  }
}

function trimLogFile(logPath: string, maxSize: number) {
  try {
    if (!fs.existsSync(logPath) || fs.statSync(logPath).size <= maxSize) {
      return;
    }

    const lines = fs.readFileSync(logPath, "utf-8").split("\n");
    const keptLines: string[] = [];
    let keptBytes = 0;

    // Keep newest lines (from end) that fit within 60% of maxSize
    const targetSize = TRIM_TARGET_BYTES;
    for (let i = lines.length - 1; i >= 0; i--) {
      const lineBytes = Buffer.byteLength(`${lines[i]}\n`, "utf-8");
      if (keptBytes + lineBytes > targetSize) break;
      keptLines.unshift(lines[i]);
      keptBytes += lineBytes;
    }

    fs.writeFileSync(logPath, keptLines.join("\n"), "utf-8");
  } catch {
    /* ignore trim errors */
  }
}

function writeToLogFile(source: LogSource, entries: unknown[]) {
  if (entries.length === 0) return;

  ensureLogDir();
  const logPath = path.join(LOG_DIR, `${source}.log`);

  // Format entries with timestamps
  const lines = entries.map((entry) => {
    const ts = new Date().toISOString();
    return `[${ts}] ${JSON.stringify(entry)}`;
  });

  // Append to log file
  fs.appendFileSync(logPath, `${lines.join("\n")}\n`, "utf-8");

  // Trim if exceeds max size
  trimLogFile(logPath, MAX_LOG_SIZE_BYTES);
}

/**
 * Vite plugin to collect browser debug logs
 * - POST /__manus__/logs: Browser sends logs, written directly to files
 * - Files: browserConsole.log, networkRequests.log, sessionReplay.log
 * - Auto-trimmed when exceeding 1MB (keeps newest entries)
 */
function vitePluginManusDebugCollector(): Plugin {
  return {
    name: "manus-debug-collector",

    transformIndexHtml(html) {
      if (process.env.NODE_ENV === "production") {
        return html;
      }
      return {
        html,
        tags: [
          {
            tag: "script",
            attrs: {
              src: "/__manus__/debug-collector.js",
              defer: true,
            },
            injectTo: "head",
          },
        ],
      };
    },

    configureServer(server: ViteDevServer) {
      // POST /__manus__/logs: Browser sends logs (written directly to files)
      server.middlewares.use("/__manus__/logs", (req, res, next) => {
        if (req.method !== "POST") {
          return next();
        }

        const handlePayload = (payload: any) => {
          // Write logs directly to files
          if (payload.consoleLogs?.length > 0) {
            writeToLogFile("browserConsole", payload.consoleLogs);
          }
          if (payload.networkRequests?.length > 0) {
            writeToLogFile("networkRequests", payload.networkRequests);
          }
          if (payload.sessionEvents?.length > 0) {
            writeToLogFile("sessionReplay", payload.sessionEvents);
          }

          res.writeHead(200, { "Content-Type": "application/json" });
          res.end(JSON.stringify({ success: true }));
        };

        const reqBody = (req as { body?: unknown }).body;
        if (reqBody && typeof reqBody === "object") {
          try {
            handlePayload(reqBody);
          } catch (e) {
            res.writeHead(400, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ success: false, error: String(e) }));
          }
          return;
        }

        let body = "";
        req.on("data", (chunk) => {
          body += chunk.toString();
        });

        req.on("end", () => {
          try {
            const payload = JSON.parse(body);
            handlePayload(payload);
          } catch (e) {
            res.writeHead(400, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ success: false, error: String(e) }));
          }
        });
      });
    },
  };
}

/**
 * Dev-only proxy for Google Maps API.
 * The forge.manus.ai proxy validates the Origin header and rejects localhost.
 * This plugin forwards /forge-maps/* requests to forge.manus.ai with the
 * correct preview origin header so maps load during local development.
 */
function vitePluginMapsProxy(): Plugin {
  return {
    name: "manus-maps-proxy",
    configureServer(server: ViteDevServer) {
      // Only active in development
      if (process.env.NODE_ENV !== "development") return;

      server.middlewares.use("/forge-maps", (req, res, next) => {
        if (req.method !== "GET") return next();

        const forgeKey = process.env.VITE_FRONTEND_FORGE_API_KEY || "";
        const forgeBaseUrl = process.env.VITE_FRONTEND_FORGE_API_URL || "https://forge.manus.ai";
        const previewOrigin = "https://3000-ijjvkmwfn7q8rwd82ihiv-7d59f262.us3.manus.computer";

        // Build the target URL: /forge-maps/maps/api/js?... -> https://forge.manus.ai/v1/maps/proxy/maps/api/js?...
        const targetPath = `/v1/maps/proxy${req.url || ""}`;
        const targetUrl = `${forgeBaseUrl}${targetPath}`;

        // Make the request with the correct Origin header
        const https = require("https");
        const urlObj = new URL(targetUrl);
        const options = {
          hostname: urlObj.hostname,
          path: urlObj.pathname + urlObj.search,
          method: "GET",
          headers: {
            Origin: previewOrigin,
            Referer: previewOrigin,
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
          },
        };

        const proxyReq = https.request(options, (proxyRes: import("node:http").IncomingMessage) => {
          // Set CORS headers to allow the browser to access this response
          res.writeHead(proxyRes.statusCode || 200, {
            "Content-Type": proxyRes.headers["content-type"] || "application/javascript",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET",
            "Cache-Control": "public, max-age=3600",
          });
          proxyRes.pipe(res);
        });

        proxyReq.on("error", (err: Error) => {
          console.error("[Maps Proxy] Error:", err.message);
          res.writeHead(500, { "Content-Type": "application/json" });
          res.end(JSON.stringify({ error: "Maps proxy failed" }));
        });

        proxyReq.end();
      });
    },
  };
}

const plugins = process.env.GITHUB_PAGES === "true"
  ? [react(), tailwindcss()]
  : [react(), tailwindcss(), jsxLocPlugin(), vitePluginManusRuntime(), vitePluginManusDebugCollector(), vitePluginMapsProxy()];

export default defineConfig({
  plugins,

  base: process.env.GITHUB_PAGES === "true"
    ? "/conectando-a-comunidade/"
    : "/",

  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "client", "src"),
      "@shared": path.resolve(import.meta.dirname, "shared"),
      "@assets": path.resolve(import.meta.dirname, "attached_assets"),
    },
  },
  envDir: path.resolve(import.meta.dirname),
  root: path.resolve(import.meta.dirname, "client"),
  publicDir: path.resolve(import.meta.dirname, "client", "public"),
  build: {
    outDir: path.resolve(import.meta.dirname, "dist/public"),
    emptyOutDir: true,
  },
  server: {
    host: true,
    allowedHosts: [
      ".manuspre.computer",
      ".manus.computer",
      ".manus-asia.computer",
      ".manuscomputer.ai",
      ".manusvm.computer",
      "localhost",
      "127.0.0.1",
    ],
    proxy: {
      // Proxy Google Maps API calls to the forge proxy in development
      // The browser cannot set Origin on script tags, so we proxy through our own server
      "/forge-maps": {
        target: "https://forge.manus.ai",
        changeOrigin: true,
        rewrite: (path) => `/v1/maps/proxy${path.replace(/^\/forge-maps/, "")}`,
        headers: {
          Origin: "https://3000-ijjvkmwfn7q8rwd82ihiv-7d59f262.us3.manus.computer",
        },
      },
    },
    fs: {
      strict: true,
      deny: ["**/.*"],
    },
  },
});
