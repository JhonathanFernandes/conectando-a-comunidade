import { int, mysqlEnum, mysqlTable, text, timestamp, varchar } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const users = mysqlTable("users", {
  /**
   * Surrogate primary key. Auto-incremented numeric value managed by the database.
   * Use this for relations between tables.
   */
  id: int("id").autoincrement().primaryKey(),
  /** Manus OAuth identifier (openId) returned from the OAuth callback. Unique per user. */
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

// === Tabelas do projeto Campo Comprido ===

export const commerces = mysqlTable("commerces", {
  id: int("id").autoincrement().primaryKey(),
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
  status: mysqlEnum("status", ["pending", "approved", "rejected"]).default("pending").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export const complaints = mysqlTable("complaints", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  phone: varchar("phone", { length: 50 }),
  type: varchar("type", { length: 100 }).notNull(),
  address: varchar("address", { length: 255 }),
  description: text("description").notNull(),
  status: mysqlEnum("status", ["pending", "resolved", "rejected"]).default("pending").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export const suggestions = mysqlTable("suggestions", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 320 }),
  phone: varchar("phone", { length: 50 }),
  type: varchar("type", { length: 100 }).notNull(),
  message: text("message").notNull(),
  status: mysqlEnum("status", ["pending", "resolved", "rejected"]).default("pending").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export const events = mysqlTable("events", {
  id: int("id").autoincrement().primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  category: varchar("category", { length: 100 }).notNull(),
  date: varchar("date", { length: 100 }),
  time: varchar("time", { length: 100 }),
  location: varchar("location", { length: 255 }),
  organizer: varchar("organizer", { length: 255 }),
  description: text("description"),
  attendees: varchar("attendees", { length: 100 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export const usefulPhones = mysqlTable("usefulPhones", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  category: varchar("category", { length: 100 }),
  phone: varchar("phone", { length: 50 }).notNull(),
  address: varchar("address", { length: 255 }),
  hours: varchar("hours", { length: 100 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

// === Reviews (avaliações com estrelas igual Google) ===

export const reviews = mysqlTable("reviews", {
  id: int("id").autoincrement().primaryKey(),
  authorName: varchar("authorName", { length: 255 }).notNull(),
  targetType: mysqlEnum("targetType", ["commerce", "service"]).notNull(),
  targetId: int("targetId").notNull(),
  targetName: varchar("targetName", { length: 255 }).notNull(),
  rating: int("rating").notNull(),
  comment: text("comment"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Review = typeof reviews.$inferSelect;
export type InsertReview = typeof reviews.$inferInsert;

// === Mural da Comunidade ===

export const muralPosts = mysqlTable("muralPosts", {
  id: int("id").autoincrement().primaryKey(),
  authorName: varchar("authorName", { length: 255 }).notNull(),
  category: varchar("category", { length: 100 }).default("Geral"),
  message: text("message").notNull(),
  status: mysqlEnum("status", ["pending", "approved", "rejected"]).default("pending").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type MuralPost = typeof muralPosts.$inferSelect;
export type InsertMuralPost = typeof muralPosts.$inferInsert;