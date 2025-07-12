import ReactGA from "react-ga4";

/**
 * Inicializa Google Analytics con el ID de medición proporcionado.
 * Configura el seguimiento automático de páginas.
 * 
 * @param measurementId - ID de medición de Google Analytics (G-XXXXXXXX)
 */
export const initializeAnalytics = (measurementId: string): void => {
  // Inicializar GA4 con el ID de medición
  ReactGA.initialize(measurementId, {
    testMode: process.env.NODE_ENV !== 'production', // Activar modo de prueba en desarrollo
    gaOptions: {
      debug_mode: process.env.NODE_ENV !== 'production' // Activar modo depuración en desarrollo
    }
  });
  
  console.log(`Analytics initialized${process.env.NODE_ENV !== 'production' ? ' in test mode' : ''}`);
};

/**
 * Registra una visita de página en Google Analytics.
 * 
 * @param path - La ruta de la página (por ejemplo, "/inicio", "/productos")
 * @param title - El título de la página (opcional)
 */
export const trackPageView = (path: string, title?: string): void => {
  ReactGA.send({
    hitType: "pageview",
    page: path,
    title: title
  });
  
  console.log(`Page view tracked: ${path}${title ? ` - ${title}` : ''}`);
};

/**
 * Registra un evento personalizado en Google Analytics.
 * 
 * @param category - Categoría del evento (ej. "Engagement", "Ecommerce")
 * @param action - Acción del evento (ej. "Click", "Download", "Purchase")
 * @param label - Etiqueta descriptiva (opcional)
 * @param value - Valor numérico (opcional)
 */
export const trackEvent = (
  category: string,
  action: string,
  label?: string,
  value?: number
): void => {
  ReactGA.event({
    category,
    action,
    label,
    value
  });
  
  console.log(`Event tracked: ${category} - ${action}${label ? ` - ${label}` : ''}${value ? ` - ${value}` : ''}`);
};

/**
 * Configura el seguimiento de excepciones en Google Analytics.
 * 
 * @param description - Descripción de la excepción
 * @param fatal - Indica si la excepción es fatal (true) o no (false)
 */
export const trackException = (description: string, fatal: boolean = false): void => {
  // Usar ReactGA.event para excepciones ya que ReactGA.exception no existe en react-ga4
  ReactGA.event({
    category: 'Exception',
    action: description,
    label: fatal ? 'Fatal' : 'Non-Fatal'
  });
  
  console.log(`Exception tracked: ${description} (Fatal: ${fatal})`);
};

/**
 * Establece información de usuario en Google Analytics.
 * ¡Importante! No incluir información personalmente identificable.
 * 
 * @param userId - ID anónimo de usuario (no email, no nombre real)
 */
export const setUser = (userId: string): void => {
  ReactGA.set({ userId });
  
  console.log(`User set: ${userId}`);
};

// Exportar por defecto para uso más simple
export default {
  initialize: initializeAnalytics,
  pageview: trackPageView,
  event: trackEvent,
  exception: trackException,
  setUser
};