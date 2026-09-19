/*
 * Design: Terra Viva — Galeria de Fotos do Campo Comprido
 */
import { useState } from "react";
import { Tag, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WaveDivider from "@/components/WaveDivider";
import { neighborhoodPhotos, photoUrl } from "@/data/photos";

type Photo = {
  src: string;
  alt: string;
  caption: string;
  source?: string;
};

const photos: Photo[] = [
  ...neighborhoodPhotos,
  {
    src: photoUrl("opera-de-arame-nova.png"),
    alt: "Passarela e estrutura metálica da Ópera de Arame",
    caption: "A arquitetura singular da Ópera de Arame",
  },
  {
    src: photoUrl("parque-tangua-nova.png"),
    alt: "Lago, paredão e cascata do Parque Tanguá",
    caption: "Natureza e paisagem no Parque Tanguá",
  },
  {
    src: photoUrl("museu-do-olho-nova.png"),
    alt: "Museu Oscar Niemeyer em Curitiba",
    caption: "Arquitetura e cultura no Museu Oscar Niemeyer",
  },
];

export default function Galeria() {
  const [lightbox, setLightbox] = useState<Photo | null>(null);

  const openLightbox = (photo: Photo) => setLightbox(photo);
  const closeLightbox = () => setLightbox(null);

  return (
    <div className="min-h-screen">
      <Header />

      {/* Hero */}
      <section className="pt-28 lg:pt-36 pb-12 min-h-[320px] lg:min-h-[360px] relative overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={photoUrl("rua antonio-nova.png")}
            alt="Rua Antônio Macioski no Campo Comprido"
            className="page-hero-image"
            loading="eager"
            decoding="async"
            fetchPriority="high"
          />
          <div className="absolute inset-0 bg-black/55" />
        </div>
        <div className="container relative z-10">
          <p className="text-white/70 font-medium text-sm uppercase tracking-widest mb-2">
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
                key={photo.src}
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
              {lightbox.source && (
                <div className="flex items-center gap-2 text-white/70 text-sm mt-1">
                  <Tag className="w-3.5 h-3.5" />
                  <a href={lightbox.source} target="_blank" rel="noopener noreferrer" className="underline">Fonte e licença da foto</a>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <Footer />
    </div>
  );
}
