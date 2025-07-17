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
            <div className="flex space-x-4">
              <a href="https://twitter.com/tuwebai" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-[#00CCFF] transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
                </svg>
              </a>
              <a href="https://www.instagram.com/tuweb.ai?igsh=MTBzYW9nYmNhNTQyeQ==" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-[#00CCFF] transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </a>
              <a href="https://www.linkedin.com/company/tuwebai/" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-[#00CCFF] transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                </svg>
              </a>
            </div>
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
              <li><a href="/blog" className="hover:text-[#9933FF] transition-colors">Blog</a></li>
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
                  <a href="mailto:admin@tuweb-ai.com" className="hover:text-[#00CCFF] transition-colors">admin@tuweb-ai.com</a>
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
            <span className="text-sm text-gray-400">© 2025 TuWeb.ai. Todos los derechos reservados.</span>
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
        
        <div className="flex justify-center mt-6 mb-4">
          <div className="flex space-x-6">
            <motion.a 
              href="https://www.linkedin.com/company/tuwebai/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="w-10 h-10 rounded-full bg-glass flex items-center justify-center text-gray-300 hover:text-[#00CCFF] hover:border-[#00CCFF] border border-gray-700 transition-colors"
              whileHover={{ y: -3 }}
              transition={{ duration: 0.2 }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 24 24">
                <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
              </svg>
            </motion.a>
            
            <motion.a 
              href="https://www.instagram.com/tuweb.ai?igsh=MTBzYW9nYmNhNTQyeQ==" 
              target="_blank" 
              rel="noopener noreferrer"
              className="w-10 h-10 rounded-full bg-glass flex items-center justify-center text-gray-300 hover:text-[#9933FF] hover:border-[#9933FF] border border-gray-700 transition-colors"
              whileHover={{ y: -3 }}
              transition={{ duration: 0.2 }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
              </svg>
            </motion.a>
            
            <motion.a 
              href="mailto:admin@tuweb-ai.com" 
              className="w-10 h-10 rounded-full bg-glass flex items-center justify-center text-gray-300 hover:text-[#00CCFF] hover:border-[#00CCFF] border border-gray-700 transition-colors"
              whileHover={{ y: -3 }}
              transition={{ duration: 0.2 }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </motion.a>
            
            <motion.a 
              href="https://twitter.com/tuwebai" 
              target="_blank" 
              rel="noopener noreferrer"
              className="w-10 h-10 rounded-full bg-glass flex items-center justify-center text-gray-300 hover:text-[#9933FF] hover:border-[#9933FF] border border-gray-700 transition-colors"
              whileHover={{ y: -3 }}
              transition={{ duration: 0.2 }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 24 24">
                <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
              </svg>
            </motion.a>
          </div>
        </div>
      </div>
    </motion.footer>
  );
}
