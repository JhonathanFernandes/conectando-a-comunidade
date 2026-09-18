var __defProp = Object.defineProperty;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __esm = (fn, res) => function __init() {
  return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
};
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};

// server/_core/env.ts
var ENV;
var init_env = __esm({
  "server/_core/env.ts"() {
    "use strict";
    ENV = {
      appId: process.env.VITE_APP_ID ?? "",
      cookieSecret: process.env.JWT_SECRET ?? "",
      databaseUrl: process.env.DATABASE_URL ?? "",
      oAuthServerUrl: process.env.OAUTH_SERVER_URL ?? "",
      ownerOpenId: process.env.OWNER_OPEN_ID ?? "",
      isProduction: process.env.NODE_ENV === "production",
      forgeApiUrl: process.env.BUILT_IN_FORGE_API_URL ?? "",
      forgeApiKey: process.env.BUILT_IN_FORGE_API_KEY ?? ""
    };
  }
});

// server/storage.ts
var storage_exports = {};
__export(storage_exports, {
  storageGet: () => storageGet,
  storageGetSignedUrl: () => storageGetSignedUrl,
  storagePut: () => storagePut
});
function getForgeConfig() {
  const forgeUrl = ENV.forgeApiUrl;
  const forgeKey = ENV.forgeApiKey;
  if (!forgeUrl || !forgeKey) {
    throw new Error(
      "Storage config missing: set BUILT_IN_FORGE_API_URL and BUILT_IN_FORGE_API_KEY"
    );
  }
  return { forgeUrl: forgeUrl.replace(/\/+$/, ""), forgeKey };
}
function normalizeKey(relKey) {
  return relKey.replace(/^\/+/, "");
}
function appendHashSuffix(relKey) {
  const hash = crypto.randomUUID().replace(/-/g, "").slice(0, 8);
  const lastDot = relKey.lastIndexOf(".");
  if (lastDot === -1) return `${relKey}_${hash}`;
  return `${relKey.slice(0, lastDot)}_${hash}${relKey.slice(lastDot)}`;
}
async function storagePut(relKey, data, contentType = "application/octet-stream") {
  const { forgeUrl, forgeKey } = getForgeConfig();
  const key = appendHashSuffix(normalizeKey(relKey));
  const presignUrl = new URL("v1/storage/presign/put", forgeUrl + "/");
  presignUrl.searchParams.set("path", key);
  const presignResp = await fetch(presignUrl, {
    headers: { Authorization: `Bearer ${forgeKey}` }
  });
  if (!presignResp.ok) {
    const msg = await presignResp.text().catch(() => presignResp.statusText);
    throw new Error(`Storage presign failed (${presignResp.status}): ${msg}`);
  }
  const { url: s3Url } = await presignResp.json();
  if (!s3Url) throw new Error("Forge returned empty presign URL");
  const blob = typeof data === "string" ? new Blob([data], { type: contentType }) : new Blob([data], { type: contentType });
  const uploadResp = await fetch(s3Url, {
    method: "PUT",
    headers: { "Content-Type": contentType },
    body: blob
  });
  if (!uploadResp.ok) {
    throw new Error(`Storage upload to S3 failed (${uploadResp.status})`);
  }
  return { key, url: `/manus-storage/${key}` };
}
async function storageGet(relKey) {
  const key = normalizeKey(relKey);
  return { key, url: `/manus-storage/${key}` };
}
async function storageGetSignedUrl(relKey) {
  const { forgeUrl, forgeKey } = getForgeConfig();
  const key = normalizeKey(relKey);
  const getUrl = new URL("v1/storage/presign/get", forgeUrl + "/");
  getUrl.searchParams.set("path", key);
  const resp = await fetch(getUrl, {
    headers: { Authorization: `Bearer ${forgeKey}` }
  });
  if (!resp.ok) {
    const msg = await resp.text().catch(() => resp.statusText);
    throw new Error(`Storage signed URL failed (${resp.status}): ${msg}`);
  }
  const { url } = await resp.json();
  return url;
}
var init_storage = __esm({
  "server/storage.ts"() {
    "use strict";
    init_env();
  }
});

// scripts/vercel-api.ts
import "dotenv/config";

// server/_core/apiApp.ts
import express from "express";
import { createExpressMiddleware } from "@trpc/server/adapters/express";

// shared/const.ts
var COOKIE_NAME = "app_session_id";
var ONE_YEAR_MS = 1e3 * 60 * 60 * 24 * 365;
var AXIOS_TIMEOUT_MS = 3e4;
var UNAUTHED_ERR_MSG = "Please login (10001)";
var NOT_ADMIN_ERR_MSG = "You do not have required permission (10002)";
var OAUTH_STATE_COOKIE = "__Host-oauth_state";
var decodeOAuthState = (state) => {
  let decoded;
  try {
    decoded = atob(state);
  } catch {
    return { redirectUri: "" };
  }
  try {
    const parsed = JSON.parse(decoded);
    if (parsed && typeof parsed.redirectUri === "string") return parsed;
  } catch {
  }
  return { redirectUri: decoded };
};

// server/routers.ts
import { z as z2 } from "zod";
import { eq as eq3, desc as desc3 } from "drizzle-orm";

// server/_core/cookies.ts
function isSecureRequest(req) {
  if (req.protocol === "https") return true;
  const forwardedProto = req.headers["x-forwarded-proto"];
  if (!forwardedProto) return false;
  const protoList = Array.isArray(forwardedProto) ? forwardedProto : forwardedProto.split(",");
  return protoList.some((proto) => proto.trim().toLowerCase() === "https");
}
function getSessionCookieOptions(req) {
  return {
    httpOnly: true,
    path: "/",
    sameSite: "none",
    secure: isSecureRequest(req)
  };
}

