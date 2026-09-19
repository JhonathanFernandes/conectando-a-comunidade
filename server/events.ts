import { asc, eq, sql } from "drizzle-orm";
import { events } from "../drizzle/schema";
import { getDb } from "./db";

export const CURITIBA_EVENTS_INDEX = "https://dadosabertos.c3sl.ufpr.br/curitiba/AgendaPMC/";
export const CURITIBA_EVENTS_PAGE = "https://turismo.curitiba.pr.gov.br/eventos";
const OFFICIAL_SOURCE = "Prefeitura de Curitiba";
const OFFICIAL_SOURCE_KEY = "curitiba-open-data";
const MAX_DOWNLOAD_BYTES = 5_000_000;

export interface CuritibaEventCandidate {
  externalId: string;
  title: string;
  category: string;
  date: string;
  endDate: string;
  time: string | null;
  location: string | null;
  organizer: string | null;
  description: string | null;
  source: string;
  sourceUrl: string;
}

function clean(value: string | undefined, limit: number) {
  return (value ?? "").replace(/\s+/g, " ").trim().slice(0, limit);
}

export function parseDelimitedRows(input: string, delimiter = ";"): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let field = "";
  let quoted = false;
  for (let index = 0; index < input.length; index += 1) {
    const character = input[index];
    if (quoted) {
      if (character === '"' && input[index + 1] === '"') {
        field += '"';
        index += 1;
      } else if (character === '"') quoted = false;
      else field += character;
    } else if (character === '"') quoted = true;
    else if (character === delimiter) {
      row.push(field);
      field = "";
    } else if (character === "\n") {
      row.push(field.replace(/\r$/, ""));
      if (row.some(Boolean)) rows.push(row);
      row = [];
      field = "";
    } else field += character;
  }
  if (field || row.length) {
    row.push(field.replace(/\r$/, ""));
    if (row.some(Boolean)) rows.push(row);
  }
  return rows;
}

function isoDate(value: string | undefined) {
  const match = value?.match(/^(\d{4}-\d{2}-\d{2})/);
  return match?.[1] ?? "";
}

export function parseCuritibaEventsCsv(csv: string): CuritibaEventCandidate[] {
  if (!csv || csv.length > MAX_DOWNLOAD_BYTES) throw new Error("Base de eventos de Curitiba inválida");
  const rows = parseDelimitedRows(csv.replace(/^\uFEFF/, ""));
  const headers = rows.shift()?.map((header) => header.trim()) ?? [];
  const required = ["EVE_IDF", "EVE_TITULO", "EVE_DATA_INICIO"];
  if (!required.every((header) => headers.includes(header))) throw new Error("Colunas obrigatórias ausentes na base de eventos");
  const seen = new Set<string>();
  const candidates: CuritibaEventCandidate[] = [];

  for (const values of rows) {
    const record = Object.fromEntries(headers.map((header, index) => [header, values[index] ?? ""]));
    const id = clean(record.EVE_IDF, 50);
    const title = clean(record.EVE_TITULO, 255);
    const date = isoDate(record.EVE_DATA_INICIO);
    if (!id || !title || !date || record.EVE_PUBLICADO === "0" || seen.has(id)) continue;
    seen.add(id);
    const endDate = isoDate(record.EVE_DATA_TERMINO) || date;
    const place = clean(record.EVE_LOCAL, 150);
    const address = clean(record.EVE_ENDERECO, 180);
    const neighborhood = clean(record.BAI_DESCRICAO, 80);
    const location = [place, address, neighborhood].filter(Boolean).join(" — ").slice(0, 255);
    candidates.push({
      externalId: `pmc:${id}`,
      title,
      category: clean(record.ETE_DESCRICAO || record.ETI_DESCRICAO, 100) || "Eventos",
      date,
      endDate,
      time: clean(record.EVE_HORARIO, 100) || null,
      location: location || null,
      organizer: clean(record.SEE_STR_NOME, 255) || OFFICIAL_SOURCE,
      description: clean(record.EVE_DESCRICAO, 1200) || null,
      source: OFFICIAL_SOURCE_KEY,
      sourceUrl: CURITIBA_EVENTS_PAGE,
    });
  }
  return candidates;
}

function decodeHtml(value: string) {
  const named: Record<string, string> = { amp: "&", quot: '"', apos: "'", lt: "<", gt: ">", nbsp: " " };
  return value.replace(/&(#x?[\da-f]+|[a-z]+);/gi, (_, entity: string) => {
    if (entity[0] !== "#") return named[entity.toLowerCase()] ?? "";
    const hex = entity[1]?.toLowerCase() === "x";
    const code = Number.parseInt(entity.slice(hex ? 2 : 1), hex ? 16 : 10);
    return Number.isInteger(code) && code > 0 && code <= 0x10ffff ? String.fromCodePoint(code) : "";
  });
}

