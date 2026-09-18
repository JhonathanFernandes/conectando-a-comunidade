import { and, desc, eq, lt, sql } from "drizzle-orm";
import { XMLParser, XMLValidator } from "fast-xml-parser";
import { news } from "../drizzle/schema";
import { getDb } from "./db";

export const TRIBUNA_RSS_URL = "https://www.tribunapr.com.br/feed/";
const SOURCE = "Tribuna do Paraná";
const TIME_ZONE = "America/Sao_Paulo";

export interface NewsCandidate {
  title: string;
  excerpt: string | null;
  source: string;
  sourceUrl: string;
  publishedAt: Date;
  category: string | null;
  imageUrl: string | null;
}

function nodeText(value: unknown): string {
  if (typeof value === "string") return value;
  if (typeof value === "object" && value !== null) {
    const node = value as Record<string, unknown>;
    return nodeText(node["#cdata"] ?? node["#text"]);
  }
  return "";
}

function plainText(value: unknown, limit: number): string {
  return nodeText(value)
    .replace(/<[^>]*>/g, " ")
    .replace(/&(?:nbsp|hellip|amp|quot|apos|lt|gt);|&#(?:x[\da-f]+|\d+);/gi, (entity) => {
      const named: Record<string, string> = { "&nbsp;": " ", "&hellip;": "…", "&amp;": "&", "&quot;": '"', "&apos;": "'", "&lt;": "<", "&gt;": ">" };
      if (named[entity.toLowerCase()]) return named[entity.toLowerCase()];
      const hex = entity[2]?.toLowerCase() === "x";
      const code = Number.parseInt(entity.slice(hex ? 3 : 2, -1), hex ? 16 : 10);
      return Number.isInteger(code) && code > 0 && code <= 0x10ffff ? String.fromCodePoint(code) : "";
    })
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, limit);
}

export function validArticleUrl(value: unknown): value is string {
  if (typeof value !== "string" || value.length > 2048) return false;
  try {
    const url = new URL(value);
    const segments = url.pathname.split("/").filter(Boolean);
    const requiredSegments = segments[0] === "noticias" ? 3 : 2;
    return url.protocol === "https:" && url.hostname === "www.tribunapr.com.br" &&
      !url.username && !url.password && segments.length >= requiredSegments &&
      !segments.includes("feed") && !segments.includes("busca");
  } catch {
    return false;
  }
}

function imageFromItem(value: unknown): string | null {
  if (typeof value !== "object" || value === null) return null;
  const enclosure = value as Record<string, unknown>;
  const imageUrl = enclosure["@_url"];
  const type = enclosure["@_type"];
  if (typeof imageUrl !== "string" || typeof type !== "string" || !type.startsWith("image/")) return null;
  try {
    const url = new URL(imageUrl);
    return url.protocol === "https:" && url.hostname === "www.tribunapr.com.br" &&
      url.pathname.startsWith("/wp-content/uploads/") ? imageUrl : null;
  } catch {
    return null;
  }
}

export function parseTribunaFeed(xml: string): NewsCandidate[] {
  if (xml.length > 1_000_000 || /<!DOCTYPE|<!ENTITY/i.test(xml) || XMLValidator.validate(xml) !== true) {
    throw new Error("RSS da Tribuna inválido");
  }
  const parsed = new XMLParser({ ignoreAttributes: false, attributeNamePrefix: "@_", cdataPropName: "#cdata" }).parse(xml);
  const channel = parsed?.rss?.channel;
  if (!channel) throw new Error("RSS da Tribuna sem canal");
  const rawItems = channel.item;
  const items = !rawItems ? [] : Array.isArray(rawItems) ? rawItems : [rawItems];
  const seen = new Set<string>();
  const result: NewsCandidate[] = [];

  for (const item of items) {
    const title = plainText(item?.title, 500);
    const sourceUrl = nodeText(item?.link).trim();
    const publishedAt = new Date(nodeText(item?.pubDate));
    if (!title || !validArticleUrl(sourceUrl) || Number.isNaN(publishedAt.getTime()) || seen.has(sourceUrl)) continue;
    seen.add(sourceUrl);
    result.push({
      title,
      excerpt: plainText(item?.description, 320) || null,
      source: SOURCE,
      sourceUrl,
      publishedAt,
      category: plainText(Array.isArray(item?.category) ? item.category[0] : item?.category, 100) || null,
      imageUrl: imageFromItem(item?.enclosure),
    });
  }
  return result;
}

