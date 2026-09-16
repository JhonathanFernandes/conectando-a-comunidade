/*
 * Design: Terra Viva — Organic Warmth
 * Header com navegação simplificada (6 itens + Admin), dark mode fixo
 */
import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { Menu, X, MapPin, Calendar, AlertTriangle, Newspaper, Phone, Shield, Sun, Moon, Users, MessageCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "@/contexts/ThemeContext";

const navLinks = [
  { href: "/", label: "Início", icon: null },
  { href: "/servicos", label: "Serviços", icon: <MapPin className="w-4 h-4" /> },
  { href: "/comercio", label: "Comércio", icon: <Users className="w-4 h-4" /> },
  { href: "/eventos", label: "Eventos", icon: <Calendar className="w-4 h-4" /> },
  { href: "/denuncias", label: "Denúncias", icon: <AlertTriangle className="w-4 h-4" /> },
  { href: "/noticias", label: "Notícias", icon: <Newspaper className="w-4 h-4" /> },
  { href: "/telefones", label: "Telefones", icon: <Phone className="w-4 h-4" /> },
  { href: "/sugestoes", label: "Sugestões", icon: <Users className="w-4 h-4" /> },
  { href: "/mural", label: "Mural", icon: <MessageCircle className="w-4 h-4" /> },
];

export default function Header() {
  const [location] = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();

  return (
    <>
      <header
        className="fixed top-0 left-0 right-0 z-50 bg-[oklch(0.97_0.015_80)] dark:bg-[oklch(0.18_0.02_160)]/95 backdrop-blur-xl shadow-md"
      >
        <div className="container flex items-center justify-between h-16 lg:h-20">
          {/* Logo — texto em linha única */}
          <Link href="/" className="flex items-center group shrink-0">
            <span className="font-mono text-base font-bold tracking-[0.15em] uppercase whitespace-nowrap text-foreground">
              Conectando a Comunidade
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-0 flex-wrap justify-end">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`px-2.5 py-1.5 rounded-lg text-[13px] font-medium transition-all duration-200 whitespace-nowrap ${
                  location === link.href
                    ? "bg-[oklch(0.72_0.12_40)] text-white shadow-md"
                    : "text-foreground hover:bg-primary/10"
                }`}
              >
                {link.label}
              </Link>
            ))}
            {/* Admin link */}
            <Link
              href="/admin"
              className="ml-1 px-2.5 py-1.5 rounded-lg text-[13px] font-medium transition-all duration-200 flex items-center gap-1 whitespace-nowrap bg-[oklch(0.25_0.02_160)] text-white hover:bg-[oklch(0.30_0.02_160)]"
            >
              <Shield className="w-3.5 h-3.5" />
              Admin
            </Link>
            {/* Theme toggle */}
            <button
              onClick={toggleTheme}
              className="ml-1.5 p-1.5 rounded-lg transition-all duration-200 text-foreground hover:bg-primary/10"
              aria-label={theme === "dark" ? "Ativar modo claro" : "Ativar modo escuro"}
            >
              {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
          </nav>

          {/* Mobile toggle */}
          <button
            onClick={() => setMobileOpen(true)}
            className="lg:hidden p-2 rounded-lg text-foreground"
            aria-label="Abrir menu"
          >
            <Menu className="w-6 h-6" />
          </button>
        </div>
      </header>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-black/50 z-50"
              onClick={() => setMobileOpen(false)}
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="fixed top-0 right-0 bottom-0 w-80 max-w-[85vw] bg-background z-50 shadow-2xl"
            >
              <div className="flex items-center justify-between p-4 border-b border-border">
                <span className="font-serif text-lg font-bold text-foreground">Menu</span>
                <button
                  onClick={() => setMobileOpen(false)}
                  className="p-2 rounded-lg hover:bg-muted"
                  aria-label="Fechar menu"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <nav className="p-4 space-y-1">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                      location === link.href
                        ? "bg-[oklch(0.72_0.12_40)] text-white"
                        : "text-foreground hover:bg-muted"
                    }`}
                  >
                    {link.icon}
                    {link.label}
                  </Link>
                ))}
                {/* Theme toggle */}
                <button
                  onClick={toggleTheme}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors text-foreground hover:bg-muted"
                >
                  {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                  {theme === "dark" ? "Modo Claro" : "Modo Escuro"}
                </button>
                <div className="my-3 border-t border-border" />
                <Link
                  href="/admin"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors bg-[oklch(0.25_0.02_160)] text-white hover:bg-[oklch(0.30_0.02_160)]"
                >
                  <Shield className="w-4 h-4" />
                  Admin
                </Link>
              </nav>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
