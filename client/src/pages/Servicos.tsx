/*
 * Design: Terra Viva — Mapa de Serviços do Campo Comprido
 * Filtros agrupados em dropdown, mapa interativo automático,
 * cadastro de serviços pelo usuário, dados reais do bairro
 */
import { useState, useRef, useEffect, useCallback, useMemo } from "react";
import { Search, MapPin, Phone, Clock, Star, ChevronDown, Filter, Navigation, Plus, MapPinned, Upload, Image as ImageIcon, Loader2, X, MessageSquare } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WaveDivider from "@/components/WaveDivider";
import { MapView } from "@/components/Map";
import { services as allServices } from "@/data/services-data";
import { toast } from "sonner";
import { trpc } from "@/lib/trpc";
import StarRating from "@/components/StarRating";

interface Service {
  id: number;
  name: string;
  category: string;
  address: string;
  phone: string;
  hours: string;
  rating: number;
}

// Categorias agrupadas
const categoryGroups = [
  {
    title: "Saúde",
    items: ["Hospitais", "UBS", "Farmácias"],
  },
  {
    title: "Educação",
    items: ["Escolas", "CMEIs"],
  },
  {
    title: "Alimentação",
    items: ["Mercados", "Açougues", "Padarias", "Restaurantes", "Lanchonetes"],
  },
  {
    title: "Serviços Públicos",
    items: ["Delegacias", "Bombeiros", "CRAS", "Cartório", "Bancos", "Correios"],
  },
  {
    title: "Comunidade",
    items: ["Igrejas", "Academias", "Salões de Beleza", "Veterinário", "Lojas"],
  },
  {
    title: "Lazer",
    items: ["Pontos de ônibus", "Praças", "Parques"],
  },
];

const allCategories = categoryGroups.flatMap((g) => g.items);

