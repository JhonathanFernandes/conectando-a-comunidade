import { photoUrl } from "@/data/photos";
/*
 * Design: Terra Viva — Notícias do Bairro
 */
import { useState, useRef, useEffect } from "react";
import { Newspaper, Calendar, ArrowRight, Filter, ChevronDown, Tag } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WaveDivider from "@/components/WaveDivider";

const newsCategories = [
  "Todas", "Obras", "Prefeitura",
];

interface NewsItem {
  id: number;
  title: string;
  category: string;
  date: string;
  excerpt: string;
  url: string;
}

const news: NewsItem[] = [
  { id: 1, title: "Recuperação de galeria pluvial na Rua Eduardo Sprada", category: "Obras", date: "23/07/2026", excerpt: "A Prefeitura informou uma intervenção na Rua Eduardo Sprada, no Campo Comprido, para recuperação de galeria pluvial.", url: "https://www.curitiba.pr.gov.br/noticias/recuperacao-de-galeria-pluvial-altera-transito-na-rua-eduardo-sprada-no-campo-comprido/84226" },
  { id: 2, title: "Obra na Major Heitor Guimarães afeta acesso à região", category: "Obras", date: "2026", excerpt: "A Prefeitura publicou informações sobre as obras no corredor que liga a BR-277 aos bairros da região do Campo Comprido.", url: "https://www.curitiba.pr.gov.br/noticias/major-heitor-guimaraes-passa-por-obra-complexa-para-melhoria-do-transporte-publico-e-da-regiao/83234" },
  { id: 3, title: "Licitação para novos terminais Campo Comprido e Centenário", category: "Prefeitura", date: "2026", excerpt: "Foi aberto processo de licitação para construir os novos terminais do projeto BRT Leste/Oeste.", url: "https://www.curitiba.pr.gov.br/noticias/licitacao-para-construcao-dos-novos-terminais-campo-comprido-e-centenario-esta-aberta/82574" },
  { id: 4, title: "Área de macrodrenagem vira parque no Campo Comprido", category: "Obras", date: "31/03/2026", excerpt: "Obra às margens do Rio Mossunguê combina prevenção de alagamentos e novo espaço de lazer.", url: "https://www.curitiba.pr.gov.br/noticias/obra-de-macrodrenagem-transforma-area-do-campo-comprido-em-novo-parque-de-curitiba/82444" },
  { id: 5, title: "Projeto habitacional para famílias da Vila Santos Andrade", category: "Prefeitura", date: "20/02/2026", excerpt: "A Prefeitura apresentou avanço no projeto de regularização fundiária e reassentamento no Campo Comprido.", url: "https://www.curitiba.pr.gov.br/noticias/curitiba-avanca-em-solucao-habitacional-e-ambiental-para-300-familias-no-campo-comprido/81788" },
];

export default function Noticias() {
  const [activeCategory, setActiveCategory] = useState("Todas");
  const [filterOpen, setFilterOpen] = useState(false);
  const filterRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (filterRef.current && !filterRef.current.contains(e.target as Node)) {
        setFilterOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filtered = news.filter(
    (n) => activeCategory === "Todas" || n.category === activeCategory
  );

  return (
    <div className="min-h-screen">
      <Header />

      {/* Hero */}
      <section className="pt-28 lg:pt-36 pb-12 min-h-[320px] lg:min-h-[360px] relative overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={photoUrl("terminal-campo-comprido.jpg")}
            alt="Terminal Campo Comprido"
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-black/50" />
        </div>
        <div className="container relative z-10">
          <p className="text-white/70 font-medium text-sm uppercase tracking-widest mb-2">
            Notícias do Bairro
          </p>
          <h1 className="font-serif text-3xl lg:text-5xl font-bold text-white mb-4">
            Fique por dentro do Campo Comprido
          </h1>
          <p className="text-white/80 text-lg max-w-2xl">
            Acompanhe as últimas notícias sobre segurança, obras, eventos e mais.
          </p>
        </div>
      </section>

      <WaveDivider color="oklch(0.25 0.02 150)" />

      <section className="py-10 lg:py-14 bg-background">
        <div className="container">
          {/* Category filter dropdown */}
          <div className="relative inline-block mb-8" ref={filterRef}>
            <button
              onClick={() => setFilterOpen(!filterOpen)}
              className="inline-flex items-center gap-2 px-4 py-3 rounded-lg text-sm font-medium transition-all shadow-md bg-card border border-border text-foreground hover:border-primary/50 min-w-[200px]"
            >
              <Filter className="w-4 h-4" />
              {activeCategory}
              <ChevronDown className={`w-4 h-4 ml-auto transition-transform ${filterOpen ? "rotate-180" : ""}`} />
            </button>

            <AnimatePresence>
              {filterOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -8, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -8, scale: 0.96 }}
                  transition={{ duration: 0.2, ease: [0.23, 1, 0.32, 1] }}
                  className="absolute top-full left-0 mt-2 w-56 bg-card rounded-xl shadow-2xl border border-border z-50 overflow-hidden"
                >
                  {newsCategories.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => { setActiveCategory(cat); setFilterOpen(false); }}
                      className={`w-full flex items-center gap-2 px-4 py-3 text-sm transition-colors border-b border-border last:border-0 ${
                        activeCategory === cat
                          ? "bg-primary/10 text-primary font-medium"
                          : "text-foreground hover:bg-muted"
                      }`}
                    >
                      <Tag className="w-3.5 h-3.5" />
                      {cat}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Featured news */}
          {filtered.length > 0 && (
            <div className="mb-8 p-6 rounded-xl bg-card border border-border shadow-sm">
              <span className="inline-block px-2 py-0.5 rounded text-xs font-medium bg-primary/10 text-primary mb-3">
                {filtered[0].category}
              </span>
              <h2 className="font-serif text-2xl font-bold text-foreground mb-2">
                {filtered[0].title}
              </h2>
              <p className="text-muted-foreground mb-4">{filtered[0].excerpt}</p>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="w-4 h-4" />
                <span>{filtered[0].date}</span>
                <a href={filtered[0].url} target="_blank" rel="noopener noreferrer" className="ml-auto inline-flex items-center gap-1 text-primary hover:underline">Ler na fonte <ArrowRight className="w-4 h-4" /></a>
              </div>
            </div>
          )}

          {/* News grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filtered.slice(1).map((item) => (
              <article
                key={item.id}
                className="p-5 rounded-xl bg-card border border-border hover:border-primary/30 hover:shadow-md transition-all group"
              >
                <span className="inline-block px-2 py-0.5 rounded text-xs font-medium bg-accent/10 text-accent mb-3">
                  {item.category}
                </span>
                <h3 className="font-serif text-lg font-semibold text-foreground group-hover:text-primary transition-colors mb-2">
                  {item.title}
                </h3>
                <p className="text-sm text-muted-foreground mb-4 line-clamp-3">{item.excerpt}</p>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>{item.date}</span>
                  <a href={item.url} target="_blank" rel="noopener noreferrer" className="ml-auto text-primary hover:underline">Ler na fonte</a>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
