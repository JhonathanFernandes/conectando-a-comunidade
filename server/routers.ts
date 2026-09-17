import { COOKIE_NAME } from "@shared/const";
import { z } from "zod";
import { eq, desc } from "drizzle-orm";
import { getSessionCookieOptions } from "./_core/cookies";
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

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
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
        await db.insert(commerces).values({ ...input, status: "pending" });
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
        return await getAllReviewsDb("commerce");
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
    delete: adminProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        await deleteMuralPostDb(input.id);
        return { success: true };
      }),
  }),
});

export type AppRouter = typeof appRouter;
