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
import { trpc } from "@/lib/trpc";

const dateFormatter = new Intl.DateTimeFormat("pt-BR", {
  timeZone: "America/Sao_Paulo", dateStyle: "short", timeStyle: "short",
});

export default function Noticias() {
  const { data: news = [], isLoading, isError } = trpc.news.listCurrent.useQuery(undefined, { refetchInterval: 15 * 60 * 1000 });
  const newsCategories = ["Todas", ...Array.from(new Set(news.map((item) => item.category).filter((category): category is string => Boolean(category))))];
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
          {!isLoading && filtered.length === 0 && (
            <div className="mb-8 p-6 rounded-xl bg-card border border-border text-muted-foreground">
              {isError ? "Notícias indisponíveis no momento. Tente novamente mais tarde." : "Ainda não há notícias para o ciclo de hoje."}
            </div>
          )}
          {filtered.length > 0 && (
            <div className="mb-8 p-6 rounded-xl bg-card border border-border shadow-sm">
              {filtered[0].imageUrl && <img src={filtered[0].imageUrl} alt="" className="w-full max-h-64 object-cover rounded-lg mb-4" loading="lazy" />}
              {filtered[0].category && <span className="inline-block px-2 py-0.5 rounded text-xs font-medium bg-primary/10 text-primary mb-3">{filtered[0].category}</span>}
              <h2 className="font-serif text-2xl font-bold text-foreground mb-2">
                {filtered[0].title}
              </h2>
              <p className="text-muted-foreground mb-4">{filtered[0].excerpt}</p>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="w-4 h-4" />
                <span>{dateFormatter.format(filtered[0].publishedAt)}</span>
                <span className="ml-2">Fonte: Tribuna do Paraná</span>
                <a href={filtered[0].sourceUrl} target="_blank" rel="noopener noreferrer" className="ml-auto inline-flex items-center gap-1 text-primary hover:underline">Ler matéria <ArrowRight className="w-4 h-4" /></a>
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
                {item.imageUrl && <img src={item.imageUrl} alt="" className="w-full h-40 object-cover rounded-lg mb-3" loading="lazy" />}
                {item.category && <span className="inline-block px-2 py-0.5 rounded text-xs font-medium bg-accent/10 text-accent mb-3">{item.category}</span>}
                <h3 className="font-serif text-lg font-semibold text-foreground group-hover:text-primary transition-colors mb-2">
                  {item.title}
                </h3>
                <p className="text-sm text-muted-foreground mb-4 line-clamp-3">{item.excerpt}</p>
                <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>{dateFormatter.format(item.publishedAt)}</span>
                  <span>Fonte: Tribuna do Paraná</span>
                  <a href={item.sourceUrl} target="_blank" rel="noopener noreferrer" className="ml-auto text-primary hover:underline">Ler matéria</a>
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
