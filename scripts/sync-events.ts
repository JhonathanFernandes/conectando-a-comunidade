import { closeDb } from "../server/db";
import { syncEvents } from "../server/events";

async function main() {
  try {
    const result = await syncEvents();
    console.log(`[events] data=${result.date} base=${result.datasetUrl} encontrados=${result.fetched} exibidos=${result.selected}`);
  } catch (error) {
    console.error("[events] sincronização falhou:", error instanceof Error ? error.message : "erro desconhecido");
    process.exitCode = 1;
  } finally {
    await closeDb();
  }
}

void main();

