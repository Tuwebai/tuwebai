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
    </div>
  );
} 