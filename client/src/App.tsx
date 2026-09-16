import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch, useLocation } from "wouter";
import { useEffect } from "react";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import Servicos from "./pages/Servicos";
import Comercio from "./pages/Comercio";
import Eventos from "./pages/Eventos";
import Denuncias from "./pages/Denuncias";
import Sugestoes from "./pages/Sugestoes";
import Noticias from "./pages/Noticias";
import Telefones from "./pages/Telefones";
import Faq from "./pages/Faq";
import Sobre from "./pages/Sobre";
import Galeria from "./pages/Galeria";
import Mural from "./pages/Mural";
import Mapa from "./pages/Mapa";
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";


function ScrollToTop() {
  const [location] = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [location]);
  return null;
}
function Router() {
  // make sure to consider if you need authentication for certain routes
  return (
    <>
      <ScrollToTop />
      <Switch>
      <Route path={"/"} component={Home} />
      <Route path={"/servicos"} component={Servicos} />
      <Route path={"/comercio"} component={Comercio} />
      <Route path={"/eventos"} component={Eventos} />
      <Route path={"/denuncias"} component={Denuncias} />
      <Route path={"/sugestoes"} component={Sugestoes} />
      <Route path={"/noticias"} component={Noticias} />
      <Route path={"/telefones"} component={Telefones} />
      <Route path={"/faq"} component={Faq} />
      <Route path={"/sobre"} component={Sobre} />
      <Route path={"/galeria"} component={Galeria} />
      <Route path={"/mural"} component={Mural} />
      <Route path={"/mapa"} component={Mapa} />
      <Route path={"/admin"} component={AdminLogin} />
      <Route path={"/admin/dashboard"} component={AdminDashboard} />
      <Route path={"/404"} component={NotFound} />
      {/* Final fallback route */}
      <Route component={NotFound} />
    </Switch>
    </>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light" switchable>
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
