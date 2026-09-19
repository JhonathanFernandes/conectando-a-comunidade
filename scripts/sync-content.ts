import { closeDb } from "../server/db";
import { syncEvents } from "../server/events";
import { phaseForRunInSaoPaulo, syncNews } from "../server/news";

const requestedPhase = process.argv[2] ?? "auto";
if (requestedPhase !== "auto" && requestedPhase !== "morning" && requestedPhase !== "afternoon") {
  console.error("Uso: pnpm exec tsx scripts/sync-content.ts [auto|morning|afternoon]");
  process.exit(2);
}

async function main() {
  const now = new Date();
  const phase = requestedPhase === "auto" ? phaseForRunInSaoPaulo(now) : requestedPhase;
  const results = await Promise.allSettled([
    syncNews(phase as "morning" | "afternoon", now),
    syncEvents(now),
  ]);
  const [newsResult, eventsResult] = results;
  if (newsResult.status === "fulfilled") {
    console.log(`[news] ciclo=${newsResult.value.cycleDate} fase=${newsResult.value.phase} feed=${newsResult.value.fetched} exibidas=${newsResult.value.selected}`);
  } else console.error("[news] sincronização falhou:", newsResult.reason instanceof Error ? newsResult.reason.message : "erro desconhecido");
  if (eventsResult.status === "fulfilled") {
    console.log(`[events] data=${eventsResult.value.date} encontrados=${eventsResult.value.fetched} exibidos=${eventsResult.value.selected}`);
  } else console.error("[events] sincronização falhou:", eventsResult.reason instanceof Error ? eventsResult.reason.message : "erro desconhecido");
  if (results.some((result) => result.status === "rejected")) process.exitCode = 1;
}

main().finally(closeDb);

