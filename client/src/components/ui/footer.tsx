import { motion } from 'framer-motion';

export default function Footer() {
  return (
    <motion.footer 
      className="bg-[#0a0a0f] pt-12 pb-8 text-gray-400 text-sm border-t border-gray-800 relative z-10"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-8 mb-10">
          <div>
            <h3 className="text-white font-rajdhani font-bold text-lg mb-4">TuWeb.ai</h3>
            <p className="mb-4">Creando experiencias web inteligentes para marcas que buscan destacar en el entorno digital.</p>
          </div>
          
          <div>
            <h3 className="text-white font-rajdhani font-bold text-lg mb-4">Servicios</h3>
            <ul className="space-y-2">
              <li><a href="/servicios/consultoria-estrategica" className="hover:text-[#00CCFF] transition-colors">Consultoría Estratégica</a></li>
              <li><a href="/servicios/desarrollo-web" className="hover:text-[#00CCFF] transition-colors">Desarrollo Web</a></li>
              <li><a href="/servicios/posicionamiento-marketing" className="hover:text-[#00CCFF] transition-colors">Posicionamiento y Marketing</a></li>
              <li><a href="/servicios/automatizacion-marketing" className="hover:text-[#00CCFF] transition-colors">Automatización de Marketing</a></li>
              <li><a href="/contacto" className="hover:text-[#00CCFF] transition-colors">Contacto</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-white font-rajdhani font-bold text-lg mb-4">Enlaces rápidos</h3>
            <ul className="space-y-2">
              
              <li><a href="/faq" className="hover:text-[#9933FF] transition-colors">Preguntas Frecuentes</a></li>
              <li><a href="/equipo" className="hover:text-[#9933FF] transition-colors">Nuestro Equipo</a></li>
              <li><a href="/tecnologias" className="hover:text-[#9933FF] transition-colors">Tecnologías</a></li>
              <li><a href="/#testimonials" className="hover:text-[#9933FF] transition-colors">Testimonios</a></li>
              <li><a href="/contacto" className="hover:text-[#9933FF] transition-colors">Contacto</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-white font-rajdhani font-bold text-lg mb-4">Contacto</h3>
            <div className="space-y-2">
              <div className="flex items-start space-x-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#00CCFF] mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <div>
                  <p className="text-gray-300">Email:</p>
                  <a href="mailto:tuwebai@gmail.com" className="hover:text-[#00CCFF] transition-colors">tuwebai@gmail.com</a>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#9933FF] mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                </svg>
                <div>
                  <p className="text-gray-300">Web:</p>
                  <a href="https://www.tuweb-ai.com" target="_blank" rel="noopener noreferrer" className="hover:text-[#9933FF] transition-colors">www.tuweb-ai.com</a>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="border-t border-gray-800 pt-8 mb-4 flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center gap-2">
            <img src="/logo-tuwebai.png" alt="Logo TuWeb.ai" className="w-8 h-8" />
            <span className="text-sm text-gray-400">© 2024 TuWeb.ai. Todos los derechos reservados.</span>
          </div>
          <div className="mt-4 md:mt-0 flex gap-6">
            <a 
              href="/terminos-condiciones" 
              className="hover:text-[#9933FF] transition-colors"
            >
              Términos y condiciones
            </a>
            <a 
              href="/politica-privacidad" 
              className="hover:text-[#00CCFF] transition-colors"
            >
              Política de privacidad
            </a>
            <a 
              href="/politica-cookies" 
              className="hover:text-[#00CCFF] transition-colors"
            >
              Cookies
            </a>
          </div>
        </div>
        

      </div>
    </motion.footer>
  );
}