// server/_core/adminPasswordAuth.ts
import { createHash, createHmac, timingSafeEqual } from "node:crypto";
import { parse } from "cookie";
var ADMIN_COOKIE_NAME = "campo_admin_session";
var ADMIN_SESSION_MS = 1e3 * 60 * 60 * 12;
function sessionSecret() {
  return process.env.ADMIN_SESSION_SECRET || "";
}
function safeEqual(left, right) {
  const leftHash = createHash("sha256").update(left).digest();
  const rightHash = createHash("sha256").update(right).digest();
  return timingSafeEqual(leftHash, rightHash);
}
function passwordLoginConfigured() {
  return Boolean(process.env.ADMIN_USERNAME && process.env.ADMIN_PASSWORD && sessionSecret());
}
function validAdminCredentials(username, password) {
  if (!passwordLoginConfigured()) return false;
  const nameMatches = safeEqual(username, process.env.ADMIN_USERNAME);
  const passwordMatches = safeEqual(password, process.env.ADMIN_PASSWORD);
  return nameMatches && passwordMatches;
}
function createAdminSession(now = Date.now()) {
  const secret = sessionSecret();
  if (!secret) throw new Error("ADMIN_SESSION_SECRET is required");
  const payload = Buffer.from(JSON.stringify({ version: 1, expiresAt: now + ADMIN_SESSION_MS })).toString("base64url");
  const signature = createHmac("sha256", secret).update(payload).digest("base64url");
  return `${payload}.${signature}`;
}
function verifyAdminSession(token, now = Date.now()) {
  const secret = sessionSecret();
  if (!secret) return false;
  const parts = token.split(".");
  if (parts.length !== 2) return false;
  const [payload, signature] = parts;
  const expected = createHmac("sha256", secret).update(payload).digest("base64url");
  if (!safeEqual(signature, expected)) return false;
  try {
    const data = JSON.parse(Buffer.from(payload, "base64url").toString("utf8"));
    return data.version === 1 && typeof data.expiresAt === "number" && data.expiresAt > now;
  } catch {
    return false;
  }
}
function getPasswordAdmin(req) {
  const token = parse(req.headers.cookie || "")[ADMIN_COOKIE_NAME];
  if (!token || !verifyAdminSession(token)) return null;
  const now = /* @__PURE__ */ new Date();
  return {
    id: 0,
    openId: "password-admin",
    name: "Administrador",
    email: null,
    loginMethod: "password",
    role: "admin",
    createdAt: now,
    updatedAt: now,
    lastSignedIn: now
  };
}
function adminCookieOptions(req) {
  const forwardedProto = req.headers["x-forwarded-proto"];
  const isHttps = req.secure || forwardedProto === "https" || typeof forwardedProto === "string" && forwardedProto.split(",").some((value) => value.trim() === "https");
  return { httpOnly: true, sameSite: "lax", secure: isHttps, path: "/" };
}

// server/routers.ts
import { TRPCError as TRPCError3 } from "@trpc/server";

// server/_core/systemRouter.ts
import { z } from "zod";

// server/_core/notification.ts
init_env();
import { TRPCError } from "@trpc/server";
var TITLE_MAX_LENGTH = 1200;
var CONTENT_MAX_LENGTH = 2e4;
var trimValue = (value) => value.trim();
var isNonEmptyString = (value) => typeof value === "string" && value.trim().length > 0;
var buildEndpointUrl = (baseUrl) => {
  const normalizedBase = baseUrl.endsWith("/") ? baseUrl : `${baseUrl}/`;
  return new URL(
    "webdevtoken.v1.WebDevService/SendNotification",
    normalizedBase
  ).toString();
};
var validatePayload = (input) => {
  if (!isNonEmptyString(input.title)) {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: "Notification title is required."
    });
  }
  if (!isNonEmptyString(input.content)) {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: "Notification content is required."
    });
  }
  const title = trimValue(input.title);
  const content = trimValue(input.content);
  if (title.length > TITLE_MAX_LENGTH) {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: `Notification title must be at most ${TITLE_MAX_LENGTH} characters.`
    });
  }
  if (content.length > CONTENT_MAX_LENGTH) {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: `Notification content must be at most ${CONTENT_MAX_LENGTH} characters.`
    });
  }
  return { title, content };
};
async function notifyOwner(payload) {
  const { title, content } = validatePayload(payload);
  if (!ENV.forgeApiUrl) {
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "Notification service URL is not configured."
    });
  }
  if (!ENV.forgeApiKey) {
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "Notification service API key is not configured."
    });
  }
  const endpoint = buildEndpointUrl(ENV.forgeApiUrl);
  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        accept: "application/json",
        authorization: `Bearer ${ENV.forgeApiKey}`,
        "content-type": "application/json",
        "connect-protocol-version": "1"
      },
      body: JSON.stringify({ title, content })
    });
    if (!response.ok) {
      const detail = await response.text().catch(() => "");
      console.warn(
        `[Notification] Failed to notify owner (${response.status} ${response.statusText})${detail ? `: ${detail}` : ""}`
      );
      return false;
    }
    return true;
  } catch (error) {
    console.warn("[Notification] Error calling notification service:", error);
    return false;
  }
}

// server/_core/trpc.ts
import { initTRPC, TRPCError as TRPCError2 } from "@trpc/server";
import superjson from "superjson";
var t = initTRPC.context().create({
  transformer: superjson
});
var router = t.router;
var publicProcedure = t.procedure;
var requireUser = t.middleware(async (opts) => {
  const { ctx, next } = opts;
  if (!ctx.user) {
    throw new TRPCError2({ code: "UNAUTHORIZED", message: UNAUTHED_ERR_MSG });
  }
  return next({
    ctx: {
      ...ctx,
      user: ctx.user
    }
  });
});
var protectedProcedure = t.procedure.use(requireUser);
var adminProcedure = t.procedure.use(
  t.middleware(async (opts) => {
    const { ctx, next } = opts;
    if (!ctx.user || ctx.user.role !== "admin") {
      throw new TRPCError2({ code: "FORBIDDEN", message: NOT_ADMIN_ERR_MSG });
    }
    return next({
      ctx: {
        ...ctx,
        user: ctx.user
      }
    });
  })
);

