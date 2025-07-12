import { createRoot } from "react-dom/client";
import { BrowserRouter, useLocation } from "react-router-dom";
import { useEffect } from "react";
import App from "./App";
import "./index.css";

// Componente para restaurar la posición de desplazamiento al inicio
function ScrollToTop() {
  const { pathname, search } = useLocation();
  
  useEffect(() => {
    console.log("ScrollToTop: pathname =", pathname, "search =", search);
    
    // Si estamos en la página principal con un parámetro de sección, no hacemos nada
    // porque el componente Home se encargará del desplazamiento
    if (pathname === '/' && search.includes('section=')) {
      console.log("En Home con parámetro de sección, omitiendo ScrollToTop");
      return;
    }
    
    // Si no, hacemos scroll al inicio de la página
    console.log("Haciendo scroll al inicio");
    
    // Hace scroll al inicio de la página
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'instant' // Asegura que el scroll sea instantáneo
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
  <BrowserRouter>
    <AppWithScrollReset />
  </BrowserRouter>
);
