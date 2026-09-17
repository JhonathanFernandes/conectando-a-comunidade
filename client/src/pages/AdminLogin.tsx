import { useEffect, useState, type FormEvent } from "react";
import { useLocation } from "wouter";
import { Eye, EyeOff, LockKeyhole, Shield } from "lucide-react";
import { useAuth } from "@/_core/hooks/useAuth";
import { startLogin } from "@/const";
import { trpc } from "@/lib/trpc";

function AuthenticatedAdminLogin() {
  const [, navigate] = useLocation();
  const { user } = useAuth();
  const utils = trpc.useUtils();
  const authConfigured = Boolean(import.meta.env.VITE_APP_ID && import.meta.env.VITE_OAUTH_PORTAL_URL);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const passwordLogin = trpc.auth.passwordLogin.useMutation({
    onSuccess: async () => {
      setPassword("");
      await utils.auth.me.invalidate();
      navigate("/admin/dashboard");
    },
    onError: (loginError) => {
      setPassword("");
      setError(loginError.message);
    },
  });

  useEffect(() => {
    if (user?.role === "admin") navigate("/admin/dashboard");
  }, [user, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="w-full max-w-md rounded-xl border border-border bg-card p-8 text-center shadow-lg">
        <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-[oklch(0.25_0.02_160)]">
          <Shield className="h-8 w-8 text-white" />
        </div>
        <h1 className="font-serif text-3xl font-bold text-foreground">Login de Administrador</h1>
        <p className="mt-2 text-muted-foreground">Conectando a Comunidade — Campo Comprido</p>
        <form onSubmit={(event) => { event.preventDefault(); setError(""); passwordLogin.mutate({ username, password }); }} className="mt-6 space-y-4 text-left">
            {user && user.role !== "admin" && <p className="text-sm text-destructive">A conta atual não é administradora. Entre com as credenciais de administração.</p>}
            <label className="block text-sm font-medium text-foreground">Usuário
              <input autoComplete="username" required value={username} onChange={(event) => setUsername(event.target.value)} className="mt-1.5 w-full rounded-lg border border-border bg-background px-4 py-3 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40" />
            </label>
            <label className="block text-sm font-medium text-foreground">Senha
              <input type="password" autoComplete="current-password" required value={password} onChange={(event) => setPassword(event.target.value)} className="mt-1.5 w-full rounded-lg border border-border bg-background px-4 py-3 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40" />
            </label>
            {error && <p role="alert" className="text-sm text-destructive">{error}</p>}
            <button type="submit" disabled={passwordLogin.isPending} className="w-full rounded-lg bg-primary px-6 py-3 font-medium text-primary-foreground hover:opacity-90 disabled:opacity-50">
              {passwordLogin.isPending ? "Verificando..." : "Entrar no painel"}
            </button>
            {authConfigured && <button type="button" onClick={startLogin} className="w-full rounded-lg border border-border px-6 py-3 font-medium text-foreground hover:bg-muted">Entrar com conta autorizada</button>}
        </form>
        <button onClick={() => navigate("/")} className="mt-5 block w-full text-sm text-primary hover:underline">Voltar ao início</button>
      </div>
    </div>
  );
}

export default function AdminLogin() {
  return import.meta.env.BASE_URL !== "/" ? <StaticAdminLogin /> : <AuthenticatedAdminLogin />;
}

function StaticAdminLogin() {
  const [, navigate] = useLocation();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(false);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(true);
    setPassword("");
  };

  return (
      <div className="min-h-screen flex items-center justify-center bg-background px-4">
        <div className="w-full max-w-md rounded-xl border border-border bg-card p-8 text-center shadow-lg">
          <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-[oklch(0.25_0.02_160)]">
            <Shield className="h-8 w-8 text-white" />
          </div>
          <h1 className="font-serif text-3xl font-bold text-foreground">Login de Administrador</h1>
          <p className="mt-2 text-muted-foreground">Conectando a Comunidade — Campo Comprido</p>
          <div className="mt-6 flex items-center justify-center gap-2 rounded-lg border border-border bg-muted/40 p-3 text-sm text-foreground">
            <LockKeyhole className="h-4 w-4 shrink-0 text-primary" /> Acesso restrito a contas autorizadas
          </div>
          <form onSubmit={handleSubmit} className="mt-6 space-y-4 text-left">
            <label className="block text-sm font-medium text-foreground">
              Usuário
              <input
                autoComplete="username"
                value={username}
                onChange={(event) => setUsername(event.target.value)}
                required
                className="mt-1.5 w-full rounded-lg border border-border bg-background px-4 py-3 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
              />
            </label>
            <label className="block text-sm font-medium text-foreground">
              Senha
              <span className="relative mt-1.5 block">
                <input
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  required
                  className="w-full rounded-lg border border-border bg-background px-4 py-3 pr-12 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </span>
            </label>
            <button type="submit" className="w-full rounded-lg bg-primary px-6 py-3 font-medium text-primary-foreground hover:opacity-90">
              Entrar no painel
            </button>
          </form>
          {error && <p role="alert" className="mt-4 text-sm text-destructive">O servidor de autenticação ainda não está conectado a este site.</p>}
          <p className="mt-4 text-sm text-muted-foreground">
            O acesso será liberado quando o servidor de autenticação estiver conectado ao site publicado.
          </p>
          <button onClick={() => navigate("/")} className="mt-5 block w-full text-sm text-primary hover:underline">Voltar ao início</button>
        </div>
      </div>
  );
}