// server/_core/systemRouter.ts
var systemRouter = router({
  health: publicProcedure.input(
    z.object({
      timestamp: z.number().min(0, "timestamp cannot be negative")
    })
  ).query(() => ({
    ok: true
  })),
  notifyOwner: adminProcedure.input(
    z.object({
      title: z.string().min(1, "title is required"),
      content: z.string().min(1, "content is required")
    })
  ).mutation(async ({ input }) => {
    const delivered = await notifyOwner(input);
    return {
      success: delivered
    };
  })
});

// server/db.ts
import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

// drizzle/schema.ts
import { boolean, date, index, integer, pgEnum, pgTable, serial, text, timestamp, uniqueIndex, varchar } from "drizzle-orm/pg-core";
var userRole = pgEnum("user_role", ["user", "admin"]);
var approvalStatus = pgEnum("approval_status", ["pending", "approved", "rejected"]);
var resolutionStatus = pgEnum("resolution_status", ["pending", "resolved", "rejected"]);
var reviewTargetType = pgEnum("review_target_type", ["commerce", "service"]);
var users = pgTable("users", {
  /**
   * Surrogate primary key. Auto-incremented numeric value managed by the database.
   * Use this for relations between tables.
   */
  id: serial("id").primaryKey(),
  /** Manus OAuth identifier (openId) returned from the OAuth callback. Unique per user. */
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: userRole("role").default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull()
});
var commerces = pgTable("commerces", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  category: varchar("category", { length: 100 }).notNull(),
  address: varchar("address", { length: 255 }).notNull(),
  phone: varchar("phone", { length: 50 }).notNull(),
  instagram: varchar("instagram", { length: 100 }),
  hours: varchar("hours", { length: 100 }),
  description: text("description"),
  lat: varchar("lat", { length: 50 }),
  lng: varchar("lng", { length: 50 }),
  coordsJson: text("coordsJson"),
  photoUrl: text("photoUrl"),
  photoKey: varchar("photoKey", { length: 255 }),
  status: approvalStatus("status").default("pending").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull()
});
var complaints = pgTable("complaints", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  phone: varchar("phone", { length: 50 }),
  type: varchar("type", { length: 100 }).notNull(),
  address: varchar("address", { length: 255 }),
  description: text("description").notNull(),
  status: resolutionStatus("status").default("pending").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull()
});
var suggestions = pgTable("suggestions", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 320 }),
  phone: varchar("phone", { length: 50 }),
  type: varchar("type", { length: 100 }).notNull(),
  message: text("message").notNull(),
  status: resolutionStatus("status").default("pending").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull()
});
var events = pgTable("events", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  category: varchar("category", { length: 100 }).notNull(),
  date: varchar("date", { length: 100 }),
  time: varchar("time", { length: 100 }),
  location: varchar("location", { length: 255 }),
  organizer: varchar("organizer", { length: 255 }),
  description: text("description"),
  attendees: varchar("attendees", { length: 100 }),
  createdAt: timestamp("createdAt").defaultNow().notNull()
});
var usefulPhones = pgTable("usefulPhones", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  category: varchar("category", { length: 100 }),
  phone: varchar("phone", { length: 50 }).notNull(),
  address: varchar("address", { length: 255 }),
  hours: varchar("hours", { length: 100 }),
  createdAt: timestamp("createdAt").defaultNow().notNull()
});
var reviews = pgTable("reviews", {
  id: serial("id").primaryKey(),
  authorName: varchar("authorName", { length: 255 }).notNull(),
  targetType: reviewTargetType("targetType").notNull(),
  targetId: integer("targetId").notNull(),
  targetName: varchar("targetName", { length: 255 }).notNull(),
  rating: integer("rating").notNull(),
  comment: text("comment"),
  createdAt: timestamp("createdAt").defaultNow().notNull()
});
var muralPosts = pgTable("muralPosts", {
  id: serial("id").primaryKey(),
  authorName: varchar("authorName", { length: 255 }).notNull(),
  category: varchar("category", { length: 100 }).default("Geral"),
  message: text("message").notNull(),
  status: approvalStatus("status").default("pending").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull()
});
var news = pgTable("news", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 500 }).notNull(),
  excerpt: text("excerpt"),
  source: varchar("source", { length: 100 }).notNull(),
  sourceUrl: text("sourceUrl").notNull(),
  publishedAt: timestamp("publishedAt", { withTimezone: true }).notNull(),
  cycleDate: date("cycleDate").notNull(),
  category: varchar("category", { length: 100 }),
  imageUrl: text("imageUrl"),
  active: boolean("active").default(true).notNull(),
  createdAt: timestamp("createdAt", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updatedAt", { withTimezone: true }).defaultNow().notNull()
}, (table) => [
  uniqueIndex("news_source_url_unique").on(table.sourceUrl),
  index("news_cycle_date_idx").on(table.cycleDate),
  index("news_published_at_idx").on(table.publishedAt)
]);

// server/db.ts
init_env();
import { desc, and } from "drizzle-orm";
var _db = null;
var _client = null;
async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _client = postgres(process.env.DATABASE_URL, { max: 10 });
      _db = drizzle(_client);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}
