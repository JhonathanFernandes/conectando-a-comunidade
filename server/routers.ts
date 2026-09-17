import { COOKIE_NAME } from "@shared/const";
import { z } from "zod";
import { eq, desc } from "drizzle-orm";
import { getSessionCookieOptions } from "./_core/cookies";
import { ADMIN_COOKIE_NAME, ADMIN_SESSION_MS, adminCookieOptions, createAdminSession, passwordLoginConfigured, validAdminCredentials } from "./_core/adminPasswordAuth";
import { TRPCError } from "@trpc/server";
import { systemRouter } from "./_core/systemRouter";
import { adminProcedure, publicProcedure, router } from "./_core/trpc";
import { getDb } from "./db";
import {
  commerces,
  complaints,
  suggestions,
  events,
  usefulPhones,
  reviews,
  muralPosts,
} from "../drizzle/schema";
import {
  addReview as addReviewDb,
  getReviewsByTarget as getReviewsByTargetDb,
  getAllReviews as getAllReviewsDb,
  deleteReview as deleteReviewDb,
  addMuralPost as addMuralPostDb,
  getApprovedMuralPosts as getApprovedMuralPostsDb,
  getAllMuralPosts as getAllMuralPostsDb,
  updateMuralPostStatus as updateMuralPostStatusDb,
  deleteMuralPost as deleteMuralPostDb,
} from "./db";

