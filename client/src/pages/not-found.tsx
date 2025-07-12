import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Home, Search, AlertTriangle, ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-gradient-to-b from-indigo-50 to-white">
      <div className="container px-4 py-16 text-center">
        {/* Número 404 estilizado */}
        <div className="relative mx-auto mb-8 w-48 h-48 flex items-center justify-center">
          <span className="absolute text-[180px] font-bold text-indigo-100">
            404
          </span>
          <AlertTriangle className="relative z-10 h-24 w-24 text-indigo-500" />
        </div>
        
        <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
          Página no encontrada
        </h1>
        
        <p className="text-xl text-gray-600 max-w-lg mx-auto mb-8">
          Lo sentimos, la página que estás buscando no existe o ha sido movida a otra ubicación.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild size="lg" className="gap-2">
            <Link to="/">
              <Home className="h-5 w-5" />
              <span>Volver al inicio</span>
            </Link>
          </Button>
          
          <Button asChild variant="outline" size="lg" className="gap-2">
            <Link to="/consulta">
              <Search className="h-5 w-5" />
              <span>Contactar con soporte</span>
            </Link>
          </Button>
        </div>
        
        <div className="mt-20">
          <Button asChild variant="ghost" className="gap-2">
            <Link to="javascript:history.back()">
              <ArrowLeft className="h-4 w-4" />
              <span>Volver a la página anterior</span>
            </Link>
          </Button>
        </div>
        
        {/* Recursos sugeridos */}
        <div className="mt-16 grid gap-4 text-left max-w-2xl mx-auto">
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Tal vez estás buscando:</h2>
          <ul className="grid gap-2">
            <li>
              <Link to="/corporativos" className="text-indigo-600 hover:text-indigo-800 hover:underline">
                Soluciones corporativas
              </Link>
            </li>
            <li>
              <Link to="/ecommerce" className="text-indigo-600 hover:text-indigo-800 hover:underline">
                Soluciones eCommerce
              </Link>
            </li>
            <li>
              <Link to="/recursos" className="text-indigo-600 hover:text-indigo-800 hover:underline">
                Recursos y descargas
              </Link>
            </li>
            <li>
              <Link to="/blog" className="text-indigo-600 hover:text-indigo-800 hover:underline">
                Blog y artículos
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