async function upsertUser(user) {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }
  try {
    const values = {
      openId: user.openId
    };
    const updateSet = { updatedAt: /* @__PURE__ */ new Date() };
    const textFields = ["name", "email", "loginMethod"];
    const assignNullable = (field) => {
      const value = user[field];
      if (value === void 0) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };
    textFields.forEach(assignNullable);
    if (user.lastSignedIn !== void 0) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== void 0) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = "admin";
      updateSet.role = "admin";
    }
    if (!values.lastSignedIn) {
      values.lastSignedIn = /* @__PURE__ */ new Date();
    }
    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = /* @__PURE__ */ new Date();
    }
    await db.insert(users).values(values).onConflictDoUpdate({
      target: users.openId,
      set: updateSet
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}
async function getUserByOpenId(openId) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return void 0;
  }
  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);
  return result.length > 0 ? result[0] : void 0;
}
async function addReview(data) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(reviews).values({ ...data });
  return result;
}
async function getReviewsByTarget(targetType, targetId) {
  const db = await getDb();
  if (!db) return [];
  const result = await db.select().from(reviews).where(and(eq(reviews.targetType, targetType), eq(reviews.targetId, targetId))).orderBy(desc(reviews.createdAt));
  return result;
}
async function getAllReviews(targetType) {
  const db = await getDb();
  if (!db) return [];
  const result = targetType ? await db.select().from(reviews).where(eq(reviews.targetType, targetType)).orderBy(desc(reviews.createdAt)) : await db.select().from(reviews).orderBy(desc(reviews.createdAt));
  return result;
}
async function deleteReview(id) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return await db.delete(reviews).where(eq(reviews.id, id));
}
async function addMuralPost(data) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return await db.insert(muralPosts).values({ ...data, status: "approved" });
}
async function getApprovedMuralPosts() {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(muralPosts).where(eq(muralPosts.status, "approved")).orderBy(desc(muralPosts.createdAt));
}
async function getAllMuralPosts() {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(muralPosts).orderBy(desc(muralPosts.createdAt));
}
async function updateMuralPostStatus(id, status) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return await db.update(muralPosts).set({ status }).where(eq(muralPosts.id, id));
}
async function deleteMuralPost(id) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return await db.delete(muralPosts).where(eq(muralPosts.id, id));
}

// server/news.ts
import { and as and2, desc as desc2, eq as eq2, lt, sql } from "drizzle-orm";
import { XMLParser, XMLValidator } from "fast-xml-parser";
var TIME_ZONE = "America/Sao_Paulo";
function cycleDateInSaoPaulo(date2) {
  const parts = new Intl.DateTimeFormat("en-US", { timeZone: TIME_ZONE, year: "numeric", month: "2-digit", day: "2-digit" }).formatToParts(date2);
  const part = (name) => parts.find((item) => item.type === name)?.value ?? "";
  return `${part("year")}-${part("month")}-${part("day")}`;
}
async function getCurrentNews(now = /* @__PURE__ */ new Date()) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(news).where(and2(eq2(news.cycleDate, cycleDateInSaoPaulo(now)), eq2(news.active, true))).orderBy(desc2(news.publishedAt)).limit(10);
}

