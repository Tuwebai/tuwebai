import React, { useState, useEffect, useRef } from 'react';
import { Navigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import WhatsAppButton from '@/components/ui/whatsapp-button';
import MetaTags from '@/components/seo/meta-tags';
import { 
  Camera, 
  Edit3, 
  Save, 
  X, 
  Lock, 
  Bell, 
  Globe, 
  Shield, 
  User, 
  Settings,
  Check,
  AlertCircle,
  Eye,
  EyeOff,
  Phone,
  MapPin,
  Mail,
  Palette,
  Languages,
  Info
} from 'lucide-react';

export default function PanelUsuario() {
  const { 
    user, 
    isLoading, 
    isAuthenticated, 
    updateUserProfile, 
    logout,
    userPreferences,
    passwordInfo,
    updateUserPreferences,
    changePassword,
    uploadProfileImage,
    setUserImage
  } = useAuth();
  const { toast } = useToast();
  
  const [activeTab, setActiveTab] = useState<'profile' | 'security' | 'preferences' | 'integrations'>('profile');
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Form states
  const [profileForm, setProfileForm] = useState({
    name: user?.name || '',
    username: user?.username || '',
    email: user?.email || '',
    phone: '',
    address: '',
  });
  
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  // Redireccionar si no está autenticado y ha terminado de cargar
  if (!isLoading && !isAuthenticated) {
    return <Navigate to="/" />;
  }
  
  // Actualizar el formulario cuando cambia el usuario
  useEffect(() => {
    if (user) {
      setProfileForm({
        name: user.name || '',
        username: user.username || '',
        email: user.email || '',
        phone: '',
        address: '',
      });
    }
  }, [user]);
  
  // Cargar imagen guardada en localStorage al iniciar
  useEffect(() => {
    if (user && typeof window !== 'undefined') {
      const savedImage = localStorage.getItem('userImage');
      if (savedImage && !user.image) {
        setUserImage(savedImage);
      }
    }
  }, [user, setUserImage]);
  
  const handleUpdatePreferences = async (newPreferences: Partial<typeof userPreferences>) => {
    setIsSaving(true);
    try {
      await updateUserPreferences(newPreferences);
      
      toast({
        title: "✅ Preferencias actualizadas",
        description: "Tus preferencias han sido actualizadas correctamente.",
      });
    } catch (error: any) {
      console.error('Error al actualizar preferencias:', error);
      toast({
        title: "❌ Error",
        description: error.message || "Ha ocurrido un error al actualizar tus preferencias.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };
  
  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfileForm(prev => ({ ...prev, [name]: value }));
    
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };
  
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordForm(prev => ({ ...prev, [name]: value }));
    
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };
  
  const validateProfileForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!profileForm.name.trim()) {
      newErrors.name = 'El nombre es requerido';
    }
    
    if (!profileForm.username.trim()) {
      newErrors.username = 'El nombre de usuario es requerido';
    }
    
    if (!profileForm.email.trim()) {
      newErrors.email = 'El email es requerido';
    } else if (!/\S+@\S+\.\S+/.test(profileForm.email)) {
      newErrors.email = 'Email no válido';
    }
    
    if (profileForm.phone && !/^[\+]?[0-9\s\-\(\)]{10,}$/.test(profileForm.phone)) {
      newErrors.phone = 'Número de teléfono no válido';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const validatePasswordForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!passwordForm.currentPassword) {
      newErrors.currentPassword = 'La contraseña actual es requerida';
    }
    
    if (!passwordForm.newPassword) {
      newErrors.newPassword = 'La nueva contraseña es requerida';
    } else if (passwordForm.newPassword.length < 8) {
      newErrors.newPassword = 'La contraseña debe tener al menos 8 caracteres';
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(passwordForm.newPassword)) {
      newErrors.newPassword = 'La contraseña debe contener mayúsculas, minúsculas y números';
    }
    
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      newErrors.confirmPassword = 'Las contraseñas no coinciden';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateProfileForm()) return;
    
    setIsSaving(true);
    
    try {
      await updateUserProfile({
        name: profileForm.name,
        username: profileForm.username,
        email: profileForm.email,
      });
      
      setIsEditing(false);
      
      toast({
        title: "✅ Perfil actualizado",
        description: "Tu información de perfil ha sido actualizada correctamente.",
      });
    } catch (error: any) {
      console.error('Error al actualizar perfil:', error);
      toast({
        title: "❌ Error",
        description: error.message || "Ha ocurrido un error al actualizar tu perfil.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };
  
  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validatePasswordForm()) return;
    
    setIsSaving(true);
    
    try {
      await changePassword(
        passwordForm.currentPassword,
        passwordForm.newPassword,
      );
      
      setIsChangingPassword(false);
      setPasswordForm({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
      
      toast({
        title: "✅ Contraseña actualizada",
        description: "Tu contraseña ha sido actualizada correctamente.",
      });
    } catch (error: any) {
      console.error('Error al cambiar contraseña:', error);
      toast({
        title: "❌ Error",
        description: error.message || "Ha ocurrido un error al cambiar tu contraseña.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validar tipo de archivo
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      toast({
        title: "❌ Tipo de archivo no válido",
        description: "Solo se permiten imágenes JPG, PNG y WebP.",
        variant: "destructive",
      });
      return;
    }

    // Validar tamaño (máximo 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "❌ Archivo demasiado grande",
        description: "La imagen debe ser menor a 5MB.",
        variant: "destructive",
      });
      return;
    }

    setIsUploadingImage(true);
    try {
      await uploadProfileImage(file);
      toast({
        title: "✅ Imagen actualizada",
        description: "Tu foto de perfil ha sido actualizada correctamente.",
      });
    } catch (error: any) {
      console.error('Error al subir imagen:', error);
      toast({
        title: "❌ Error",
        description: error.message || "Ha ocurrido un error al subir la imagen.",
        variant: "destructive",
      });
    } finally {
      setIsUploadingImage(false);
    }
  };

  const triggerImageUpload = () => {
    fileInputRef.current?.click();
  };
  
  const handleLogout = async () => {
    try {
      await logout();
      toast({
        title: "👋 Sesión cerrada",
        description: "Has cerrado sesión correctamente.",
      });
    } catch (error: any) {
      console.error('Error al cerrar sesión:', error);
      toast({
        title: "❌ Error",
        description: error.message || "Ha ocurrido un error al cerrar sesión.",
        variant: "destructive",
      });
    }
  };
  
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex flex-col items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        <p className="mt-4 text-gray-400">Cargando tu panel...</p>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <MetaTags title="Panel de Usuario | TuWeb.ai" description="Gestiona tu cuenta, preferencias y seguridad en TuWeb.ai." />
      
      <div className="container mx-auto px-4 py-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ duration: 0.5 }}
          className="max-w-6xl mx-auto"
        >
          {/* Header del Panel */}
          <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-6 mb-8 border border-white/10">
            <div className="flex flex-col lg:flex-row items-center justify-between">
              <div className="flex items-center space-x-6 mb-6 lg:mb-0">
                {/* Avatar con funcionalidad de cambio */}
                <div className="relative group">
                  <div className="w-20 h-20 rounded-full overflow-hidden bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-2xl text-white font-bold">
                    {user?.image ? (
                      <img 
                        src={user.image} 
                        alt="Profile" 
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      user?.name?.charAt(0) || user?.username?.charAt(0) || 'U'
                    )}
                  </div>
                  
                  {/* Overlay para cambiar imagen */}
                  <div 
                    onClick={triggerImageUpload}
                    className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                  >
                    <Camera className="w-6 h-6 text-white" />
          </div>
                  
                  {/* Loading overlay */}
                  {isUploadingImage && (
                    <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center">
                      <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-white"></div>
        </div>
                  )}
                  
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/jpeg,image/jpg,image/png,image/webp"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </div>
                
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <h1 className="text-2xl font-bold text-white">{user?.name || user?.username}</h1>
                    {user?.isActive ? (
                      <span className="px-3 py-1 text-xs rounded-full bg-green-500/20 text-green-400 border border-green-500/30 flex items-center gap-1">
                        <Check className="w-3 h-3" />
                        Verificada
                      </span>
                    ) : (
                      <span className="px-3 py-1 text-xs rounded-full bg-yellow-500/20 text-yellow-400 border border-yellow-500/30 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        Pendiente
                    </span>
                  )}
                </div>
                  <p className="text-gray-400">{user?.email}</p>
                  <p className="text-sm text-gray-500">
                    Miembro desde {(() => {
                      if (user?.createdAt) {
                        const date = new Date(user.createdAt);
                        if (!isNaN(date.getTime())) {
                          return date.toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' });
                        }
                      }
                      // Si no hay fecha válida, mostrar "-" o una fecha por defecto
                      return '12 de julio de 2025';
                    })()}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 text-gray-300 hover:text-white transition-colors"
                >
                  Cerrar sesión
                </button>
              </div>
            </div>
          </div>

          {/* Tabs de Navegación */}
          <div className="bg-white/5 backdrop-blur-lg rounded-xl p-2 mb-8 border border-white/10">
            <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => setActiveTab('profile')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                        activeTab === 'profile'
                    ? 'bg-blue-500 text-white shadow-lg' 
                    : 'text-gray-300 hover:bg-white/10 hover:text-white'
                      }`}
                    >
                <User className="w-4 h-4" />
                      Perfil
                    </button>
                    <button
                      onClick={() => setActiveTab('security')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                        activeTab === 'security'
                    ? 'bg-blue-500 text-white shadow-lg' 
                    : 'text-gray-300 hover:bg-white/10 hover:text-white'
                      }`}
                    >
                <Shield className="w-4 h-4" />
                      Seguridad
                    </button>
                    <button
                      onClick={() => setActiveTab('preferences')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                        activeTab === 'preferences'
                    ? 'bg-blue-500 text-white shadow-lg' 
                    : 'text-gray-300 hover:bg-white/10 hover:text-white'
                      }`}
                    >
                <Settings className="w-4 h-4" />
                      Preferencias
                    </button>
              <button 
                onClick={() => setActiveTab('integrations')} 
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  activeTab === 'integrations' 
                    ? 'bg-blue-500 text-white shadow-lg' 
                    : 'text-gray-300 hover:bg-white/10 hover:text-white'
                }`}
              >
                <Globe className="w-4 h-4" />
                Integraciones
              </button>
            </div>
          </div>
          
          {/* Contenido de los Tabs */}
          <AnimatePresence mode="wait">
          <motion.div 
              key={activeTab}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="bg-white/5 backdrop-blur-lg rounded-2xl p-8 border border-white/10"
            >
              {/* Tab: Perfil */}
              {activeTab === 'profile' && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-semibold text-white flex items-center gap-2">
                      <User className="w-5 h-5" />
                      Información Personal
                    </h2>
                    {!isEditing && (
                      <button
                        onClick={() => setIsEditing(true)}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition-all"
                      >
                        <Edit3 className="w-4 h-4" />
                        Editar perfil
                      </button>
                    )}
                  </div>
                  
                  <form onSubmit={handleSaveProfile} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-gray-300 text-sm font-medium mb-2 flex items-center gap-2">
                          <User className="w-4 h-4" />
                          Nombre completo
                        </label>
                        <input
                          type="text"
                          name="name"
                          value={profileForm.name}
                          onChange={handleProfileChange}
                          className={`w-full px-4 py-3 rounded-lg bg-white/5 text-white border transition-all ${
                            errors.name ? 'border-red-500' : 'border-white/20 focus:border-blue-500'
                          } ${!isEditing ? 'opacity-50 cursor-not-allowed' : ''}`}
                          disabled={!isEditing}
                        />
                        {errors.name && <span className="text-red-400 text-sm mt-1 flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" />
                          {errors.name}
                        </span>}
                      </div>
                      
                      <div>
                        <label className="block text-gray-300 text-sm font-medium mb-2 flex items-center gap-2">
                          <User className="w-4 h-4" />
                          Nombre de usuario
                        </label>
                        <input
                          type="text"
                          name="username"
                          value={profileForm.username}
                          onChange={handleProfileChange}
                          className={`w-full px-4 py-3 rounded-lg bg-white/5 text-white border transition-all ${
                            errors.username ? 'border-red-500' : 'border-white/20 focus:border-blue-500'
                          } ${!isEditing ? 'opacity-50 cursor-not-allowed' : ''}`}
                          disabled={!isEditing}
                        />
                        {errors.username && <span className="text-red-400 text-sm mt-1 flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" />
                          {errors.username}
                        </span>}
                      </div>
                      
                      <div>
                        <label className="block text-gray-300 text-sm font-medium mb-2 flex items-center gap-2">
                          <Mail className="w-4 h-4" />
                          Email
                        </label>
                        <input
                          type="email"
                          name="email"
                          value={profileForm.email}
                          onChange={handleProfileChange}
                          className={`w-full px-4 py-3 rounded-lg bg-white/5 text-white border transition-all ${
                            errors.email ? 'border-red-500' : 'border-white/20 focus:border-blue-500'
                          } ${!isEditing ? 'opacity-50 cursor-not-allowed' : ''}`}
                          disabled={!isEditing}
                        />
                        {errors.email && <span className="text-red-400 text-sm mt-1 flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" />
                          {errors.email}
                        </span>}
                      </div>
                      
                      <div>
                        <label className="block text-gray-300 text-sm font-medium mb-2 flex items-center gap-2">
                          <Phone className="w-4 h-4" />
                          Teléfono (opcional)
                        </label>
                        <input 
                          type="tel" 
                          name="phone" 
                          value={profileForm.phone} 
                          onChange={handleProfileChange} 
                          placeholder="+34 600 000 000"
                          className={`w-full px-4 py-3 rounded-lg bg-white/5 text-white border transition-all ${
                            errors.phone ? 'border-red-500' : 'border-white/20 focus:border-blue-500'
                          } ${!isEditing ? 'opacity-50 cursor-not-allowed' : ''}`}
                          disabled={!isEditing}
                        />
                        {errors.phone && <span className="text-red-400 text-sm mt-1 flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" />
                          {errors.phone}
                        </span>}
                      </div>

                      <div className="md:col-span-2">
                        <label className="block text-gray-300 text-sm font-medium mb-2 flex items-center gap-2">
                          <MapPin className="w-4 h-4" />
                          Dirección (opcional)
                        </label>
                        <input 
                          type="text" 
                          name="address" 
                          value={profileForm.address} 
                          onChange={handleProfileChange} 
                          placeholder="Calle, Ciudad, País"
                          className={`w-full px-4 py-3 rounded-lg bg-white/5 text-white border transition-all ${
                            errors.address ? 'border-red-500' : 'border-white/20 focus:border-blue-500'
                          } ${!isEditing ? 'opacity-50 cursor-not-allowed' : ''}`}
                          disabled={!isEditing}
                        />
                        {errors.address && <span className="text-red-400 text-sm mt-1 flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" />
                          {errors.address}
                        </span>}
                      </div>
                    </div>

                    {isEditing && (
                      <div className="flex gap-3 pt-4">
                        <button
                          type="submit"
                          disabled={isSaving}
                          className="flex items-center gap-2 px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition-all disabled:opacity-60"
                        >
                          {isSaving ? (
                            <>
                              <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white"></div>
                              Guardando...
                            </>
                          ) : (
                            <>
                              <Save className="w-4 h-4" />
                              Guardar cambios
                            </>
                          )}
                        </button>
                      <button
                          type="button" 
                        onClick={() => {
                            setIsEditing(false); 
                            setProfileForm({ 
                              name: user?.name || '', 
                              username: user?.username || '', 
                              email: user?.email || '',
                              phone: '',
                              address: ''
                            }); 
                          }} 
                          className="flex items-center gap-2 px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white rounded-lg font-medium transition-all"
                        >
                          <X className="w-4 h-4" />
                        Cancelar
                      </button>
                      </div>
                    )}
                  </form>
                  </div>
              )}

              {/* Tab: Seguridad */}
              {activeTab === 'security' && (
                <div className="space-y-6">
                  <h2 className="text-xl font-semibold text-white flex items-center gap-2 mb-6">
                    <Shield className="w-5 h-5" />
                    Seguridad de la Cuenta
                  </h2>

                  {/* Información de la cuenta */}
                  <div className="bg-white/5 rounded-xl p-6 border border-white/10">
                    <h3 className="text-lg font-medium text-white mb-4">Estado de la cuenta</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                        <span className="text-gray-300">Estado</span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          user?.isActive 
                            ? 'bg-green-500/20 text-green-400 border border-green-500/30' 
                            : 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
                        }`}>
                          {user?.isActive ? 'Activa' : 'En revisión'}
                              </span>
                            </div>
                      {passwordInfo.changedAt && (
                        <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                          <span className="text-gray-300">Último cambio de contraseña</span>
                          <span className="text-white">
                            {new Date(passwordInfo.changedAt).toLocaleDateString('es-ES', { 
                              year: 'numeric', 
                              month: 'short', 
                              day: 'numeric'
                            })}
                          </span>
                          </div>
                      )}
                      {passwordInfo.daysSinceChange !== null && (
                        <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                          <span className="text-gray-300">Días desde el último cambio</span>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            passwordInfo.daysSinceChange > 90 
                              ? 'bg-red-500/20 text-red-400 border border-red-500/30' 
                              : passwordInfo.daysSinceChange > 60 
                              ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
                              : 'bg-green-500/20 text-green-400 border border-green-500/30'
                          }`}>
                            {passwordInfo.daysSinceChange} días
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Cambio de contraseña */}
                  <div className="bg-white/5 rounded-xl p-6 border border-white/10">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-medium text-white">Cambiar contraseña</h3>
                      {!isChangingPassword && (
                        <button
                          onClick={() => setIsChangingPassword(true)}
                          className="flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition-all"
                        >
                          <Lock className="w-4 h-4" />
                          Cambiar contraseña
                        </button>
                      )}
                    </div>

                    {isChangingPassword && (
                    <form onSubmit={handleChangePassword} className="space-y-4">
                      <div>
                          <label className="block text-gray-300 text-sm font-medium mb-2">Contraseña actual</label>
                          <div className="relative">
                        <input
                              type={showPassword ? "text" : "password"}
                          name="currentPassword"
                          value={passwordForm.currentPassword}
                          onChange={handlePasswordChange}
                              className={`w-full px-4 py-3 rounded-lg bg-white/5 text-white border transition-all ${
                                errors.currentPassword ? 'border-red-500' : 'border-white/20 focus:border-blue-500'
                              }`}
                            />
                            <button
                              type="button"
                              onClick={() => setShowPassword(!showPassword)}
                              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                            >
                              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                          </div>
                          {errors.currentPassword && <span className="text-red-400 text-sm mt-1 flex items-center gap-1">
                            <AlertCircle className="w-3 h-3" />
                            {errors.currentPassword}
                          </span>}
                      </div>
                      
                      <div>
                          <label className="block text-gray-300 text-sm font-medium mb-2">Nueva contraseña</label>
                          <div className="relative">
                        <input
                              type={showNewPassword ? "text" : "password"}
                          name="newPassword"
                          value={passwordForm.newPassword}
                          onChange={handlePasswordChange}
                              className={`w-full px-4 py-3 rounded-lg bg-white/5 text-white border transition-all ${
                                errors.newPassword ? 'border-red-500' : 'border-white/20 focus:border-blue-500'
                              }`}
                            />
                            <button
                              type="button"
                              onClick={() => setShowNewPassword(!showNewPassword)}
                              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                            >
                              {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                          </div>
                          {errors.newPassword && <span className="text-red-400 text-sm mt-1 flex items-center gap-1">
                            <AlertCircle className="w-3 h-3" />
                            {errors.newPassword}
                          </span>}
                      </div>
                      
                      <div>
                          <label className="block text-gray-300 text-sm font-medium mb-2">Confirmar nueva contraseña</label>
                          <div className="relative">
                        <input
                              type={showConfirmPassword ? "text" : "password"}
                          name="confirmPassword"
                          value={passwordForm.confirmPassword}
                          onChange={handlePasswordChange}
                              className={`w-full px-4 py-3 rounded-lg bg-white/5 text-white border transition-all ${
                                errors.confirmPassword ? 'border-red-500' : 'border-white/20 focus:border-blue-500'
                              }`}
                        />
                        <button
                              type="button"
                              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                            >
                              {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                          {errors.confirmPassword && <span className="text-red-400 text-sm mt-1 flex items-center gap-1">
                            <AlertCircle className="w-3 h-3" />
                            {errors.confirmPassword}
                          </span>}
                      </div>
                      
                        <div className="flex gap-3 pt-4">
                        <button
                            type="submit" 
                            disabled={isSaving} 
                            className="flex items-center gap-2 px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition-all disabled:opacity-60"
                          >
                            {isSaving ? (
                              <>
                                <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white"></div>
                                Actualizando...
                              </>
                            ) : (
                              <>
                                <Save className="w-4 h-4" />
                                Actualizar contraseña
                              </>
                            )}
                        </button>
                        <button
                            type="button" 
                            onClick={() => { 
                              setIsChangingPassword(false); 
                              setPasswordForm({
                                currentPassword: '',
                                newPassword: '',
                                confirmPassword: '',
                              }); 
                            }} 
                            className="flex items-center gap-2 px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white rounded-lg font-medium transition-all"
                          >
                            <X className="w-4 h-4" />
                            Cancelar
                        </button>
                      </div>
                      </form>
                  )}
                  </div>
                </div>
              )}
              
              {/* Tab: Preferencias */}
              {activeTab === 'preferences' && (
                <div className="space-y-6">
                  <h2 className="text-xl font-semibold text-white flex items-center gap-2 mb-6">
                    <Settings className="w-5 h-5" />
                    Preferencias de Usuario
                    </h2>
                    
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Notificaciones */}
                    <div className="bg-white/5 rounded-xl p-6 border border-white/10">
                      <h3 className="text-lg font-medium text-white mb-4 flex items-center gap-2">
                        <Bell className="w-5 h-5" />
                        Notificaciones
                      </h3>
                      <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                            <label className="text-gray-300 font-medium">Notificaciones por email</label>
                            <p className="text-sm text-gray-500">Recibir actualizaciones importantes</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input 
                            type="checkbox" 
                              checked={userPreferences?.emailNotifications ?? true} 
                              onChange={e => handleUpdatePreferences({ emailNotifications: e.target.checked })} 
                            className="sr-only peer" 
                          />
                            <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-500"></div>
                        </label>
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                            <label className="text-gray-300 font-medium">Newsletter</label>
                            <p className="text-sm text-gray-500">Recibir contenido exclusivo</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input 
                            type="checkbox" 
                              checked={userPreferences?.newsletter ?? true} 
                              onChange={e => handleUpdatePreferences({ newsletter: e.target.checked })} 
                            className="sr-only peer" 
                          />
                            <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-500"></div>
                        </label>
                        </div>
                      </div>
                    </div>
                    
                    {/* Apariencia */}
                    <div className="bg-white/5 rounded-xl p-6 border border-white/10">
                      <h3 className="text-lg font-medium text-white mb-4 flex items-center gap-2">
                        <Palette className="w-5 h-5" />
                        Apariencia
                      </h3>
                      <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                            <label className="text-gray-300 font-medium">Modo oscuro</label>
                            <p className="text-sm text-gray-500">Interfaz con tema oscuro</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input 
                            type="checkbox" 
                              checked={userPreferences?.darkMode ?? false} 
                              onChange={e => handleUpdatePreferences({ darkMode: e.target.checked })} 
                            className="sr-only peer" 
                          />
                            <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-500"></div>
                        </label>
                      </div>
                        <div>
                          <label className="block text-gray-300 font-medium mb-2 flex items-center gap-2">
                            <Languages className="w-4 h-4" />
                        Idioma
                          </label>
                      <select 
                            value={userPreferences?.language || 'es'} 
                            onChange={e => handleUpdatePreferences({ language: e.target.value })} 
                            className="w-full px-4 py-3 rounded-lg bg-white/5 text-white border border-white/20 focus:border-blue-500 transition-all"
                      >
                        <option value="es">Español</option>
                        <option value="en">English</option>
                            <option value="fr">Français</option>
                            <option value="de">Deutsch</option>
                      </select>
                        </div>
                      </div>
                    </div>
                    </div>
                    
                  {/* Información adicional */}
                  <div className="bg-blue-500/10 rounded-xl p-6 border border-blue-500/20">
                    <h3 className="text-lg font-medium text-blue-400 mb-2 flex items-center gap-2">
                      <Info className="w-5 h-5" />
                      Información
                      </h3>
                    <p className="text-blue-300 text-sm">
                      Tus preferencias se guardan automáticamente y se aplican en tiempo real. 
                      Puedes cambiar estas configuraciones en cualquier momento.
                          </p>
                        </div>
                </div>
              )}

              {/* Tab: Integraciones */}
              {activeTab === 'integrations' && (
                <div className="space-y-6">
                  <h2 className="text-xl font-semibold text-white flex items-center gap-2 mb-6">
                    <Globe className="w-5 h-5" />
                    Integraciones y Conexiones
                  </h2>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Servicios conectados */}
                    <div className="bg-white/5 rounded-xl p-6 border border-white/10">
                      <h3 className="text-lg font-medium text-white mb-4">Servicios conectados</h3>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-red-500 rounded-lg flex items-center justify-center">
                              <span className="text-white text-sm font-bold">G</span>
                    </div>
                            <div>
                              <p className="text-white font-medium">Google</p>
                              <p className="text-sm text-gray-400">No conectado</p>
                  </div>
                </div>
                          <button className="px-3 py-1 text-sm bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-all">
                            Conectar
                          </button>
            </div>

                        <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                              <span className="text-white text-sm font-bold">F</span>
                            </div>
                            <div>
                              <p className="text-white font-medium">Facebook</p>
                              <p className="text-sm text-gray-400">No conectado</p>
                            </div>
                          </div>
                          <button className="px-3 py-1 text-sm bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-all">
                            Conectar
                          </button>
                        </div>

                        <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center">
                              <span className="text-white text-sm font-bold">G</span>
                            </div>
                            <div>
                              <p className="text-white font-medium">GitHub</p>
                              <p className="text-sm text-gray-400">No conectado</p>
                            </div>
                          </div>
                          <button className="px-3 py-1 text-sm bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-all">
                            Conectar
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* API Keys */}
                    <div className="bg-white/5 rounded-xl p-6 border border-white/10">
                      <h3 className="text-lg font-medium text-white mb-4">API Keys</h3>
                      <div className="space-y-4">
                        <div className="p-3 bg-white/5 rounded-lg">
                          <p className="text-gray-300 text-sm mb-2">API Key de desarrollo</p>
                          <div className="flex items-center gap-2">
                            <input 
                              type="password" 
                              value="••••••••••••••••••••••••••••••••" 
                              className="flex-1 px-3 py-2 bg-white/5 text-white border border-white/20 rounded-lg text-sm"
                              readOnly
                            />
                            <button className="px-3 py-2 text-sm bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-all">
                              Copiar
                            </button>
                          </div>
                        </div>
                        <button className="w-full px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition-all">
                          Generar nueva API Key
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Información de integraciones */}
                  <div className="bg-yellow-500/10 rounded-xl p-6 border border-yellow-500/20">
                    <h3 className="text-lg font-medium text-yellow-400 mb-2 flex items-center gap-2">
                      <AlertCircle className="w-5 h-5" />
                      Próximamente
                    </h3>
                    <p className="text-yellow-300 text-sm">
                      Las integraciones con servicios externos estarán disponibles próximamente. 
                      Esto te permitirá conectar tu cuenta con otras plataformas y servicios.
                    </p>
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
          </motion.div>
        </div>
      
      <WhatsAppButton />
    </div>
  );
}