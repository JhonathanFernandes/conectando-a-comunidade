/*
 * Design: Terra Viva — Organic Warmth (refinado)
 * Cards com bordas duplas terracota, uso mais forte de terracota como action color,
 * mais textura local e organicidade
 */
import { useState, useRef, useEffect, useCallback, type ReactNode } from "react";
import { Link } from "wouter";
import {
  MapPin, Store, Calendar, AlertTriangle, Newspaper, Phone,
  ArrowRight, Users, Building2, HandHeart, ChevronLeft, ChevronRight,
  Hospital, GraduationCap, Shield, Trees, ShoppingBag, Coffee, Quote, ArrowUp
} from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import WaveDivider from "@/components/WaveDivider";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { neighborhoodPhotos } from "@/data/photos";
import { featuredCommerces } from "@/data/featuredCommerces";

const carouselImages = neighborhoodPhotos;

const stats = [
  { number: "30.000", label: "Moradores (Censo 2022)", icon: <Users className="w-6 h-6" /> },
  { number: "3,72 km²", label: "Área do Bairro", icon: <MapPin className="w-6 h-6" /> },
  { number: String(featuredCommerces.length), label: "Locais catalogados", icon: <Store className="w-6 h-6" /> },
  { number: "151+", label: "Serviços Mapeados", icon: <Building2 className="w-6 h-6" /> },
];

const quickLinks = [
  { href: "/servicos", icon: <MapPin className="w-7 h-7" />, label: "Mapa de Serviços", desc: "Hospitais, escolas, farmácias e mais" },
  { href: "/comercio", icon: <Store className="w-7 h-7" />, label: "Comércio Local", desc: "Apoie os empreendedores do bairro" },
  { href: "/eventos", icon: <Calendar className="w-7 h-7" />, label: "Eventos", desc: "Feiras, festas, cursos e ações sociais" },
  { href: "/denuncias", icon: <AlertTriangle className="w-7 h-7" />, label: "Denúncias", desc: "Reporte problemas do bairro" },
  { href: "/noticias", icon: <Newspaper className="w-7 h-7" />, label: "Notícias", desc: "Fique por dentro do que acontece" },
  { href: "/telefones", icon: <Phone className="w-7 h-7" />, label: "Telefones Úteis", desc: "Emergências e contatos importantes" },
];

const serviceCategories = [
  { icon: <Hospital className="w-6 h-6" />, label: "Saúde", count: 26 },
  { icon: <GraduationCap className="w-6 h-6" />, label: "Educação", count: 16 },
  { icon: <Shield className="w-6 h-6" />, label: "Segurança", count: 5 },
  { icon: <Trees className="w-6 h-6" />, label: "Lazer", count: 4 },
  { icon: <ShoppingBag className="w-6 h-6" />, label: "Comércio", count: 60 },
  { icon: <Coffee className="w-6 h-6" />, label: "Alimentação", count: 20 },
];

function useRevealTrigger(resetKey: number) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setVisible(false);
    const checkPosition = () => {
      if (ref.current && ref.current.getBoundingClientRect().top <= window.innerHeight * 0.9) {
        setVisible(true);
      }
    };
    checkPosition();
    window.addEventListener("scroll", checkPosition, { passive: true });
    window.addEventListener("resize", checkPosition);
    return () => {
      window.removeEventListener("scroll", checkPosition);
      window.removeEventListener("resize", checkPosition);
    };
  }, [resetKey]);

  return { ref, visible };
}

function StatRevealCard({ stat, index, resetKey }: { stat: typeof stats[number]; index: number; resetKey: number }) {
  const reducedMotion = useReducedMotion();
  const { ref, visible } = useRevealTrigger(resetKey);

  return (
    <motion.div
      ref={ref}
      initial={false}
      animate={reducedMotion || visible ? { opacity: 1, x: 0 } : { opacity: 0, x: -70 }}
      transition={{ duration: 0.4, delay: index * 0.13, ease: "easeOut" }}
      className="text-center p-6 rounded-xl relative overflow-hidden bg-card border border-border"
    >
      <div className="absolute top-0 left-0 right-0 h-1 bg-[oklch(0.72_0.12_40)]" />
      <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 text-primary mb-4 mt-2">
        {stat.icon}
      </div>
      <motion.div initial={false} animate={reducedMotion || visible ? { opacity: 1, x: 0 } : { opacity: 0, x: -18 }} transition={{ duration: 0.4, delay: index * 0.13 + 0.23, ease: "easeOut" }}>
        <p className="font-serif text-3xl lg:text-4xl font-bold text-[oklch(0.72_0.12_40)] mb-1">
          {stat.number}
        </p>
        <p className="text-sm text-muted-foreground">{stat.label}</p>
      </motion.div>
    </motion.div>
  );
}