// server/routers.ts
var failedAdminLogins = /* @__PURE__ */ new Map();
var appRouter = router({
  system: systemRouter,
  news: router({
    listCurrent: publicProcedure.query(() => getCurrentNews())
  }),
  auth: router({
    me: publicProcedure.query((opts) => opts.ctx.user),
    passwordLogin: publicProcedure.input(z2.object({ username: z2.string().min(1).max(100), password: z2.string().min(1).max(256) })).mutation(({ ctx, input }) => {
      if (!passwordLoginConfigured()) {
        throw new TRPCError3({ code: "PRECONDITION_FAILED", message: "Login administrativo n\xE3o configurado no servidor." });
      }
      const key = ctx.req.ip || ctx.req.socket.remoteAddress || "unknown";
      const now = Date.now();
      const previous = failedAdminLogins.get(key);
      const attempts = previous && previous.resetAt > now ? previous : { count: 0, resetAt: now + 15 * 60 * 1e3 };
      if (attempts.count >= 5) {
        throw new TRPCError3({ code: "TOO_MANY_REQUESTS", message: "Muitas tentativas. Aguarde 15 minutos." });
      }
      if (!validAdminCredentials(input.username, input.password)) {
        failedAdminLogins.set(key, { ...attempts, count: attempts.count + 1 });
        throw new TRPCError3({ code: "UNAUTHORIZED", message: "Usu\xE1rio ou senha inv\xE1lidos." });
      }
      failedAdminLogins.delete(key);
      ctx.res.cookie(ADMIN_COOKIE_NAME, createAdminSession(), { ...adminCookieOptions(ctx.req), maxAge: ADMIN_SESSION_MS });
      return { success: true };
    }),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      ctx.res.clearCookie(ADMIN_COOKIE_NAME, adminCookieOptions(ctx.req));
      return {
        success: true
      };
    })
  }),
  // === Comércios ===
  commerce: router({
    list: adminProcedure.query(async () => {
      const db = await getDb();
      if (!db) return [];
      const rows = await db.select().from(commerces).orderBy(desc3(commerces.createdAt));
      return rows;
    }),
    listApproved: publicProcedure.query(async () => {
      const db = await getDb();
      if (!db) return [];
      const rows = await db.select().from(commerces).where(eq3(commerces.status, "approved")).orderBy(desc3(commerces.createdAt));
      return rows;
    }),
    add: publicProcedure.input(
      z2.object({
        name: z2.string().min(1),
        category: z2.string().min(1),
        address: z2.string().min(1),
        phone: z2.string().min(1),
        instagram: z2.string().optional(),
        hours: z2.string().optional(),
        description: z2.string().optional(),
        lat: z2.string().optional(),
        lng: z2.string().optional(),
        coordsJson: z2.string().optional(),
        photoUrl: z2.string().optional(),
        photoKey: z2.string().optional()
      })
    ).mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");
      await db.insert(commerces).values({ ...input, status: "approved" });
      return { success: true };
    }),
    uploadPhoto: publicProcedure.input(z2.object({
      fileName: z2.string().min(1),
      base64Data: z2.string().min(1),
      mimeType: z2.string().default("image/jpeg")
    })).mutation(async ({ input }) => {
      const { storagePut: storagePut2 } = await Promise.resolve().then(() => (init_storage(), storage_exports));
      const fileBuffer = Buffer.from(input.base64Data, "base64");
      const key = `commerce-photos/${Date.now()}-${input.fileName}`;
      const { url } = await storagePut2(key, fileBuffer, input.mimeType);
      return { url, key };
    }),
    updateStatus: adminProcedure.input(z2.object({ id: z2.number(), status: z2.enum(["pending", "approved", "rejected"]) })).mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");
      await db.update(commerces).set({ status: input.status }).where(eq3(commerces.id, input.id));
      return { success: true };
    }),
    update: adminProcedure.input(z2.object({ id: z2.number(), name: z2.string().min(1), category: z2.string().min(1), address: z2.string().min(1), phone: z2.string().min(1), description: z2.string().optional() })).mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");
      const { id, ...values } = input;
      await db.update(commerces).set(values).where(eq3(commerces.id, id));
      return { success: true };
    }),
    delete: adminProcedure.input(z2.object({ id: z2.number() })).mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");
      await db.delete(commerces).where(eq3(commerces.id, input.id));
      return { success: true };
    })
  }),
  // === Denúncias ===
  complaint: router({
    listPublic: publicProcedure.query(async () => {
      const db = await getDb();
      if (!db) return [];
      return db.select({ id: complaints.id, name: complaints.name, type: complaints.type, address: complaints.address, description: complaints.description, status: complaints.status, createdAt: complaints.createdAt }).from(complaints).orderBy(desc3(complaints.createdAt));
    }),
    list: adminProcedure.query(async () => {
      const db = await getDb();
      if (!db) return [];
      return await db.select().from(complaints).orderBy(desc3(complaints.createdAt));
    }),
    add: publicProcedure.input(
      z2.object({
        name: z2.string().min(1),
        phone: z2.string().optional(),
        type: z2.string().min(1),
        address: z2.string().optional(),
        description: z2.string().min(1)
      })
    ).mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");
      await db.insert(complaints).values({ ...input, status: "pending" });
      return { success: true };
    }),
    updateStatus: adminProcedure.input(z2.object({ id: z2.number(), status: z2.enum(["pending", "resolved", "rejected"]) })).mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");
      await db.update(complaints).set({ status: input.status }).where(eq3(complaints.id, input.id));
      return { success: true };
    }),
    update: adminProcedure.input(z2.object({ id: z2.number(), type: z2.string().min(1), address: z2.string().optional(), description: z2.string().min(1) })).mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");
      const { id, ...values } = input;
      await db.update(complaints).set(values).where(eq3(complaints.id, id));
      return { success: true };
    }),
    delete: adminProcedure.input(z2.object({ id: z2.number() })).mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");
      await db.delete(complaints).where(eq3(complaints.id, input.id));
      return { success: true };
    })
  }),
  // === Sugestões ===
  suggestion: router({
    listPublic: publicProcedure.query(async () => {
      const db = await getDb();
      if (!db) return [];
      return db.select({ id: suggestions.id, type: suggestions.type, message: suggestions.message, status: suggestions.status, createdAt: suggestions.createdAt }).from(suggestions).orderBy(desc3(suggestions.createdAt));
    }),
    list: adminProcedure.query(async () => {
      const db = await getDb();
      if (!db) return [];
      return await db.select().from(suggestions).orderBy(desc3(suggestions.createdAt));
    }),
    add: publicProcedure.input(
      z2.object({
        name: z2.string().min(1),
        email: z2.string().optional(),
        phone: z2.string().optional(),
        type: z2.string().min(1),
        message: z2.string().min(1)
      })
    ).mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");
      await db.insert(suggestions).values({ ...input, status: "pending" });
      return { success: true };
    }),
    updateStatus: adminProcedure.input(z2.object({ id: z2.number(), status: z2.enum(["pending", "resolved", "rejected"]) })).mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");
      await db.update(suggestions).set({ status: input.status }).where(eq3(suggestions.id, input.id));
      return { success: true };
    }),
    update: adminProcedure.input(z2.object({ id: z2.number(), type: z2.string().min(1), message: z2.string().min(1) })).mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");
      const { id, ...values } = input;
      await db.update(suggestions).set(values).where(eq3(suggestions.id, id));
      return { success: true };
    }),
    delete: adminProcedure.input(z2.object({ id: z2.number() })).mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");
      await db.delete(suggestions).where(eq3(suggestions.id, input.id));
      return { success: true };
    })
  }),
  // === Eventos ===
  event: router({
    list: publicProcedure.query(async () => {
      const db = await getDb();
      if (!db) return [];
      return await db.select().from(events).orderBy(desc3(events.createdAt));
    }),
    add: publicProcedure.input(
      z2.object({
        title: z2.string().min(1),
        category: z2.string().min(1),
        date: z2.string().optional(),
        time: z2.string().optional(),
        location: z2.string().optional(),
        organizer: z2.string().optional(),
        description: z2.string().optional(),
        attendees: z2.string().optional()
      })
    ).mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");
      await db.insert(events).values(input);
      return { success: true };
    }),
    update: adminProcedure.input(z2.object({ id: z2.number(), title: z2.string().min(1), category: z2.string().min(1), date: z2.string().optional(), time: z2.string().optional(), location: z2.string().optional(), organizer: z2.string().optional(), description: z2.string().optional() })).mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");
      const { id, ...values } = input;
      await db.update(events).set(values).where(eq3(events.id, id));
      return { success: true };
    }),
    delete: adminProcedure.input(z2.object({ id: z2.number() })).mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");
      await db.delete(events).where(eq3(events.id, input.id));
      return { success: true };
    })
  }),
  // === Telefones Úteis ===
  phone: router({
    list: publicProcedure.query(async () => {
      const db = await getDb();
      if (!db) return [];
      return await db.select().from(usefulPhones).orderBy(usefulPhones.name);
    }),
    add: adminProcedure.input(
      z2.object({
        name: z2.string().min(1),
        category: z2.string().optional(),
        phone: z2.string().min(1),
        address: z2.string().optional(),
        hours: z2.string().optional()
      })
    ).mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");
      await db.insert(usefulPhones).values(input);
      return { success: true };
    }),
    update: adminProcedure.input(z2.object({ id: z2.number(), name: z2.string().min(1), category: z2.string().optional(), phone: z2.string().min(1), address: z2.string().optional(), hours: z2.string().optional() })).mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");
      const { id, ...values } = input;
      await db.update(usefulPhones).set(values).where(eq3(usefulPhones.id, id));
      return { success: true };
    }),
    delete: adminProcedure.input(z2.object({ id: z2.number() })).mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");
      await db.delete(usefulPhones).where(eq3(usefulPhones.id, input.id));
      return { success: true };
    })
  }),
  // === Reviews (Avaliações com estrelas) ===
  review: router({
    listByTarget: publicProcedure.input(z2.object({ targetType: z2.enum(["commerce", "service"]), targetId: z2.number() })).query(async ({ input }) => {
      return await getReviewsByTarget(input.targetType, input.targetId);
    }),
    listAll: publicProcedure.input(z2.object({ targetType: z2.enum(["commerce", "service"]).optional() })).query(async ({ input }) => {
      if (input.targetType) return await getAllReviews(input.targetType);
      return await getAllReviews();
    }),
    add: publicProcedure.input(
      z2.object({
        authorName: z2.string().min(1),
        targetType: z2.enum(["commerce", "service"]),
        targetId: z2.number(),
        targetName: z2.string().min(1),
        rating: z2.number().min(1).max(5),
        comment: z2.string().optional()
      })
    ).mutation(async ({ input }) => {
      await addReview(input);
      return { success: true };
    }),
    delete: adminProcedure.input(z2.object({ id: z2.number() })).mutation(async ({ input }) => {
      await deleteReview(input.id);
      return { success: true };
    }),
    update: adminProcedure.input(z2.object({ id: z2.number(), authorName: z2.string().min(1), rating: z2.number().min(1).max(5), comment: z2.string().optional() })).mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");
      const { id, ...values } = input;
      await db.update(reviews).set(values).where(eq3(reviews.id, id));
      return { success: true };
    })
  }),
  // === Mural da Comunidade ===
  mural: router({
    listApproved: publicProcedure.query(async () => {
      return await getApprovedMuralPosts();
    }),
    listAll: adminProcedure.query(async () => {
      return await getAllMuralPosts();
    }),
    add: publicProcedure.input(
      z2.object({
        authorName: z2.string().min(1),
        category: z2.string().optional(),
        message: z2.string().min(1)
      })
    ).mutation(async ({ input }) => {
      await addMuralPost({
        authorName: input.authorName,
        category: input.category || "Geral",
        message: input.message
      });
      return { success: true };
    }),
    updateStatus: adminProcedure.input(z2.object({ id: z2.number(), status: z2.enum(["pending", "approved", "rejected"]) })).mutation(async ({ input }) => {
      await updateMuralPostStatus(input.id, input.status);
      return { success: true };
    }),
    update: adminProcedure.input(z2.object({ id: z2.number(), authorName: z2.string().min(1), category: z2.string().optional(), message: z2.string().min(1) })).mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");
      const { id, ...values } = input;
      await db.update(muralPosts).set(values).where(eq3(muralPosts.id, id));
      return { success: true };
    }),
    delete: adminProcedure.input(z2.object({ id: z2.number() })).mutation(async ({ input }) => {
      await deleteMuralPost(input.id);
      return { success: true };
    })
  })
});

