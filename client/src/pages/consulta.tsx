import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Alert } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import WhatsAppButton from "@/components/ui/whatsapp-button";
import { useIsMobile } from "@/hooks/use-mobile";
import analytics from "@/lib/analytics";
import { API_URL } from '@/lib/api';

const formSchema = z.object({
  nombre: z.string().min(2, { message: "El nombre es requerido" }),
  email: z.string().email({ message: "Ingresá un email válido" }),
  empresa: z.string().optional(),
  telefono: z.string().optional(),
  tipoProyecto: z.enum(['web', 'ecommerce', 'marketing', 'app', 'branding', 'seo', 'otro'], {
    errorMap: () => ({ message: "Selecciona un tipo de proyecto" }),
  }),
  urgente: z.boolean().optional(),
  detalleServicio: z.array(z.string()).optional(),
  secciones: z.array(z.string()).optional(),
  presupuesto: z.enum(['menos5k', '5k-10k', '10k-20k', 'mas20k'], {
    errorMap: () => ({ message: "Indica tu presupuesto aproximado" }),
  }),
  plazo: z.enum(['1_mes', '2_3_meses', '3_6_meses', 'sin_urgencia'], {
    errorMap: () => ({ message: "Selecciona el plazo aproximado" }),
  }).optional(),
  mensaje: z.string().min(10, { message: "El mensaje debe tener al menos 10 caracteres" }),
  comoNosEncontraste: z.enum(['google', 'redes_sociales', 'recomendacion', 'otro']).optional(),
});

type FormValues = z.infer<typeof formSchema>;

// Detalles de servicios para cada tipo de proyecto
const serviciosPorTipo = {
  web: ['Diseño web', 'Desarrollo frontend', 'Desarrollo backend', 'SEO', 'Hosting', 'Mantenimiento'],
  ecommerce: ['Tienda online', 'Pasarela de pagos', 'Gestión de inventario', 'Diseño de producto', 'Marketing', 'Integración con APIs'],
  marketing: ['SEO', 'SEM', 'Email marketing', 'Redes sociales', 'Analítica web', 'Contenidos'],
  app: ['App móvil iOS', 'App móvil Android', 'PWA', 'Backend', 'Diseño UX/UI', 'Mantenimiento'],
  branding: ['Identidad visual', 'Logo', 'Manual de marca', 'Papelería', 'Diseño de packaging', 'Posicionamiento'],
  seo: ['Auditoría SEO', 'SEO on-page', 'SEO off-page', 'SEO técnico', 'Análisis de competencia', 'Estrategia de contenidos'],
  otro: ['Consultoría', 'Formación', 'Soporte', 'Migración', 'Integración', 'Desarrollo personalizado'],
};

// Componente para el estimador de presupuesto
const PresupuestoEstimado: React.FC<{
  tipoProyecto?: string;
  detalleServicio?: string[];
  presupuestoSeleccionado?: string;
  urgente?: boolean;
}> = ({ tipoProyecto, detalleServicio = [], presupuestoSeleccionado, urgente }) => {
  const [estimacionBase, setEstimacionBase] = useState<number>(0);
  
  useEffect(() => {
    let base = 0;
    
    // Estimación base según tipo de proyecto
    if (tipoProyecto === 'web') base = 5000;
    else if (tipoProyecto === 'ecommerce') base = 8000;
    else if (tipoProyecto === 'marketing') base = 3500;
    else if (tipoProyecto === 'app') base = 10000;
    else if (tipoProyecto === 'branding') base = 4000;
    else if (tipoProyecto === 'seo') base = 3000;
    else base = 4500;
    
    // Añadir costos por servicios seleccionados
    detalleServicio.forEach(() => {
      base += 1000;
    });
    
    // Factor de urgencia
    if (urgente) base *= 1.25;
    
    setEstimacionBase(base);
  }, [tipoProyecto, detalleServicio, urgente]);
  
  // Formatea el precio en moneda
  const formatoPrecio = (precio: number): string => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
      maximumFractionDigits: 0,
    }).format(precio);
  };
  
  let rangoMin = estimacionBase * 0.8;
  let rangoMax = estimacionBase * 1.2;
  
  // Ajustar según presupuesto seleccionado
  if (presupuestoSeleccionado === 'menos5k') {
    rangoMax = Math.min(rangoMax, 5000);
  } else if (presupuestoSeleccionado === '5k-10k') {
    rangoMin = Math.max(rangoMin, 5000);
    rangoMax = Math.min(rangoMax, 10000);
  } else if (presupuestoSeleccionado === '10k-20k') {
    rangoMin = Math.max(rangoMin, 10000);
    rangoMax = Math.min(rangoMax, 20000);
  } else if (presupuestoSeleccionado === 'mas20k') {
    rangoMin = Math.max(rangoMin, 20000);
  }
  
  return (
    <div className="mt-6 p-4 rounded-lg bg-[#1A1A23] border border-gray-700">
      <h4 className="text-white font-medium mb-3">Estimación preliminar</h4>
      <div className="flex items-baseline gap-1">
        <span className="text-2xl font-bold text-[#00CCFF]">{formatoPrecio(rangoMin)}</span>
        <span className="text-gray-400">-</span>
        <span className="text-2xl font-bold text-[#9933FF]">{formatoPrecio(rangoMax)}</span>
      </div>
      <p className="text-gray-400 text-sm mt-2">
        Esta es una estimación inicial basada en tus selecciones. La propuesta final detallada puede variar según los requisitos específicos de tu proyecto.
      </p>
    </div>
  );
};