const failedAdminLogins = new Map<string, { count: number; resetAt: number }>();

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    passwordLogin: publicProcedure
      .input(z.object({ username: z.string().min(1).max(100), password: z.string().min(1).max(256) }))
      .mutation(({ ctx, input }) => {
        if (!passwordLoginConfigured()) {
          throw new TRPCError({ code: "PRECONDITION_FAILED", message: "Login administrativo não configurado no servidor." });
        }
        const key = ctx.req.ip || ctx.req.socket.remoteAddress || "unknown";
        const now = Date.now();
        const previous = failedAdminLogins.get(key);
        const attempts = previous && previous.resetAt > now ? previous : { count: 0, resetAt: now + 15 * 60 * 1000 };
        if (attempts.count >= 5) {
          throw new TRPCError({ code: "TOO_MANY_REQUESTS", message: "Muitas tentativas. Aguarde 15 minutos." });
        }
        if (!validAdminCredentials(input.username, input.password)) {
          failedAdminLogins.set(key, { ...attempts, count: attempts.count + 1 });
          throw new TRPCError({ code: "UNAUTHORIZED", message: "Usuário ou senha inválidos." });
        }
        failedAdminLogins.delete(key);
        ctx.res.cookie(ADMIN_COOKIE_NAME, createAdminSession(), { ...adminCookieOptions(ctx.req), maxAge: ADMIN_SESSION_MS });
        return { success: true } as const;
      }),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      ctx.res.clearCookie(ADMIN_COOKIE_NAME, adminCookieOptions(ctx.req));
      return {
        success: true,
      } as const;
    }),
  }),

  // === Comércios ===
  commerce: router({
    list: adminProcedure.query(async () => {
      const db = await getDb();
      if (!db) return [];
      const rows = await db.select().from(commerces).orderBy(desc(commerces.createdAt));
      return rows;
    }),
    listApproved: publicProcedure.query(async () => {
      const db = await getDb();
      if (!db) return [];
      const rows = await db.select().from(commerces).where(eq(commerces.status, "approved")).orderBy(desc(commerces.createdAt));
      return rows;
    }),
    add: publicProcedure
      .input(
        z.object({
          name: z.string().min(1),
          category: z.string().min(1),
          address: z.string().min(1),
          phone: z.string().min(1),
          instagram: z.string().optional(),
          hours: z.string().optional(),
          description: z.string().optional(),
          lat: z.string().optional(),
          lng: z.string().optional(),
          coordsJson: z.string().optional(),
          photoUrl: z.string().optional(),
          photoKey: z.string().optional(),
        })
      )
      .mutation(async ({ input }) => {
        const db = await getDb();
        if (!db) throw new Error("Database not available");
        await db.insert(commerces).values({ ...input, status: "approved" });
        return { success: true };
      }),
    uploadPhoto: publicProcedure
      .input(z.object({
        fileName: z.string().min(1),
        base64Data: z.string().min(1),
        mimeType: z.string().default("image/jpeg"),
      }))
      .mutation(async ({ input }) => {
        const { storagePut } = await import("./storage");
        const fileBuffer = Buffer.from(input.base64Data, "base64");
        const key = `commerce-photos/${Date.now()}-${input.fileName}`;
        const { url } = await storagePut(key, fileBuffer, input.mimeType);
        return { url, key };
      }),
    updateStatus: adminProcedure
      .input(z.object({ id: z.number(), status: z.enum(["pending", "approved", "rejected"]) }))
      .mutation(async ({ input }) => {
        const db = await getDb();
        if (!db) throw new Error("Database not available");
        await db.update(commerces).set({ status: input.status }).where(eq(commerces.id, input.id));
        return { success: true };
      }),
    update: adminProcedure.input(z.object({ id: z.number(), name: z.string().min(1), category: z.string().min(1), address: z.string().min(1), phone: z.string().min(1), description: z.string().optional() })).mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");
      const { id, ...values } = input;
      await db.update(commerces).set(values).where(eq(commerces.id, id));
      return { success: true };
    }),
    delete: adminProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        const db = await getDb();
        if (!db) throw new Error("Database not available");
        await db.delete(commerces).where(eq(commerces.id, input.id));
        return { success: true };
      }),
  }),

  // === Denúncias ===
  complaint: router({
    listPublic: publicProcedure.query(async () => {
      const db = await getDb();
      if (!db) return [];
      return db.select({ id: complaints.id, name: complaints.name, type: complaints.type, address: complaints.address, description: complaints.description, status: complaints.status, createdAt: complaints.createdAt }).from(complaints).orderBy(desc(complaints.createdAt));
    }),
    list: adminProcedure.query(async () => {
      const db = await getDb();
      if (!db) return [];
      return await db.select().from(complaints).orderBy(desc(complaints.createdAt));
    }),
    add: publicProcedure
      .input(
        z.object({
          name: z.string().min(1),
          phone: z.string().optional(),
          type: z.string().min(1),
          address: z.string().optional(),
          description: z.string().min(1),
        })
      )
      .mutation(async ({ input }) => {
        const db = await getDb();
        if (!db) throw new Error("Database not available");
        await db.insert(complaints).values({ ...input, status: "pending" });
        return { success: true };
      }),
    updateStatus: adminProcedure
      .input(z.object({ id: z.number(), status: z.enum(["pending", "resolved", "rejected"]) }))
      .mutation(async ({ input }) => {
        const db = await getDb();
        if (!db) throw new Error("Database not available");
        await db.update(complaints).set({ status: input.status }).where(eq(complaints.id, input.id));
        return { success: true };
      }),
    update: adminProcedure.input(z.object({ id: z.number(), type: z.string().min(1), address: z.string().optional(), description: z.string().min(1) })).mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");
      const { id, ...values } = input;
      await db.update(complaints).set(values).where(eq(complaints.id, id));
      return { success: true };
    }),
    delete: adminProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        const db = await getDb();
        if (!db) throw new Error("Database not available");
        await db.delete(complaints).where(eq(complaints.id, input.id));
        return { success: true };
      }),
  }),

  // === Sugestões ===
  suggestion: router({
    listPublic: publicProcedure.query(async () => {
      const db = await getDb();
      if (!db) return [];
      return db.select({ id: suggestions.id, type: suggestions.type, message: suggestions.message, status: suggestions.status, createdAt: suggestions.createdAt }).from(suggestions).orderBy(desc(suggestions.createdAt));
    }),
    list: adminProcedure.query(async () => {
      const db = await getDb();
      if (!db) return [];
      return await db.select().from(suggestions).orderBy(desc(suggestions.createdAt));
    }),
    add: publicProcedure
      .input(
        z.object({
          name: z.string().min(1),
          email: z.string().optional(),
          phone: z.string().optional(),
          type: z.string().min(1),
          message: z.string().min(1),
        })
      )
      .mutation(async ({ input }) => {
        const db = await getDb();
        if (!db) throw new Error("Database not available");
        await db.insert(suggestions).values({ ...input, status: "pending" });
        return { success: true };
      }),
    updateStatus: adminProcedure
      .input(z.object({ id: z.number(), status: z.enum(["pending", "resolved", "rejected"]) }))
      .mutation(async ({ input }) => {
        const db = await getDb();
        if (!db) throw new Error("Database not available");
        await db.update(suggestions).set({ status: input.status }).where(eq(suggestions.id, input.id));
        return { success: true };
      }),
    update: adminProcedure.input(z.object({ id: z.number(), type: z.string().min(1), message: z.string().min(1) })).mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");
      const { id, ...values } = input;
      await db.update(suggestions).set(values).where(eq(suggestions.id, id));
      return { success: true };
    }),
    delete: adminProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        const db = await getDb();
        if (!db) throw new Error("Database not available");
        await db.delete(suggestions).where(eq(suggestions.id, input.id));
        return { success: true };
      }),
  }),

  // === Eventos ===
  event: router({
    list: publicProcedure.query(async () => {
      const db = await getDb();
      if (!db) return [];
      return await db.select().from(events).orderBy(desc(events.createdAt));
    }),
    add: publicProcedure
      .input(
        z.object({
          title: z.string().min(1),
          category: z.string().min(1),
          date: z.string().optional(),
          time: z.string().optional(),
          location: z.string().optional(),
          organizer: z.string().optional(),
          description: z.string().optional(),
          attendees: z.string().optional(),
        })
      )
      .mutation(async ({ input }) => {
        const db = await getDb();
        if (!db) throw new Error("Database not available");
        await db.insert(events).values(input);
        return { success: true };
      }),
    update: adminProcedure.input(z.object({ id: z.number(), title: z.string().min(1), category: z.string().min(1), date: z.string().optional(), time: z.string().optional(), location: z.string().optional(), organizer: z.string().optional(), description: z.string().optional() })).mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");
      const { id, ...values } = input;
      await db.update(events).set(values).where(eq(events.id, id));
      return { success: true };
    }),
    delete: adminProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        const db = await getDb();
        if (!db) throw new Error("Database not available");
        await db.delete(events).where(eq(events.id, input.id));
        return { success: true };
      }),
  }),

  // === Telefones Úteis ===
  phone: router({
    list: publicProcedure.query(async () => {
      const db = await getDb();
      if (!db) return [];
      return await db.select().from(usefulPhones).orderBy(usefulPhones.name);
    }),
    add: adminProcedure
      .input(
        z.object({
          name: z.string().min(1),
          category: z.string().optional(),
          phone: z.string().min(1),
          address: z.string().optional(),
          hours: z.string().optional(),
        })
      )
      .mutation(async ({ input }) => {
        const db = await getDb();
        if (!db) throw new Error("Database not available");
        await db.insert(usefulPhones).values(input);
        return { success: true };
      }),
    update: adminProcedure.input(z.object({ id: z.number(), name: z.string().min(1), category: z.string().optional(), phone: z.string().min(1), address: z.string().optional(), hours: z.string().optional() })).mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");
      const { id, ...values } = input;
      await db.update(usefulPhones).set(values).where(eq(usefulPhones.id, id));
      return { success: true };
    }),
    delete: adminProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        const db = await getDb();
        if (!db) throw new Error("Database not available");
        await db.delete(usefulPhones).where(eq(usefulPhones.id, input.id));
        return { success: true };
      }),
  }),

  // === Reviews (Avaliações com estrelas) ===
  review: router({
    listByTarget: publicProcedure
      .input(z.object({ targetType: z.enum(["commerce", "service"]), targetId: z.number() }))
      .query(async ({ input }) => {
        return await getReviewsByTargetDb(input.targetType, input.targetId);
      }),
    listAll: publicProcedure
      .input(z.object({ targetType: z.enum(["commerce", "service"]).optional() }))
      .query(async ({ input }) => {
        if (input.targetType) return await getAllReviewsDb(input.targetType);
        return await getAllReviewsDb();
      }),
    add: publicProcedure
      .input(
        z.object({
          authorName: z.string().min(1),
          targetType: z.enum(["commerce", "service"]),
          targetId: z.number(),
          targetName: z.string().min(1),
          rating: z.number().min(1).max(5),
          comment: z.string().optional(),
        })
      )
      .mutation(async ({ input }) => {
        await addReviewDb(input);
        return { success: true };
      }),
    delete: adminProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        await deleteReviewDb(input.id);
        return { success: true };
      }),
    update: adminProcedure.input(z.object({ id: z.number(), authorName: z.string().min(1), rating: z.number().min(1).max(5), comment: z.string().optional() })).mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");
      const { id, ...values } = input;
      await db.update(reviews).set(values).where(eq(reviews.id, id));
      return { success: true };
    }),
  }),

  // === Mural da Comunidade ===
  mural: router({
    listApproved: publicProcedure.query(async () => {
      return await getApprovedMuralPostsDb();
    }),
    listAll: adminProcedure.query(async () => {
      return await getAllMuralPostsDb();
    }),
    add: publicProcedure
      .input(
        z.object({
          authorName: z.string().min(1),
          category: z.string().optional(),
          message: z.string().min(1),
        })
      )
      .mutation(async ({ input }) => {
        await addMuralPostDb({
          authorName: input.authorName,
          category: input.category || "Geral",
          message: input.message,
        });
        return { success: true };
      }),
    updateStatus: adminProcedure
      .input(z.object({ id: z.number(), status: z.enum(["pending", "approved", "rejected"]) }))
      .mutation(async ({ input }) => {
        await updateMuralPostStatusDb(input.id, input.status);
        return { success: true };
      }),
    update: adminProcedure.input(z.object({ id: z.number(), authorName: z.string().min(1), category: z.string().optional(), message: z.string().min(1) })).mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");
      const { id, ...values } = input;
      await db.update(muralPosts).set(values).where(eq(muralPosts.id, id));
      return { success: true };
    }),
    delete: adminProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        await deleteMuralPostDb(input.id);
        return { success: true };
      }),
  }),
});

export type AppRouter = typeof appRouter;
