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
  "Todas", "Segurança", "Obras", "Eventos", "Prefeitura", "Saúde", "Educação",
];

interface NewsItem {
  id: number;
  title: string;
  category: string;
  date: string;
  excerpt: string;
  image?: string;
}

const news: NewsItem[] = [
  { id: 1, title: "Curitiba anuncia expansão do BRT e melhorias no transporte do Campo Comprido", category: "Obras", date: "18/08/2026", excerpt: "A Prefeitura de Curitiba confirmou o investimento de R$ 50 milhões na modernização do corredor de ônibus que passa pelo bairro, com novos veículos e estações reformadas até 2027." },
  { id: 2, title: "Campanha de vacinação contra dengue e gripe mobiliza UBS do bairro", category: "Saúde", date: "15/08/2026", excerpt: "A UBS Campo Comprido está com a campanha de multivacinação ativa até o fim do mês. Moradores podem se vacinar de segunda a sexta, das 8h às 17h, sem agendamento prévio." },
  { id: 3, title: "Festival de Inverno do Campo Comprido reúne mais de 2 mil moradores", category: "Eventos", date: "12/08/2026", excerpt: "O evento realizado na Praça Getúlio Vargas contou com apresentações de artistas locais, comida típica e atividades para crianças, consolidando-se como tradição do bairro." },
  { id: 4, title: "Novo posto da Guarda Municipal reforça segurança na região do Terminal", category: "Segurança", date: "09/08/2026", excerpt: "A Guarda Municipal inaugurou um novo posto de atendimento nas proximidades do Terminal Campo Comprido, com rondas ampliadas e base comunitária para denúncias em tempo real." },
  { id: 5, title: "Escolas municipais recebem investimento em tecnologia e quadras poliesportivas", category: "Educação", date: "05/08/2026", excerpt: "As escolas do Campo Comprido receberam tablets, projetores e reforma das quadras esportivas com recursos do programa de infraestrutura educacional da Prefeitura de Curitiba." },
  { id: 6, title: "Parque Barigui ganha novo trecho de canaleta de ônibus e ciclovia integrada", category: "Obras", date: "01/08/2026", excerpt: "A obra de 2 km conecta o Campo Comprido ao resto do corredor de transporte, com faixas exclusivas para bicicletas e pedestres ao longo do parque." },
  { id: 7, title: "Teatro Positivo anuncia temporada gratuita para moradores de bairros vizinhos", category: "Eventos", date: "28/07/2026", excerpt: "Espetáculos de dança, música e teatro serão oferecidos com ingressos gratuitos para moradores da região do Campo Comprido, Orleans e Barigui, mediante cadastro no site." },
  { id: 8, title: "Feira de produtores locais estreia no Terminal Campo Comprido", category: "Prefeitura", date: "25/07/2026", excerpt: "A nova feira acontece aos sábados no entorno do terminal, com alimentos orgânicos, artesanato e produtos de agricultores da região metropolitana de Curitiba." },
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
      <section className="pt-28 lg:pt-36 pb-12 relative overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="/manus-storage/noticias-hero_20a2e9aa.png"
            alt="Notícias do Campo Comprido"
            className="w-full h-full object-cover"
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
                <ArrowRight className="w-4 h-4 ml-auto text-primary cursor-pointer" />
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