// shared/_core/errors.ts
var HttpError = class extends Error {
  constructor(statusCode, message) {
    super(message);
    this.statusCode = statusCode;
    this.name = "HttpError";
  }
};
var ForbiddenError = (msg) => new HttpError(403, msg);

// server/_core/sdk.ts
import axios from "axios";
import { parse as parseCookieHeader } from "cookie";
import { SignJWT, jwtVerify } from "jose";
init_env();
var isNonEmptyString2 = (value) => typeof value === "string" && value.length > 0;
var EXCHANGE_TOKEN_PATH = `/webdev.v1.WebDevAuthPublicService/ExchangeToken`;
var GET_USER_INFO_PATH = `/webdev.v1.WebDevAuthPublicService/GetUserInfo`;
var GET_USER_INFO_WITH_JWT_PATH = `/webdev.v1.WebDevAuthPublicService/GetUserInfoWithJwt`;
var OAuthService = class {
  constructor(client) {
    this.client = client;
    console.log("[OAuth] Initialized with baseURL:", ENV.oAuthServerUrl);
    if (!ENV.oAuthServerUrl) {
      console.error(
        "[OAuth] ERROR: OAUTH_SERVER_URL is not configured! Set OAUTH_SERVER_URL environment variable."
      );
    }
  }
  decodeState(state) {
    return decodeOAuthState(state).redirectUri;
  }
  async getTokenByCode(code, state) {
    const payload = {
      clientId: ENV.appId,
      grantType: "authorization_code",
      code,
      redirectUri: this.decodeState(state)
    };
    const { data } = await this.client.post(
      EXCHANGE_TOKEN_PATH,
      payload
    );
    return data;
  }
  async getUserInfoByToken(token) {
    const { data } = await this.client.post(
      GET_USER_INFO_PATH,
      {
        accessToken: token.accessToken
      }
    );
    return data;
  }
};
var createOAuthHttpClient = () => axios.create({
  baseURL: ENV.oAuthServerUrl,
  timeout: AXIOS_TIMEOUT_MS
});
var SDKServer = class {
  client;
  oauthService;
  constructor(client = createOAuthHttpClient()) {
    this.client = client;
    this.oauthService = new OAuthService(this.client);
  }
  deriveLoginMethod(platforms, fallback) {
    if (fallback && fallback.length > 0) return fallback;
    if (!Array.isArray(platforms) || platforms.length === 0) return null;
    const set = new Set(
      platforms.filter((p) => typeof p === "string")
    );
    if (set.has("REGISTERED_PLATFORM_EMAIL")) return "email";
    if (set.has("REGISTERED_PLATFORM_GOOGLE")) return "google";
    if (set.has("REGISTERED_PLATFORM_APPLE")) return "apple";
    if (set.has("REGISTERED_PLATFORM_MICROSOFT") || set.has("REGISTERED_PLATFORM_AZURE"))
      return "microsoft";
    if (set.has("REGISTERED_PLATFORM_GITHUB")) return "github";
    const first = Array.from(set)[0];
    return first ? first.toLowerCase() : null;
  }
  /**
   * Exchange OAuth authorization code for access token
   * @example
   * const tokenResponse = await sdk.exchangeCodeForToken(code, state);
   */
  async exchangeCodeForToken(code, state) {
    return this.oauthService.getTokenByCode(code, state);
  }
  /**
   * Get user information using access token
   * @example
   * const userInfo = await sdk.getUserInfo(tokenResponse.accessToken);
   */
  async getUserInfo(accessToken) {
    const data = await this.oauthService.getUserInfoByToken({
      accessToken
    });
    const loginMethod = this.deriveLoginMethod(
      data?.platforms,
      data?.platform ?? data.platform ?? null
    );
    return {
      ...data,
      platform: loginMethod,
      loginMethod
    };
  }
  parseCookies(cookieHeader) {
    if (!cookieHeader) {
      return /* @__PURE__ */ new Map();
    }
    const parsed = parseCookieHeader(cookieHeader);
    return new Map(Object.entries(parsed));
  }
  getSessionSecret() {
    const secret = ENV.cookieSecret;
    return new TextEncoder().encode(secret);
  }
  /**
   * Create a session token for a Manus user openId
   * @example
   * const sessionToken = await sdk.createSessionToken(userInfo.openId);
   */
  async createSessionToken(openId, options = {}) {
    return this.signSession(
      {
        openId,
        appId: ENV.appId,
        name: options.name || ""
      },
      options
    );
  }
  async signSession(payload, options = {}) {
    const issuedAt = Date.now();
    const expiresInMs = options.expiresInMs ?? ONE_YEAR_MS;
    const expirationSeconds = Math.floor((issuedAt + expiresInMs) / 1e3);
    const secretKey = this.getSessionSecret();
    return new SignJWT({
      openId: payload.openId,
      appId: payload.appId,
      name: payload.name
    }).setProtectedHeader({ alg: "HS256", typ: "JWT" }).setExpirationTime(expirationSeconds).sign(secretKey);
  }
  async verifySession(cookieValue) {
    if (!cookieValue) {
      console.warn("[Auth] Missing session cookie");
      return null;
    }
    try {
      const secretKey = this.getSessionSecret();
      const { payload } = await jwtVerify(cookieValue, secretKey, {
        algorithms: ["HS256"]
      });
      const { openId, appId, name } = payload;
      if (!isNonEmptyString2(openId) || !isNonEmptyString2(appId) || !isNonEmptyString2(name)) {
        console.warn("[Auth] Session payload missing required fields");
        return null;
      }
      return {
        openId,
        appId,
        name
      };
    } catch (error) {
      console.warn("[Auth] Session verification failed", String(error));
      return null;
    }
  }
  async getUserInfoWithJwt(jwtToken) {
    const payload = {
      jwtToken,
      projectId: ENV.appId
    };
    const { data } = await this.client.post(
      GET_USER_INFO_WITH_JWT_PATH,
      payload
    );
    const loginMethod = this.deriveLoginMethod(
      data?.platforms,
      data?.platform ?? data.platform ?? null
    );
    return {
      ...data,
      platform: loginMethod,
      loginMethod
    };
  }
  async authenticateRequest(req) {
    const cookies = this.parseCookies(req.headers.cookie);
    let sessionToken = cookies.get(COOKIE_NAME);
    if (!sessionToken) {
      const authHeader = req.headers.authorization;
      if (typeof authHeader === "string" && authHeader.startsWith("Bearer ")) {
        sessionToken = authHeader.slice(7);
      }
    }
    const session = await this.verifySession(sessionToken);
    if (!session) {
      throw ForbiddenError("Invalid session cookie");
    }
    if (session.openId.startsWith(CRON_OPEN_ID_PREFIX)) {
      const userInfo = await this.getUserInfoWithJwt(sessionToken ?? "");
      const taskUid = userInfo.taskUid ?? null;
      if (!taskUid) {
        throw ForbiddenError("Cron session missing task_uid");
      }
      return buildCronUser(userInfo);
    }
    const sessionUserId = session.openId;
    const signedInAt = /* @__PURE__ */ new Date();
    let user = await getUserByOpenId(sessionUserId);
    if (!user) {
      try {
        const userInfo = await this.getUserInfoWithJwt(sessionToken ?? "");
        await upsertUser({
          openId: userInfo.openId,
          name: userInfo.name || null,
          email: userInfo.email ?? null,
          loginMethod: userInfo.loginMethod ?? userInfo.platform ?? null,
          lastSignedIn: signedInAt
        });
        user = await getUserByOpenId(userInfo.openId);
      } catch (error) {
        console.error("[Auth] Failed to sync user from OAuth:", error);
        throw ForbiddenError("Failed to sync user info");
      }
    }
    if (!user) {
      throw ForbiddenError("User not found");
    }
    await upsertUser({
      openId: user.openId,
      lastSignedIn: signedInAt
    });
    return user;
  }
};
var CRON_OPEN_ID_PREFIX = "cron_";
function buildCronUser(userInfo) {
  const now = /* @__PURE__ */ new Date();
  return {
    id: -1,
    openId: userInfo.openId,
    name: userInfo.name || "Manus Scheduled Task",
    email: null,
    loginMethod: null,
    role: "user",
    createdAt: now,
    updatedAt: now,
    lastSignedIn: now,
    taskUid: userInfo.taskUid ?? void 0,
    isCron: true
  };
}
var sdk = new SDKServer();

