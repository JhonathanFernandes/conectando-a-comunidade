/*
 * Design: Terra Viva — Mapa Interativo do Campo Comprido
 * Google Maps focado na região do Campo Comprido, filtros agrupados em dropdown,
 * geolocalização em tempo real, sistema de favoritos, adicionar comércio
 */
import { useState, useRef, useEffect, useCallback, useMemo } from "react";
import { MapView } from "@/components/Map";
import { Search, Navigation, MapPin, X, Phone, Star, Plus, ChevronDown, Heart, Filter, Loader2, MapPinned, Upload, Image as ImageIcon } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { toast } from "sonner";
import { trpc } from "@/lib/trpc";
import { photoUrl as localPhotoUrl } from "@/data/photos";

// Campo Comprido center coordinates (Terminal Campo Comprido area)
const CAMPO_COMPRIDO_CENTER = { lat: -25.44, lng: -49.34 };

// Business segments grouped by category
const segmentGroups = [
  {
    title: "Alimentação",
    items: [
      { id: "restaurant", label: "Restaurantes", icon: "🍽️" },
      { id: "cafe", label: "Cafés e Padarias", icon: "☕" },
      { id: "supermarket", label: "Supermercados", icon: "🛒" },
    ],
  },
  {
    title: "Saúde",
    items: [
      { id: "pharmacy", label: "Farmácias", icon: "💊" },
      { id: "health", label: "Clínicas e Hospitais", icon: "🏥" },
      { id: "ubs", label: "UBS / Postos de Saúde", icon: "⚕️" },
    ],
  },
  {
    title: "Serviços",
    items: [
      { id: "bank", label: "Bancos", icon: "🏦" },
      { id: "beauty", label: "Beleza", icon: "💇" },
      { id: "automotive", label: "Automotivo", icon: "🔧" },
      { id: "gas_station", label: "Postos de Combustível", icon: "⛽" },
      { id: "store", label: "Lojas e Comércio", icon: "🛍️" },
      { id: "pet", label: "Pet Shop", icon: "🐾" },
    ],
  },
  {
    title: "Comunidade",
    items: [
      { id: "education", label: "Escolas e Educação", icon: "🎓" },
      { id: "gym", label: "Academias", icon: "💪" },
      { id: "park", label: "Parques e Lazer", icon: "🌳" },
      { id: "church", label: "Igrejas", icon: "⛪" },
    ],
  },
];

// Flatten all segments
const allSegments = segmentGroups.flatMap((g) => g.items);

interface SelectedBusiness {
  name: string;
  category: string;
  address: string;
  phone: string;
  rating: number;
  lat: number;
  lng: number;
}

