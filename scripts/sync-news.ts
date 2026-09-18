import { phaseForRunInSaoPaulo, syncNews } from "../server/news";
import { closeDb } from "../server/db";

const requestedPhase = process.argv[2] ?? "auto";
if (requestedPhase !== "auto" && requestedPhase !== "morning" && requestedPhase !== "afternoon") {
  console.error("Uso: pnpm exec tsx scripts/sync-news.ts [auto|morning|afternoon]");
  process.exit(2);
}

async function main() {
  try {
    const phase = requestedPhase === "auto" ? phaseForRunInSaoPaulo(new Date()) : requestedPhase;
    const result = await syncNews(phase as "morning" | "afternoon");
    console.log(`[news] ciclo=${result.cycleDate} fase=${result.phase} feed=${result.fetched} exibidas=${result.selected}`);
  } catch (error) {
    console.error("[news] sincronização falhou:", error instanceof Error ? error.message : "erro desconhecido");
    process.exitCode = 1;
  } finally {
    await closeDb();
  }
}

void main();
