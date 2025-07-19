import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { 
  getUserProject, 
  getUserPayments, 
  getUserTickets, 
  createTicket,
  Project,
  Payment,
  SupportTicket,
  ProjectPhase,
  ProjectFile,
  Comment,
  TicketResponse
} from '@/services/firestore';

// Datos simulados por defecto (se usarán si no hay datos reales)
const defaultProject: Project = {
  id: 'default',
  userId: '',
  name: 'Sitio Web Corporativo Premium',
  type: 'E-commerce + Blog',
  startDate: '2025-01-15',
  estimatedEndDate: '2025-03-15',
  overallProgress: 65,
  status: 'active',
  phases: [
    {
      id: '1',
      name: 'UI Design',
      status: 'completed',
      description: 'Diseño de interfaz de usuario y experiencia de usuario',
      estimatedDate: '2025-01-25',
      completedDate: '2025-01-22',
      progress: 100,
      files: [
        {
          id: '1',
          name: 'Mockups_Fase1.pdf',
          type: 'pdf',
          url: 'https://drive.google.com/file/d/example/view',
          uploadedAt: '2025-01-22',
          uploadedBy: 'TuWeb.ai'
        }
      ],
      comments: [
        {
          id: '1',
          text: 'Diseños aprobados por el cliente. Listo para maquetado.',
          author: 'TuWeb.ai',
          authorType: 'admin',
          createdAt: '2025-01-22T10:30:00Z'
        }
      ]
    },
    {
      id: '2',
      name: 'Maquetado',
      status: 'completed',
      description: 'Desarrollo del frontend con React y TailwindCSS',
      estimatedDate: '2025-02-10',
      completedDate: '2025-02-08',
      progress: 100,
      files: [
        {
          id: '2',
          name: 'Screenshot_Homepage.png',
          type: 'image',
          url: 'https://drive.google.com/file/d/example2/view',
          uploadedAt: '2025-02-08',
          uploadedBy: 'TuWeb.ai'
        }
      ],
      comments: [
        {
          id: '2',
          text: 'Maquetado completado. Revisar en el navegador.',
          author: 'TuWeb.ai',
          authorType: 'admin',
          createdAt: '2025-02-08T15:45:00Z'
        }
      ]
    },
    {
      id: '3',
      name: 'Contenido',
      status: 'in-progress',
      description: 'Integración de contenido y textos del cliente',
      estimatedDate: '2025-02-20',
      progress: 75,
      comments: [
        {
          id: '3',
          text: 'Necesitamos las imágenes de productos para completar esta fase.',
          author: 'TuWeb.ai',
          authorType: 'admin',
          createdAt: '2025-02-15T09:15:00Z'
        }
      ]
    },
    {
      id: '4',
      name: 'Funcionalidades',
      status: 'pending',
      description: 'Implementación de funcionalidades avanzadas y e-commerce',
      estimatedDate: '2025-02-28',
      progress: 0
    },
    {
      id: '5',
      name: 'SEO',
      status: 'pending',
      description: 'Optimización para motores de búsqueda',
      estimatedDate: '2025-03-05',
      progress: 0
    },
    {
      id: '6',
      name: 'Deploy',
      status: 'pending',
      description: 'Publicación en servidor de producción',
      estimatedDate: '2025-03-15',
      progress: 0
    }
  ]
};

