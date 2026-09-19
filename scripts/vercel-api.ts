import "dotenv/config";
import type { Request, Response } from "express";
import { createApiApp } from "../server/_core/apiApp";

const app = createApiApp();

// Vercel forwards all /api/* requests here with the original path in `route`.
// Restore that path before Express and tRPC handle the request.
export default function handler(req: Request, res: Response) {
  const url = new URL(req.url, "http://localhost");
  const route = url.searchParams.get("route");
  if (!route || !/^(trpc\/|oauth\/callback$|manus-storage\/|cron\/events$)/.test(route)) {
    res.status(404).end();
    return;
  }
  url.searchParams.delete("route");
  req.url = `/api/${route}${url.search}`;
  app(req, res);
}