// Coordenadas aproximadas para mapear serviços no mapa (baseado em endereços reais)
const serviceCoords: Record<string, { lat: number; lng: number }> = {
  "UPA Campo Comprido": { lat: -25.4240, lng: -49.3240 },
  "Unidade Cuidados Continuados Santa Terezinha": { lat: -25.4240, lng: -49.3240 },
  "Unidade Local de Saúde Atenas": { lat: -25.4240, lng: -49.3131 },
  "UBS Campo Comprido": { lat: -25.4270, lng: -49.3160 },
  "UBS Orlando Muraro": { lat: -25.4280, lng: -49.3175 },
  "UBS Jardim Campo Comprido": { lat: -25.4255, lng: -49.3180 },
  "Centro de Saúde São Braz": { lat: -25.4290, lng: -49.3150 },
  "Centro de Saúde Umbará": { lat: -25.4240, lng: -49.3170 },
  "UBS Via Vêneto (em construção)": { lat: -25.4240, lng: -49.3240 },
  "Hospital Pilar do Sul": { lat: -25.4310, lng: -49.3140 },
  "Pronto Atendimento Regional": { lat: -25.4285, lng: -49.3130 },
  "Farmácia Pague Menos Campo Comprido": { lat: -25.4275, lng: -49.3165 },
  "Farmácia Campofarma": { lat: -25.4265, lng: -49.3155 },
  "Farmácia Samsei": { lat: -25.4260, lng: -49.3170 },
  "Farmácia Fafeli": { lat: -25.4270, lng: -49.3150 },
  "Drogarias Nissei - Parigot de Souza": { lat: -25.4245, lng: -49.3185 },
  "Drogarias Nissei - João Falarz": { lat: -25.4280, lng: -49.3145 },
  "Farmácia Globo": { lat: -25.4278, lng: -49.3162 },
  "Farmais Campo Comprido": { lat: -25.4295, lng: -49.3178 },
  "Homeopatia e Cia": { lat: -25.4268, lng: -49.3158 },
  "Farmácia Unimax": { lat: -25.4258, lng: -49.3148 },
  "Henryfarma": { lat: -25.4250, lng: -49.3172 },
  "Panvel Farmácias - Mossunguê": { lat: -25.4305, lng: -49.3155 },
  "Farmácia Descontão": { lat: -25.4298, lng: -49.3185 },
  "Farma Total": { lat: -25.4272, lng: -49.3168 },
  "Thalifarma": { lat: -25.4240, lng: -49.3240 },
  "Escola Ecológica de Curitiba": { lat: -25.4248, lng: -49.3162 },
  "Escola Projeto Inovação": { lat: -25.4262, lng: -49.3142 },
  "Escola Municipal Jardim Santos Andrade": { lat: -25.4240, lng: -49.3178 },
  "Escola Nilza Tartuce": { lat: -25.4288, lng: -49.3125 },
  "Escola Municipal Maria do Carmo Martins": { lat: -25.4292, lng: -49.3188 },
  "Escola Municipal Padre João Cruciani": { lat: -25.4275, lng: -49.3135 },
  "CMEI Conjunto Piquiri": { lat: -25.4282, lng: -49.3172 },
  "Escola Como Viver": { lat: -25.4252, lng: -49.3145 },
  "Centro de Educação Infantil Tia Cida": { lat: -25.4260, lng: -49.3168 },
  "Kamby Berçário e Educação Infantil": { lat: -25.4248, lng: -49.3182 },
  "Ursula Benincasa Escola": { lat: -25.4285, lng: -49.3152 },
  "Escola Turmalina": { lat: -25.4295, lng: -49.3165 },
  "Positivo Internacional - Campo Comprido": { lat: -25.4278, lng: -49.3140 },
  "Pequeno Cotolengo": { lat: -25.4290, lng: -49.3118 },
  "Escola Paula Amaral": { lat: -25.4250, lng: -49.3158 },
  "CMEI Santos Andrade": { lat: -25.4240, lng: -49.3174 },
  "Mercado Guassu Campo Comprido": { lat: -25.4255, lng: -49.3165 },
  "Supermercado Jacomar": { lat: -25.4258, lng: -49.3175 },
  "Super Sierra": { lat: -25.4242, lng: -49.3168 },
  "Mundo Verde Campo Comprido": { lat: -25.4262, lng: -49.3145 },
  "Mercadinho do Bairro": { lat: -25.4278, lng: -49.3155 },
  "Hortifruti Campo Comprido": { lat: -25.4282, lng: -49.3162 },
  "Supermercado Pão de Açúcar Express": { lat: -25.4285, lng: -49.3182 },
  "Supermercado Condor Campo Comprido": { lat: -25.4240, lng: -49.3240 },
  "Açougue da Família": { lat: -25.4268, lng: -49.3148 },
  "Açougue Campo Comprido": { lat: -25.4255, lng: -49.3172 },
  "Açougue do Zé": { lat: -25.4245, lng: -49.3185 },
  "Carnes Nobres Campo Comprido": { lat: -25.4288, lng: -49.3148 },
  "Açougue e Churrascaria Paraná": { lat: -25.4275, lng: -49.3138 },
  "Frigorífico Campo Comprido": { lat: -25.4290, lng: -49.3122 },
  "Casa das Carnes Premium": { lat: -25.4258, lng: -49.3160 },
  "Açougue Bom Preço": { lat: -25.4292, lng: -49.3188 },
  "Frigorífico Argus": { lat: -25.4240, lng: -49.3164 },
  "Panificadora Imperial": { lat: -25.4252, lng: -49.3172 },
  "Panificadora Panivida": { lat: -25.4240, lng: -49.3153 },
  "Panificadora Saint Germain Ecoville": { lat: -25.4240, lng: -49.3240 },
  "Grão do Dia Padaria": { lat: -25.4240, lng: -49.3125 },
  "Padaria São João": { lat: -25.4272, lng: -49.3158 },
  "Cantinho da Bica": { lat: -25.4258, lng: -49.3175 },
  "Padaria Avenida": { lat: -25.4270, lng: -49.3138 },
  "Padaria e Confeitaria Rosa": { lat: -25.4245, lng: -49.3180 },
  "Padaria Trigo Puro": { lat: -25.4250, lng: -49.3165 },
  "Café Campo Comprido": { lat: -25.4240, lng: -49.3240 },
  "Dulin Café": { lat: -25.4275, lng: -49.3152 },
  "Restaurante Sabor do Paraná": { lat: -25.4268, lng: -49.3155 },
  "Mestre Espetinhos": { lat: -25.4258, lng: -49.3162 },
  "JP Lanches": { lat: -25.4255, lng: -49.3172 },
  "Dom Parma Trattoria": { lat: -25.4282, lng: -49.3185 },
  "Lanchonete do Beto": { lat: -25.4272, lng: -49.3165 },
  "Restaurante Bom Prato Campo Comprido": { lat: -25.4292, lng: -49.3120 },
  "Pizzaria Massa & Cia": { lat: -25.4268, lng: -49.3145 },
  "Churrascaria Gaúcha do Sul": { lat: -25.4310, lng: -49.3148 },
  "Restaurante Madalosso (Unidade Campo Comprido)": { lat: -25.4240, lng: -49.3216 },
  "Restaurante Orelha de Elefante": { lat: -25.4240, lng: -49.3240 },
  "Velho Madalosso": { lat: -25.4240, lng: -49.3149 },
  "Delegacia de Polícia - Portão": { lat: -25.4320, lng: -49.3110 },
  "Quartel do Corpo de Bombeiros": { lat: -25.4340, lng: -49.3080 },
  "CRAS Campo Comprido": { lat: -25.4295, lng: -49.3192 },
  "Cartório de Registro Civil - Portão": { lat: -25.4325, lng: -49.3105 },
  "Banco do Brasil - Agência 1863 Servidor": { lat: -25.4240, lng: -49.3118 },
  "Itaú Unibanco - Campo Comprido": { lat: -25.4265, lng: -49.3140 },
  "Caixa Econômica Federal - Campo Comprido": { lat: -25.4282, lng: -49.3175 },
  "Agência dos Correios - Campo Comprido": { lat: -25.4260, lng: -49.3178 },
  "Bradesco - Campo Comprido": { lat: -25.4240, lng: -49.3080 },
  "Santander - Campo Comprido": { lat: -25.4240, lng: -49.3162 },
  "Santuário de Schoenstatt (Cantinho da Paz)": { lat: -25.4240, lng: -49.3145 },
  "Ala Campo Comprido - Igreja de Jesus Cristo dos Santos dos Últimos Dias": { lat: -25.4240, lng: -49.3156 },
  "Primeira Igreja Batista de Curitiba - Campo Comprido": { lat: -25.4240, lng: -49.3240 },
  "Santuário Diocesano Nossa Senhora de Lourdes": { lat: -25.4240, lng: -49.3228 },
  "Igreja Nossa Senhora Aparecida": { lat: -25.4288, lng: -49.3175 },
  "Igreja São Francisco de Assis": { lat: -25.4262, lng: -49.3152 },
  "Igreja Adventista do Sétimo Dia - Campo Comprido": { lat: -25.4285, lng: -49.3155 },
  "Igreja Assembleia de Deus - Campo Comprido": { lat: -25.4252, lng: -49.3172 },
  "Igreja Batista Central - Campo Comprido": { lat: -25.4275, lng: -49.3138 },
  "Centro Espírita Amor e Caridade": { lat: -25.4248, lng: -49.3182 },
  "Igreja Católica São José": { lat: -25.4290, lng: -49.3125 },
  "Igreja Presbiteriana - Campo Comprido": { lat: -25.4250, lng: -49.3168 },
  "Igreja Universal do Reino de Deus - Campo Comprido": { lat: -25.4240, lng: -49.3240 },
  "Uplay Campo Comprido": { lat: -25.4240, lng: -49.3231 },
  "Gym Life Clube Campo Comprido": { lat: -25.4240, lng: -49.3209 },
  "Academia Equilibrium Campo Comprido": { lat: -25.4240, lng: -49.3240 },
  "Fit Studio Campo Comprido": { lat: -25.4240, lng: -49.3080 },
  "Academia ao Ar Livre Campo Comprido": { lat: -25.4240, lng: -49.3148 },
  "Academia Fit Life Campo Comprido": { lat: -25.4280, lng: -49.3170 },
  "Smart Fit Campo Comprido": { lat: -25.4268, lng: -49.3142 },
  "Academia Bluefit": { lat: -25.4275, lng: -49.3135 },
  "Studio Pilates Campo Comprido": { lat: -25.4285, lng: -49.3152 },
  "Academia Body Tech": { lat: -25.4260, lng: -49.3148 },
  "CrossFit Campo Comprido": { lat: -25.4298, lng: -49.3195 },
  "Academia Mulher em Forma": { lat: -25.4248, lng: -49.3188 },
  "Exclusive Studio": { lat: -25.4240, lng: -49.3118 },
  "Salão de Beleza Carolaine Batista": { lat: -25.4240, lng: -49.3205 },
  "DG Beauty Hair": { lat: -25.4240, lng: -49.3140 },
  "Salão Luiz Tramontin": { lat: -25.4240, lng: -49.3129 },
  "Barbearia Campo Comprido": { lat: -25.4255, lng: -49.3172 },
  "Studio Hair Design": { lat: -25.4272, lng: -49.3135 },
  "Espaço Beauty": { lat: -25.4280, lng: -49.3158 },
  "Salão Glamour": { lat: -25.4282, lng: -49.3182 },
  "Manicure & Pedicure Elegance": { lat: -25.4245, lng: -49.3178 },
  "Barbearia Premium Cuts": { lat: -25.4292, lng: -49.3128 },
  "Salão Beleza & Cia": { lat: -25.4255, lng: -49.3160 },
  "BePet Pet Shop": { lat: -25.4240, lng: -49.3106 },
  "Quintessência Pet Shop": { lat: -25.4240, lng: -49.3240 },
  "Molekas Pet Shop": { lat: -25.4240, lng: -49.3233 },
  "HUGPET": { lat: -25.4240, lng: -49.3080 },
  "Clínica Veterinária Clube Animal": { lat: -25.4240, lng: -49.3221 },
  "Hospital Veterinário Batel (Campo Comprido)": { lat: -25.4240, lng: -49.3201 },
  "Banho e Tosa Feliz": { lat: -25.4280, lng: -49.3160 },
  "Pet Shop Rações & Cia": { lat: -25.4248, lng: -49.3180 },
  "Pet Shop Amigo Fiel": { lat: -25.4265, lng: -49.3140 },
  "Loja Utilidades do Bairro": { lat: -25.4258, lng: -49.3165 },
  "Loja de Materiais de Construção Silva": { lat: -25.4262, lng: -49.3148 },
  "Loja de Eletrodomésticos Campo Comprido": { lat: -25.4272, lng: -49.3135 },
  "Loja de Roupas Moda Campo": { lat: -25.4275, lng: -49.3155 },
  "Papelaria e Bazar Campo Comprido": { lat: -25.4288, lng: -49.3185 },
  "Loja de Ferragens e Variedades": { lat: -25.4250, lng: -49.3190 },
  "Floricultura Jardim Encantado": { lat: -25.4248, lng: -49.3165 },
  "Outlet Campo Comprido (Outlet de Marcas)": { lat: -25.4240, lng: -49.3185 },
  "Loja de Brinquedos Campo Comprido": { lat: -25.4240, lng: -49.3238 },
  "Loja de Informática e Celulares CC": { lat: -25.4240, lng: -49.3234 },
  "Parque Barigui": { lat: -25.4240, lng: -49.3200 },
  "Praça do Campo Comprido": { lat: -25.4270, lng: -49.3165 },
  "Ponto de Ônibus Terminal Campo Comprido": { lat: -25.4278, lng: -49.3168 },
  "Praça Luiz Zilli": { lat: -25.4242, lng: -49.3182 },
  "Praça Prof. João Falarz": { lat: -25.4272, lng: -49.3155 },
};

