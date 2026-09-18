import { phaseInSaoPaulo, syncNews } from "../server/news";
import { closeDb } from "../server/db";

const requestedPhase = process.argv[2] ?? "auto";
if (requestedPhase !== "auto" && requestedPhase !== "morning" && requestedPhase !== "afternoon") {
  console.error("Uso: pnpm exec tsx scripts/sync-news.ts [auto|morning|afternoon]");
  process.exit(2);
}

async function main() {
  try {
    const phase = requestedPhase === "auto" ? phaseInSaoPaulo(new Date()) : requestedPhase;
    if (!phase) throw new Error("Cron executado fora das 08h/14h em America/Sao_Paulo");
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
