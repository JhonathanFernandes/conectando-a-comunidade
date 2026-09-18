import { describe, expect, it } from "vitest";
import { buildCycle, cycleDateInSaoPaulo, fetchTribunaFeed, parseTribunaFeed, phaseInSaoPaulo, selectDiverseNews, validArticleUrl, type NewsCandidate } from "./news";

const articleUrl = (section: string, slug: string) => `https://www.tribunapr.com.br/${section}/${slug}/`;
const article = (section: string, slug: string, hour = 12): NewsCandidate => ({
  title: slug,
  excerpt: "Resumo curto",
  source: "Tribuna do Paraná",
  sourceUrl: articleUrl(section, slug),
  publishedAt: new Date(`2026-09-18T${String(hour).padStart(2, "0")}:00:00-03:00`),
  category: null,
  imageUrl: null,
});

const rss = (items: string) => `<?xml version="1.0"?><rss version="2.0"><channel><title>Tribuna</title>${items}</channel></rss>`;
const item = (url: string, extra = "") => `<item><title><![CDATA[Notícia de Curitiba]]></title><description><![CDATA[Resumo &hellip; <b>útil</b>]]></description><link>${url}</link><pubDate>Fri, 18 Sep 2026 15:00:00 GMT</pubDate>${extra}</item>`;

describe("RSS da Tribuna", () => {
  it("preserva a URL individual, limita o resumo e aceita imagem e categoria ausentes", () => {
    const url = articleUrl("noticias/curitiba-regiao", "materia-exata");
    const parsed = parseTribunaFeed(rss(item(url)));
    expect(parsed).toHaveLength(1);
    expect(parsed[0]).toMatchObject({ sourceUrl: url, source: "Tribuna do Paraná", excerpt: "Resumo … útil", imageUrl: null, category: null });
  });

  it("aceita enclosure de imagem da fonte e elimina duplicatas e URLs genéricas", () => {
    const url = articleUrl("noticias/parana", "outra-materia");
    const xml = rss(item(url, '<enclosure url="https://www.tribunapr.com.br/wp-content/uploads/2026/09/foto.jpg" type="image/jpeg"/>') + item(url) + item("https://www.tribunapr.com.br/"));
    expect(parseTribunaFeed(xml)).toHaveLength(1);
    expect(parseTribunaFeed(xml)[0].imageUrl).toContain("foto.jpg");
    expect(validArticleUrl("https://www.tribunapr.com.br/noticias/")).toBe(false);
    expect(validArticleUrl("https://www.tribunapr.com.br/noticias/parana/")).toBe(false);
    expect(validArticleUrl("https://outro-site.example/noticias/materia/")).toBe(false);
  });

  it("não derruba dados existentes quando o RSS está indisponível", async () => {
    const failedFetch = async () => { throw new Error("RSS indisponível"); };
    await expect(fetchTribunaFeed(failedFetch as typeof fetch)).rejects.toThrow("RSS indisponível");
    expect(() => parseTribunaFeed("<rss><channel>")).toThrow("RSS da Tribuna inválido");
  });
});

describe("seleção e ciclo diário", () => {
  it("seleciona menos de 10 quando o feed é curto e no máximo 10 quando é longo", () => {
    expect(selectDiverseNews([article("noticias/parana", "a")])).toHaveLength(1);
    expect(selectDiverseNews(Array.from({ length: 15 }, (_, index) => article("noticias/parana", `materia-${index}`)))).toHaveLength(10);
  });

  it("distribui as seções da fonte quando há alternativas", () => {
    const many = Array.from({ length: 12 }, (_, index) => article("noticias/parana", `parana-${index}`, 18));
    const selected = selectDiverseNews([...many, article("noticias/curitiba-regiao", "curitiba", 17), article("viva", "cultura", 16)]);
    expect(selected).toHaveLength(10);
    expect(selected.map((news) => news.sourceUrl)).toContain(articleUrl("noticias/curitiba-regiao", "curitiba"));
    expect(selected.map((news) => news.sourceUrl)).toContain(articleUrl("viva", "cultura"));
  });

  it("inicia o ciclo às 08h, complementa às 14h e exclui notícias do dia anterior", () => {
    const morning = new Date("2026-09-18T08:00:00-03:00");
    const afternoon = new Date("2026-09-18T14:00:00-03:00");
    const today = article("noticias/parana", "hoje", 7);
    const yesterday = { ...article("noticias/parana", "ontem"), publishedAt: new Date("2026-09-17T20:00:00-03:00") };
    expect(cycleDateInSaoPaulo(morning)).toBe("2026-09-18");
    expect(phaseInSaoPaulo(morning)).toBe("morning");
    expect(phaseInSaoPaulo(afternoon)).toBe("afternoon");
    expect(phaseInSaoPaulo(new Date("2026-09-18T12:00:00-03:00"))).toBeNull();
    expect(buildCycle([today, yesterday], [], morning, "morning").map((news) => news.sourceUrl)).toEqual([today.sourceUrl]);
    const newArticle = article("noticias/curitiba-regiao", "tarde", 13);
    expect(buildCycle([today, newArticle], [today], afternoon, "afternoon")).toHaveLength(2);
    expect(buildCycle([today], [], new Date("2026-09-19T08:00:00-03:00"), "morning")).toHaveLength(0);
  });
});
