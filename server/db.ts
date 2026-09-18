import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { InsertUser, users } from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;
let _client: ReturnType<typeof postgres> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
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

// Used by short-lived jobs so the connection pool does not keep the process alive.
export async function closeDb() {
  await _client?.end();
  _client = null;
  _db = null;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Partial<InsertUser> = { updatedAt: new Date() };

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onConflictDoUpdate({
      target: users.openId,
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

// TODO: add feature queries here as your schema grows.

// === Reviews ===

import { desc, and } from "drizzle-orm";
import { reviews, muralPosts } from "../drizzle/schema";

export async function addReview(data: {
  authorName: string;
  targetType: "commerce" | "service";
  targetId: number;
  targetName: string;
  rating: number;
  comment?: string;
}) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(reviews).values({ ...data });
  return result;
}

export async function getReviewsByTarget(targetType: "commerce" | "service", targetId: number) {
  const db = await getDb();
  if (!db) return [];
  const result = await db
    .select()
    .from(reviews)
    .where(and(eq(reviews.targetType, targetType), eq(reviews.targetId, targetId)))
    .orderBy(desc(reviews.createdAt));
  return result;
}

export async function getAllReviews(targetType?: "commerce" | "service") {
  const db = await getDb();
  if (!db) return [];
  const result = targetType
    ? await db.select().from(reviews).where(eq(reviews.targetType, targetType)).orderBy(desc(reviews.createdAt))
    : await db.select().from(reviews).orderBy(desc(reviews.createdAt));
  return result;
}

export async function deleteReview(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return await db.delete(reviews).where(eq(reviews.id, id));
}

// === Mural ===

export async function addMuralPost(data: { authorName: string; category: string; message: string }) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return await db.insert(muralPosts).values({ ...data, status: "approved" });
}

export async function getApprovedMuralPosts() {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(muralPosts).where(eq(muralPosts.status, "approved")).orderBy(desc(muralPosts.createdAt));
}

export async function getAllMuralPosts() {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(muralPosts).orderBy(desc(muralPosts.createdAt));
}

export async function updateMuralPostStatus(id: number, status: "pending" | "approved" | "rejected") {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return await db.update(muralPosts).set({ status }).where(eq(muralPosts.id, id));
}

export async function deleteMuralPost(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return await db.delete(muralPosts).where(eq(muralPosts.id, id));
}