// Mapear serviços para o mapa
const mapServices = allServices.map((s) => {
  const coords = serviceCoords[s.name] || {
    lat: -25.4275 + (Math.random() - 0.5) * 0.008,
    lng: -49.3170 + (Math.random() - 0.5) * 0.008,
  };
  return { ...s, lat: coords.lat, lng: coords.lng };
});

const CAMPO_COMPRIDO_CENTER = { lat: -25.4275, lng: -49.3170 };

export default function Servicos() {
  const [activeCategory, setActiveCategory] = useState("Todos");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterOpen, setFilterOpen] = useState(false);
  const filterRef = useRef<HTMLDivElement>(null);
  const [showMap, setShowMap] = useState(true);
  const [mapReady, setMapReady] = useState(false);
  const [selectedService, setSelectedService] = useState<Service & { lat: number; lng: number } | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const mapRef = useRef<google.maps.Map | null>(null);
  const markersRef = useRef<google.maps.marker.AdvancedMarkerElement[]>([]);
  const userMarkerRef = useRef<google.maps.marker.AdvancedMarkerElement | null>(null);
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);
  const addressInputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Add service form state
  const [formData, setFormData] = useState({
    nome: "",
    categoria: "",
    endereco: "",
    telefone: "",
    horario: "",
    lat: 0,
    lng: 0,
  });
  const [addressSuggestion, setAddressSuggestion] = useState<string | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  // Review modal state
  const [reviewTarget, setReviewTarget] = useState<{ id: number; name: string } | null>(null);
  const [reviewName, setReviewName] = useState("");
  const [reviewRating, setReviewRating] = useState(0);
  const [reviewComment, setReviewComment] = useState("");

  // Fetch all service reviews to build average rating map
  const { data: allServiceReviews } = trpc.review.listAll.useQuery({ targetType: "service" });
  const { data: serviceReviewsData, refetch: refetchServiceReviews } = trpc.review.listByTarget.useQuery(
    { targetType: "service", targetId: reviewTarget?.id ?? 0 },
    { enabled: reviewTarget !== null }
  );

  // Average ratings per service
  const serviceRatingMap = useMemo(() => {
    const map: Record<number, { avg: number; count: number }> = {};
    if (!allServiceReviews) return map;
    allServiceReviews.forEach((r) => {
      if (!map[r.targetId]) map[r.targetId] = { avg: 0, count: 0 };
      map[r.targetId].avg += r.rating;
      map[r.targetId].count += 1;
    });
    Object.keys(map).forEach((k) => {
      const key = Number(k);
      map[key].avg = Math.round((map[key].avg / map[key].count) * 10) / 10;
    });
    return map;
  }, [allServiceReviews]);

  const addServiceReviewMutation = trpc.review.add.useMutation({
    onSuccess: () => {
      toast.success("Avaliação enviada com sucesso!");
      setReviewTarget(null);
      setReviewName("");
      setReviewRating(0);
      setReviewComment("");
      refetchServiceReviews();
    },
    onError: () => toast.error("Erro ao enviar avaliação"),
  });

  // tRPC mutations
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

  const addServiceMutation = trpc.commerce.add.useMutation({
    onSuccess: () => {
      toast.success("Serviço cadastrado com sucesso! Aguardando aprovação do administrador.");
      setFormData({ nome: "", categoria: "", endereco: "", telefone: "", horario: "", lat: 0, lng: 0 });
      setAddressSuggestion(null);
      setShowAddForm(false);
      setPhotoPreview(null);
      setPhotoFile(null);
      setPhotoUrl(null);
    },
    onError: () => {
      toast.error("Erro ao cadastrar serviço. Tente novamente.");
    },
  });

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
              endereco: place.formatted_address || prev.endereco,
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

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (filterRef.current && !filterRef.current.contains(e.target as Node)) {
        setFilterOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filtered = allServices.filter((s) => {
    const matchCategory = activeCategory === "Todos" || s.category === activeCategory;
    const matchSearch =
      !searchTerm ||
      s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.address.toLowerCase().includes(searchTerm.toLowerCase());
    return matchCategory && matchSearch;
  });

  const handleCategoryClick = (cat: string) => {
    setActiveCategory(cat);
    setFilterOpen(false);
  };

  // Update markers on map when category/search changes
  const updateMarkers = useCallback(() => {
    if (!mapRef.current) return;

    // Clear existing markers
    markersRef.current.forEach((marker) => {
      marker.map = null;
    });
    markersRef.current = [];

    // Filter map services by current selection
    const mapFiltered = mapServices.filter((s) => {
      const matchCategory = activeCategory === "Todos" || s.category === activeCategory;
      const matchSearch =
        !searchTerm ||
        s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.address.toLowerCase().includes(searchTerm.toLowerCase());
      return matchCategory && matchSearch;
    });

    // Add markers for filtered services
    mapFiltered.forEach((service) => {
      const marker = new google.maps.marker.AdvancedMarkerElement({
        map: mapRef.current,
        position: { lat: service.lat, lng: service.lng },
        title: service.name,
      });

      marker.addListener("click", () => {
        setSelectedService(service);
        mapRef.current?.panTo({ lat: service.lat, lng: service.lng });
      });

      markersRef.current.push(marker);
    });
  }, [activeCategory, searchTerm]);

  const handleMapReady = (map: google.maps.Map) => {
    mapRef.current = map;
    setMapReady(true);
    updateMarkers();
  };

  // Update markers when filters change
  useEffect(() => {
    if (mapReady) {
      updateMarkers();
    }
  }, [mapReady, activeCategory, searchTerm, updateMarkers]);

  const flyToService = (service: Service) => {
    const coords = serviceCoords[service.name] || {
      lat: -25.4275 + (Math.random() - 0.5) * 0.008,
      lng: -49.3170 + (Math.random() - 0.5) * 0.008,
    };
    setSelectedService({ ...service, ...coords });
    if (mapRef.current) {
      mapRef.current.panTo(coords);
      mapRef.current.setZoom(16);
    }
    setShowMap(true);
    window.scrollTo({ top: 300, behavior: "smooth" });
  };

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
    if (!photoFile || photoUrl) return;
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

  const handleAddService = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.nome || !formData.categoria || !formData.endereco || !formData.telefone) {
      toast.error("Preencha todos os campos obrigatórios");
      return;
    }
    if (photoFile && !photoUrl) {
      await uploadPhotoFile();
    }
    setTimeout(() => {
      addServiceMutation.mutate({
        name: formData.nome,
        category: formData.categoria,
        address: formData.endereco,
        phone: formData.telefone,
        lat: formData.lat ? String(formData.lat) : undefined,
        lng: formData.lng ? String(formData.lng) : undefined,
        coordsJson: formData.lat && formData.lng ? JSON.stringify({ lat: formData.lat, lng: formData.lng }) : undefined,
        photoUrl: photoUrl || undefined,
        photoKey: photoUrl || undefined,
      });
    }, 500);
  };

  // Category counts
  const categoryCounts: Record<string, number> = {};
  allServices.forEach((s) => {
    categoryCounts[s.category] = (categoryCounts[s.category] || 0) + 1;
  });

  return (
    <div className="min-h-screen">
      <Header />

      {/* Hero with photo */}
      <section className="pt-28 lg:pt-36 pb-12 relative overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="/manus-storage/campo-comprido-novo-6_3322afb1.jpg"
            alt="Serviços do Campo Comprido"
            className="w-full h-full object-cover" loading="eager"
          />
          <div className="absolute inset-0 bg-black/50" />
        </div>
        <div className="container relative z-10">
          <p className="text-white/70 font-medium text-sm uppercase tracking-[0.2em] mb-2">
            Mapa de Serviços
          </p>
          <h1 className="font-serif text-3xl lg:text-5xl font-bold text-white mb-4">
            Encontre serviços no Campo Comprido
          </h1>
          <p className="text-white/80 text-lg max-w-2xl">
            Localize hospitais, escolas, farmácias, comércios e mais. Use o filtro por categoria ou pesquise pelo nome.
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
                placeholder="Buscar serviço, endereço..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-lg border border-border bg-card text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
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
                {activeCategory === "Todos" ? "Todas as categorias" : activeCategory}
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
                              {categoryCounts[cat] || 0}
                            </span>
                          </button>
                        ))}
                      </div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Add Service button */}
            <button
              onClick={() => setShowAddForm(true)}
              className="inline-flex items-center gap-2 bg-primary text-white px-4 py-3 rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors shadow-md"
            >
              <Plus className="w-4 h-4" />
              Cadastrar Serviço
            </button>
          </div>

          {/* Results count */}
          <p className="text-sm text-muted-foreground mb-4">
            {filtered.length} {filtered.length === 1 ? "serviço" : "serviços"} encontrados
            {activeCategory !== "Todos" && <span> na categoria <strong>{activeCategory}</strong></span>}
          </p>

          {/* Interactive Map — automatically visible */}
          {showMap && (
            <div className="relative rounded-xl overflow-hidden border border-border shadow-lg mb-8" style={{ height: "400px", minHeight: "350px" }}>
              <MapView
                initialCenter={CAMPO_COMPRIDO_CENTER}
                initialZoom={14}
                onMapReady={handleMapReady}
                className="w-full h-full"
              />
              {/* Geolocation button */}
              <button
                onClick={getUserLocation}
                className="absolute bottom-4 right-4 bg-white p-3 rounded-full shadow-lg hover:bg-gray-50 transition-colors z-10"
                title="Minha localização"
              >
                <Navigation className="w-5 h-5 text-[oklch(0.72_0.12_40)]" />
              </button>
              {/* Info badge */}
              <div className="absolute top-4 left-4 bg-card/90 dark:bg-[oklch(0.22_0.02_160)]/90 px-3 py-1.5 rounded-full text-xs font-medium text-muted-foreground dark:text-[oklch(0.70_0.02_80)] shadow-sm">
                {filtered.length} serviços no mapa
              </div>

              {/* Selected service popup */}
              {selectedService && (
                <div               className="absolute bottom-4 left-4 right-4 lg:left-auto lg:right-4 lg:w-80 bg-card dark:bg-[oklch(0.22_0.02_160)] rounded-xl shadow-2xl border border-border z-10">
                  <div className="p-4 border-b border-border">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-serif text-lg font-bold text-foreground">{selectedService.name}</h3>
                        <p className="text-sm text-[oklch(0.72_0.12_40)] font-medium mt-0.5">{selectedService.category}</p>
                      </div>
                      <button onClick={() => setSelectedService(null)} className="p-1.5 rounded-lg hover:bg-muted transition-colors">
                        <X className="w-4 h-4 text-muted-foreground" />
                      </button>
                    </div>
                  </div>
                  <div className="p-4 space-y-2">
                    <div className="flex items-start gap-2">
                      <MapPin className="w-4 h-4 text-[oklch(0.72_0.12_40)] shrink-0 mt-0.5" />
                      <p className="text-sm text-foreground">{selectedService.address}</p>
                    </div>
                    <div className="flex items-start gap-2">
                      <Phone className="w-4 h-4 text-[oklch(0.72_0.12_40)] shrink-0 mt-0.5" />
                      <p className="text-sm text-foreground">{selectedService.phone}</p>
                    </div>
                  </div>
                  <div className="p-4 pt-0 flex gap-2">
                    <button
                      onClick={() => window.open(`https://www.google.com/maps/dir/?api=1&destination=${selectedService.lat},${selectedService.lng}`, "_blank")}
                      className="flex-1 inline-flex items-center justify-center gap-1.5 bg-[oklch(0.72_0.12_40)] text-white px-3 py-2.5 rounded-lg text-sm font-medium hover:bg-[oklch(0.65_0.12_40)] transition-colors"
                    >
                      <Navigation className="w-4 h-4" /> Rotas
                    </button>
                    <button
                      onClick={() => { if (selectedService.phone) window.open(`tel:${selectedService.phone}`, "_self"); }}
                      className="flex-1 inline-flex items-center justify-center gap-1.5 bg-primary text-white px-3 py-2.5 rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors"
                    >
                      <Phone className="w-4 h-4" /> Ligar
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Service cards — grouped by category with nested accordion */}
          <div className="space-y-3">
            {(() => {
              // Group filtered services by category, preserving order from categoryGroups
              const orderedGroups: { title: string; categories: string[] }[] = activeCategory === "Todos"
                ? categoryGroups.map((g) => ({
                    title: g.title,
                    categories: g.items.filter((cat) => filtered.some((s) => s.category === cat)),
                  })).filter((g) => g.categories.length > 0)
                : [{ title: activeCategory, categories: [activeCategory] }];

              return orderedGroups.map((group) => (
                <div key={group.title} className="rounded-xl border border-border bg-card overflow-hidden">
                  {/* Main group header — clickable to expand/collapse */}
                  <details className="group">
                    <summary className="flex items-center justify-between px-5 py-4 cursor-pointer hover:bg-[oklch(0.72_0.12_40)]/5 transition-colors list-none bg-[oklch(0.72_0.12_40)]/10 border-b border-border">
                      <div className="flex items-center gap-3">
                        <ChevronDown className="w-5 h-5 text-[oklch(0.72_0.12_40)] dark:text-[oklch(0.78_0.10_40)] transition-transform group-open:rotate-180" />
                        <h2 className="font-serif text-lg font-bold text-[oklch(0.72_0.12_40)] dark:text-[oklch(0.78_0.10_40)]">
                          {group.title}
                        </h2>
                      </div>
                      <span className="text-sm font-medium text-muted-foreground">
                        {group.categories.reduce((acc, cat) => acc + filtered.filter((s) => s.category === cat).length, 0)} serviços
                      </span>
                    </summary>

                    {/* Sub-categories inside the expanded group */}
                    <div className="bg-card">
                      {group.categories.map((cat) => {
                        const catServices = filtered.filter((s) => s.category === cat);
                        if (catServices.length === 0) return null;
                        return (
                          <div key={cat} className="border-b border-border last:border-0">
                            {/* Sub-category accordion */}
                            <details className="group/sub">
                              <summary className="flex items-center justify-between px-8 py-3 cursor-pointer hover:bg-muted transition-colors list-none">
                                <div className="flex items-center gap-3">
                                  <ChevronDown className="w-4 h-4 text-muted-foreground transition-transform group-open/sub:rotate-180" />
                                  <span className="font-medium text-foreground text-sm">{cat}</span>
                                  <span className="text-xs px-2 py-0.5 rounded-full bg-[oklch(0.72_0.12_40)]/10 text-[oklch(0.72_0.12_40)] dark:text-[oklch(0.78_0.10_40)]">
                                    {catServices.length}
                                  </span>
                                </div>
                              </summary>
                              {/* Cards grid inside sub-category accordion */}
                              <div className="px-8 pb-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                                {catServices.map((service) => (
                                  <div
                                    key={service.id}
                                    className="p-4 rounded-lg hover:shadow-lg transition-all bg-background border border-border"
                                  >
                                    <div className="flex items-start justify-between mb-2">
                                      <h3 className="font-serif text-base font-semibold text-foreground leading-tight">
                                        {service.name}
                                      </h3>
                                      {serviceRatingMap[service.id] && serviceRatingMap[service.id].count > 0 && (
                                        <div className="flex items-center gap-1 text-yellow-500 shrink-0 ml-2">
                                          <Star className="w-3.5 h-3.5 fill-current" />
                                          <span className="text-xs font-medium">{serviceRatingMap[service.id].avg}</span>
                                          <span className="text-xs text-muted-foreground">({serviceRatingMap[service.id].count})</span>
                                        </div>
                                      )}
                                    </div>
                                    <div className="space-y-1.5 text-xs text-muted-foreground dark:text-[oklch(0.70_0.02_80)]">
                                      <div className="flex items-center gap-1.5">
                                        <MapPin className="w-3 h-3 shrink-0 text-primary" />
                                        <span>{service.address}</span>
                                      </div>
                                      <div className="flex items-center gap-1.5">
                                        <Phone className="w-3 h-3 shrink-0 text-primary" />
                                        <span>{service.phone}</span>
                                      </div>
                                      <div className="flex items-center gap-1.5">
                                        <Clock className="w-3 h-3 shrink-0 text-primary" />
                                        <span>{service.hours}</span>
                                      </div>
                                    </div>
                                    {/* Rating display */}
                                    {!serviceRatingMap[service.id] || serviceRatingMap[service.id].count === 0 ? (
                                      <div className="mt-3 p-2 rounded-lg bg-muted/50 text-muted-foreground text-xs font-medium">
                                        Ainda sem avaliações. Seja o primeiro a avaliar!
                                      </div>
                                    ) : (
                                      <div className="mt-3 p-2 rounded-lg bg-[oklch(0.72_0.12_40)]/10 text-[oklch(0.72_0.12_40)] dark:text-[oklch(0.78_0.10_40)] text-xs font-medium">
                                        Média de {serviceRatingMap[service.id].avg} estrelas com {serviceRatingMap[service.id].count} {serviceRatingMap[service.id].count === 1 ? "avaliação" : "avaliações"}
                                      </div>
                                    )}
                                    <div className="mt-3 flex gap-2 flex-wrap">
                                      <button
                                        onClick={() => flyToService(service)}
                                        className="text-xs px-2.5 py-1 rounded-lg bg-[oklch(0.72_0.12_40)]/10 text-[oklch(0.72_0.12_40)] hover:bg-[oklch(0.72_0.12_40)] hover:text-white transition-colors"
                                      >
                                        Ver no mapa
                                      </button>
                                      <button
                                        onClick={() => window.open(`https://www.google.com/maps/dir/?api=1&destination=${serviceCoords[service.name]?.lat ?? ''},${serviceCoords[service.name]?.lng ?? ''}`, "_blank")}
                                        className="text-xs px-2.5 py-1 rounded-lg border border-border text-foreground hover:bg-muted transition-colors"
                                      >
                                        Traçar rota
                                      </button>
                                      <button
                                        onClick={() => setReviewTarget({ id: service.id, name: service.name })}
                                        className="text-xs px-2.5 py-1 rounded-lg bg-[oklch(0.72_0.12_40)]/10 text-[oklch(0.72_0.12_40)] hover:bg-[oklch(0.72_0.12_40)] hover:text-white transition-colors flex items-center gap-1"
                                      >
                                        <MessageSquare className="w-3 h-3" /> Avaliar
                                      </button>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </details>
                          </div>
                        );
                      })}
                    </div>
                  </details>
                </div>
              ));
            })()}
          </div>
        </div>
      </section>

      {/* Add Service Modal */}
      <AnimatePresence>
        {showAddForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => setShowAddForm(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ duration: 0.2, ease: [0.23, 1, 0.32, 1] }}
              className="bg-card dark:bg-[oklch(0.22_0.02_160)] rounded-xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-5 border-b border-border">
                <h3 className="font-serif text-xl font-bold text-foreground">Cadastrar Serviço</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Adicione um serviço ou estabelecimento do Campo Comprido. Aguardará aprovação do administrador.
                </p>
              </div>

              <form onSubmit={handleAddService} className="p-5 space-y-4">
                {/* Nome */}
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">
                    Nome do Serviço *
                  </label>
                  <input
                    type="text"
                    value={formData.nome}
                    onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                    placeholder="Ex: Padaria Pão Quente"
                    className="w-full px-4 py-2.5 rounded-lg border border-border bg-background text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-[oklch(0.72_0.12_40)]/50"
                    required
                  />
                </div>

                {/* Categoria */}
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">
                    Categoria *
                  </label>
                  <select
                    value={formData.categoria}
                    onChange={(e) => setFormData({ ...formData, categoria: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-lg border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-[oklch(0.72_0.12_40)]/50"
                    required
                  >
                    <option value="">Selecione a categoria</option>
                    {allCategories.map((cat) => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                {/* Endereço */}
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">
                    Endereço *
                  </label>
                  <div className="relative">
                    <input
                      ref={addressInputRef}
                      type="text"
                      value={formData.endereco}
                      onChange={(e) => {
                        setFormData({ ...formData, endereco: e.target.value, lat: 0, lng: 0 });
                        setAddressSuggestion(null);
                      }}
                      placeholder="Digite o endereço para buscar no mapa..."
                      className="w-full px-4 py-2.5 pr-10 rounded-lg border border-border bg-background text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-[oklch(0.72_0.12_40)]/50"
                      required
                    />
                    {addressSuggestion ? (
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
                  {!addressSuggestion && formData.endereco.length > 5 && (
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

                {/* Horário */}
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">
                    Horário de Funcionamento
                  </label>
                  <input
                    type="text"
                    value={formData.horario}
                    onChange={(e) => setFormData({ ...formData, horario: e.target.value })}
                    placeholder="Ex: 08h-20h"
                    className="w-full px-4 py-2.5 rounded-lg border border-border bg-background text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-[oklch(0.72_0.12_40)]/50"
                  />
                </div>

                {/* Foto */}
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
                        alt="Preview"
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
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

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
                    addServiceReviewMutation.mutate({
                      authorName: reviewName.trim(),
                      targetType: "service",
                      targetId: reviewTarget.id,
                      targetName: reviewTarget.name,
                      rating: reviewRating,
                      comment: reviewComment.trim() || undefined,
                    });
                  }}
                  disabled={addServiceReviewMutation.isPending}
                  className="flex-1 px-4 py-2.5 rounded-lg bg-[oklch(0.72_0.12_40)] text-white hover:bg-[oklch(0.65_0.12_40)] transition-colors text-sm font-medium disabled:opacity-50"
                >
                  {addServiceReviewMutation.isPending ? "Enviando..." : "Enviar avaliação"}
                </button>
              </div>

              {/* Recent reviews for this target */}
              {serviceReviewsData && serviceReviewsData.length > 0 && (
                <div className="mt-4 pt-4 border-t border-border">
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Avaliações recentes</p>
                  <div className="space-y-2 max-h-32 overflow-y-auto">
                    {serviceReviewsData.slice(0, 5).map((r) => (
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
