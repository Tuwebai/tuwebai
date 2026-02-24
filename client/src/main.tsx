import { createRoot } from "react-dom/client";
import { BrowserRouter, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { QueryClientProvider } from "@tanstack/react-query";
import App from "./App";
import { queryClient } from "@/lib/queryClient";
import { startWebVitalsTracking } from "@/lib/performance";
import "./index.css";

// Componente para restaurar la posición de desplazamiento al inicio
function ScrollToTop() {
  const { pathname, search } = useLocation();

  useEffect(() => {
    // Si estamos en la página principal con un parámetro de sección, no hacemos nada
    // porque el componente Home se encargará del desplazamiento
    if (pathname === "/" && search.includes("section=")) {
      return;
    }

    // Hace scroll al inicio de la página
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "instant", // Asegura que el scroll sea instantáneo
    });

    // Doble verificación con timeout para asegurar que funcione
    setTimeout(() => {
      window.scrollTo(0, 0);
    }, 100);
  }, [pathname, search]);

  return null;
}

// Componente contenedor para incluir ScrollToTop
function AppWithScrollReset() {
  return (
    <>
      <ScrollToTop />
      <App />
    </>
  );
}

createRoot(document.getElementById("root")!).render(
  <QueryClientProvider client={queryClient}>
    <BrowserRouter>
      <AppWithScrollReset />
    </BrowserRouter>
  </QueryClientProvider>,
);

startWebVitalsTracking();
