console.log('Revisando ruta de autenticación en el servidor');
console.log('Usuario encontrado en la BD:');
import { storage } from './server/storage.js';
async function main() {
  const user = await storage.getUserByEmail('admin@tuwebai.com');
  console.log(user ? 'Usuario encontrado' : 'Usuario no encontrado');
  if (user) {
    console.log('Email:', user.email);
    console.log('Credenciales:', user.password);
  }
}
main().catch(err => console.error('Error:', err));
