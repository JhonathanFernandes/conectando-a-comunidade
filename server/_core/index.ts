import "dotenv/config";
import express from "express";
import { createServer } from "http";
import net from "net";
import { createExpressMiddleware } from "@trpc/server/adapters/express";
import { registerOAuthRoutes } from "./oauth";
import { registerStorageProxy } from "./storageProxy";
import { appRouter } from "../routers";
import { createContext } from "./context";
import { ENV } from "./env";
import { serveStatic, setupVite } from "./vite";

function isPortAvailable(port: number): Promise<boolean> {
  return new Promise(resolve => {
    const server = net.createServer();
    server.listen(port, () => {
      server.close(() => resolve(true));
    });
    server.on("error", () => resolve(false));
  });
}

async function findAvailablePort(startPort: number = 3000): Promise<number> {
  for (let port = startPort; port < startPort + 20; port++) {
    if (await isPortAvailable(port)) {
      return port;
    }
  }
  throw new Error(`No available port found starting from ${startPort}`);
}

async function startServer() {
  const app = express();
  const server = createServer(app);
  // Configure body parser with larger size limit for file uploads
  app.use(express.json({ limit: "50mb" }));
  app.use(express.urlencoded({ limit: "50mb", extended: true }));
  registerStorageProxy(app);
  registerOAuthRoutes(app);

  app.use("/forge-maps", async (req, res) => {
    const path = req.path.replace(/^\/forge-maps/, "") || "/";
    if (!ENV.forgeApiUrl || !ENV.forgeApiKey) {
      res.status(503).json({
        error: "Google Maps proxy not configured",
        message: "Set BUILT_IN_FORGE_API_URL and BUILT_IN_FORGE_API_KEY to enable the map proxy.",
      });
      return;
    }

    try {
      const upstream = new URL(`${ENV.forgeApiUrl.replace(/\/+$/, "")}/v1/maps/proxy${path}`);
      for (const [key, value] of Object.entries(req.query)) {
        if (Array.isArray(value)) {
          value.forEach((item) => upstream.searchParams.append(key, String(item)));
        } else if (value !== undefined) {
          upstream.searchParams.set(key, String(value));
        }
      }

      const response = await fetch(upstream.toString());
      const body = await response.arrayBuffer();
      res.status(response.status);
      response.headers.forEach((value, key) => {
        if (key.toLowerCase() !== "content-encoding") {
          res.setHeader(key, value);
        }
      });
      res.send(Buffer.from(body));
    } catch (error) {
      console.error("[Forge Maps Proxy] failed:", error);
      res.status(502).json({ error: "Maps proxy unavailable" });
    }
  });

  // tRPC API
  app.use(
    "/api/trpc",
    createExpressMiddleware({
      router: appRouter,
      createContext,
    })
  );
  // development mode uses Vite, production mode uses static files
  if (process.env.NODE_ENV === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  const preferredPort = parseInt(process.env.PORT || "3000");
  const port = await findAvailablePort(preferredPort);

  if (port !== preferredPort) {
    console.log(`Port ${preferredPort} is busy, using port ${port} instead`);
  }

  server.listen(port, () => {
    console.log(`Server running on http://localhost:${port}/`);
  });
}

startServer().catch(console.error);