function SequentialReveal({ children, index, resetKey, className = "" }: { children: ReactNode; index: number; resetKey: number; className?: string }) {
  const reducedMotion = useReducedMotion();
  const { ref, visible } = useRevealTrigger(resetKey);

  return (
    <motion.div ref={ref} className={className} initial={false} animate={reducedMotion || visible ? { opacity: 1, x: 0 } : { opacity: 0, x: -60 }} transition={{ duration: 0.4, delay: (index % 3) * 0.12, ease: "easeOut" }}>
      <motion.div className="h-full" initial={false} animate={reducedMotion || visible ? { opacity: 1 } : { opacity: 0 }} transition={{ duration: 0.4, delay: (index % 3) * 0.12 + 0.22 }}>
        {children}
      </motion.div>
    </motion.div>
  );
}

function RevealText({ children, className = "", resetKey, delay = 0 }: { children: ReactNode; className?: string; resetKey: number; delay?: number }) {
  const reducedMotion = useReducedMotion();
  const { ref, visible } = useRevealTrigger(resetKey);
  return (
    <motion.div
      ref={ref}
      className={className}
      initial={false}
      animate={reducedMotion || visible ? { opacity: 1, x: 0 } : { opacity: 0, x: -45 }}
      transition={{ duration: 0.5, delay, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
}

export default function Home() {
  const reducedMotion = useReducedMotion();
  const [revealCycle, setRevealCycle] = useState(0);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const resetAtTopRef = useRef(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const autoPlayRef = useRef<ReturnType<typeof setInterval> | null>(null);
  // Swipe state for carousel
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);
  const SWIPE_THRESHOLD = 50;

  useEffect(() => {
    const onScroll = () => {
      setShowBackToTop(window.scrollY > 500);
      if (resetAtTopRef.current && window.scrollY <= 20) {
        resetAtTopRef.current = false;
        setRevealCycle((cycle) => cycle + 1);
      }
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const backToTop = () => {
    resetAtTopRef.current = true;
    window.scrollTo({ top: 0, behavior: reducedMotion ? "auto" : "smooth" });
  };

  useEffect(() => {
    if (isAutoPlaying) {
      autoPlayRef.current = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % carouselImages.length);
      }, 5000);
    }
    return () => { if (autoPlayRef.current) clearInterval(autoPlayRef.current); };
  }, [isAutoPlaying]);

  const goTo = useCallback((idx: number) => {
    setCurrentSlide(idx);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 10000);
  }, []);

  const prev = useCallback(() => goTo((currentSlide - 1 + carouselImages.length) % carouselImages.length), [currentSlide, goTo]);
  const next = useCallback(() => goTo((currentSlide + 1) % carouselImages.length), [currentSlide, goTo]);

  // Touch handlers for swipe
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.targetTouches[0].clientX;
  };
  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.targetTouches[0].clientX;
  };
  const handleTouchEnd = () => {
    const diff = touchStartX.current - touchEndX.current;
    if (Math.abs(diff) > SWIPE_THRESHOLD) {
      if (diff > 0) next();
      else prev();
    }
  };

  return (
    <div className="min-h-screen">
      <Header />

      {/* ===== HERO CAROUSEL ===== */}
      <section className="relative h-[85vh] min-h-[500px] overflow-hidden pt-36 lg:pt-44" onTouchStart={handleTouchStart} onTouchMove={handleTouchMove} onTouchEnd={handleTouchEnd}>
        <div key={currentSlide} className="absolute inset-0 animate-in fade-in duration-700">
          <img
            src={carouselImages[currentSlide].src}
            alt={carouselImages[currentSlide].alt}
            className="page-hero-image"
            loading="eager"
            decoding="async"
            fetchPriority="high"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/40 to-black/35" />
        </div>

        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center">
          <div className="container">
            <motion.div
              key={currentSlide}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
              className="max-w-2xl lg:max-w-none mx-auto text-center"
            >
              <h1 className="font-serif text-4xl md:text-5xl lg:text-[clamp(2rem,3.5vw,3.75rem)] lg:whitespace-nowrap font-bold text-white mb-4 leading-tight">
                {carouselImages[currentSlide].caption === "As cores do outono transformam os caminhos do bairro" ? (
                  <>
                    As cores do outono transformam<span className="lg:hidden"> </span>
                    <br className="hidden lg:block" />
                    os caminhos do bairro
                  </>
                ) : carouselImages[currentSlide].caption}
              </h1>
            </motion.div>
          </div>
        </div>

        {/* Controls - hidden on mobile, visible on desktop */}
        <button onClick={prev} className="hidden lg:flex absolute left-4 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm text-white items-center justify-center hover:bg-white/30 transition-colors" aria-label="Anterior">
          <ChevronLeft className="w-6 h-6" />
        </button>
        <button onClick={next} className="hidden lg:flex absolute right-4 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm text-white items-center justify-center hover:bg-white/30 transition-colors" aria-label="Próximo">
          <ChevronRight className="w-6 h-6" />
        </button>

        {/* Dots + Mobile nav arrows */}
        <div className="absolute bottom-4 lg:bottom-6 left-1/2 -translate-x-1/2 z-20 flex items-center gap-3">
          <button onClick={prev} className="lg:hidden w-9 h-9 rounded-full bg-white/20 backdrop-blur-sm text-white flex items-center justify-center hover:bg-white/30 transition-colors" aria-label="Anterior">
            <ChevronLeft className="w-5 h-5" />
          </button>
          <div className="flex gap-2">
            {carouselImages.map((_, i) => (
              <button
                key={i}
                onClick={() => goTo(i)}
                className={`h-2 rounded-full transition-all ${
                  i === currentSlide ? "bg-white w-8" : "bg-white/50 w-2"
                }`}
                aria-label={`Slide ${i + 1}`}
              />
            ))}
          </div>
          <button onClick={next} className="lg:hidden w-9 h-9 rounded-full bg-white/20 backdrop-blur-sm text-white flex items-center justify-center hover:bg-white/30 transition-colors" aria-label="Próximo">
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </section>

      <WaveDivider color="oklch(0.97 0.015 80)" />

      {/* ===== ESTATÍSTICAS ===== */}
      <section className="py-10 lg:py-12 bg-background">
        <div>
          <div className="container">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
              {stats.map((stat, i) => (
                <StatRevealCard key={stat.label} stat={stat} index={i} resetKey={revealCycle} />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ===== ACESSO RÁPIDO ===== */}
      <section className="pt-10 pb-14 lg:pt-12 lg:pb-16 relative">
        {/* Subtle topographic pattern background */}
        <div className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 5 Q50 15 55 35 Q50 55 30 50 Q10 55 5 35 Q10 15 30 5Z' fill='none' stroke='oklch(0.45 0.08 160)' stroke-width='0.5'/%3E%3C/svg%3E")`,
            backgroundSize: "120px 120px",
          }}
        />
        <div className="container relative z-10">
          <RevealText resetKey={revealCycle} className="text-center mb-8">
            <p className="text-[oklch(0.72_0.12_40)] font-medium text-sm uppercase tracking-[0.2em] mb-2">
              Navegação Rápida
            </p>
            <h2 className="font-serif text-3xl lg:text-4xl font-bold text-foreground">
              Tudo que você precisa em um só lugar
            </h2>
          </RevealText>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {quickLinks.map((link, i) => (
              <SequentialReveal key={link.href} index={i} resetKey={revealCycle}>
                <Link
                  href={link.href}
                  className="group flex items-start gap-4 p-5 rounded-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-lg bg-card border border-border"
                >
                  <div className="shrink-0 w-12 h-12 rounded-lg bg-primary/10 text-primary flex items-center justify-center group-hover:bg-[oklch(0.72_0.12_40)] group-hover:text-white transition-colors">
                    {link.icon}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-serif text-base font-semibold text-foreground group-hover:text-primary transition-colors">
                      {link.label}
                    </h3>
                    <p className="text-sm text-muted-foreground mt-1">{link.desc}</p>
                  </div>
                  <ArrowRight className="w-4 h-4 text-muted-foreground ml-auto mt-1 opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0 group-hover:text-[oklch(0.72_0.12_40)]" />
                </Link>
              </SequentialReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ===== CATEGORIAS DE SERVIÇOS ===== */}
      <section className="pt-14 pb-10 lg:pt-16 lg:pb-12 bg-secondary">
        <div className="container">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-8 gap-4">
            <RevealText resetKey={revealCycle}>
              <p className="text-[oklch(0.72_0.12_40)] font-medium text-sm uppercase tracking-[0.2em] mb-2">
                Mapa de Serviços
              </p>
              <h2 className="font-serif text-3xl lg:text-4xl font-bold text-foreground">
                Encontre o que precisa no bairro
              </h2>
            </RevealText>
            <RevealText resetKey={revealCycle} delay={0.12}>
            <Link
              href="/servicos"
              className="inline-flex items-center gap-2 text-[oklch(0.72_0.12_40)] font-medium hover:gap-3 transition-all"
            >
              Ver todos os serviços <ArrowRight className="w-4 h-4" />
            </Link>
            </RevealText>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {serviceCategories.map((cat, i) => (
              <SequentialReveal key={cat.label} index={i} resetKey={revealCycle}>
                <Link
                  href="/servicos"
                  className="flex flex-col items-center gap-3 p-5 rounded-xl transition-all group bg-card border border-border"
                >
                  <div className="w-14 h-14 rounded-full bg-primary/10 text-primary flex items-center justify-center group-hover:bg-[oklch(0.72_0.12_40)] group-hover:text-white transition-colors">
                    {cat.icon}
                  </div>
                  <span className="font-medium text-sm text-center text-foreground">{cat.label}</span>
                  <span className="text-xs text-muted-foreground">{cat.count} locais</span>
                </Link>
              </SequentialReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ===== COMO FUNCIONA ===== */}
      <section className="py-10 lg:py-12 bg-background">
        <div className="container">
          <RevealText resetKey={revealCycle} className="text-center mb-8">
            <p className="text-[oklch(0.72_0.12_40)] font-medium text-sm uppercase tracking-[0.2em] mb-2">
              Como Funciona
            </p>
            <h2 className="font-serif text-3xl lg:text-4xl font-bold text-foreground">
              Participe da comunidade em 3 passos
            </h2>
          </RevealText>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12 max-w-4xl mx-auto">
            {[
              {
                step: "01",
                title: "Explore",
                desc: "Navegue pelo mapa de serviços, comércio local e eventos do bairro.",
              },
              {
                step: "02",
                title: "Contribua",
                desc: "Faça denúncias, sugestões ou divulgue seu comércio na plataforma.",
              },
              {
                step: "03",
                title: "Conecte-se",
                desc: "Interaja com vizinhos, avalie serviços e fique por dentro das novidades.",
              },
            ].map((item, i) => (
              <SequentialReveal key={item.step} index={i} resetKey={revealCycle} className="relative text-center">
                <div className="w-16 h-16 rounded-full bg-[oklch(0.72_0.12_40)] text-white font-serif text-2xl font-bold flex items-center justify-center mx-auto mb-5 shadow-lg shadow-[oklch(0.72_0.12_40)]/25">
                  {item.step}
                </div>
                <h3 className="font-serif text-xl font-semibold text-foreground mb-2">
                  {item.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
                {i < 2 && (
                  <div className="hidden md:block absolute top-8 left-[calc(50%+40px)] w-[calc(100%-80px)] h-0.5 bg-primary/20" />
                )}
              </SequentialReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ===== GALERIA / FOTOS ===== */}
      <section className="py-10 lg:py-12 bg-secondary">
        <div className="container">
          <RevealText resetKey={revealCycle} className="text-center mb-8">
            <p className="text-[oklch(0.72_0.12_40)] font-medium text-sm uppercase tracking-[0.2em] mb-2">
              Galeria
            </p>
            <h2 className="font-serif text-3xl lg:text-4xl font-bold text-foreground">
              O Campo Comprido em imagens
            </h2>
          </RevealText>

          {/* Featured photo strip */}
          <div className="grid grid-cols-3 gap-3 max-w-4xl mx-auto">
            {carouselImages.slice(0, 3).map((img, i) => (
              <SequentialReveal
                key={i}
                index={i}
                resetKey={revealCycle}
                className="relative rounded-xl overflow-hidden aspect-[4/3] group"
              >
                <img
                  src={img.src}
                  alt={img.alt}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <p className="absolute bottom-3 left-3 text-white text-sm opacity-0 group-hover:opacity-100 transition-opacity">{img.caption}</p>
              </SequentialReveal>
            ))}
          </div>
          <RevealText resetKey={revealCycle} className="text-center mt-6">
            <Link
              href="/galeria"
              className="inline-flex items-center gap-2 text-[oklch(0.72_0.12_40)] font-medium hover:gap-3 transition-all"
            >
              Ver galeria completa <ArrowRight className="w-4 h-4" />
            </Link>
          </RevealText>
        </div>
      </section>

      {/* ===== DEPOIMENTOS ===== */}
      <section className="py-10 lg:py-12 bg-background relative">
        <div className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 5 Q50 15 55 35 Q50 55 30 50 Q10 55 5 35 Q10 15 30 5Z' fill='none' stroke='oklch(0.45 0.08 160)' stroke-width='0.5'/%3E%3C/svg%3E")`,
            backgroundSize: "120px 120px",
          }}
        />
        <div className="container relative z-10">
          <RevealText resetKey={revealCycle} className="text-center mb-8">
            <p className="text-[oklch(0.72_0.12_40)] font-medium text-sm uppercase tracking-[0.2em] mb-2">
              Vozes da Comunidade
            </p>
            <h2 className="font-serif text-3xl lg:text-4xl font-bold text-foreground">
              O que dizem os moradores
            </h2>
          </RevealText>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {[
              {
                name: "Maria Silva",
                role: "Moradora há 12 anos",
                text: "O Campo Comprido é um bairro que une o melhor dos dois mundos: a tranquilidade da natureza com a praticidade da cidade. O Parque Barigui é o nosso quintal e isso faz toda a diferença.",
              },
              {
                name: "João Pereira",
                role: "Comerciante local",
                text: "Desde que a plataforma foi criada, meu pequeno negócio ganhou mais visibilidade. Os vizinhos agora me encontram facilmente e a comunidade se fortaleceu muito.",
              },
              {
                name: "Ana Costa",
                role: "Moradora e voluntária",
                text: "Participar das ações da comunidade me fez conhecer vizinhos que agora são amigos. O bairro tem uma energia especial e a plataforma ajuda a manter essa conexão.",
              },
            ].map((dep, i) => (
              <SequentialReveal key={dep.name} index={i} resetKey={revealCycle} className="p-6 rounded-xl relative bg-card border border-border">
                <Quote className="w-8 h-8 text-[oklch(0.72_0.12_40)]/30 mb-3" />
                <p className="text-sm text-foreground/80 leading-relaxed mb-4 italic">
                  "{dep.text}"
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <span className="font-serif text-sm font-bold text-primary">{dep.name.charAt(0)}</span>
                  </div>
                  <div>
                    <p className="font-serif text-sm font-semibold text-foreground">{dep.name}</p>
                    <p className="text-xs text-muted-foreground">{dep.role}</p>
                  </div>
                </div>
              </SequentialReveal>
            ))}
          </div>
        </div>
      </section>

      <WaveDivider color="oklch(0.72 0.12 40)" />

      {/* ===== CHAMADA PARA AÇÃO ===== */}
      <section className="py-12 lg:py-16 bg-[oklch(0.72_0.12_40)] relative overflow-hidden">
        <div className="absolute inset-0 opacity-15">
          <div className="absolute top-10 left-10 w-64 h-64 rounded-full bg-white/20 blur-3xl" />
          <div className="absolute bottom-10 right-10 w-96 h-96 rounded-full bg-white/10 blur-3xl" />
          {/* Subtle organic pattern */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-white/5" />
        </div>
        <div className="container relative z-10 text-center">
          <RevealText resetKey={revealCycle}>
          <h2 className="font-serif text-3xl lg:text-5xl font-bold text-white mb-4">
            Conectando a Comunidade.
          </h2>
          </RevealText>
          <RevealText resetKey={revealCycle} delay={0.1}>
          <p className="text-white/80 text-lg mb-8 max-w-xl mx-auto">
            Somos o Campo Comprido. Cada voz conta na construção de um bairro melhor.
          </p>
          </RevealText>
          <RevealText resetKey={revealCycle} delay={0.2}>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/denuncias"
              className="inline-flex items-center gap-2 bg-white text-[oklch(0.72_0.12_40)] px-8 py-3 rounded-lg font-semibold hover:bg-white/90 transition-all hover:scale-[1.02] active:scale-[0.97] shadow-lg"
            >
              <HandHeart className="w-5 h-5" /> Quero Participar
            </Link>
            <Link
              href="/sobre"
              className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-sm text-white px-8 py-3 rounded-lg font-medium hover:bg-white/25 transition-all"
            >
              Conheça o Projeto
            </Link>
          </div>
          </RevealText>
        </div>
      </section>

      <Footer />
      {showBackToTop && (
        <button
          type="button"
          onClick={backToTop}
          className="fixed bottom-6 right-6 z-50 inline-flex items-center gap-2 rounded-full bg-[oklch(0.72_0.12_40)] px-4 py-3 text-sm font-semibold text-white shadow-lg transition-colors hover:bg-[oklch(0.65_0.12_40)]"
          aria-label="Voltar ao topo"
        >
          <ArrowUp className="h-5 w-5" />
          <span className="hidden sm:inline">Voltar ao topo</span>
        </button>
      )}
    </div>
  );
}
