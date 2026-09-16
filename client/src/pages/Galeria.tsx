/*
 * Design: Terra Viva — Galeria de Fotos do Campo Comprido
 */
import { useState } from "react";
import { Tag, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WaveDivider from "@/components/WaveDivider";

interface Photo {
  id: number;
  src: string;
  alt: string;
  caption: string;
}

const photos: Photo[] = [
  { id: 1, src: "/manus-storage/campo-comprido-novo-1_8562e62a.jpg", alt: "Vista panorâmica", caption: "Vista panorâmica do Campo Comprido — bairro, prédios e verde" },
  { id: 2, src: "/manus-storage/parque-barigui-1_a184efe0.jpg", alt: "Parque Barigui", caption: "Parque Barigui — cartão postal ao lado do bairro" },
  { id: 3, src: "/manus-storage/brt-canal-bus_ea471771.jpg", alt: "Canaleta de ônibus com flores", caption: "Canaleta de ônibus no Campo Comprido com ipês em flor na primavera" },
  { id: 4, src: "/manus-storage/viaduto-orleans_754366df.jpg", alt: "Viaduto do Orleans", caption: "Viaduto do Orleans — ponto de referência do bairro" },
  { id: 5, src: "/manus-storage/teatro-positivo-1_5a7c58e2.jpg", alt: "Teatro Positivo", caption: "Teatro Positivo — palco de grandes espetáculos ao lado do bairro" },
  { id: 6, src: "/manus-storage/teatro-positivo-2_1cf99b5e.jpg", alt: "Teatro Positivo à noite", caption: "Teatro Positivo iluminado à noite" },
  { id: 7, src: "/manus-storage/corredor-ipes_ce61de2c.jpg", alt: "Corredor de ônibus com ipês", caption: "Corredor de ônibus cercado por ipês roxos em flor" },
  { id: 8, src: "/manus-storage/brt-corredor_17821a98.jpg", alt: "BRT canaleta", caption: "Estação do BRT no corredor de transporte do Campo Comprido" },
  { id: 9, src: "/manus-storage/viaduto-orleans_63d2e314.jpg", alt: "Viaduto do Orleans", caption: "Viaduto do Orleans — ponto de referência do bairro" },
  { id: 10, src: "/manus-storage/teatro-positivo-1_05da74ab.jpg", alt: "Teatro Positivo", caption: "Teatro Positivo — palco de grandes espetáculos ao lado do bairro" },
  { id: 11, src: "/manus-storage/corredor-ipes_e6474f5e.jpg", alt: "Corredor de ônibus com ipês", caption: "Corredor de ônibus cercado por ipês roxos em flor" },
  { id: 12, src: "/manus-storage/campo-comprido-aereo_9e4dd866.jpg", alt: "Residências", caption: "Vista aérea da região do Campo Comprido e Orleans" },
  { id: 13, src: "/manus-storage/viaduto-orleans-2_b8e6e47a.jpg", alt: "Viaduto Orleans", caption: "Viaduto do Orleans visto de outro ângulo" },
  { id: 14, src: "/manus-storage/teatro-positivo-3_c945d009.jpg", alt: "Teatro Positivo interior", caption: "Interior do Teatro Positivo" },
  { id: 15, src: "/manus-storage/brt-canal-bus_ea471771.jpg", alt: "BRT em operação", caption: "Ônibus BRT transitando pela canaleta exclusiva" },
  { id: 16, src: "/manus-storage/campo-comprido-aereo_4bb30e0b.jpg", alt: "Campo Comprido visto de cima", caption: "Vista aérea da região do Campo Comprido e Orleans" },
];

export default function Galeria() {
  const [lightbox, setLightbox] = useState<Photo | null>(null);

  const openLightbox = (photo: Photo) => setLightbox(photo);
  const closeLightbox = () => setLightbox(null);

  return (
    <div className="min-h-screen">
      <Header />

      {/* Hero */}
      <section className="pt-28 lg:pt-36 pb-12 bg-secondary">
        <div className="container">
          <p className="text-primary font-medium text-sm uppercase tracking-widest mb-2">
            Galeria
          </p>
          <h1 className="font-serif text-3xl lg:text-5xl font-bold text-foreground mb-4">
            O Campo Comprido em fotos
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl">
            Imagens que registram a beleza, os eventos e as transformações do nosso bairro.
          </p>
        </div>
      </section>

      <WaveDivider color="oklch(0.97 0.015 80)" />

      <section className="py-10 lg:py-14 bg-background">
        <div className="container">
          {/* Photo grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {photos.map((photo) => (
              <button
                key={photo.id}
                onClick={() => openLightbox(photo)}
                className="relative group overflow-hidden rounded-lg aspect-[4/3] cursor-pointer"
              >
                <img
                  src={photo.src}
                  alt={photo.alt}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="absolute bottom-0 left-0 right-0 p-3 translate-y-full group-hover:translate-y-0 transition-transform">
                  <p className="text-white text-sm font-medium">{photo.caption}</p>
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Lightbox */}
      <AnimatePresence>
        {lightbox && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
            onClick={closeLightbox}
          >
            <button
              onClick={closeLightbox}
              className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/10 text-white flex items-center justify-center hover:bg-white/20"
              aria-label="Fechar"
            >
              <X className="w-5 h-5" />
            </button>
            <img
              src={lightbox.src}
              alt={lightbox.alt}
              className="max-w-full max-h-[80vh] rounded-lg object-contain"
              onClick={(e) => e.stopPropagation()}
            />
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-center">
              <p className="text-white font-medium">{lightbox.caption}</p>
              <div className="flex items-center gap-2 text-white/70 text-sm mt-1">
                <Tag className="w-3.5 h-3.5" />
                <span>Galeria do Campo Comprido</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <Footer />
    </div>
  );
}