export default function Mapa() {
  const { data: approvedCommerces } = trpc.commerce.listApproved.useQuery();
  const mapBusinesses = useMemo(() => (approvedCommerces ?? []).flatMap((item) => {
    const lat = Number(item.lat);
    const lng = Number(item.lng);
    if (!Number.isFinite(lat) || !Number.isFinite(lng) || lat === 0 || lng === 0) return [];
    return [{
      id: item.id,
      name: item.name,
      category: allSegments.some((segment) => segment.id === item.category) ? item.category : "store",
      lat,
      lng,
      address: item.address,
      phone: item.phone,
      rating: 0,
    }];
  }), [approvedCommerces]);
  const [selectedSegment, setSelectedSegment] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedBusiness, setSelectedBusiness] = useState<SelectedBusiness | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [filterOpen, setFilterOpen] = useState(false);
  const [mapReady, setMapReady] = useState(false);
  const [favorites, setFavorites] = useState<string[]>(() => {
    try {
      return JSON.parse(localStorage.getItem("map_favorites") || "[]");
    } catch {
      return [];
    }
  });
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);

  const mapRef = useRef<google.maps.Map | null>(null);
  const markersRef = useRef<google.maps.marker.AdvancedMarkerElement[]>([]);
  const userMarkerRef = useRef<google.maps.marker.AdvancedMarkerElement | null>(null);

  // Add commerce form state
  const [formData, setFormData] = useState({
    nome: "",
    segmento: "",
    rua: "",
    telefone: "",
    lat: 0,
    lng: 0,
  });
  const [addressSuggestion, setAddressSuggestion] = useState<string | null>(null);
  const [geocoding, setGeocoding] = useState(false);
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);
  const addressInputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Photo upload state
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  // tRPC upload photo mutation
  const uploadPhotoMutation = trpc.commerce.uploadPhoto.useMutation({
    onSuccess: (data) => {
      setPhotoUrl(data.url);
      setUploading(false);
      toast.success("Foto enviada com sucesso!");
    },
    onError: () => {
      setUploading(false);
      toast.error("Erro ao enviar foto. O cadastro continua sem imagem.");
    },
  });

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast.error("Por favor, selecione apenas arquivos de imagem.");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error("A imagem deve ter no máximo 5MB.");
      return;
    }
    setPhotoFile(file);
    const reader = new FileReader();
    reader.onload = () => {
      setPhotoPreview(reader.result as string);
      setPhotoUrl(null);
    };
    reader.readAsDataURL(file);
  };

  const uploadPhotoFile = async () => {
    if (!photoFile || photoUrl) return; // already uploaded
    setUploading(true);
    const reader = new FileReader();
    reader.onload = () => {
      const base64 = (reader.result as string).split(",")[1];
      uploadPhotoMutation.mutate({
        fileName: photoFile.name,
        base64Data: base64,
        mimeType: photoFile.type || "image/jpeg",
      });
    };
    reader.readAsDataURL(photoFile);
  };

  // Initialize Google Places Autocomplete when form opens
  useEffect(() => {
    if (showAddForm && addressInputRef.current && window.google?.maps?.places) {
      if (!autocompleteRef.current) {
        const autocomplete = new google.maps.places.Autocomplete(addressInputRef.current, {
          componentRestrictions: { country: "br" },
          fields: ["formatted_address", "geometry", "name"],
        });
        autocomplete.addListener("place_changed", () => {
          const place = autocomplete.getPlace();
          const loc = place.geometry?.location;
          if (loc) {
            setFormData((prev) => ({
              ...prev,
              rua: place.formatted_address || prev.rua,
              lat: loc.lat(),
              lng: loc.lng(),
            }));
            setAddressSuggestion(place.formatted_address || null);
            toast.success("Endereço localizado no mapa!");
          }
        });
        autocompleteRef.current = autocomplete;
      }
    }
  }, [showAddForm]);

  // Toggle favorite
  const toggleFavorite = useCallback((businessId: string) => {
    setFavorites((prev) => {
      const next = prev.includes(businessId)
        ? prev.filter((id) => id !== businessId)
        : [...prev, businessId];
      localStorage.setItem("map_favorites", JSON.stringify(next));
      return next;
    });
  }, []);

  const filteredBusinesses = useMemo(() => mapBusinesses.filter((b) => {
    const matchSegment = selectedSegment === "all" || b.category === selectedSegment;
    const matchSearch = !searchTerm || b.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchFavorite = !showFavoritesOnly || favorites.includes(String(b.id));
    return matchSegment && matchSearch && matchFavorite;
  }), [mapBusinesses, selectedSegment, searchTerm, showFavoritesOnly, favorites]);

  // Initialize markers on map
  const updateMarkers = useCallback(() => {
    if (!mapRef.current) return;

    markersRef.current.forEach((marker) => {
      marker.map = null;
    });
    markersRef.current = [];

    filteredBusinesses.forEach((biz) => {
      const isFav = favorites.includes(String(biz.id));
      const marker = new google.maps.marker.AdvancedMarkerElement({
        map: mapRef.current,
        position: { lat: biz.lat, lng: biz.lng },
        title: biz.name,
      });

      marker.addListener("click", () => {
        setSelectedBusiness({
          name: biz.name,
          category: biz.category,
          address: biz.address,
          phone: biz.phone,
          rating: biz.rating,
          lat: biz.lat,
          lng: biz.lng,
        });
        mapRef.current?.panTo({ lat: biz.lat, lng: biz.lng });
      });

      markersRef.current.push(marker);
    });
  }, [filteredBusinesses, favorites]);

  const handleMapReady = (map: google.maps.Map) => {
    mapRef.current = map;
    setMapReady(true);
    updateMarkers();
  };

  useEffect(() => {
    if (mapReady) {
      updateMarkers();
    }
  }, [selectedSegment, searchTerm, mapReady, updateMarkers, showFavoritesOnly]);

  // Get user geolocation
  const getUserLocation = () => {
    if (!navigator.geolocation) {
      toast.error("Geolocalização não suportada pelo seu navegador");
      return;
    }

    toast("Localizando sua posição...");

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const location = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };

        if (userMarkerRef.current) {
          userMarkerRef.current.position = location;
        } else if (mapRef.current) {
          userMarkerRef.current = new google.maps.marker.AdvancedMarkerElement({
            map: mapRef.current,
            position: location,
            title: "Você está aqui",
          });
        }

        mapRef.current?.panTo(location);
        mapRef.current?.setZoom(14);
        toast.success("Localização encontrada!");
      },
      () => {
        toast.error("Não foi possível obter sua localização. Verifique as permissões.");
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  const handleSegmentClick = (segmentId: string) => {
    setSelectedSegment(segmentId);
    setShowFavoritesOnly(false);
    setFilterOpen(false);
    if (mapRef.current) {
      mapRef.current.panTo(CAMPO_COMPRIDO_CENTER);
      mapRef.current.setZoom(14);
    }
  };

  const handleFavoritesClick = () => {
    setShowFavoritesOnly(!showFavoritesOnly);
    setSelectedSegment("all");
    setFilterOpen(false);
  };

  // tRPC mutations
  const addCommerceMutation = trpc.commerce.add.useMutation({
    onSuccess: () => {
      toast.success("Comércio cadastrado com sucesso! Aguardando aprovação do administrador.");
      setFormData({ nome: "", segmento: "", rua: "", telefone: "", lat: 0, lng: 0 });
      setAddressSuggestion(null);
      setShowAddForm(false);
      setPhotoPreview(null);
      setPhotoFile(null);
      setPhotoUrl(null);
    },
    onError: () => {
      toast.error("Erro ao cadastrar comércio. Tente novamente.");
    },
  });

  // Handle add commerce submission
  const handleAddCommerce = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.nome || !formData.segmento || !formData.rua || !formData.telefone) {
      toast.error("Preencha todos os campos obrigatórios");
      return;
    }

    // Upload photo if available
    if (photoFile && !photoUrl) {
      await uploadPhotoFile();
    }

    // Small delay to let upload mutation complete
    setTimeout(() => {
      addCommerceMutation.mutate({
        name: formData.nome,
        category: formData.segmento,
        address: formData.rua,
        phone: formData.telefone,
        lat: formData.lat ? String(formData.lat) : undefined,
        lng: formData.lng ? String(formData.lng) : undefined,
        coordsJson: formData.lat && formData.lng ? JSON.stringify({ lat: formData.lat, lng: formData.lng }) : undefined,
        photoUrl: photoUrl || undefined,
        photoKey: photoUrl || undefined,
      });
    }, 500);
  };

  const currentSegmentLabel = selectedSegment === "all"
    ? "Todos os segmentos"
    : allSegments.find((s) => s.id === selectedSegment)?.label || "Todos";

  const favoriteCount = favorites.length;

  return (
    <div className="min-h-screen">
      <Header />

      {/* Hero */}
      <section className="pt-20 lg:pt-24 pb-4 bg-primary relative overflow-hidden">
        <img src={localPhotoUrl("rua-pedro-zanlorenzi.jpg")} alt="Rua Pedro Artur Zanlorenzi no Campo Comprido" className="absolute inset-0 h-full w-full object-cover opacity-25" />
        <div className="container relative z-10">
          <p className="text-primary-foreground/70 font-medium text-sm uppercase tracking-[0.2em] mb-2">
            Mapa Interativo
          </p>
          <h1 className="font-serif text-2xl lg:text-4xl font-bold text-primary-foreground mb-2">
            Explore o Campo Comprido
          </h1>
          <p className="text-primary-foreground/80 text-sm lg:text-base max-w-2xl">
            Filtre por segmento e encontre comércios, serviços e pontos de interesse da região do Campo Comprido.
          </p>
        </div>
      </section>

      {/* Map Section */}
      <section className="bg-background">
        <div className="container py-4">
          {/* Controls bar */}
          <div className="flex flex-col lg:flex-row gap-3 mb-4">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Buscar comércio..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-border bg-card text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-[oklch(0.72_0.12_40)]/50"
              />
            </div>

            {/* Filter dropdown — grouped segments */}
            <div className="relative">
              <button
                onClick={() => setFilterOpen(!filterOpen)}
                className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all shadow-md ${
                  selectedSegment !== "all" || showFavoritesOnly
                    ? "bg-[oklch(0.72_0.12_40)] text-white hover:bg-[oklch(0.65_0.12_40)]"
                    : "bg-card border border-border text-foreground hover:border-[oklch(0.72_0.12_40)]/50"
                }`}
              >
                <Filter className="w-4 h-4" />
                {showFavoritesOnly ? "Favoritos" : currentSegmentLabel}
                <ChevronDown className={`w-4 h-4 transition-transform ${filterOpen ? "rotate-180" : ""}`} />
              </button>

              <AnimatePresence>
                {filterOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -8, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -8, scale: 0.96 }}
                    transition={{ duration: 0.2, ease: [0.23, 1, 0.32, 1] }}
                    className="absolute top-full left-0 mt-2 w-80 max-w-[calc(100vw-2rem)] bg-white rounded-xl shadow-2xl border border-border z-50 overflow-hidden"
                  >
                    {/* Favorites toggle */}
                    <button
                      onClick={handleFavoritesClick}
                      className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium transition-colors border-b border-border ${
                        showFavoritesOnly
                          ? "bg-[oklch(0.72_0.12_40)]/10 text-[oklch(0.72_0.12_40)]"
                          : "text-foreground hover:bg-muted"
                      }`}
                    >
                      <Heart className={`w-4 h-4 ${showFavoritesOnly ? "fill-current" : ""}`} />
                      Meus Favoritos
                      {favoriteCount > 0 && (
                        <span className="ml-auto bg-[oklch(0.72_0.12_40)] text-white text-xs px-2 py-0.5 rounded-full">
                          {favoriteCount}
                        </span>
                      )}
                    </button>

                    {/* All */}
                    <button
                      onClick={() => handleSegmentClick("all")}
                      className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium transition-colors ${
                        selectedSegment === "all" && !showFavoritesOnly
                          ? "bg-[oklch(0.72_0.12_40)]/10 text-[oklch(0.72_0.12_40)]"
                          : "text-foreground hover:bg-muted"
                      }`}
                    >
                      <MapPin className="w-4 h-4" />
                      Mostrar todos
                    </button>

                    {/* Grouped segments */}
                    {segmentGroups.map((group) => (
                      <div key={group.title} className="border-t border-border">
                        <p className="px-4 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                          {group.title}
                        </p>
                        {group.items.map((seg) => (
                          <button
                            key={seg.id}
                            onClick={() => handleSegmentClick(seg.id)}
                            className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-colors ${
                              selectedSegment === seg.id
                                ? "bg-[oklch(0.72_0.12_40)]/10 text-[oklch(0.72_0.12_40)] font-medium"
                                : "text-foreground hover:bg-muted"
                            }`}
                          >
                            <span className="text-base">{seg.icon}</span>
                            {seg.label}
                            <span className="ml-auto text-xs text-muted-foreground">
                              {mapBusinesses.filter((b) => b.category === seg.id).length}
                            </span>
                          </button>
                        ))}
                      </div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Geolocation button */}
            <button
              onClick={getUserLocation}
              className="inline-flex items-center gap-2 bg-[oklch(0.72_0.12_40)] text-white px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-[oklch(0.65_0.12_40)] transition-colors shadow-md"
            >
              <Navigation className="w-4 h-4" />
              Minha localização
            </button>

            {/* Add Commerce button */}
            <button
              onClick={() => setShowAddForm(true)}
              className="inline-flex items-center gap-2 bg-primary text-white px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors shadow-md"
            >
              <Plus className="w-4 h-4" />
              Adicionar Comércio
            </button>
          </div>

          {/* Results count */}
          <p className="text-xs text-muted-foreground mb-3">
            {showFavoritesOnly
              ? `${filteredBusinesses.length} favorito${filteredBusinesses.length !== 1 ? "s" : ""}`
              : `${filteredBusinesses.length} ${filteredBusinesses.length === 1 ? "estabelecimento" : "estabelecimentos"} encontrado${filteredBusinesses.length !== 1 ? "s" : ""} no Campo Comprido`}
          </p>

          {/* Map container */}
          <div className="relative rounded-xl overflow-hidden border border-border shadow-lg" style={{ height: "calc(100vh - 340px)", minHeight: "500px" }}>
            <MapView
              initialCenter={CAMPO_COMPRIDO_CENTER}
              initialZoom={14}
              onMapReady={handleMapReady}
              fallbackMarkers={filteredBusinesses.map((biz) => ({
                id: biz.id,
                title: biz.name,
                subtitle: allSegments.find((s) => s.id === biz.category)?.label || biz.category,
                lat: biz.lat,
                lng: biz.lng,
                onClick: () => setSelectedBusiness({
                  name: biz.name,
                  category: biz.category,
                  address: biz.address,
                  phone: biz.phone,
                  rating: biz.rating,
                  lat: biz.lat,
                  lng: biz.lng,
                }),
              }))}
              className="w-full h-full"
            />

            {/* Selected business popup — shows all info when clicking a pin */}
            {selectedBusiness && (
              <div className="absolute bottom-4 left-4 right-4 lg:left-auto lg:right-4 lg:w-96 bg-white rounded-xl shadow-2xl border border-border z-10">
                {/* Popup header */}
                <div className="p-4 border-b border-border">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-serif text-xl font-bold text-foreground">
                        {selectedBusiness.name}
                      </h3>
                      <p className="text-sm text-[oklch(0.72_0.12_40)] font-medium capitalize mt-0.5">
                        {allSegments.find((s) => s.id === selectedBusiness.category)?.label || selectedBusiness.category}
                      </p>
                    </div>
                    <div className="flex items-center gap-1">
                      {/* Favorite button */}
                      <button
                        onClick={() => {
                          const bizId = mapBusinesses.find(
                            (b) => b.name === selectedBusiness.name
                          )?.id;
                          if (bizId) toggleFavorite(String(bizId));
                        }}
                        className="p-1.5 rounded-lg hover:bg-muted transition-colors"
                      >
                        <Heart
                          className={`w-5 h-5 transition-colors ${
                            favorites.includes(
                              String(mapBusinesses.find((b) => b.name === selectedBusiness.name)?.id)
                            )
                              ? "text-red-500 fill-current"
                              : "text-muted-foreground"
                          }`}
                        />
                      </button>
                      <button
                        onClick={() => setSelectedBusiness(null)}
                        className="p-1.5 rounded-lg hover:bg-muted transition-colors"
                      >
                        <X className="w-5 h-5 text-muted-foreground" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Popup body — all details */}
                <div className="p-4 space-y-3">
                  {/* Address */}
                  <div className="flex items-start gap-2">
                    <MapPin className="w-4 h-4 text-[oklch(0.72_0.12_40)] shrink-0 mt-0.5" />
                    <div>
                      <p className="text-xs text-muted-foreground font-medium">Endereço</p>
                      <p className="text-sm text-foreground">{selectedBusiness.address}</p>
                    </div>
                  </div>

                  {/* Phone */}
                  {selectedBusiness.phone && (
                    <div className="flex items-start gap-2">
                      <Phone className="w-4 h-4 text-[oklch(0.72_0.12_40)] shrink-0 mt-0.5" />
                      <div>
                        <p className="text-xs text-muted-foreground font-medium">Telefone</p>
                        <p className="text-sm text-foreground">{selectedBusiness.phone}</p>
                      </div>
                    </div>
                  )}

                  {/* Rating */}
                  {selectedBusiness.rating > 0 && <div className="flex items-center gap-2">
                    <Star className="w-4 h-4 text-yellow-500 fill-current" />
                    <span className="text-sm font-medium text-foreground">{selectedBusiness.rating}</span>
                    <span className="text-xs text-muted-foreground">/ 5.0</span>
                  </div>}
                </div>

                {/* Popup actions */}
                <div className="p-4 pt-0 flex gap-2">
                  <button
                    onClick={() => {
                      window.open(`https://www.google.com/maps/dir/?api=1&destination=${selectedBusiness.lat},${selectedBusiness.lng}`, "_blank");
                    }}
                    className="flex-1 inline-flex items-center justify-center gap-1.5 bg-[oklch(0.72_0.12_40)] text-white px-3 py-2.5 rounded-lg text-sm font-medium hover:bg-[oklch(0.65_0.12_40)] transition-colors"
                  >
                    <Navigation className="w-4 h-4" /> Ver no Google Maps
                  </button>
                  <button
                    onClick={() => {
                      if (selectedBusiness.phone) {
                        window.open(`tel:${selectedBusiness.phone}`, "_self");
                      }
                    }}
                    className="flex-1 inline-flex items-center justify-center gap-1.5 bg-primary text-white px-3 py-2.5 rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors"
                  >
                    <Phone className="w-4 h-4" /> Ligar
                  </button>
                </div>
              </div>
            )}

            {/* Add Commerce Modal */}
            {showAddForm && (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-20 p-4">
                <div className="bg-white rounded-xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
                  <div className="p-5 border-b border-border">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Plus className="w-5 h-5 text-[oklch(0.72_0.12_40)]" />
                        <h3 className="font-serif text-lg font-bold text-foreground">
                          Cadastrar Comércio
                        </h3>
                      </div>
                      <button
                        onClick={() => setShowAddForm(false)}
                        className="p-1.5 rounded-lg hover:bg-muted"
                      >
                        <X className="w-5 h-5 text-muted-foreground" />
                      </button>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      Preencha os dados do seu estabelecimento no Campo Comprido. O cadastro será enviado para aprovação do administrador.
                    </p>
                  </div>

                  <form onSubmit={handleAddCommerce} className="p-5 space-y-4">
                    {/* Nome do comércio */}
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-1.5">
                        Nome do Comércio *
                      </label>
                      <input
                        type="text"
                        value={formData.nome}
                        onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                        placeholder="Ex: Padaria do João"
                        className="w-full px-4 py-2.5 rounded-lg border border-border bg-background text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-[oklch(0.72_0.12_40)]/50"
                        required
                      />
                    </div>

                    {/* Segmento */}
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-1.5">
                        Segmento *
                      </label>
                      <select
                        value={formData.segmento}
                        onChange={(e) => setFormData({ ...formData, segmento: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-lg border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-[oklch(0.72_0.12_40)]/50"
                        required
                      >
                        <option value="">Selecione o segmento...</option>
                        {allSegments.map((seg) => (
                          <option key={seg.id} value={seg.id}>
                            {seg.icon} {seg.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Rua / Endereço with autocomplete */}
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-1.5">
                        Rua / Endereço *
                      </label>
                      <div className="relative">
                        <input
                          ref={addressInputRef}
                          type="text"
                          value={formData.rua}
                          onChange={(e) => {
                            setFormData({ ...formData, rua: e.target.value, lat: 0, lng: 0 });
                            setAddressSuggestion(null);
                          }}
                          placeholder="Digite o endereço para buscar no mapa..."
                          className="w-full px-4 py-2.5 pr-10 rounded-lg border border-border bg-background text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-[oklch(0.72_0.12_40)]/50"
                          required
                        />
                        {geocoding ? (
                          <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 animate-spin text-[oklch(0.72_0.12_40)]" />
                        ) : addressSuggestion ? (
                          <MapPinned className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-green-600" />
                        ) : (
                          <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        )}
                      </div>
                      {addressSuggestion && (
                        <p className="text-xs text-green-600 mt-1 flex items-center gap-1">
                          <MapPinned className="w-3 h-3" /> Endereço localizado no mapa
                        </p>
                      )}
                      {!addressSuggestion && formData.rua.length > 5 && (
                        <p className="text-xs text-muted-foreground mt-1">
                          Selecione o endereço na lista de sugestões para geolocalizar automaticamente
                        </p>
                      )}
                    </div>

                    {/* Telefone */}
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-1.5">
                        Telefone *
                      </label>
                      <input
                        type="tel"
                        value={formData.telefone}
                        onChange={(e) => setFormData({ ...formData, telefone: e.target.value })}
                        placeholder="(41) 99999-9999"
                        className="w-full px-4 py-2.5 rounded-lg border border-border bg-background text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-[oklch(0.72_0.12_40)]/50"
                        required
                      />
                    </div>

                    {/* Foto do comércio */}
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-1.5">
                        Foto do Estabelecimento <span className="text-muted-foreground">(opcional)</span>
                      </label>
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handlePhotoChange}
                        className="hidden"
                      />
                      {!photoPreview ? (
                        <button
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          className="w-full flex items-center justify-center gap-2 px-4 py-8 rounded-lg border-2 border-dashed border-border bg-background text-muted-foreground hover:border-[oklch(0.72_0.12_40)] hover:text-[oklch(0.72_0.12_40)] transition-colors"
                        >
                          <Upload className="w-5 h-5" />
                          <span className="text-sm">Clique para enviar uma foto</span>
                        </button>
                      ) : (
                        <div className="relative rounded-lg overflow-hidden border border-border">
                          <img
                            src={photoPreview}
                            alt="Preview do comércio"
                            className="w-full h-40 object-cover"
                          />
                          {uploading && (
                            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                              <Loader2 className="w-6 h-6 animate-spin text-white" />
                            </div>
                          )}
                          {!uploading && (
                            <button
                              type="button"
                              onClick={() => {
                                setPhotoPreview(null);
                                setPhotoFile(null);
                                setPhotoUrl(null);
                                if (fileInputRef.current) fileInputRef.current.value = "";
                              }}
                              className="absolute top-2 right-2 p-1.5 rounded-full bg-black/60 text-white hover:bg-black/80 transition-colors"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          )}
                          {!uploading && photoUrl && (
                            <div className="absolute bottom-2 right-2 flex items-center gap-1 bg-green-600 text-white text-xs px-2 py-1 rounded-full">
                              <ImageIcon className="w-3 h-3" /> Enviada
                            </div>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Submit */}
                    <div className="flex gap-2 pt-2">
                      <button
                        type="button"
                        onClick={() => setShowAddForm(false)}
                        className="flex-1 px-4 py-2.5 rounded-lg border border-border text-foreground text-sm font-medium hover:bg-muted transition-colors"
                      >
                        Cancelar
                      </button>
                      <button
                        type="submit"
                        className="flex-1 px-4 py-2.5 rounded-lg bg-[oklch(0.72_0.12_40)] text-white text-sm font-medium hover:bg-[oklch(0.65_0.12_40)] transition-colors"
                      >
                        Cadastrar
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
