import { photoUrl } from "@/data/photos";
/*
 * Design: Terra Viva — Mural da Comunidade
 * Área de mensagens/recados entre vizinhos do Campo Comprido
 */
import { useState, useRef, useEffect } from "react";
import { MessageCircle, Send, Heart, Clock, User, MapPin } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WaveDivider from "@/components/WaveDivider";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";

export default function Mural() {
  const [authorName, setAuthorName] = useState("");
  const [message, setMessage] = useState("");
  const [likes, setLikes] = useState<Record<number, boolean>>({});

  const { data: posts, isLoading, refetch } = trpc.mural.listApproved.useQuery();
  const addPostMutation = trpc.mural.add.useMutation({
    onSuccess: () => {
      toast.success("Mensagem publicada para a comunidade.");
      setAuthorName("");
      setMessage("");
      refetch();
    },
    onError: () => toast.error("Erro ao publicar. Tente novamente."),
  });

  const handleLike = (postId: number) => {
    const wasLiked = likes[postId] ?? false;
    setLikes((prev) => ({ ...prev, [postId]: !wasLiked }));
    // Local-only visual feedback (likes persist in session)
  };

  const [lastSubmission, setLastSubmission] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!authorName.trim()) {
      toast.error("Digite seu nome");
      return;
    }
    if (!message.trim()) {
      toast.error("Escreva uma mensagem");
      return;
    }
    if (message.trim().length < 10) {
      toast.error("Mensagem muito curta. Escreva pelo menos 10 caracteres.");
      return;
    }
    addPostMutation.mutate(
      {
        authorName: authorName.trim(),
        message: message.trim(),
      },
      {
        onSuccess: () => {
          setLastSubmission(authorName.trim());
        },
      }
    );
  };

  const allPosts = posts || [];

  return (
    <div className="min-h-screen">
      <Header />

      {/* Hero */}
      <section className="pt-28 lg:pt-36 pb-12 min-h-[320px] lg:min-h-[360px] relative overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={photoUrl("Comunidade-novo.png")}
            alt="Mural da Comunidade do Campo Comprido"
            className="page-hero-image"
            loading="eager"
            decoding="async"
            fetchPriority="high"
          />
          <div className="absolute inset-0 bg-black/50" />
        </div>
        <div className="container relative z-10">
          <p className="text-white/70 font-medium text-sm uppercase tracking-[0.2em] mb-2">
            Mural da Comunidade
          </p>
          <h1 className="font-serif text-3xl lg:text-5xl font-bold text-white mb-4">
            Recados entre vizinhos
          </h1>
          <p className="text-white/80 text-lg max-w-2xl">
            Compartilhe avisos, dicas, elogios e novidades com a comunidade do Campo Comprido.
          </p>
        </div>
      </section>

      <WaveDivider color="oklch(0.25 0.02 150)" />

      <section className="py-10 lg:py-14 bg-background">
        <div className="container">
          {/* Post form */}
          <div className="bg-card border border-border rounded-2xl p-6 mb-8 shadow-lg">
            <div className="flex items-center gap-2 mb-4">
              <MessageCircle className="w-5 h-5 text-[oklch(0.72_0.12_40)]" />
              <h2 className="font-serif text-xl font-bold text-foreground">Publicar no Mural</h2>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="text"
                placeholder="Seu nome"
                value={authorName}
                onChange={(e) => setAuthorName(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-[oklch(0.72_0.12_40)]/50"
              />
              <textarea
                placeholder="Escreva sua mensagem para a comunidade (mín. 10 caracteres)..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={4}
                className="w-full px-4 py-3 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-[oklch(0.72_0.12_40)]/50 resize-none"
              />
              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={addPostMutation.isPending}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-[oklch(0.72_0.12_40)] text-white hover:bg-[oklch(0.65_0.12_40)] transition-colors shadow-md text-sm font-medium disabled:opacity-50"
                >
                  <Send className="w-4 h-4" />
                  {addPostMutation.isPending ? "Publicando..." : "Publicar no Mural"}
                </button>
              </div>
            </form>
          </div>

          {/* Posts */}
          <div className="space-y-4">
            <h2 className="font-serif text-2xl font-bold text-foreground mb-4">
              Mensagens da Comunidade
            </h2>

            {/* Pending approval notice */}
            {lastSubmission && (
              <div className="bg-[oklch(0.92_0.03_80)] dark:bg-[oklch(0.28_0.02_160)] border border-[oklch(0.72_0.12_40)]/30 rounded-xl p-4 mb-4 text-sm text-foreground">
                <MessageCircle className="w-4 h-4 inline mr-2 text-[oklch(0.72_0.12_40)]" />
                Sua mensagem está visível para a comunidade. Obrigado por participar, {lastSubmission}!
              </div>
            )}

            {isLoading ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="bg-card border border-border rounded-xl p-5 animate-pulse">
                    <div className="h-4 bg-muted rounded w-1/3 mb-3" />
                    <div className="h-3 bg-muted rounded w-full mb-2" />
                    <div className="h-3 bg-muted rounded w-2/3" />
                  </div>
                ))}
              </div>
            ) : allPosts.length === 0 ? (
              <div className="text-center py-12">
                <MessageCircle className="w-16 h-16 mx-auto text-muted-foreground/40 mb-4" />
                <h3 className="font-serif text-xl font-semibold text-foreground mb-2">Nenhuma mensagem publicada ainda</h3>
                <p className="text-muted-foreground max-w-md mx-auto">
                  Seja o primeiro vizinho a publicar no mural!
                </p>
              </div>
            ) : (
              <AnimatePresence>
                {allPosts.map((post) => (
                  <motion.div
                    key={post.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="bg-card border border-border rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-[oklch(0.72_0.12_40)]/20 flex items-center justify-center">
                          <User className="w-5 h-5 text-[oklch(0.72_0.12_40)]" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-foreground text-sm">{post.authorName}</h3>
                          <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <MapPin className="w-3 h-3" />
                            <span>Campo Comprido</span>
                            <span className="mx-1">•</span>
                            <Clock className="w-3 h-3" />
                            <span>{new Date(post.createdAt).toLocaleString("pt-BR", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" })}</span>
                          </div>
                        </div>
                      </div>

                      {/* Like button */}
                      <button
                        onClick={() => handleLike(post.id)}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm transition-all ${
                          likes[post.id]
                            ? "bg-red-500/10 text-red-500"
                            : "bg-muted/50 text-muted-foreground hover:bg-red-500/10 hover:text-red-500"
                        }`}
                      >
                        <Heart className={`w-4 h-4 ${likes[post.id] ? "fill-current" : ""}`} />
                        <span>{likes[post.id] ? "Curtido" : "Curtir"}</span>
                      </button>
                    </div>

                    <p className="text-foreground text-sm leading-relaxed pl-13">{post.message}</p>
                  </motion.div>
                ))}
              </AnimatePresence>
            )}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
