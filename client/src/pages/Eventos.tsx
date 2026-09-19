import { photoUrl } from "@/data/photos";
/*
 * Design: Terra Viva — Eventos da Comunidade
 * Filtros agrupados em dropdown, terracota como cor de ação
 */
import { useState, useRef, useEffect } from "react";
import { Calendar, MapPin, Clock, Users, ExternalLink, Tag, Filter, ChevronDown, Plus, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WaveDivider from "@/components/WaveDivider";
import { trpc } from "@/lib/trpc";

// Categorias agrupadas
const categoryGroups = [
  {
    title: "Saúde e Bem-estar",
    items: ["Saúde"],
  },
  {
    title: "Cultura e Lazer",
    items: ["Feiras", "Festas", "Culturais", "Esportivos"],
  },
  {
    title: "Educação",
    items: ["Cursos"],
  },
  {
    title: "Social",
    items: ["Ações Sociais"],
  },
];

const allCategories = categoryGroups.flatMap((g) => g.items);

interface Event {
  id: number;
  title: string;
  category: string;
  date: string;
  time: string;
  location: string;
  organizer: string;
  description: string;
  attendees?: string;
  source?: string;
  sourceUrl?: string;
}

const categoryOptions = ["Feiras", "Festas", "Culturais", "Esportivos", "Cursos", "Saúde", "Ações Sociais"];

export default function Eventos() {
  const { data: dbEvents, refetch } = trpc.event.list.useQuery(undefined, { refetchInterval: 60 * 60 * 1000 });
  const events: Event[] = (dbEvents ?? []).map((event) => ({ ...event, date: event.date ?? "", time: event.time ?? "", location: event.location ?? "", organizer: event.organizer ?? "", description: event.description ?? "", attendees: event.attendees ?? undefined, sourceUrl: event.sourceUrl ?? undefined }));
  const addEvent = trpc.event.add.useMutation({
    onSuccess: () => {
      toast.success("Evento publicado e salvo para toda a comunidade.");
      setNewEvent({ title: "", category: "", date: "", time: "", location: "", organizer: "", description: "" });
      setShowForm(false);
      refetch();
    },
    onError: () => toast.error("Não foi possível salvar o evento."),
  });
  const [activeCategory, setActiveCategory] = useState("Todos");
  const [filterOpen, setFilterOpen] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const filterRef = useRef<HTMLDivElement>(null);

  // Form state
  const [newEvent, setNewEvent] = useState({ title: "", category: "", date: "", time: "", location: "", organizer: "", description: "" });

  const handleAddEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEvent.title || !newEvent.date || !newEvent.location) {
      toast.error("Preencha pelo menos título, data e local.");
      return;
    }
    addEvent.mutate({ ...newEvent, category: newEvent.category || "Outros" });
  };

  // Fechar dropdown ao clicar fora
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (filterRef.current && !filterRef.current.contains(e.target as Node)) {
        setFilterOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filtered = events.filter(
    (e) => activeCategory === "Todos" || e.category === activeCategory
  );

  const handleCategoryClick = (cat: string) => {
    setActiveCategory(cat);
    setFilterOpen(false);
  };

  const eventDate = (value: string) => {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return { weekday: "DATA", date: value };
    const parsed = new Date(`${value}T12:00:00-03:00`);
    return {
      weekday: new Intl.DateTimeFormat("pt-BR", { weekday: "short", timeZone: "America/Sao_Paulo" }).format(parsed).replace(".", "").toUpperCase(),
      date: new Intl.DateTimeFormat("pt-BR", { day: "2-digit", month: "2-digit", timeZone: "America/Sao_Paulo" }).format(parsed),
    };
  };

  return (
    <div className="min-h-screen">
      <Header />

      {/* Hero */}
      <section className="pt-28 lg:pt-36 pb-12 min-h-[320px] lg:min-h-[360px] relative overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={photoUrl("event-novo.png")}
            alt="Árvores coloridas na canaleta da Rua Deputado Heitor Alencar Furtado"
            className="page-hero-image"
            loading="eager"
            decoding="async"
            fetchPriority="high"
          />
          <div className="absolute inset-0 bg-black/50" />
        </div>
        <div className="container relative z-10">
          <p className="text-white/70 font-medium text-sm uppercase tracking-[0.2em] mb-2">
            Eventos da Comunidade
          </p>
          <h1 className="font-serif text-3xl lg:text-5xl font-bold text-white mb-4">
            O que acontece no bairro
          </h1>
          <p className="text-white/80 text-lg max-w-2xl">
            Acompanhe o calendário completo de eventos, feiras, festas, cursos e ações sociais do Campo Comprido.
          </p>
        </div>
      </section>

      <WaveDivider color="oklch(0.25 0.02 150)" />

      <section className="py-10 lg:py-14 bg-background">
        <div className="container">
          {/* Add event button */}
          <div className="mb-6">
            <button
              onClick={() => setShowForm(!showForm)}
              className="inline-flex items-center gap-2 px-5 py-3 rounded-lg text-sm font-medium transition-all shadow-md bg-[oklch(0.72_0.12_40)] text-white hover:bg-[oklch(0.65_0.12_40)] hover:scale-[1.02] active:scale-[0.97]"
            >
              {showForm ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
              {showForm ? "Cancelar" : "Adicionar Evento"}
            </button>
          </div>

          {/* Add event form */}
          {showForm && (
            <form onSubmit={handleAddEvent} className="mb-8 p-6 rounded-xl bg-card border border-border dark:bg-[oklch(0.22_0.02_160)] dark:border-[oklch(0.30_0.02_160)]">
              <h3 className="font-serif text-lg font-semibold text-foreground mb-4">Novo Evento</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">Título *</label>
                  <input
                    type="text"
                    value={newEvent.title}
                    onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                    placeholder="Ex: Feira de Orgânicos"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">Categoria</label>
                  <select
                    value={newEvent.category}
                    onChange={(e) => setNewEvent({ ...newEvent, category: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                  >
                    <option value="">Selecione</option>
                    {categoryOptions.map((cat) => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">Data *</label>
                  <input
                    type="date"
                    value={newEvent.date}
                    onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">Horário</label>
                  <input
                    type="text"
                    value={newEvent.time}
                    onChange={(e) => setNewEvent({ ...newEvent, time: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                    placeholder="Ex: 09h-17h"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-foreground mb-1">Local *</label>
                  <input
                    type="text"
                    value={newEvent.location}
                    onChange={(e) => setNewEvent({ ...newEvent, location: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                    placeholder="Ex: Praça Getúlio Vargas - Campo Comprido"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">Organizador</label>
                  <input
                    type="text"
                    value={newEvent.organizer}
                    onChange={(e) => setNewEvent({ ...newEvent, organizer: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                    placeholder="Ex: Associação de Moradores"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">Descrição</label>
                  <input
                    type="text"
                    value={newEvent.description}
                    onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                    placeholder="Breve descrição do evento"
                  />
                </div>
              </div>
              <button
                type="submit"
                className="mt-4 inline-flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-medium bg-[oklch(0.72_0.12_40)] text-white hover:bg-[oklch(0.65_0.12_40)] transition-all hover:scale-[1.02] active:scale-[0.97]"
              >
                <Plus className="w-4 h-4" /> Cadastrar Evento
              </button>
            </form>
          )}

          {/* Filter dropdown — grouped */}
          <div className="relative mb-8 w-fit" ref={filterRef}>
            <button
              onClick={() => setFilterOpen(!filterOpen)}
              className={`inline-flex items-center gap-2 px-4 py-3 rounded-lg text-sm font-medium transition-all shadow-md min-w-[200px] ${
                activeCategory !== "Todos"
                  ? "bg-[oklch(0.72_0.12_40)] text-white hover:bg-[oklch(0.65_0.12_40)]"
                  : "bg-card border border-border text-foreground hover:border-[oklch(0.72_0.12_40)]/50"
              }`}
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
                    className="absolute top-full left-0 mt-2 w-72 max-w-[calc(100vw-2rem)] bg-card dark:bg-[oklch(0.22_0.02_160)] rounded-xl shadow-2xl border border-border z-50 overflow-hidden"
                >
                  {/* All */}
                  <button
                    onClick={() => handleCategoryClick("Todos")}
                    className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium transition-colors border-b border-border ${
                      activeCategory === "Todos"
                        ? "bg-[oklch(0.72_0.12_40)]/10 text-[oklch(0.72_0.12_40)]"
                        : "text-foreground hover:bg-muted"
                    }`}
                  >
                    <Filter className="w-4 h-4" />
                    Mostrar todos
                  </button>

                  {/* Grouped categories */}
                  {categoryGroups.map((group) => (
                    <div key={group.title} className="border-b border-border last:border-0">
                      <p className="px-4 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                        {group.title}
                      </p>
                      {group.items.map((cat) => (
                        <button
                          key={cat}
                          onClick={() => handleCategoryClick(cat)}
                          className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-colors ${
                            activeCategory === cat
                              ? "bg-[oklch(0.72_0.12_40)]/10 text-[oklch(0.72_0.12_40)] font-medium"
                              : "text-foreground hover:bg-muted"
                          }`}
                        >
                          {cat}
                          <span className="ml-auto text-xs text-muted-foreground">
                            {events.filter((e) => e.category === cat).length}
                          </span>
                        </button>
                      ))}
                    </div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Events list */}
          <div className="space-y-4">
            {filtered.length === 0 && <p className="rounded-xl border border-border bg-card p-6 text-muted-foreground">Nenhum evento cadastrado nesta categoria.</p>}
            {filtered.map((event) => (
              <div
                key={event.id}
                className="flex flex-col md:flex-row md:items-center gap-4 md:gap-6 p-5 rounded-xl bg-card border border-border hover:shadow-md transition-shadow dark:bg-[oklch(0.22_0.02_160)] dark:border-[oklch(0.30_0.02_160)] dark:text-foreground"
              >
                {/* Date badge */}
                <div className="shrink-0 w-18 text-center p-2 rounded-lg bg-[oklch(0.72_0.12_40)]/10">
                  <span className="block text-xs text-muted-foreground font-medium uppercase">
                    {eventDate(event.date).weekday}
                  </span>
                  <span className="block text-xs font-semibold text-[oklch(0.72_0.12_40)]">{eventDate(event.date).date}</span>
                  <Calendar className="w-5 h-5 text-[oklch(0.72_0.12_40)] mx-auto" />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <Tag className="w-3.5 h-3.5 text-[oklch(0.72_0.12_40)]" />
                    <span className="text-xs font-medium text-[oklch(0.72_0.12_40)]">{event.category}</span>
                  </div>
                  <h3 className="font-serif text-lg font-semibold text-foreground dark:text-[oklch(0.95_0.01_80)]">{event.title}</h3>
                  <p className="text-sm text-muted-foreground dark:text-[oklch(0.75_0.02_80)] mt-1">{event.description}</p>
                  <div className="flex flex-wrap gap-4 mt-3 text-sm text-muted-foreground dark:text-[oklch(0.75_0.02_80)]">
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-4 h-4 text-primary" />
                      <span>{event.time}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <MapPin className="w-4 h-4 text-primary" />
                      <span>{event.location}</span>
                    </div>
                    {event.attendees && (
                      <div className="flex items-center gap-1.5">
                        <Users className="w-4 h-4 text-primary" />
                        <span>{event.attendees}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Actions */}
                {event.sourceUrl && (
                  <a href={event.sourceUrl} target="_blank" rel="noopener noreferrer" className="shrink-0 text-xs px-3 py-1.5 rounded-lg bg-[oklch(0.72_0.12_40)]/10 text-[oklch(0.72_0.12_40)] hover:bg-[oklch(0.72_0.12_40)] hover:text-white transition-colors flex items-center gap-1">
                    Fonte oficial <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
