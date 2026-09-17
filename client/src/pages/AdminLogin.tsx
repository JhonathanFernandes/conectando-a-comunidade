import { useEffect } from "react";
import { useLocation } from "wouter";
import { Shield } from "lucide-react";
import { useAuth } from "@/_core/hooks/useAuth";
import { startLogin } from "@/const";

export default function AdminLogin() {
  const [, navigate] = useLocation();
  const { user, loading } = useAuth();
  const authConfigured = Boolean(import.meta.env.VITE_APP_ID && import.meta.env.VITE_OAUTH_PORTAL_URL);

  useEffect(() => {
    if (user?.role === "admin") navigate("/admin/dashboard");
  }, [user, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="w-full max-w-md rounded-xl border border-border bg-card p-8 text-center shadow-lg">
        <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-[oklch(0.25_0.02_160)]">
          <Shield className="h-8 w-8 text-white" />
        </div>
        <h1 className="font-serif text-3xl font-bold text-foreground">Painel Administrativo</h1>
        <p className="mt-2 text-muted-foreground">Conectando a Comunidade — Campo Comprido</p>
        {loading ? (
          <p className="mt-8 text-sm text-muted-foreground">Verificando acesso...</p>
        ) : user && user.role !== "admin" ? (
          <p className="mt-8 text-sm text-destructive">Esta conta não tem permissão de administração.</p>
        ) : authConfigured ? (
          <button onClick={startLogin} className="mt-8 rounded-lg bg-primary px-6 py-3 font-medium text-primary-foreground hover:opacity-90">
            Entrar com conta autorizada
          </button>
        ) : (
          <p className="mt-8 text-sm text-muted-foreground">O painel requer o servidor e a autenticação configurados.</p>
        )}
        <button onClick={() => navigate("/")} className="mt-5 block w-full text-sm text-primary hover:underline">Voltar ao início</button>
      </div>
    </div>
  );
}
