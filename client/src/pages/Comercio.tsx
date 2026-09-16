/*
 * Design: Terra Viva — Comércio Local do Campo Comprido
 * Filtros agrupados em dropdown, terracota como cor de ação
 */
import { useState, useRef, useEffect, useMemo } from "react";
import { Star, MapPin, Phone, Clock, Instagram, Heart, Search, Globe, Filter, ChevronDown, ChevronRight, MessageSquare } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { trpc } from "@/lib/trpc";
import StarRating from "@/components/StarRating";
import { toast } from "sonner";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WaveDivider from "@/components/WaveDivider";
import { Link } from "wouter";
import { MapView } from "@/components/Map";

// Categorias agrupadas
const categoryGroups = [
  {
    title: "Alimentação",
    items: ["Alimentação"],
  },
  {
    title: "Beleza e Saúde",
    items: ["Beleza", "Saúde"],
  },
  {
    title: "Tecnologia e Escritório",
    items: ["Informática", "Papelaria"],
  },
  {
    title: "Moda",
    items: ["Vestuário"],
  },
  {
    title: "Serviços",
    items: ["Automotivo", "Construção", "Prestadores de serviço"],
  },
];

const allCategories = categoryGroups.flatMap((g) => g.items);

interface CommerceItem {
  id: number;
  name: string;
  category: string;
  address: string;
  phone: string;
  instagram: string;
  hours: string;
  description: string;
  lat?: string;
  lng?: string;
}

// Categorias com contagens dinâmicas são calculadas a partir dos dados do banco

