/*
 * Design: Terra Viva — Login Admin
 * Tela de login para acesso ao painel administrativo
 */
import { useState } from "react";
import { useLocation } from "wouter";
import { Eye, EyeOff, Lock, Shield, AlertCircle } from "lucide-react";
import { toast } from "sonner";

export default function AdminLogin() {
  const [, navigate] = useLocation();
  const [admin, setAdmin] = useState("");
  const [senha, setSenha] = useState("");
  const [showSenha, setShowSenha] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    setTimeout(() => {
      if (admin.trim() === "admin" && senha.trim() === "admin123") {
        sessionStorage.setItem("admin_logged_in", "true");
        toast.success("Bem-vindo ao painel administrativo!");
        navigate("/admin/dashboard");
      } else {
        toast.error("Credenciais inválidas. Tente novamente.");
      }
      setLoading(false);
    }, 800);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background dark:bg-[oklch(0.18_0.02_160)] px-4">
      <div className="w-full max-w-md">
        {/* Logo area */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-[oklch(0.25_0.02_160)] flex items-center justify-center mx-auto mb-4 shadow-lg">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <h1 className="font-serif text-3xl font-bold text-foreground">
            Painel Administrativo
          </h1>
          <p className="text-muted-foreground mt-2">
            Conectando a Comunidade — Campo Comprido
          </p>
        </div>

        {/* Login form */}
        <div
          className="rounded-xl p-6 shadow-lg bg-card border border-border dark:bg-[oklch(0.22_0.02_160)]"
        >
          <form onSubmit={handleLogin} className="space-y-4">
            {/* Admin field */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">
                Admin
              </label>
              <input
                type="text"
                value={admin}
                onChange={(e) => setAdmin(e.target.value)}
                placeholder="Digite seu login de administrador"
                className="w-full px-4 py-3 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground dark:bg-[oklch(0.28_0.02_160)] dark:border-[oklch(0.32_0.02_160)] dark:placeholder:text-[oklch(0.70_0.02_80)] focus:outline-none focus:ring-2 focus:ring-[oklch(0.72_0.12_40)]/50 transition-all"
                required
              />
            </div>

            {/* Senha field */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">
                Senha
              </label>
              <div className="relative">
                <input
                  type={showSenha ? "text" : "password"}
                  value={senha}
                  onChange={(e) => setSenha(e.target.value)}
                  placeholder="Digite sua senha"
                  className="w-full px-4 py-3 pr-11 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-[oklch(0.72_0.12_40)]/50 transition-all"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowSenha(!showSenha)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showSenha ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Error hint */}
            <div className="flex items-start gap-2 text-xs text-muted-foreground dark:text-[oklch(0.70_0.02_80)] bg-muted/50 dark:bg-[oklch(0.28_0.02_160)] rounded-lg p-3">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>
                Acesso restrito a administradores autorizados. Todos os acessos são registrados.
              </span>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-lg bg-[oklch(0.72_0.12_40)] text-white font-semibold hover:bg-[oklch(0.65_0.12_40)] transition-all disabled:opacity-60 shadow-md"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Verificando...
                </span>
              ) : (
                "Entrar no Painel"
              )}
            </button>
          </form>
        </div>

        {/* Back link */}
        <p className="text-center mt-6">
          <button
            onClick={() => navigate("/")}
            className="text-sm text-muted-foreground hover:text-primary transition-colors"
          >
            ← Voltar para o site
          </button>
        </p>
      </div>
    </div>
  );
}
