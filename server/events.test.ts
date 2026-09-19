import { describe, expect, it } from "vitest";
import { latestDatasetUrl, parseCuritibaEventsCsv, parseTourismEventsHtml, selectUpcomingEvents } from "./events";

const header = "EVE_IDF;EVE_TITULO;EVE_DESCRICAO;EVE_PUBLICADO;EVE_DATA_INICIO;EVE_DATA_TERMINO;SEE_STR_NOME;EVE_DATA_CADASTRO;EVE_LOCAL;EVE_ENDERECO;EVE_HORARIO;EVE_REPETIR;EVE_DIA;BAI_DESCRICAO;ETE_DESCRICAO;ETI_DESCRICAO;REG_DESCRICAO";

describe("eventos oficiais de Curitiba", () => {
  it("interpreta campos entre aspas, datas e localização", () => {
    const csv = `${header}\n42;\"Feira; cultural\";\"Descrição com; separador\";1;2026-09-20 00:00:00.000;2026-09-21 00:00:00.000;Fundação Cultural;;Memorial;Rua Teste, 10;10h às 18h;;;Centro;Cultura;;Matriz`;
    expect(parseCuritibaEventsCsv(csv)).toEqual([expect.objectContaining({
      externalId: "pmc:42", title: "Feira; cultural", date: "2026-09-20", endDate: "2026-09-21", category: "Cultura",
      location: "Memorial — Rua Teste, 10 — Centro",
    })]);
  });

  it("seleciona os dez próximos e remove eventos encerrados", () => {
    const events = Array.from({ length: 12 }, (_, index) => ({
      externalId: `pmc:${index}`, title: `Evento ${index}`, category: "Cultura", date: `2026-09-${String(index + 10).padStart(2, "0")}`,
      endDate: `2026-09-${String(index + 10).padStart(2, "0")}`, time: null, location: null, organizer: null, description: null,
      source: "curitiba-open-data", sourceUrl: "https://example.test",
    }));
    const selected = selectUpcomingEvents(events, "2026-09-15");
    expect(selected).toHaveLength(7);
    expect(selected[0].date).toBe("2026-09-15");
  });

  it("encontra somente a base oficial mais recente", () => {
    const html = '<a href="2026-09-18_Eventos_-_Base_de_Dados.csv">a</a><a href="2026-09-19_Eventos_-_Base_de_Dados.csv">b</a>';
    expect(latestDatasetUrl(html)).toContain("2026-09-19_Eventos_-_Base_de_Dados.csv");
    expect(() => latestDatasetUrl('<a href="https://evil.example/2026-09-20_Eventos_-_Base_de_Dados.csv">x</a>')).toThrow("URL inválida");
  });

  it("interpreta os dez cards do calendário oficial", () => {
    const html = '<input value="19/09/2026"><div class="itemEventoConteudo"><span class="dataEvento dataEventoMenor">20</span><span class="dataEvento dataEventoMenor">09</span><span class="categoria">Festival</span><h4><a href="/evento/festival-primavera/4333">Festival Primavera</a></h4></div>';
    expect(parseTourismEventsHtml(html)).toEqual([expect.objectContaining({ externalId: "turismo:4333", date: "2026-09-20", category: "Festival", title: "Festival Primavera" })]);
  });
});