export function parseTourismEventsHtml(html: string): CuritibaEventCandidate[] {
  if (!html || html.length > MAX_DOWNLOAD_BYTES) throw new Error("Calendário de eventos de Curitiba inválido");
  const yearMatch = html.match(/value=["']\d{2}\/\d{2}\/(\d{4})["']/);
  const year = yearMatch?.[1] ?? String(new Date().getFullYear());
  const candidates: CuritibaEventCandidate[] = [];
  const blocks = Array.from(html.matchAll(/<div class=["']itemEventoConteudo["']>([\s\S]*?)<\/div>/gi));
  for (const match of blocks) {
    const block = match[1];
    const dateParts = Array.from(block.matchAll(/class=["'][^"']*dataEvento[^"']*["'][^>]*>(\d{2})</gi)).map((item) => item[1]);
    const category = block.match(/class=["']categoria["'][^>]*>([\s\S]*?)<\/span>/i)?.[1];
    const link = block.match(/href=["'](\/evento\/[^"']+\/(\d+))["'][^>]*>([\s\S]*?)<\/a>/i);
    if (dateParts.length < 2 || !link) continue;
    const date = `${year}-${dateParts[1]}-${dateParts[0]}`;
    const sourceUrl = new URL(link[1], CURITIBA_EVENTS_PAGE).toString();
    candidates.push({
      externalId: `turismo:${link[2]}`,
      title: clean(decodeHtml(link[3].replace(/<[^>]*>/g, " ")), 255),
      category: clean(decodeHtml((category ?? "Eventos").replace(/<[^>]*>/g, " ")), 100),
      date,
      endDate: date,
      time: null,
      location: "Curitiba",
      organizer: "Turismo Curitiba",
      description: "Consulte a programação, os horários e o local na fonte oficial.",
      source: OFFICIAL_SOURCE_KEY,
      sourceUrl,
    });
  }
  if (!candidates.length) throw new Error("Nenhum evento encontrado no calendário oficial");
  return candidates.slice(0, 10);
}

export function latestDatasetUrl(indexHtml: string) {
  const matches = Array.from(indexHtml.matchAll(/href=["']([^"']*?(\d{4}-\d{2}-\d{2})_Eventos_-_Base_de_Dados\.csv)["']/gi));
  if (!matches.length) throw new Error("Nenhuma base CSV de eventos encontrada");
  matches.sort((left, right) => right[2].localeCompare(left[2]));
  const url = new URL(matches[0][1], CURITIBA_EVENTS_INDEX);
  if (url.protocol !== "https:" || url.hostname !== "dadosabertos.c3sl.ufpr.br" || !url.pathname.startsWith("/curitiba/AgendaPMC/")) {
    throw new Error("URL inválida para a base de eventos");
  }
  return url.toString();
}

async function limitedBody(response: Response) {
  const declaredLength = Number(response.headers.get("content-length") || 0);
  if (declaredLength > MAX_DOWNLOAD_BYTES) throw new Error("Base de eventos excede o limite permitido");
  const buffer = await response.arrayBuffer();
  if (buffer.byteLength > MAX_DOWNLOAD_BYTES) throw new Error("Base de eventos excede o limite permitido");
  const utf8 = new TextDecoder("utf-8").decode(buffer);
  return utf8.includes("\uFFFD") ? new TextDecoder("windows-1252").decode(buffer) : utf8;
}

export async function fetchCuritibaEvents(fetcher: typeof fetch = fetch) {
  const response = await fetcher(CURITIBA_EVENTS_PAGE, { signal: AbortSignal.timeout(20_000), headers: { Accept: "text/html", "User-Agent": "ConectandoComunidade/1.0" } });
  if (!response.ok) throw new Error(`Calendário de eventos retornou HTTP ${response.status}`);
  return { datasetUrl: CURITIBA_EVENTS_PAGE, candidates: parseTourismEventsHtml(await limitedBody(response)) };
}

export function selectUpcomingEvents(candidates: CuritibaEventCandidate[], today: string, limit = 10) {
  return candidates
    .filter((event) => event.endDate >= today)
    .sort((left, right) => left.date.localeCompare(right.date) || left.title.localeCompare(right.title, "pt-BR"))
    .slice(0, limit);
}

export async function getPublicEvents(now = new Date()) {
  const db = await getDb();
  if (!db) return [];
  const today = now.toLocaleDateString("en-CA", { timeZone: "America/Sao_Paulo" });
  const rows = await db.select().from(events).orderBy(asc(events.date), asc(events.title));
  return rows.filter((event) => !event.date || (event.endDate || event.date) >= today);
}

export async function syncEvents(now = new Date(), fetcher: typeof fetch = fetch) {
  const { datasetUrl, candidates } = await fetchCuritibaEvents(fetcher);
  const today = now.toLocaleDateString("en-CA", { timeZone: "America/Sao_Paulo" });
  const selected = selectUpcomingEvents(candidates, today, 10);
  const db = await getDb();
  if (!db) throw new Error("Banco de dados indisponível para eventos");
  await db.transaction(async (tx) => {
    await tx.execute(sql`select pg_advisory_xact_lock(65420327)`);
    await tx.delete(events).where(eq(events.source, OFFICIAL_SOURCE_KEY));
    if (selected.length) await tx.insert(events).values(selected);
  });
  return { datasetUrl, fetched: candidates.length, selected: selected.length, date: today };
}
