import { boolean, date, index, integer, pgEnum, pgTable, serial, text, timestamp, uniqueIndex, varchar } from "drizzle-orm/pg-core";

export const userRole = pgEnum("user_role", ["user", "admin"]);
export const approvalStatus = pgEnum("approval_status", ["pending", "approved", "rejected"]);
export const resolutionStatus = pgEnum("resolution_status", ["pending", "resolved", "rejected"]);
export const reviewTargetType = pgEnum("review_target_type", ["commerce", "service"]);

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const users = pgTable("users", {
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
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

// === Tabelas do projeto Campo Comprido ===

export const commerces = pgTable("commerces", {
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
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export const complaints = pgTable("complaints", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  phone: varchar("phone", { length: 50 }),
  type: varchar("type", { length: 100 }).notNull(),
  address: varchar("address", { length: 255 }),
  description: text("description").notNull(),
  status: resolutionStatus("status").default("pending").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export const suggestions = pgTable("suggestions", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 320 }),
  phone: varchar("phone", { length: 50 }),
  type: varchar("type", { length: 100 }).notNull(),
  message: text("message").notNull(),
  status: resolutionStatus("status").default("pending").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export const events = pgTable("events", {
  id: serial("id").primaryKey(),
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

export const usefulPhones = pgTable("usefulPhones", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  category: varchar("category", { length: 100 }),
  phone: varchar("phone", { length: 50 }).notNull(),
  address: varchar("address", { length: 255 }),
  hours: varchar("hours", { length: 100 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

// === Reviews (avaliações com estrelas igual Google) ===

export const reviews = pgTable("reviews", {
  id: serial("id").primaryKey(),
  authorName: varchar("authorName", { length: 255 }).notNull(),
  targetType: reviewTargetType("targetType").notNull(),
  targetId: integer("targetId").notNull(),
  targetName: varchar("targetName", { length: 255 }).notNull(),
  rating: integer("rating").notNull(),
  comment: text("comment"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Review = typeof reviews.$inferSelect;
export type InsertReview = typeof reviews.$inferInsert;

// === Mural da Comunidade ===

export const muralPosts = pgTable("muralPosts", {
  id: serial("id").primaryKey(),
  authorName: varchar("authorName", { length: 255 }).notNull(),
  category: varchar("category", { length: 100 }).default("Geral"),
  message: text("message").notNull(),
  status: approvalStatus("status").default("pending").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type MuralPost = typeof muralPosts.$inferSelect;
export type InsertMuralPost = typeof muralPosts.$inferInsert;

// Notícias importadas do RSS da Tribuna do Paraná. Conteúdo completo não é armazenado.
export const news = pgTable("news", {
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
  updatedAt: timestamp("updatedAt", { withTimezone: true }).defaultNow().notNull(),
}, (table) => [
  uniqueIndex("news_source_url_unique").on(table.sourceUrl),
  index("news_cycle_date_idx").on(table.cycleDate),
  index("news_published_at_idx").on(table.publishedAt),
]);