export default function Consulta() {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [showEstimador, setShowEstimador] = useState(false);
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  
  // Estado para detalles de servicios
  const [serviciosDisponibles, setServiciosDisponibles] = useState<string[]>([]);
  
  const totalSteps = 4;

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isValid },
    reset,
    trigger,
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nombre: "",
      email: "",
      empresa: "",
      telefono: "",
      tipoProyecto: undefined,
      urgente: false,
      detalleServicio: [] as string[],
      secciones: [] as string[],
      presupuesto: undefined,
      plazo: undefined,
      mensaje: "",
      comoNosEncontraste: undefined,
    },
    mode: "onChange",
  });
  
  // Observar los valores del formulario para el estimador
  const watchTipoProyecto = watch("tipoProyecto");
  const watchDetalleServicio = watch("detalleServicio");
  const watchPresupuesto = watch("presupuesto");
  const watchUrgente = watch("urgente");
  
  // Actualizar servicios disponibles cuando cambie el tipo de proyecto
  useEffect(() => {
    if (watchTipoProyecto) {
      const tipoProyectoKey = watchTipoProyecto as keyof typeof serviciosPorTipo;
      if (serviciosPorTipo[tipoProyectoKey]) {
        setServiciosDisponibles(serviciosPorTipo[tipoProyectoKey]);
        setValue("detalleServicio", []);
      }
    }
  }, [watchTipoProyecto, setValue]);
  
  // Mostrar estimador cuando se seleccionen suficientes datos
  useEffect(() => {
    if (watchTipoProyecto && (watchDetalleServicio?.length || 0) > 0) {
      setShowEstimador(true);
    } else {
      setShowEstimador(false);
    }
  }, [watchTipoProyecto, watchDetalleServicio]);
  
  // Validar el paso actual antes de avanzar
  const validarYAvanzar = async () => {
    let fieldsToValidate: (keyof FormValues)[] = [];
    
    switch (currentStep) {
      case 1:
        fieldsToValidate = ["nombre", "email", "telefono"];
        break;
      case 2:
        fieldsToValidate = ["tipoProyecto", "detalleServicio"];
        break;
      case 3:
        fieldsToValidate = ["presupuesto", "plazo"];
        break;
      case 4:
        fieldsToValidate = ["mensaje"];
        break;
    }
    
    const isStepValid = await trigger(fieldsToValidate);
    
    if (isStepValid) {
      if (currentStep < totalSteps) {
        setCurrentStep(prev => prev + 1);
      }
    }
  };
  
  // Manejar cambios en los checkboxes de servicios
  const handleServicioChange = (servicio: string) => {
    const currentServicios = watchDetalleServicio || [];
    if (currentServicios.includes(servicio)) {
      setValue(
        "detalleServicio",
        currentServicios.filter(s => s !== servicio),
        { shouldValidate: true }
      );
    } else {
      setValue("detalleServicio", [...currentServicios, servicio], { shouldValidate: true });
    }
  };

  const onSubmit = async (data: FormValues) => {
    setIsSubmitting(true);
    
    try {
      // Mapear los datos del formulario a los campos que espera el endpoint
      const propuestaData = {
        nombre: data.nombre,
        email: data.email,
        tipo_proyecto: data.tipoProyecto,
        servicios: data.detalleServicio?.join(', ') || 'No especificado',
        presupuesto: data.presupuesto,
        plazo: data.plazo,
        detalles: data.mensaje
      };

      // Envío real del formulario a la API
      const response = await fetch(`${API_URL}/api/propuesta`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(propuestaData)
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Error al enviar el formulario');
      }
      
      setSubmitted(true);
      
      toast({
        title: "Solicitud recibida",
        description: "Tu propuesta personalizada estará lista en menos de 48 horas",
      });
      
      reset();
      setCurrentStep(1);
      
      // Guardamos el email en localStorage para futuras interacciones
      if (data.email) {
        localStorage.setItem('userEmail', data.email);
      }
      
      // Registro del evento en analytics
      analytics.event('Formulario', 'Consulta Enviada', data.tipoProyecto);
      
      // Revertimos el estado después de 10 segundos
      setTimeout(() => {
        setSubmitted(false);
      }, 10000);
    } catch (error) {
      console.error('Error al enviar formulario:', error);
      toast({
        title: "Error al enviar",
        description: "Ha ocurrido un problema al procesar tu solicitud. Por favor, inténtalo de nuevo.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white">
      <WhatsAppButton />
      
      {/* Header */}
      <motion.header 
        className="bg-gradient-to-b from-[#0f0f19] to-[#0a0a0f] pt-24 pb-16 px-4"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="container mx-auto">
          <div className="text-center">
            <Link to="/" className="text-3xl font-rajdhani font-bold mb-10 inline-block">
              TuWeb<span className="text-[#00CCFF]">.ai</span>
            </Link>
            <h1 className="text-4xl md:text-5xl font-rajdhani font-bold mb-4">
              <span className="gradient-text pb-2">Solicitar propuesta personalizada</span>
            </h1>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto mt-4">
              Completá el formulario y en menos de 48 horas recibirás una propuesta a medida para tu proyecto.
            </p>
          </div>
        </div>
      </motion.header>

      {/* Formulario de consulta */}
      <section className="py-16 px-4 bg-[#0a0a0f]">
        <div className="container mx-auto">
          <div className="max-w-3xl mx-auto">
            <motion.div
              className="bg-gradient-to-br from-[#00CCFF]/10 to-[#9933FF]/10 rounded-xl p-[1px]"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="bg-[#121217] rounded-xl p-8">
                {submitted ? (
                  <motion.div
                    className="text-center py-16"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                  >
                    <div className="w-20 h-20 bg-gradient-to-r from-[#00CCFF] to-[#9933FF] rounded-full flex items-center justify-center mx-auto mb-6">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <h3 className="text-2xl font-rajdhani font-bold mb-4 text-white">¡Gracias por tu solicitud!</h3>
                    <p className="text-gray-300 mb-6">
                      Hemos recibido los detalles de tu proyecto. Nuestro equipo está trabajando en tu propuesta personalizada y la recibirás en menos de 48 horas.
                    </p>
                    <Link 
                      to="/"
                      className="inline-block px-6 py-3 bg-gradient-to-r from-[#00CCFF] to-[#9933FF] rounded-full text-white font-medium"
                    >
                      Volver al inicio
                    </Link>
                  </motion.div>
                ) : (
                  <>
                    {/* Barra de progreso */}
                    <div className="mb-8">
                      <div className="flex items-center justify-between mb-2">
                        <h2 className="text-lg font-medium text-white">Tu solicitud</h2>
                        <span className="text-sm text-gray-400">Paso {currentStep} de {totalSteps}</span>
                      </div>
                      <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                        <motion.div 
                          className="h-full bg-gradient-to-r from-[#00CCFF] to-[#9933FF]"
                          initial={{ width: `${(1 / totalSteps) * 100}%` }}
                          animate={{ width: `${(currentStep / totalSteps) * 100}%` }}
                          transition={{ duration: 0.3 }}
                        />
                      </div>
                      
                      <div className="flex justify-between mt-2">
                        <span className={`text-xs ${currentStep >= 1 ? 'text-[#00CCFF]' : 'text-gray-500'}`}>Datos</span>
                        <span className={`text-xs ${currentStep >= 2 ? 'text-[#00CCFF]' : 'text-gray-500'}`}>Proyecto</span>
                        <span className={`text-xs ${currentStep >= 3 ? 'text-[#00CCFF]' : 'text-gray-500'}`}>Presupuesto</span>
                        <span className={`text-xs ${currentStep >= 4 ? 'text-[#00CCFF]' : 'text-gray-500'}`}>Detalles</span>
                      </div>
                    </div>
                    
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                      <AnimatePresence mode="wait">
                        {currentStep === 1 && (
                          <motion.div 
                            key="step1"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            transition={{ duration: 0.3 }}
                            className="space-y-6"
                          >
                            <h3 className="text-xl font-medium text-white mb-4">Tus datos de contacto</h3>
                            
                            <div>
                              <label htmlFor="nombre" className="block text-white font-medium mb-2">
                                Nombre completo <span className="text-[#00CCFF]">*</span>
                              </label>
                              <Input
                                id="nombre"
                                {...register("nombre")}
                                className="bg-[#1A1A23] border-gray-700 text-white"
                                placeholder="Tu nombre"
                              />
                              {errors.nombre && (
                                <p className="text-[#00CCFF] text-sm mt-1">{errors.nombre.message}</p>
                              )}
                            </div>
                            
                            <div>
                              <label htmlFor="email-consulta" className="block text-white font-medium mb-2">
                                Email <span className="text-[#00CCFF]">*</span>
                              </label>
                              <Input
                                id="email-consulta"
                                {...register("email")}
                                className="bg-[#1A1A23] border-gray-700 text-white"
                                placeholder="tu@email.com"
                              />
                              {errors.email && (
                                <p className="text-[#00CCFF] text-sm mt-1">{errors.email.message}</p>
                              )}
                            </div>
                            
                            <div>
                              <label htmlFor="empresa" className="block text-white font-medium mb-2">
                                Empresa (opcional)
                              </label>
                              <Input
                                id="empresa"
                                {...register("empresa")}
                                className="bg-[#1A1A23] border-gray-700 text-white"
                                placeholder="Nombre de tu empresa"
                              />
                            </div>
                            
                            <div>
                              <label htmlFor="telefono" className="block text-white font-medium mb-2">
                                Teléfono (opcional)
                              </label>
                              <Input
                                id="telefono"
                                {...register("telefono")}
                                className="bg-[#1A1A23] border-gray-700 text-white"
                                placeholder="Tu número de teléfono"
                              />
                            </div>
                            
                            <div>
                              <label className="block text-white font-medium mb-2">
                                ¿Cómo nos encontraste? (opcional)
                              </label>
                              <div className="grid grid-cols-2 gap-2">
                                {['google', 'redes_sociales', 'recomendacion', 'otro'].map((source) => (
                                  <label 
                                    key={source} 
                                    className={`
                                      p-3 border rounded-lg flex items-center cursor-pointer transition-colors
                                      ${watch('comoNosEncontraste') === source 
                                        ? 'border-[#00CCFF] bg-[#00CCFF]/10' 
                                        : 'border-gray-700 bg-[#1A1A23] hover:bg-[#2a2a35]'
                                      }
                                    `}
                                  >
                                    <input
                                      type="radio"
                                      {...register("comoNosEncontraste")}
                                      value={source}
                                      className="sr-only"
                                    />
                                    <span>
                                      {source === 'google' && 'Google'}
                                      {source === 'redes_sociales' && 'Redes sociales'}
                                      {source === 'recomendacion' && 'Recomendación'}
                                      {source === 'otro' && 'Otro'}
                                    </span>
                                  </label>
                                ))}
                              </div>
                            </div>
                          </motion.div>
                        )}
                        
                        {currentStep === 2 && (
                          <motion.div 
                            key="step2"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            transition={{ duration: 0.3 }}
                            className="space-y-6"
                          >
                            <h3 className="text-xl font-medium text-white mb-4">Tipo de proyecto</h3>
                            
                            <div>
                              <label htmlFor="tipoProyecto" className="block text-white font-medium mb-2">
                                ¿Qué tipo de proyecto necesitas? <span className="text-[#00CCFF]">*</span>
                              </label>
                              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                {[
                                  {id: 'web', name: 'Sitio web', icon: '🌐'},
                                  {id: 'ecommerce', name: 'Tienda online', icon: '🛒'},
                                  {id: 'marketing', name: 'Marketing digital', icon: '📈'},
                                  {id: 'app', name: 'Aplicación', icon: '📱'},
                                  {id: 'branding', name: 'Branding', icon: '✨'},
                                  {id: 'seo', name: 'SEO', icon: '🔍'},
                                  {id: 'otro', name: 'Otro', icon: '🔧'},
                                ].map((tipo) => (
                                  <label 
                                    key={tipo.id} 
                                    className={`
                                      p-3 border rounded-lg flex flex-col items-center justify-center cursor-pointer text-center transition-all
                                      ${watchTipoProyecto === tipo.id 
                                        ? 'border-[#00CCFF] bg-[#00CCFF]/10 scale-105' 
                                        : 'border-gray-700 bg-[#1A1A23] hover:bg-[#2a2a35]'
                                      }
                                      aspect-square
                                    `}
                                  >
                                    <input
                                      type="radio"
                                      {...register("tipoProyecto")}
                                      value={tipo.id}
                                      className="sr-only"
                                    />
                                    <span className="text-2xl mb-1">{tipo.icon}</span>
                                    <span className="text-sm font-medium">{tipo.name}</span>
                                  </label>
                                ))}
                              </div>
                              {errors.tipoProyecto && (
                                <p className="text-[#00CCFF] text-sm mt-1">{errors.tipoProyecto.message}</p>
                              )}
                            </div>
                            
                            {watchTipoProyecto && (
                              <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                transition={{ duration: 0.3 }}
                              >
                                <label className="block text-white font-medium mb-3">
                                  Servicios específicos que necesitas <span className="text-[#00CCFF]">*</span>
                                </label>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-2">
                                  {serviciosDisponibles.map((servicio) => (
                                    <label 
                                      key={servicio} 
                                      className={`
                                        p-3 border rounded-lg flex items-center gap-3 cursor-pointer transition-colors
                                        ${(watchDetalleServicio || []).includes(servicio)
                                          ? 'border-[#00CCFF] bg-[#00CCFF]/10' 
                                          : 'border-gray-700 bg-[#1A1A23] hover:bg-[#232330]'
                                        }
                                      `}
                                    >
                                      <div 
                                        className={`w-5 h-5 flex-shrink-0 border rounded flex items-center justify-center transition-colors
                                          ${(watchDetalleServicio || []).includes(servicio)
                                            ? 'bg-[#00CCFF] border-[#00CCFF]' 
                                            : 'border-gray-500'
                                          }
                                        `}
                                        onClick={() => handleServicioChange(servicio)}
                                      >
                                        {(watchDetalleServicio || []).includes(servicio) && (
                                          <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                          </svg>
                                        )}
                                      </div>
                                      <span>{servicio}</span>
                                    </label>
                                  ))}
                                </div>
                                {errors.detalleServicio && (
                                  <p className="text-[#00CCFF] text-sm mt-1">Selecciona al menos un servicio</p>
                                )}
                              </motion.div>
                            )}
                            
                            <div className="flex items-center mt-4">
                              <input 
                                type="checkbox"
                                id="urgente"
                                {...register("urgente")}
                                className="sr-only"
                              />
                              <label 
                                htmlFor="urgente" 
                                className="flex items-center cursor-pointer"
                                onClick={() => setValue("urgente", !watchUrgente)}
                              >
                                <div 
                                  className={`w-10 h-6 flex items-center rounded-full p-1 transition-colors ${
                                    watchUrgente ? 'bg-[#00CCFF]' : 'bg-gray-700'
                                  }`}
                                >
                                  <motion.div 
                                    className="bg-white w-4 h-4 rounded-full shadow-md"
                                    animate={{ x: watchUrgente ? 16 : 0 }}
                                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                                  />
                                </div>
                                <span className="ml-2 text-gray-300">Es un proyecto urgente</span>
                              </label>
                            </div>
                            
                            {/* Mostrar estimador si hay suficiente información */}
                            {showEstimador && (
                              <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.3 }}
                              >
                                <PresupuestoEstimado 
                                  tipoProyecto={watchTipoProyecto}
                                  detalleServicio={watchDetalleServicio}
                                  presupuestoSeleccionado={watchPresupuesto}
                                  urgente={watchUrgente}
                                />
                              </motion.div>
                            )}
                          </motion.div>
                        )}
                        
                        {currentStep === 3 && (
                          <motion.div 
                            key="step3"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            transition={{ duration: 0.3 }}
                            className="space-y-6"
                          >
                            <h3 className="text-xl font-medium text-white mb-4">Presupuesto y plazos</h3>
                            
                            <div>
                              <label htmlFor="presupuesto" className="block text-white font-medium mb-2">
                                Presupuesto aproximado <span className="text-[#00CCFF]">*</span>
                              </label>
                              <div className="grid grid-cols-2 gap-3">
                                {[
                                  {id: 'menos5k', name: 'Menos de $5.000'},
                                  {id: '5k-10k', name: '$5.000 - $10.000'},
                                  {id: '10k-20k', name: '$10.000 - $20.000'},
                                  {id: 'mas20k', name: 'Más de $20.000'},
                                ].map((rango) => (
                                  <label 
                                    key={rango.id} 
                                    className={`
                                      p-3 border rounded-lg flex items-center gap-3 cursor-pointer transition-colors
                                      ${watchPresupuesto === rango.id 
                                        ? 'border-[#00CCFF] bg-[#00CCFF]/10' 
                                        : 'border-gray-700 bg-[#1A1A23] hover:bg-[#232330]'
                                      }
                                    `}
                                  >
                                    <input
                                      type="radio"
                                      {...register("presupuesto")}
                                      value={rango.id}
                                      className="sr-only"
                                    />
                                    <span>{rango.name}</span>
                                  </label>
                                ))}
                              </div>
                              {errors.presupuesto && (
                                <p className="text-[#00CCFF] text-sm mt-1">{errors.presupuesto.message}</p>
                              )}
                            </div>
                            
                            <div>
                              <label htmlFor="plazo" className="block text-white font-medium mb-2">
                                Plazo estimado para el proyecto
                              </label>
                              <div className="grid grid-cols-2 gap-3">
                                {[
                                  {id: '1_mes', name: 'Menos de 1 mes'},
                                  {id: '2_3_meses', name: '2-3 meses'},
                                  {id: '3_6_meses', name: '3-6 meses'},
                                  {id: 'sin_urgencia', name: 'Sin urgencia'},
                                ].map((plazo) => (
                                  <label 
                                    key={plazo.id} 
                                    className={`
                                      p-3 border rounded-lg flex items-center gap-3 cursor-pointer transition-colors
                                      ${watch('plazo') === plazo.id 
                                        ? 'border-[#00CCFF] bg-[#00CCFF]/10' 
                                        : 'border-gray-700 bg-[#1A1A23] hover:bg-[#232330]'
                                      }
                                    `}
                                  >
                                    <input
                                      type="radio"
                                      {...register("plazo")}
                                      value={plazo.id}
                                      className="sr-only"
                                    />
                                    <span>{plazo.name}</span>
                                  </label>
                                ))}
                              </div>
                            </div>
                            
                            {/* Mostrar estimador nuevamente en esta sección */}
                            {showEstimador && (
                              <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.3 }}
                              >
                                <PresupuestoEstimado 
                                  tipoProyecto={watchTipoProyecto}
                                  detalleServicio={watchDetalleServicio}
                                  presupuestoSeleccionado={watchPresupuesto}
                                  urgente={watchUrgente}
                                />
                              </motion.div>
                            )}
                          </motion.div>
                        )}
                        
                        {currentStep === 4 && (
                          <motion.div 
                            key="step4"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            transition={{ duration: 0.3 }}
                            className="space-y-6"
                          >
                            <h3 className="text-xl font-medium text-white mb-4">Detalles finales</h3>
                            
                            <div>
                              <label htmlFor="mensaje" className="block text-white font-medium mb-2">
                                Detalles del proyecto <span className="text-[#00CCFF]">*</span>
                              </label>
                              <Textarea
                                id="mensaje"
                                {...register("mensaje")}
                                className="bg-[#1A1A23] border-gray-700 text-white min-h-[120px]"
                                placeholder="Describe tu proyecto, objetivos, plazos y cualquier otra información relevante para preparar una propuesta personalizada."
                              />
                              {errors.mensaje && (
                                <p className="text-[#00CCFF] text-sm mt-1">{errors.mensaje.message}</p>
                              )}
                            </div>
                            
                            <div className="bg-[#1A1A23] rounded-lg p-4 border border-gray-700">
                              <h4 className="font-medium text-white mb-2">Resumen de tu solicitud</h4>
                              <ul className="space-y-2 text-sm text-gray-300">
                                <li><span className="text-gray-500">Tipo de proyecto:</span> {watchTipoProyecto && (() => {
                                  const proyectoMap: Record<string, string> = {
                                    web: 'Sitio web',
                                    ecommerce: 'Tienda online',
                                    marketing: 'Marketing digital',
                                    app: 'Aplicación',
                                    branding: 'Branding',
                                    seo: 'SEO',
                                    otro: 'Otro'
                                  };
                                  return proyectoMap[watchTipoProyecto] || '';
                                })()}</li>
                                <li><span className="text-gray-500">Servicios:</span> {watchDetalleServicio?.join(', ')}</li>
                                <li><span className="text-gray-500">Presupuesto:</span> {watchPresupuesto && (() => {
                                  const presupuestoMap: Record<string, string> = {
                                    'menos5k': 'Menos de $5.000',
                                    '5k-10k': '$5.000 - $10.000',
                                    '10k-20k': '$10.000 - $20.000',
                                    'mas20k': 'Más de $20.000'
                                  };
                                  return presupuestoMap[watchPresupuesto] || '';
                                })()}</li>
                                {watch('plazo') && (
                                  <li><span className="text-gray-500">Plazo:</span> {(() => {
                                    const plazoSeleccionado = watch('plazo');
                                    if (!plazoSeleccionado) return '';
                                    
                                    const plazoMap: Record<string, string> = {
                                      '1_mes': 'Menos de 1 mes',
                                      '2_3_meses': '2-3 meses',
                                      '3_6_meses': '3-6 meses',
                                      'sin_urgencia': 'Sin urgencia'
                                    };
                                    return plazoMap[plazoSeleccionado] || '';
                                  })()}</li>
                                )}
                                {watchUrgente && <li className="text-[#00CCFF]">Proyecto urgente</li>}
                              </ul>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                      
                      {/* Botones de navegación */}
                      <div className="flex justify-between pt-4">
                        {currentStep > 1 ? (
                          <Button
                            type="button"
                            className="bg-gray-800 hover:bg-gray-700 text-white rounded-full px-6"
                            onClick={() => setCurrentStep(prev => Math.max(prev - 1, 1))}
                          >
                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                            Anterior
                          </Button>
                        ) : (
                          <div></div>
                        )}
                        
                        {currentStep < totalSteps ? (
                          <Button
                            type="button"
                            className="bg-gradient-to-r from-[#00CCFF] to-[#9933FF] text-white rounded-full px-6"
                            onClick={validarYAvanzar}
                          >
                            Siguiente
                            <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                          </Button>
                        ) : (
                          <motion.div
                            whileHover={{ scale: 1.02 }}
                            transition={{ duration: 0.2 }}
                            className="w-full sm:w-auto"
                          >
                            <Button
                              type="submit"
                              className="w-full py-4 text-lg bg-gradient-to-r from-[#00CCFF] to-[#9933FF] rounded-full text-white font-medium hover:shadow-lg hover:shadow-[#00CCFF]/20 transition-all"
                              disabled={isSubmitting}
                            >
                              {isSubmitting ? (
                                <div className="flex items-center">
                                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                  </svg>
                                  Enviando...
                                </div>
                              ) : (
                                "Solicitar propuesta personalizada"
                              )}
                            </Button>
                          </motion.div>
                        )}
                      </div>
                    </form>
                  </>
                )}
                
                {submitted && (
                  <motion.div
                    className="text-center py-16"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                  >
                    <div className="w-20 h-20 bg-gradient-to-r from-[#00CCFF] to-[#9933FF] rounded-full flex items-center justify-center mx-auto mb-6">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <h3 className="text-2xl font-rajdhani font-bold mb-4 text-white">¡Gracias por tu solicitud!</h3>
                    <p className="text-gray-300 mb-6">
                      Hemos recibido los detalles de tu proyecto. Nuestro equipo está trabajando en tu propuesta personalizada y la recibirás en menos de 48 horas.
                    </p>
                    <Link 
                      to="/"
                      className="inline-block px-6 py-3 bg-gradient-to-r from-[#00CCFF] to-[#9933FF] rounded-full text-white font-medium"
                    >
                      Volver al inicio
                    </Link>
                  </motion.div>
                )}
                
                <div className="mt-8 pt-8 border-t border-gray-800">
                  <div className="flex flex-col items-center text-center">
                    <h3 className="text-xl font-medium text-white mb-4">¿Preferís contactarnos directamente?</h3>
                    <p className="text-gray-300 mb-6 max-w-lg">
                      Nuestro equipo está disponible para responder tus consultas por WhatsApp, teléfono o email. Elegí la forma que te resulte más cómoda.
                    </p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full max-w-2xl">
                      <motion.a
                        href="https://wa.me/543571416044?text=Hola,%20estoy%20interesado%20en%20sus%20servicios"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex flex-col items-center p-4 bg-[#25D366]/10 border border-[#25D366]/30 rounded-xl text-white hover:bg-[#25D366]/20 transition-colors"
                        whileHover={{ y: -5 }}
                        transition={{ duration: 0.2 }}
                      >
                        <div className="w-12 h-12 bg-[#25D366] rounded-full flex items-center justify-center mb-3">
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" className="w-6 h-6">
                            <path fill="currentColor" d="M380.9 97.1C339 55.1 283.2 32 223.9 32c-122.4 0-222 99.6-222 222 0 39.1 10.2 77.3 29.6 111L0 480l117.7-30.9c32.4 17.7 68.9 27 106.1 27h.1c122.3 0 224.1-99.6 224.1-222 0-59.3-25.2-115-67.1-157zm-157 341.6c-33.2 0-65.7-8.9-94-25.7l-6.7-4-69.8 18.3L72 359.2l-4.4-7c-18.5-29.4-28.2-63.3-28.2-98.2 0-101.7 82.8-184.5 184.6-184.5 49.3 0 95.6 19.2 130.4 54.1 34.8 34.9 56.2 81.2 56.1 130.5 0 101.8-84.9 184.6-186.6 184.6zm101.2-138.2c-5.5-2.8-32.8-16.2-37.9-18-5.1-1.9-8.8-2.8-12.5 2.8-3.7 5.6-14.3 18-17.6 21.8-3.2 3.7-6.5 4.2-12 1.4-32.6-16.3-54-29.1-75.5-66-5.7-9.8 5.7-9.1 16.3-30.3 1.8-3.7.9-6.9-.5-9.7-1.4-2.8-12.5-30.1-17.1-41.2-4.5-10.8-9.1-9.3-12.5-9.5-3.2-.2-6.9-.2-10.6-.2-3.7 0-9.7 1.4-14.8 6.9-5.1 5.6-19.4 19-19.4 46.3 0 27.3 19.9 53.7 22.6 57.4 2.8 3.7 39.1 59.7 94.8 83.8 35.2 15.2 49 16.5 66.6 13.9 10.7-1.6 32.8-13.4 37.4-26.4 4.6-13 4.6-24.1 3.2-26.4-1.3-2.5-5-3.9-10.5-6.6z"/>
                          </svg>
                        </div>
                        <span className="font-medium mb-1">WhatsApp</span>
                        <span className="text-sm text-gray-300">Respuesta inmediata</span>
                      </motion.a>
                      
                      <motion.a
                        href="tel:+543571416044"
                        className="flex flex-col items-center p-4 bg-[#00CCFF]/10 border border-[#00CCFF]/30 rounded-xl text-white hover:bg-[#00CCFF]/20 transition-colors"
                        whileHover={{ y: -5 }}
                        transition={{ duration: 0.2 }}
                      >
                        <div className="w-12 h-12 bg-[#00CCFF] rounded-full flex items-center justify-center mb-3">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                          </svg>
                        </div>
                        <span className="font-medium mb-1">Teléfono</span>
                        <span className="text-sm text-gray-300">+54 9 3571 416044</span>
                      </motion.a>
                      
                      <motion.a
                        href="mailto:admin@tuweb-ai.com"
                        className="flex flex-col items-center p-4 bg-[#9933FF]/10 border border-[#9933FF]/30 rounded-xl text-white hover:bg-[#9933FF]/20 transition-colors"
                        whileHover={{ y: -5 }}
                        transition={{ duration: 0.2 }}
                      >
                        <div className="w-12 h-12 bg-[#9933FF] rounded-full flex items-center justify-center mb-3">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                          </svg>
                        </div>
                        <span className="font-medium mb-1">Email</span>
                        <span className="text-sm text-gray-300">admin@tuweb-ai.com</span>
                      </motion.a>
                    </div>
                    
                    <p className="text-gray-400 text-sm mt-6">
                      Horario de atención: Lunes a Viernes de 9:00 a 18:00 hs.
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}