// server/_core/context.ts
async function createContext(opts) {
  let user = getPasswordAdmin(opts.req);
  if (!user) {
    try {
      user = await sdk.authenticateRequest(opts.req);
    } catch (error) {
      user = null;
    }
  }
  return {
    req: opts.req,
    res: opts.res,
    user
  };
}

// server/_core/oauth.ts
import { parse as parseCookieHeader2 } from "cookie";
function getQueryParam(req, key) {
  const value = req.query[key];
  return typeof value === "string" ? value : void 0;
}
function registerOAuthRoutes(app2) {
  app2.get("/api/oauth/callback", async (req, res) => {
    const code = getQueryParam(req, "code");
    const state = getQueryParam(req, "state");
    if (!code || !state) {
      res.status(400).json({ error: "code and state are required" });
      return;
    }
    const { nonce } = decodeOAuthState(state);
    const expectedNonce = parseCookieHeader2(req.headers.cookie ?? "")[OAUTH_STATE_COOKIE];
    if (!nonce || nonce !== expectedNonce) {
      res.status(403).json({ error: "invalid oauth state" });
      return;
    }
    res.clearCookie(OAUTH_STATE_COOKIE, { path: "/", secure: true, sameSite: "none" });
    try {
      const tokenResponse = await sdk.exchangeCodeForToken(code, state);
      const userInfo = await sdk.getUserInfo(tokenResponse.accessToken);
      if (!userInfo.openId) {
        res.status(400).json({ error: "openId missing from user info" });
        return;
      }
      await upsertUser({
        openId: userInfo.openId,
        name: userInfo.name || null,
        email: userInfo.email ?? null,
        loginMethod: userInfo.loginMethod ?? userInfo.platform ?? null,
        lastSignedIn: /* @__PURE__ */ new Date()
      });
      const sessionToken = await sdk.createSessionToken(userInfo.openId, {
        name: userInfo.name || "",
        expiresInMs: ONE_YEAR_MS
      });
      const cookieOptions = getSessionCookieOptions(req);
      res.cookie(COOKIE_NAME, sessionToken, { ...cookieOptions, maxAge: ONE_YEAR_MS });
      res.redirect(302, "/");
    } catch (error) {
      console.error("[OAuth] Callback failed", error);
      res.status(500).json({ error: "OAuth callback failed" });
    }
  });
}

