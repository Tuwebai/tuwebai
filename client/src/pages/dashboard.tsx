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

// Datos reales de LH Decants
const defaultProject: Project = {
  id: 'lhdecants',
  userId: '',
  name: 'LH Decants - Sitio Web Corporativo',
  type: 'E-commerce Premium',
  startDate: '2025-01-10',
  estimatedEndDate: '2025-02-28',
  overallProgress: 100,
  status: 'completed',
  phases: [
    {
      id: '1',
      name: 'Diseño y Branding',
      status: 'completed',
      description: 'Diseño de identidad visual y experiencia de usuario para empresa de perfumes',
      estimatedDate: '2025-01-20',
      completedDate: '2025-01-18',
      progress: 100,
      files: [
        {
          id: '1',
          name: 'LH_Decants_Mockups.pdf',
          type: 'pdf',
          url: 'https://drive.google.com/file/d/lhdecants-mockups/view',
          uploadedAt: '2025-01-18',
          uploadedBy: 'TuWeb.ai'
        }
      ],
      comments: [
        {
          id: '1',
          text: 'Diseño elegante y sofisticado aprobado. Refleja perfectamente la calidad premium de los productos.',
          author: 'TuWeb.ai',
          authorType: 'admin',
          createdAt: '2025-01-18T14:30:00Z'
        }
      ]
    },
    {
      id: '2',
      name: 'Desarrollo Frontend',
      status: 'completed',
      description: 'Desarrollo del sitio web con React, TailwindCSS y animaciones premium',
      estimatedDate: '2025-02-05',
      completedDate: '2025-02-03',
      progress: 100,
      files: [
        {
          id: '2',
          name: 'LH_Decants_Homepage.png',
          type: 'image',
          url: 'https://drive.google.com/file/d/lhdecants-homepage/view',
          uploadedAt: '2025-02-03',
          uploadedBy: 'TuWeb.ai'
        }
      ],
      comments: [
        {
          id: '2',
          text: 'Sitio web completamente funcional. Diseño responsive y optimizado para conversiones.',
          author: 'TuWeb.ai',
          authorType: 'admin',
          createdAt: '2025-02-03T16:45:00Z'
        }
      ]
    },
    {
      id: '3',
      name: 'Integración E-commerce',
      status: 'completed',
      description: 'Configuración de tienda online y sistema de pagos',
      estimatedDate: '2025-02-15',
      completedDate: '2025-02-12',
      progress: 100,
      comments: [
        {
          id: '3',
          text: 'E-commerce completamente configurado. Sistema de pagos integrado y funcional.',
          author: 'TuWeb.ai',
          authorType: 'admin',
          createdAt: '2025-02-12T11:30:00Z'
        }
      ]
    },
    {
      id: '4',
      name: 'SEO y Optimización',
      status: 'completed',
      description: 'Optimización para motores de búsqueda y rendimiento',
      estimatedDate: '2025-02-20',
      completedDate: '2025-02-18',
      progress: 100,
      comments: [
        {
          id: '4',
          text: 'SEO implementado. Sitio optimizado para Google y velocidad de carga mejorada.',
          author: 'TuWeb.ai',
          authorType: 'admin',
          createdAt: '2025-02-18T13:20:00Z'
        }
      ]
    },
    {
      id: '5',
      name: 'Lanzamiento',
      status: 'completed',
      description: 'Despliegue final y configuración de dominio',
      estimatedDate: '2025-02-28',
      completedDate: '2025-02-25',
      progress: 100,
      comments: [
        {
          id: '5',
          text: '¡Proyecto completado! Sitio web lanzado exitosamente en lhdecant.com',
          author: 'TuWeb.ai',
          authorType: 'admin',
          createdAt: '2025-02-25T10:00:00Z'
        }
      ]
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
  const [error, setError] = useState<string | null>(null);

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
        setError(null);
      } catch (error: any) {
        // Si es error de índice, mostrar mensaje amigable
        if (error?.code === 'failed-precondition' || (error?.message && error.message.includes('index'))) {
          setError('Falta un índice en Firestore. Haz clic en el link de la consola para crearlo.');
        } else if (error?.code === 'permission-denied') {
          setError('No tienes permisos para ver estos datos.');
        } else {
          setError('No se pudieron cargar los datos.');
        }
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

  // Layout premium SIEMPRE visible
  return (
    <div className="min-h-screen bg-[#0a0a0f] px-2 md:px-8 py-8">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">¡Bienvenido, {user?.name || user?.email}!</h1>
        <p className="text-gray-400 mb-8">Panel de control de tu proyecto</p>
        {error && (
          <div className="bg-red-700 text-white rounded-lg p-4 mb-6 text-center font-semibold">
            {error}
          </div>
        )}
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="overview">Resumen</TabsTrigger>
            <TabsTrigger value="project">Proyecto</TabsTrigger>
            <TabsTrigger value="payments">Pagos</TabsTrigger>
            <TabsTrigger value="support">Soporte</TabsTrigger>
          </TabsList>
          {/* Resumen */}
          <TabsContent value="overview">
            <div className="grid md:grid-cols-3 gap-6">
              {/* Progreso General */}
              <Card className="col-span-1">
                <CardHeader>
                  <CardTitle>Progreso General</CardTitle>
                  <CardDescription>Estado actual del proyecto</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-4 mb-2">
                    <span className="text-3xl font-bold text-[#00CCFF]">{project ? `${project.overallProgress}%` : '0%'}</span>
                    <Badge variant="secondary">{project ? (project.status === 'active' ? 'Activo' : project.status) : 'Sin proyecto'}</Badge>
                  </div>
                  <p className="text-gray-400 text-sm">Fecha estimada de entrega: {project ? project.estimatedEndDate : '-'}</p>
                </CardContent>
              </Card>
              {/* Fases Completadas */}
              <Card className="col-span-1">
                <CardHeader>
                  <CardTitle>Fases Completadas</CardTitle>
                  <CardDescription>Progreso por fases</CardDescription>
                </CardHeader>
                <CardContent>
                  {project && project.phases && project.phases.length > 0 ? (
                    <ul className="space-y-2">
                      {project.phases.map(phase => (
                        <li key={phase.id} className="flex items-center justify-between">
                          <span>{phase.name}</span>
                          <span className="text-xs font-semibold text-gray-300">{phase.progress}%</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-gray-400">No hay fases registradas.</p>
                  )}
                </CardContent>
              </Card>
              {/* Próximas Entregas */}
              <Card className="col-span-1">
                <CardHeader>
                  <CardTitle>Próximas Entregas</CardTitle>
                  <CardDescription>Fechas importantes</CardDescription>
                </CardHeader>
                <CardContent>
                  {project && project.phases && project.phases.length > 0 ? (
                    <ul className="space-y-2">
                      {project.phases.filter(p => p.status !== 'completed').map(phase => (
                        <li key={phase.id} className="flex items-center justify-between">
                          <span>{phase.name}</span>
                          <Badge variant="outline">{phase.status === 'pending' ? 'Pendiente' : 'En Progreso'}</Badge>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-gray-400">No hay entregas próximas.</p>
                  )}
                </CardContent>
              </Card>
            </div>
            {/* Actividad Reciente */}
            <div className="mt-8">
              <Card>
                <CardHeader>
                  <CardTitle>Actividad Reciente</CardTitle>
                </CardHeader>
                <CardContent>
                  {project && project.phases && project.phases.some(p => p.comments && p.comments.length > 0) ? (
                    <ul className="space-y-3">
                      {project.phases.flatMap(phase => (phase.comments || []).map(comment => (
                        <li key={comment.id} className="flex items-center gap-3">
                          <span className="bg-[#00CCFF] text-white rounded-full w-8 h-8 flex items-center justify-center font-bold">T</span>
                          <div>
                            <div className="text-sm text-white font-semibold">TuWeb.ai <span className="text-xs text-gray-400">{new Date(comment.createdAt).toLocaleDateString()}</span></div>
                            <div className="text-gray-300 text-sm">{comment.text}</div>
                          </div>
                        </li>
                      )))}
                    </ul>
                  ) : (
                    <p className="text-gray-400">No hay actividad reciente.</p>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          {/* Proyecto */}
          <TabsContent value="project">
            <Card>
              <CardHeader>
                <CardTitle>Detalle del Proyecto</CardTitle>
              </CardHeader>
              <CardContent>
                {project ? (
                  <>
                    <div className="mb-4">
                      <span className="font-semibold text-white">Nombre:</span> {project.name}
                    </div>
                    <div className="mb-4">
                      <span className="font-semibold text-white">Tipo:</span> {project.type}
                    </div>
                    <div className="mb-4">
                      <span className="font-semibold text-white">Estado:</span> <Badge>{project.status}</Badge>
                    </div>
                    <div className="mb-4">
                      <span className="font-semibold text-white">Fecha de inicio:</span> {project.startDate}
                    </div>
                    <div className="mb-4">
                      <span className="font-semibold text-white">Fecha estimada de entrega:</span> {project.estimatedEndDate}
                    </div>
                    <div className="mb-4">
                      <span className="font-semibold text-white">Progreso:</span> {project.overallProgress}%
                    </div>
                    <div>
                      <span className="font-semibold text-white">Fases:</span>
                      {project.phases && project.phases.length > 0 ? (
                        <ul className="list-disc ml-6 mt-2">
                          {project.phases.map(phase => (
                            <li key={phase.id}>{phase.name} - {phase.progress}%</li>
                          ))}
                        </ul>
                      ) : (
                        <span className="text-gray-400 ml-2">No hay fases registradas.</span>
                      )}
                    </div>
                  </>
                ) : (
                  <p className="text-gray-400">No tienes ningún proyecto asignado.</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          {/* Pagos */}
          <TabsContent value="payments">
            <Card>
              <CardHeader>
                <CardTitle>Historial de Pagos</CardTitle>
              </CardHeader>
              <CardContent>
                {payments && payments.length > 0 ? (
                  <ul className="divide-y divide-gray-700">
                    {payments.map(payment => (
                      <li key={payment.id} className="py-3 flex items-center justify-between">
                        <div>
                          <div className="font-semibold text-white">{payment.description}</div>
                          <div className="text-xs text-gray-400">{payment.date}</div>
                        </div>
                        <div className="text-right">
                          <span className="font-bold text-[#00CCFF]">{payment.amount} {payment.currency}</span>
                          <Badge className="ml-2" variant={payment.status === 'completed' ? 'default' : payment.status === 'pending' ? 'secondary' : 'destructive'}>{payment.status}</Badge>
                        </div>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-400">No hay pagos registrados.</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          {/* Soporte */}
          <TabsContent value="support">
            <Card>
              <CardHeader>
                <CardTitle>Tickets de Soporte</CardTitle>
              </CardHeader>
              <CardContent>
                {tickets && tickets.length > 0 ? (
                  <ul className="divide-y divide-gray-700">
                    {tickets.map(ticket => (
                      <li key={ticket.id} className="py-3">
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="font-semibold text-white">{ticket.subject}</div>
                            <div className="text-xs text-gray-400">{ticket.createdAt}</div>
                          </div>
                          <Badge className="ml-2" variant={ticket.status === 'resolved' ? 'default' : ticket.status === 'open' ? 'secondary' : 'destructive'}>{ticket.status}</Badge>
                        </div>
                        <div className="text-gray-300 mt-2">{ticket.message}</div>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-400">No tienes tickets de soporte abiertos.</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
      <a href="https://tuweb-ai.com/" target="_blank" rel="noopener noreferrer" className="fixed top-6 right-6 z-50 px-5 py-2 bg-gradient-to-r from-[#00CCFF] to-[#9933FF] rounded-full text-white text-sm font-medium shadow-lg hover:shadow-[#9933FF]/30 transition-all">Ir a la página principal</a>
    </div>
  );
} 