export function cycleDateInSaoPaulo(date: Date): string {
  const parts = new Intl.DateTimeFormat("en-US", { timeZone: TIME_ZONE, year: "numeric", month: "2-digit", day: "2-digit" }).formatToParts(date);
  const part = (name: string) => parts.find((item) => item.type === name)?.value ?? "";
  return `${part("year")}-${part("month")}-${part("day")}`;
}

export function phaseInSaoPaulo(date: Date): "morning" | "afternoon" | null {
  const hour = Number(new Intl.DateTimeFormat("en-US", { timeZone: TIME_ZONE, hour: "2-digit", hourCycle: "h23" }).format(date));
  return hour === 8 ? "morning" : hour === 14 ? "afternoon" : null;
}

function sectionKey(article: NewsCandidate): string {
  const parts = new URL(article.sourceUrl).pathname.split("/").filter(Boolean);
  return parts[0] === "noticias" ? `${parts[0]}/${parts[1]}` : parts[0];
}

export function selectDiverseNews(candidates: NewsCandidate[], limit = 10): NewsCandidate[] {
  const unique = new Map<string, NewsCandidate>();
  for (const item of candidates) {
    const previous = unique.get(item.sourceUrl);
    if (!previous || item.publishedAt > previous.publishedAt) unique.set(item.sourceUrl, item);
  }
  const groups = new Map<string, NewsCandidate[]>();
  for (const item of Array.from(unique.values()).sort((a, b) => b.publishedAt.getTime() - a.publishedAt.getTime())) {
    const key = sectionKey(item);
    groups.set(key, [...(groups.get(key) ?? []), item]);
  }
  const selected: NewsCandidate[] = [];
  while (selected.length < limit && Array.from(groups.values()).some((group) => group.length > 0)) {
    const ordered = Array.from(groups.values()).filter((group) => group.length).sort((a, b) => b[0].publishedAt.getTime() - a[0].publishedAt.getTime());
    for (const group of ordered) {
      if (selected.length === limit) break;
      selected.push(group.shift()!);
    }
  }
  return selected;
}

export function buildCycle(candidates: NewsCandidate[], current: NewsCandidate[], now: Date, phase: "morning" | "afternoon") {
  const today = cycleDateInSaoPaulo(now);
  const fresh = candidates.filter((item) => item.publishedAt <= now && cycleDateInSaoPaulo(item.publishedAt) === today);
  return selectDiverseNews(phase === "afternoon" ? [...fresh, ...current] : fresh);
}

export async function fetchTribunaFeed(fetcher: typeof fetch = fetch): Promise<NewsCandidate[]> {
  const response = await fetcher(TRIBUNA_RSS_URL, { signal: AbortSignal.timeout(15_000), headers: { Accept: "application/rss+xml, application/xml, text/xml" } });
  if (!response.ok) throw new Error(`RSS da Tribuna retornou HTTP ${response.status}`);
  const xml = await response.text();
  return parseTribunaFeed(xml);
}

export async function getCurrentNews(now = new Date()) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(news)
    .where(and(eq(news.cycleDate, cycleDateInSaoPaulo(now)), eq(news.active, true)))
    .orderBy(desc(news.publishedAt)).limit(10);
}

export async function syncNews(phase: "morning" | "afternoon", now = new Date(), fetcher: typeof fetch = fetch) {
  // Fetch before opening a transaction: an RSS outage leaves the current cycle untouched.
  const candidates = await fetchTribunaFeed(fetcher);
  const db = await getDb();
  if (!db) throw new Error("Banco de dados indisponível para notícias");
  const today = cycleDateInSaoPaulo(now);
  const cutoff = cycleDateInSaoPaulo(new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000));

  return db.transaction(async (tx) => {
    await tx.execute(sql`select pg_advisory_xact_lock(65420326)`);
    const currentRows = phase === "afternoon"
      ? await tx.select().from(news).where(and(eq(news.cycleDate, today), eq(news.active, true)))
      : [];
    const current: NewsCandidate[] = currentRows.map(({ title, excerpt, source, sourceUrl, publishedAt, category, imageUrl }) =>
      ({ title, excerpt, source, sourceUrl, publishedAt, category, imageUrl }));
    const selected = buildCycle(candidates, current, now, phase);
    await tx.update(news).set({ active: false, updatedAt: now }).where(eq(news.cycleDate, today));
    for (const item of selected) {
      await tx.insert(news).values({ ...item, cycleDate: today, active: true, updatedAt: now })
        .onConflictDoUpdate({ target: news.sourceUrl, set: { ...item, cycleDate: today, active: true, updatedAt: now } });
    }
    await tx.delete(news).where(lt(news.cycleDate, cutoff));
    return { cycleDate: today, phase, selected: selected.length, fetched: candidates.length };
  });
}
