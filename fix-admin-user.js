// Este script crea un usuario admin en la base de datos en memoria
import { storage } from './server/storage.js';

// Función principal
async function main() {
  console.log('🔍 Verificando usuario admin...');
  const user = await storage.getUserByEmail('admin@tuwebai.com');
  console.log('Usuario encontrado:', user ? 'Sí' : 'No');
  
  if (user) {
    console.log('Datos de usuario (sin password):', {
      id: user.id,
      email: user.email,
      username: user.username,
      role: user.role,
      isActive: user.isActive
    });
  }
  
  // Crear un nuevo usuario admin si no existe
  if (!user) {
    console.log('Creando nuevo usuario admin...');
    try {
      const newAdmin = await storage.createUser({
        username: 'admin',
        email: 'admin@tuwebai.com',
        password: 'admin123',
        name: 'Admin',
        role: 'admin'
      });
      console.log('Usuario admin creado:', newAdmin.id);
    } catch (err) {
      console.error('Error al crear usuario:', err);
    }
  }
}

main().catch(err => console.error('Error:', err));