// server/_core/storageProxy.ts
init_env();
function registerStorageProxy(app2) {
  app2.get("/manus-storage/*", async (req, res) => {
    const key = req.params[0];
    if (!key) {
      res.status(400).send("Missing storage key");
      return;
    }
    if (!ENV.forgeApiUrl || !ENV.forgeApiKey) {
      res.status(500).send("Storage proxy not configured");
      return;
    }
    try {
      const forgeUrl = new URL(
        "v1/storage/presign/get",
        ENV.forgeApiUrl.replace(/\/+$/, "") + "/"
      );
      forgeUrl.searchParams.set("path", key);
      const forgeResp = await fetch(forgeUrl, {
        headers: { Authorization: `Bearer ${ENV.forgeApiKey}` }
      });
      if (!forgeResp.ok) {
        const body = await forgeResp.text().catch(() => "");
        console.error(`[StorageProxy] forge error: ${forgeResp.status} ${body}`);
        res.status(502).send("Storage backend error");
        return;
      }
      const { url } = await forgeResp.json();
      if (!url) {
        res.status(502).send("Empty signed URL from backend");
        return;
      }
      res.set("Cache-Control", "no-store");
      res.redirect(307, url);
    } catch (err) {
      console.error("[StorageProxy] failed:", err);
      res.status(502).send("Storage proxy error");
    }
  });
}

// server/_core/apiApp.ts
function createApiApp() {
  const app2 = express();
  app2.set("trust proxy", 1);
  app2.use(express.json({ limit: "50mb" }));
  app2.use(express.urlencoded({ limit: "50mb", extended: true }));
  registerStorageProxy(app2);
  registerOAuthRoutes(app2);
  app2.use("/api/trpc", createExpressMiddleware({ router: appRouter, createContext }));
  return app2;
}

// scripts/vercel-api.ts
var app = createApiApp();
function handler(req, res) {
  const url = new URL(req.url, "http://localhost");
  const route = url.searchParams.get("route");
  if (!route || !/^(trpc\/|oauth\/callback$|manus-storage\/)/.test(route)) {
    res.status(404).end();
    return;
  }
  url.searchParams.delete("route");
  req.url = `/api/${route}${url.search}`;
  app(req, res);
}
export {
  handler as default
};