export default function Comercio() {
  const [activeCategory, setActiveCategory] = useState("Todos");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterOpen, setFilterOpen] = useState(false);
  const filterRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<google.maps.Map | null>(null);

  // Real data from database
  const { data: dbCommerces, isLoading: dbLoading } = trpc.commerce.listApproved.useQuery();

  // Review state
  const [reviewTarget, setReviewTarget] = useState<{ type: "commerce"; id: number; name: string } | null>(null);
  const [reviewName, setReviewName] = useState("");
  const [reviewRating, setReviewRating] = useState(0);
  const [reviewComment, setReviewComment] = useState("");

  const { data: allReviews } = trpc.review.listAll.useQuery({ targetType: "commerce" });
  const { data: reviewsData, refetch: refetchReviews } = trpc.review.listByTarget.useQuery(
    { targetType: "commerce", targetId: reviewTarget?.id ?? 0 },
    { enabled: reviewTarget !== null }
  );

  // Average ratings per commerce
  const ratingMap = useMemo(() => {
    const map: Record<number, { avg: number; count: number }> = {};
    if (!allReviews) return map;
    allReviews.forEach((r) => {
      if (!map[r.targetId]) map[r.targetId] = { avg: 0, count: 0 };
      map[r.targetId].avg += r.rating;
      map[r.targetId].count += 1;
    });
    Object.keys(map).forEach((k) => {
      const key = Number(k);
      map[key].avg = Math.round((map[key].avg / map[key].count) * 10) / 10;
    });
    return map;
  }, [allReviews]);

  // Use real DB data, fallback to empty list while loading
  const commerceList: CommerceItem[] = (dbCommerces || []).map((c) => ({
    id: c.id,
    name: c.name,
    category: c.category,
    address: c.address,
    phone: c.phone,
    instagram: c.instagram || "",
    hours: c.hours || "",
    description: c.description || "",
    lat: c.lat || undefined,
    lng: c.lng || undefined,
  }));
  const addReviewMutation = trpc.review.add.useMutation({
    onSuccess: () => {
      toast.success("Avaliação enviada com sucesso!");
      setReviewTarget(null);
      setReviewName("");
      setReviewRating(0);
      setReviewComment("");
      refetchReviews();
    },
    onError: () => toast.error("Erro ao enviar avaliação"),
  });

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

  const filtered = commerceList.filter((c) => {
    const matchCategory = activeCategory === "Todos" || c.category === activeCategory;
    const matchSearch = !searchTerm || c.name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchCategory && matchSearch;
  });

  const handleCategoryClick = (cat: string) => {
    setActiveCategory(cat);
    setFilterOpen(false);
  };

  // Accordion: which category groups are expanded (all collapsed by default)
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>({});

  const toggleGroup = (title: string) => {
    setExpandedGroups((prev) => ({ ...prev, [title]: !prev[title] }));
  };

  // Group filtered items by category
  const groupedItems = useMemo(() => {
    const groups: Record<string, CommerceItem[]> = {};
    filtered.forEach((item) => {
      if (!groups[item.category]) groups[item.category] = [];
      groups[item.category].push(item);
    });
    return groups;
  }, [filtered]);

  // Order groups: predefined order, then alphabetically
  const orderedGroups = useMemo(() => {
    const order = ["Alimentação", "Beleza", "Saúde", "Informática", "Papelaria", "Vestuário", "Automotivo", "Construção", "Prestadores de serviço"];
    return Object.keys(groupedItems).sort((a, b) => {
      const ai = order.indexOf(a);
      const bi = order.indexOf(b);
      return ai === -1 && bi === -1 ? a.localeCompare(b) : ai === -1 ? 1 : bi === -1 ? -1 : ai - bi;
    });
  }, [groupedItems]);

  // Comerce commerce: map coordinates
  const commerceCoords = useMemo(() => {
    const coords: Record<string, { lat: number; lng: number }> = {};
    filtered.forEach((item) => {
      // Generate deterministic coordinates within Campo Comprido bounds
      const hash = item.name.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0);
      const lat = -25.4240 + (hash % 100) * 0.0001;
      const lng = -49.3200 + ((hash * 7) % 100) * 0.0001;
      coords[item.id.toString()] = { lat, lng };
    });
    return coords;
  }, [filtered]);

  // Show one marker per visible category group
  const mapMarkers = useMemo(() => {
    const markers: Array<{ lat: number; lng: number; title: string; category: string }> = [];
    orderedGroups.forEach((cat) => {
      const items = groupedItems[cat];
      if (items.length > 0) {
        // Place marker near center of group items
        const hash = items[0].name.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0);
        markers.push({
          lat: -25.4270 + (hash % 20) * 0.0005,
          lng: -49.3180 + ((hash * 3) % 20) * 0.0005,
          title: `${cat} (${items.length})`,
          category: cat,
        });
      }
    });
    return markers;
  }, [orderedGroups, groupedItems]);

  return (
    <div className="min-h-screen">
      <Header />

      {/* Hero */}
      <section className="pt-28 lg:pt-36 pb-12 relative overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="/manus-storage/comercio-novo_f65f371d.jpg"
            alt="Comércio do Campo Comprido"
            className="w-full h-full object-cover" loading="eager"
          />
          <div className="absolute inset-0 bg-black/50" />
        </div>
        <div className="container relative z-10">
          <p className="text-white/70 font-medium text-sm uppercase tracking-[0.2em] mb-2">
            Comércio Local
          </p>
          <h1 className="font-serif text-3xl lg:text-5xl font-bold text-white mb-4">
            Apoie os empreendedores do bairro
          </h1>
          <p className="text-white/80 text-lg max-w-2xl">
            Conheça e valorize os pequenos negócios que fazem o Campo Comprido um lugar especial.
          </p>
        </div>
      </section>

      <WaveDivider color="oklch(0.25 0.02 150)" />

      <section className="py-10 lg:py-14 bg-background">
        <div className="container">
          {/* Search + Filter row */}
          <div className="flex flex-col sm:flex-row gap-3 mb-6">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input
                type="text"
                placeholder="Buscar comércio..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-lg border border-border bg-card text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-[oklch(0.72_0.12_40)]/50"
              />
            </div>

            {/* Filter dropdown — grouped */}
            <div className="relative" ref={filterRef}>
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
                        <p className="px-4 py-2 text-xs font-semibold text-muted-foreground dark:text-[oklch(0.65_0.02_80)] uppercase tracking-wider">
                          {group.title}
                        </p>
                        {group.items.map((cat) => (
                          <button
                            key={cat}
                            onClick={() => handleCategoryClick(cat)}
                            className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-colors ${
                              activeCategory === cat
                                ? "bg-[oklch(0.72_0.12_40)]/10 text-[oklch(0.72_0.12_40)] font-medium"
                                : "text-foreground dark:text-[oklch(0.80_0.01_80)] hover:bg-muted"
                            }`}
                          >
                            {cat}
                            <span className="ml-auto text-xs text-muted-foreground dark:text-[oklch(0.65_0.02_80)]">
                              {commerceList.filter((c) => c.category === cat).length}
                            </span>
                          </button>
                        ))}
                      </div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Results count */}
          <p className="text-sm text-muted-foreground mb-4">
            {filtered.length} {filtered.length === 1 ? "estabelecimento" : "estabelecimentos"} encontrado{filtered.length !== 1 ? "s" : ""}
          </p>

          {/* Accordion: category groups (collapsed by default) */}
          <div className="space-y-4">
            {orderedGroups.map((cat) => (
              <div key={cat} className="rounded-xl border border-border bg-card overflow-hidden">
                {/* Group header */}
                <button
                  onClick={() => toggleGroup(cat)}
                  className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <span className="inline-block px-3 py-1 rounded-lg text-xs font-semibold bg-[oklch(0.72_0.12_40)]/10 text-[oklch(0.72_0.12_40)] dark:text-[oklch(0.78_0.10_40)]">
                      {cat}
                    </span>
                    <span className="text-sm text-muted-foreground">
                      {groupedItems[cat].length} {groupedItems[cat].length === 1 ? "estabelecimento" : "estabelecimentos"}
                    </span>
                  </div>
                  <ChevronRight
                    className={`w-5 h-5 text-muted-foreground transition-transform duration-200 ${
                      expandedGroups[cat] ? "rotate-90" : ""
                    }`}
                  />
                </button>

                {/* Expandable content */}
                <AnimatePresence>
                  {expandedGroups[cat] && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2, ease: [0.23, 1, 0.32, 1] }}
                      className="overflow-hidden"
                    >
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-5 pt-2">
                        {groupedItems[cat].map((item) => (
                          <div
                            key={item.id}
                            className="group p-5 rounded-xl hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5 bg-card border border-border"
                          >
                {/* Header */}
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <span className="inline-block px-2 py-0.5 rounded text-xs font-medium bg-[oklch(0.72_0.12_40)]/10 text-[oklch(0.72_0.12_40)] dark:text-[oklch(0.78_0.10_40)] mb-2">
                      {item.category}
                    </span>
                    <h3 className="font-serif text-lg font-semibold text-foreground group-hover:text-[oklch(0.72_0.12_40)] transition-colors">
                      {item.name}
                    </h3>
                  </div>
                  {ratingMap[item.id] && ratingMap[item.id].count > 0 && (
                    <button
                      onClick={() => setReviewTarget({ type: "commerce", id: item.id, name: item.name })}
                      className="flex items-center gap-1 text-yellow-500 hover:underline transition-colors"
                      title="Ver avaliações"
                    >
                      <Star className="w-4 h-4 fill-current" />
                      <span className="text-sm font-medium">{ratingMap[item.id].avg}</span>
                      <span className="text-xs text-muted-foreground">({ratingMap[item.id].count})</span>
                    </button>
                  )}
                </div>

                {/* Description */}
                <p className="text-sm text-muted-foreground dark:text-[oklch(0.70_0.02_80)] mb-3">{item.description}</p>

                {/* Info */}
                <div className="space-y-1.5 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 shrink-0 text-primary" />
                    <span className="text-muted-foreground dark:text-[oklch(0.70_0.02_80)]">{item.address}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 shrink-0 text-primary" />
                    <span className="text-muted-foreground dark:text-[oklch(0.70_0.02_80)]">{item.phone}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 shrink-0 text-primary" />
                    <span className="text-muted-foreground dark:text-[oklch(0.70_0.02_80)]">{item.hours}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Instagram className="w-4 h-4 shrink-0 text-primary" />
                    <span className="text-[oklch(0.72_0.12_40)] dark:text-[oklch(0.78_0.10_40)]">{item.instagram}</span>
                  </div>
                </div>

                {/* Average rating display — clickable */}
                {!ratingMap[item.id] || ratingMap[item.id].count === 0 ? (
                  <button
                    onClick={() => setReviewTarget({ type: "commerce", id: item.id, name: item.name })}
                    className="w-full mt-3 p-2 rounded-lg bg-muted/50 text-muted-foreground text-xs font-medium hover:bg-muted transition-colors"
                  >
                    Ainda sem avaliações. Seja o primeiro a avaliar!
                  </button>
                ) : (
                  <button
                    onClick={() => setReviewTarget({ type: "commerce", id: item.id, name: item.name })}
                    className="w-full mt-3 p-2 rounded-lg bg-[oklch(0.72_0.12_40)]/10 text-[oklch(0.72_0.12_40)] text-xs font-medium hover:bg-[oklch(0.72_0.12_40)] hover:text-white transition-colors"
                  >
                    Média de {ratingMap[item.id].avg} estrelas com {ratingMap[item.id].count} {ratingMap[item.id].count === 1 ? "avaliação" : "avaliações"} — clique para ver
                  </button>
                )}

                  {/* Actions */}
                <div className="mt-4 flex gap-2">
                  <button
                    onClick={() => setReviewTarget({ type: "commerce", id: item.id, name: item.name })}
                    className="text-xs px-3 py-1.5 rounded-lg bg-[oklch(0.72_0.12_40)]/10 text-[oklch(0.72_0.12_40)] hover:bg-[oklch(0.72_0.12_40)] hover:text-white transition-colors flex items-center gap-1"
                  >
                    <MessageSquare className="w-3 h-3" /> Avaliar
                  </button>
                  <button className="text-xs px-3 py-1.5 rounded-lg border border-border text-foreground hover:bg-muted transition-colors flex items-center gap-1">
                    <Heart className="w-3 h-3" /> Salvar
                  </button>
                </div>
              </div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mapa Interativo */}
      <section className="py-10 lg:py-14 bg-card border-t border-border">
        <div className="container">
          <div className="flex items-center gap-3 mb-6">
            <MapPin className="text-[oklch(0.72_0.12_40)]" size={24} />
            <h2 className="font-serif text-2xl lg:text-3xl font-bold text-foreground">Mapa de Comércios</h2>
          </div>
          <div className="rounded-2xl overflow-hidden border border-border shadow-lg">
            <MapView
              className="h-[450px]"
              initialCenter={{ lat: -25.4270, lng: -49.3180 }}
              initialZoom={15}
              onMapReady={(map) => {
                mapRef.current = map;
                // Add one pin per commerce (filtered)
                filtered.forEach((item) => {
                  const lat = parseFloat(item.lat || "0");
                  const lng = parseFloat(item.lng || "0");
                  if (!lat || !lng) return;
                  const marker = new google.maps.marker.AdvancedMarkerElement({
                    map,
                    position: { lat, lng },
                    title: item.name,
                  });
                  marker.addListener("click", () => {
                    const infoWindow = new google.maps.InfoWindow({
                      content: `
                        <div style="max-width:260px;padding:8px;">
                          <p style="font-weight:bold;margin:0;font-size:14px;">${item.name}</p>
                          <p style="margin:2px 0 0;font-size:12px;color:#666;">${item.category}</p>
                          <p style="margin:2px 0;font-size:12px;">${item.address}</p>
                          <p style="margin:0;font-size:12px;">📞 ${item.phone}</p>
                        </div>
                      `,
                    });
                    infoWindow.open({ anchor: marker, map });
                  });
                });
                // Fit bounds
                const bounds = new google.maps.LatLngBounds();
                filtered.forEach((item) => {
                  const lat = parseFloat(item.lat || "0");
                  const lng = parseFloat(item.lng || "0");
                  if (lat && lng) bounds.extend({ lat, lng });
                });
                if (!bounds.isEmpty()) {
                  map.fitBounds(bounds);
                  if (map.getZoom()! > 16) map.setZoom(16);
                }
              }}
            />
          </div>
        </div>
      </section>

      {/* Review Modal */}
      <AnimatePresence>
        {reviewTarget && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setReviewTarget(null)} />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ duration: 0.2 }}
              className="relative bg-card border border-border rounded-2xl p-6 w-full max-w-md shadow-2xl"
            >
              <h3 className="font-serif text-xl font-bold text-foreground mb-1">Avaliar {reviewTarget.name}</h3>
              <p className="text-sm text-muted-foreground mb-4">Compartilhe sua experiência com a comunidade</p>

              {/* Star rating selector */}
              <div className="flex flex-col items-center mb-4">
                <StarRating rating={reviewRating} size={32} interactive onRate={setReviewRating} />
                {reviewRating > 0 && (
                  <p className="text-sm text-muted-foreground mt-1">{reviewRating} estrela{reviewRating > 1 ? "s" : ""}</p>
                )}
              </div>

              {/* Name */}
              <input
                type="text"
                placeholder="Seu nome"
                value={reviewName}
                onChange={(e) => setReviewName(e.target.value)}
                className="w-full px-4 py-2.5 rounded-lg border border-border bg-card text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-[oklch(0.72_0.12_40)]/50 mb-3"
              />

              {/* Comment */}
              <textarea
                placeholder="Deixe seu comentário (opcional)"
                value={reviewComment}
                onChange={(e) => setReviewComment(e.target.value)}
                rows={3}
                className="w-full px-4 py-2.5 rounded-lg border border-border bg-card text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-[oklch(0.72_0.12_40)]/50 mb-4 resize-none"
              />

              {/* Buttons */}
              <div className="flex gap-3">
                <button
                  onClick={() => setReviewTarget(null)}
                  className="flex-1 px-4 py-2.5 rounded-lg border border-border text-foreground hover:bg-muted transition-colors text-sm font-medium"
                >
                  Cancelar
                </button>
                <button
                  onClick={() => {
                    if (!reviewName.trim()) {
                      toast.error("Digite seu nome");
                      return;
                    }
                    if (reviewRating === 0) {
                      toast.error("Selecione as estrelas");
                      return;
                    }
                    addReviewMutation.mutate({
                      authorName: reviewName.trim(),
                      targetType: "commerce",
                      targetId: reviewTarget.id,
                      targetName: reviewTarget.name,
                      rating: reviewRating,
                      comment: reviewComment.trim() || undefined,
                    });
                  }}
                  disabled={addReviewMutation.isPending}
                  className="flex-1 px-4 py-2.5 rounded-lg bg-[oklch(0.72_0.12_40)] text-white hover:bg-[oklch(0.65_0.12_40)] transition-colors text-sm font-medium disabled:opacity-50"
                >
                  {addReviewMutation.isPending ? "Enviando..." : "Enviar avaliação"}
                </button>
              </div>

              {/* Recent reviews for this target */}
              {reviewsData && reviewsData.length > 0 && (
                <div className="mt-4 pt-4 border-t border-border">
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Avaliações recentes</p>
                  <div className="space-y-2 max-h-32 overflow-y-auto">
                    {reviewsData.slice(0, 5).map((r) => (
                      <div key={r.id} className="flex items-start gap-2 text-sm">
                        <StarRating rating={r.rating} size={12} />
                        <div>
                          <span className="font-medium text-foreground">{r.authorName}</span>
                          {r.comment && <p className="text-muted-foreground text-xs">{r.comment}</p>}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <Footer />
    </div>
  );
}
