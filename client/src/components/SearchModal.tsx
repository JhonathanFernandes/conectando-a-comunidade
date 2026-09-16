/*
 * Design: Terra Viva — Modal de pesquisa inteligente
 */
import { useState } from "react";
import { Search, X, MapPin, Store, Calendar, AlertTriangle, Newspaper } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface SearchModalProps {
  open: boolean;
  onClose: () => void;
}

const searchCategories = [
  { icon: <MapPin className="w-5 h-5" />, label: "Serviços (hospitais, escolas, farmácias...)", href: "/servicos" },
  { icon: <Store className="w-5 h-5" />, label: "Comércio local", href: "/comercio" },
  { icon: <Calendar className="w-5 h-5" />, label: "Eventos da comunidade", href: "/eventos" },
  { icon: <AlertTriangle className="w-5 h-5" />, label: "Denúncias e sugestões", href: "/denuncias" },
  { icon: <Newspaper className="w-5 h-5" />, label: "Notícias do bairro", href: "/noticias" },
];

export default function SearchModal({ open, onClose }: SearchModalProps) {
  const [query, setQuery] = useState("");

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.2, ease: [0.23, 1, 0.32, 1] }}
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-xl z-50 mx-4"
          >
            <div className="bg-card rounded-xl shadow-2xl border border-border overflow-hidden">
              <div className="flex items-center gap-3 p-4 border-b border-border">
                <Search className="w-5 h-5 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Pesquisar serviços, eventos, comércios..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="flex-1 bg-transparent text-foreground text-lg outline-none placeholder:text-muted-foreground"
                  autoFocus
                />
                <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-muted" aria-label="Fechar">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="p-3">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider px-3 py-2">
                  Categorias
                </p>
                {searchCategories.map((cat, i) => (
                  <button
                    key={cat.href}
                    className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg hover:bg-muted transition-colors text-left"
                    style={{ animationDelay: `${i * 60}ms` }}
                  >
                    <span className="text-primary">{cat.icon}</span>
                    <span className="text-sm text-foreground">{cat.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
