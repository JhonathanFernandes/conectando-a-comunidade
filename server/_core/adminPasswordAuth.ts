import { createHash, createHmac, timingSafeEqual } from "node:crypto";
import type { Request } from "express";
import { parse } from "cookie";
import type { User } from "../../drizzle/schema";

export const ADMIN_COOKIE_NAME = "campo_admin_session";
export const ADMIN_SESSION_MS = 1000 * 60 * 60 * 12;

function sessionSecret() {
  return process.env.ADMIN_SESSION_SECRET || "";
}

function safeEqual(left: string, right: string) {
  const leftHash = createHash("sha256").update(left).digest();
  const rightHash = createHash("sha256").update(right).digest();
  return timingSafeEqual(leftHash, rightHash);
}

export function passwordLoginConfigured() {
  return Boolean(process.env.ADMIN_USERNAME && process.env.ADMIN_PASSWORD && sessionSecret());
}

export function validAdminCredentials(username: string, password: string) {
  if (!passwordLoginConfigured()) return false;
  const nameMatches = safeEqual(username, process.env.ADMIN_USERNAME!);
  const passwordMatches = safeEqual(password, process.env.ADMIN_PASSWORD!);
  return nameMatches && passwordMatches;
}

export function createAdminSession(now = Date.now()) {
  const secret = sessionSecret();
  if (!secret) throw new Error("ADMIN_SESSION_SECRET is required");
  const payload = Buffer.from(JSON.stringify({ version: 1, expiresAt: now + ADMIN_SESSION_MS })).toString("base64url");
  const signature = createHmac("sha256", secret).update(payload).digest("base64url");
  return `${payload}.${signature}`;
}

export function verifyAdminSession(token: string, now = Date.now()) {
  const secret = sessionSecret();
  if (!secret) return false;
  const parts = token.split(".");
  if (parts.length !== 2) return false;
  const [payload, signature] = parts;
  const expected = createHmac("sha256", secret).update(payload).digest("base64url");
  if (!safeEqual(signature, expected)) return false;
  try {
    const data = JSON.parse(Buffer.from(payload, "base64url").toString("utf8")) as { version?: unknown; expiresAt?: unknown };
    return data.version === 1 && typeof data.expiresAt === "number" && data.expiresAt > now;
  } catch {
    return false;
  }
}

export function getPasswordAdmin(req: Request): User | null {
  const token = parse(req.headers.cookie || "")[ADMIN_COOKIE_NAME];
  if (!token || !verifyAdminSession(token)) return null;
  const now = new Date();
  return {
    id: 0,
    openId: "password-admin",
    name: "Administrador",
    email: null,
    loginMethod: "password",
    role: "admin",
    createdAt: now,
    updatedAt: now,
    lastSignedIn: now,
  };
}

export function adminCookieOptions(req: Request) {
  const forwardedProto = req.headers["x-forwarded-proto"];
  const isHttps = req.secure || forwardedProto === "https" || (typeof forwardedProto === "string" && forwardedProto.split(",").some((value) => value.trim() === "https"));
  return { httpOnly: true as const, sameSite: "lax" as const, secure: isHttps, path: "/" };
}