export default function Dashboard() {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);

  // Estados para datos reales
  const [project, setProject] = useState<Project | null>(null);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [newTicketSubject, setNewTicketSubject] = useState('');
  const [newTicketMessage, setNewTicketMessage] = useState('');
  const [newTicketPriority, setNewTicketPriority] = useState<'low' | 'medium' | 'high'>('medium');

  // Cargar datos reales del usuario
  useEffect(() => {
    const loadUserData = async () => {
      if (!user?.uid) return;
      try {
        setLoading(true);
        // Cargar proyecto del usuario
        const userProject = await getUserProject(user.uid);
        setProject(userProject || null);
        // Cargar pagos del usuario
        const userPayments = await getUserPayments(user.uid);
        setPayments(userPayments);
        // Cargar tickets del usuario
        const userTickets = await getUserTickets(user.uid);
        setTickets(userTickets);
      } catch (error) {
        console.error('Error cargando datos del usuario:', error);
        toast({
          title: "Error",
          description: "No se pudieron cargar los datos del usuario",
          variant: "destructive"
        });
        setProject(null);
        setPayments([]);
        setTickets([]);
      } finally {
        setLoading(false);
      }
    };
    loadUserData();
  }, [user?.uid, toast]);

  // Función para crear nuevo ticket
  const handleCreateTicket = async () => {
    if (!user?.uid || !newTicketSubject || !newTicketMessage) {
      toast({
        title: "Error",
        description: "Por favor completa todos los campos",
        variant: "destructive"
      });
      return;
    }

    try {
      const ticketData = {
        userId: user.uid,
        subject: newTicketSubject,
        message: newTicketMessage,
        priority: newTicketPriority,
        status: 'open' as const,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      await createTicket(ticketData);
      
      // Recargar tickets
      const updatedTickets = await getUserTickets(user.uid);
      setTickets(updatedTickets);
      
      // Limpiar formulario
      setNewTicketSubject('');
      setNewTicketMessage('');
      setNewTicketPriority('medium');
      
      toast({
        title: "Ticket creado",
        description: "Tu ticket de soporte ha sido creado exitosamente"
      });
    } catch (error) {
      console.error('Error creando ticket:', error);
      toast({
        title: "Error",
        description: "No se pudo crear el ticket",
        variant: "destructive"
      });
    }
  };

  // Verificar autenticación
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/');
      toast({
        title: "Acceso denegado",
        description: "Debes iniciar sesión para acceder al dashboard.",
        variant: "destructive"
      });
      return;
    }
  }, [isAuthenticated, navigate, toast]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-500';
      case 'in-progress': return 'bg-blue-500';
      case 'pending': return 'bg-gray-500';
      case 'active': return 'bg-green-500';
      case 'on-hold': return 'bg-yellow-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed': return 'Completado';
      case 'in-progress': return 'En Progreso';
      case 'pending': return 'Pendiente';
      case 'active': return 'Activo';
      case 'on-hold': return 'En Pausa';
      default: return status;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#00CCFF] mx-auto mb-4"></div>
          <p className="text-gray-400">Cargando tu dashboard...</p>
        </div>
      </div>
    );
  }

  // Si no hay proyecto, mostrar dashboard vacío
  if (!project) {
    return (
      <div className="min-h-screen bg-[#0a0a0f] flex flex-col items-center justify-center p-4">
        <h1 className="text-2xl md:text-3xl font-bold text-white mb-4">¡Bienvenido, {user?.name || user?.email}!</h1>
        <p className="text-gray-400 mb-8">Aún no tienes un proyecto asignado. Cuando contrates un servicio, verás aquí el progreso, pagos y soporte.</p>
        <div className="w-full max-w-xl bg-[#18181b] rounded-xl p-6 flex flex-col gap-6">
          <div>
            <h2 className="text-lg font-semibold text-white mb-2">Progreso General</h2>
            <div className="flex items-center gap-4">
              <span className="text-3xl font-bold text-[#00CCFF]">0%</span>
              <span className="px-3 py-1 rounded-full bg-gray-700 text-gray-300 text-xs">Sin proyecto</span>
            </div>
          </div>
          <div>
            <h2 className="text-lg font-semibold text-white mb-2">Pagos</h2>
            <p className="text-gray-400">No hay pagos registrados.</p>
          </div>
          <div>
            <h2 className="text-lg font-semibold text-white mb-2">Soporte</h2>
            <p className="text-gray-400">No tienes tickets de soporte abiertos.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white">
      {/* Header */}
      <div className="bg-[#121217] border-b border-gray-800">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-rajdhani font-bold">
                Bienvenido, <span className="text-[#00CCFF]">{user?.name || user?.username}</span>
              </h1>
              <p className="text-gray-400 mt-1">Panel de control de tu proyecto</p>
            </div>
            <div className="flex items-center gap-4">
              <Button
                variant="outline"
                onClick={() => navigate('/')}
                className="border-gray-600 text-gray-300 hover:bg-gray-800"
              >
                Volver al sitio
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Contenido principal */}
      <div className="container mx-auto px-4 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 bg-[#121217] border border-gray-800">
            <TabsTrigger value="overview" className="data-[state=active]:bg-[#00CCFF] data-[state=active]:text-black">
              Resumen
            </TabsTrigger>
            <TabsTrigger value="project" className="data-[state=active]:bg-[#00CCFF] data-[state=active]:text-black">
              Proyecto
            </TabsTrigger>
            <TabsTrigger value="payments" className="data-[state=active]:bg-[#00CCFF] data-[state=active]:text-black">
              Pagos
            </TabsTrigger>
            <TabsTrigger value="support" className="data-[state=active]:bg-[#00CCFF] data-[state=active]:text-black">
              Soporte
            </TabsTrigger>
          </TabsList>

          {/* Tab: Resumen */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Progreso general */}
              <Card className="bg-[#121217] border-gray-800">
                <CardHeader>
                  <CardTitle className="text-[#00CCFF]">Progreso General</CardTitle>
                  <CardDescription className="text-gray-400">
                    Estado actual del proyecto
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-bold">{project.overallProgress}%</span>
                      <Badge className={getStatusColor(project.status)}>
                        {getStatusText(project.status)}
                      </Badge>
                    </div>
                    <Progress value={project.overallProgress} className="h-2" />
                    <p className="text-sm text-gray-400">
                      Fecha estimada de entrega: {new Date(project.estimatedEndDate).toLocaleDateString()}
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Fases completadas */}
              <Card className="bg-[#121217] border-gray-800">
                <CardHeader>
                  <CardTitle className="text-[#9933FF]">Fases Completadas</CardTitle>
                  <CardDescription className="text-gray-400">
                    Progreso por fases
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {project.phases.map((phase) => (
                      <div key={phase.id} className="flex items-center justify-between">
                        <span className="text-sm">{phase.name}</span>
                        <Badge 
                          variant={phase.status === 'completed' ? 'default' : 'secondary'}
                          className={phase.status === 'completed' ? 'bg-green-500' : 'bg-gray-600'}
                        >
                          {phase.progress}%
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Próximas entregas */}
              <Card className="bg-[#121217] border-gray-800">
                <CardHeader>
                  <CardTitle className="text-[#00CCFF]">Próximas Entregas</CardTitle>
                  <CardDescription className="text-gray-400">
                    Fechas importantes
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {project.phases
                      .filter(phase => phase.status !== 'completed')
                      .slice(0, 3)
                      .map((phase) => (
                        <div key={phase.id} className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium">{phase.name}</p>
                            <p className="text-xs text-gray-400">
                              {new Date(phase.estimatedDate).toLocaleDateString()}
                            </p>
                          </div>
                          <Badge className={getStatusColor(phase.status)}>
                            {getStatusText(phase.status)}
                          </Badge>
                        </div>
                      ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Actividad reciente */}
            <Card className="bg-[#121217] border-gray-800">
              <CardHeader>
                <CardTitle>Actividad Reciente</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {project.phases
                    .filter(phase => phase.comments && phase.comments.length > 0)
                    .flatMap(phase => phase.comments!)
                    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                    .slice(0, 5)
                    .map((comment) => (
                      <div key={comment.id} className="flex items-start gap-3 p-3 bg-[#1a1a1f] rounded-lg">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-r from-[#00CCFF] to-[#9933FF] flex items-center justify-center text-white text-sm font-medium">
                          {comment.authorType === 'admin' ? 'T' : 'C'}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-medium">{comment.author}</span>
                            <span className="text-xs text-gray-400">
                              {new Date(comment.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                          <p className="text-sm text-gray-300">{comment.text}</p>
                        </div>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tab: Proyecto */}
          <TabsContent value="project" className="space-y-6">
            <Card className="bg-[#121217] border-gray-800">
              <CardHeader>
                <CardTitle className="text-[#00CCFF]">{project.name}</CardTitle>
                <CardDescription className="text-gray-400">
                  {project.type} • Iniciado el {new Date(project.startDate).toLocaleDateString()}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {project.phases.map((phase) => (
                    <div key={phase.id} className="border border-gray-800 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <h3 className="text-lg font-semibold">{phase.name}</h3>
                          <p className="text-gray-400">{phase.description}</p>
                        </div>
                        <Badge className={getStatusColor(phase.status)}>
                          {getStatusText(phase.status)}
                        </Badge>
                      </div>
                      
                      <div className="space-y-4">
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span>Progreso</span>
                            <span>{phase.progress}%</span>
                          </div>
                          <Progress value={phase.progress} className="h-2" />
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="text-gray-400">Fecha estimada:</span>
                            <p>{new Date(phase.estimatedDate).toLocaleDateString()}</p>
                          </div>
                          {phase.completedDate && (
                            <div>
                              <span className="text-gray-400">Completado:</span>
                              <p>{new Date(phase.completedDate).toLocaleDateString()}</p>
                            </div>
                          )}
                        </div>

                        {/* Archivos */}
                        {phase.files && phase.files.length > 0 && (
                          <div>
                            <h4 className="font-medium mb-2">Archivos Compartidos</h4>
                            <div className="space-y-2">
                              {phase.files.map((file) => (
                                <div key={file.id} className="flex items-center justify-between p-2 bg-[#1a1a1f] rounded">
                                  <div className="flex items-center gap-2">
                                    {file.type === 'image' ? (
                                      <svg className="w-4 h-4 text-[#9933FF]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                      </svg>
                                    ) : file.type === 'pdf' ? (
                                      <svg className="w-4 h-4 text-[#00CCFF]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                                      </svg>
                                    ) : (
                                      <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                      </svg>
                                    )}
                                    <span className="text-sm">{file.name}</span>
                                  </div>
                                  <a 
                                    href={file.url} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="px-3 py-1 text-xs bg-[#00CCFF] text-black rounded hover:bg-[#00CCFF]/80 transition-colors"
                                  >
                                    Ver
                                  </a>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Comentarios */}
                        {phase.comments && phase.comments.length > 0 && (
                          <div>
                            <h4 className="font-medium mb-2">Comentarios</h4>
                            <div className="space-y-3">
                              {phase.comments.map((comment) => (
                                <div key={comment.id} className="p-3 bg-[#1a1a1f] rounded-lg">
                                  <div className="flex items-center gap-2 mb-2">
                                    <span className="font-medium text-sm">{comment.author}</span>
                                    <span className="text-xs text-gray-400">
                                      {new Date(comment.createdAt).toLocaleDateString()}
                                    </span>
                                  </div>
                                  <p className="text-sm text-gray-300">{comment.text}</p>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tab: Pagos */}
          <TabsContent value="payments" className="space-y-6">
            <Card className="bg-[#121217] border-gray-800">
              <CardHeader>
                <CardTitle className="text-[#00CCFF]">Historial de Pagos</CardTitle>
                <CardDescription className="text-gray-400">
                  Todos los pagos realizados y pendientes
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {payments.map((payment) => (
                    <div key={payment.id} className="flex items-center justify-between p-4 border border-gray-800 rounded-lg">
                      <div className="flex-1">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-r from-[#00CCFF] to-[#9933FF] flex items-center justify-center">
                            <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                            </svg>
                          </div>
                          <div>
                            <p className="font-medium">{payment.description}</p>
                            <p className="text-sm text-gray-400">
                              {new Date(payment.date).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold">${payment.amount}</p>
                        <Badge 
                          className={payment.status === 'completed' ? 'bg-green-500' : 'bg-yellow-500'}
                        >
                          {payment.status === 'completed' ? 'Completado' : 'Pendiente'}
                        </Badge>
                      </div>
                      {payment.invoiceUrl && (
                        <Button size="sm" variant="outline" className="ml-4 border-gray-600">
                          Factura
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tab: Soporte */}
          <TabsContent value="support" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Tickets existentes */}
              <div className="lg:col-span-2">
                <Card className="bg-[#121217] border-gray-800">
                  <CardHeader>
                    <CardTitle className="text-[#00CCFF]">Mis Tickets de Soporte</CardTitle>
                    <CardDescription className="text-gray-400">
                      Historial de consultas y solicitudes
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {tickets.map((ticket) => (
                        <div key={ticket.id} className="border border-gray-800 rounded-lg p-4">
                          <div className="flex items-start justify-between mb-3">
                            <div>
                              <h3 className="font-medium">{ticket.subject}</h3>
                              <p className="text-sm text-gray-400 mt-1">{ticket.message}</p>
                            </div>
                            <Badge 
                              className={
                                ticket.status === 'resolved' ? 'bg-green-500' : 
                                ticket.status === 'in-progress' ? 'bg-blue-500' : 'bg-yellow-500'
                              }
                            >
                              {ticket.status === 'resolved' ? 'Resuelto' : 
                               ticket.status === 'in-progress' ? 'En Progreso' : 'Abierto'}
                            </Badge>
                          </div>
                          
                          <div className="flex items-center justify-between text-sm text-gray-400">
                            <span>Creado: {new Date(ticket.createdAt).toLocaleDateString()}</span>
                            <span>Prioridad: {ticket.priority}</span>
                          </div>

                          {ticket.responses && ticket.responses.length > 0 && (
                            <div className="mt-3 pt-3 border-t border-gray-800">
                              <h4 className="font-medium mb-2">Respuestas:</h4>
                              <div className="space-y-2">
                                {ticket.responses.map((response) => (
                                  <div key={response.id} className="p-2 bg-[#1a1a1f] rounded text-sm">
                                    <div className="flex items-center gap-2 mb-1">
                                      <span className="font-medium">{response.author}</span>
                                      <span className="text-gray-400">
                                        {new Date(response.createdAt).toLocaleDateString()}
                                      </span>
                                    </div>
                                    <p className="text-gray-300">{response.message}</p>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Nuevo ticket */}
              <div>
                <Card className="bg-[#121217] border-gray-800">
                  <CardHeader>
                    <CardTitle className="text-[#9933FF]">Nuevo Ticket</CardTitle>
                    <CardDescription className="text-gray-400">
                      Crear una nueva consulta
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">Asunto</label>
                        <input
                          type="text"
                          value={newTicketSubject}
                          onChange={(e) => setNewTicketSubject(e.target.value)}
                          className="w-full px-3 py-2 bg-[#1a1a1f] border border-gray-700 rounded-md text-white focus:outline-none focus:border-[#00CCFF]"
                          placeholder="Describe brevemente tu consulta"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Mensaje</label>
                        <textarea
                          rows={4}
                          value={newTicketMessage}
                          onChange={(e) => setNewTicketMessage(e.target.value)}
                          className="w-full px-3 py-2 bg-[#1a1a1f] border border-gray-700 rounded-md text-white focus:outline-none focus:border-[#00CCFF] resize-none"
                          placeholder="Describe detalladamente tu consulta o solicitud..."
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Prioridad</label>
                        <select 
                          value={newTicketPriority}
                          onChange={(e) => setNewTicketPriority(e.target.value as 'low' | 'medium' | 'high')}
                          className="w-full px-3 py-2 bg-[#1a1a1f] border border-gray-700 rounded-md text-white focus:outline-none focus:border-[#00CCFF]"
                        >
                          <option value="low">Baja</option>
                          <option value="medium">Media</option>
                          <option value="high">Alta</option>
                        </select>
                      </div>
                      <Button 
                        onClick={handleCreateTicket}
                        className="w-full bg-gradient-to-r from-[#00CCFF] to-[#9933FF]"
                      >
                        Crear Ticket
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
} 