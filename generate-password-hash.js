import bcrypt from 'bcryptjs';

const password = 'admin123';
const saltRounds = 10;

// Generar hash de la contraseña
bcrypt.hash(password, saltRounds, (err, hash) => {
  if (err) {
    console.error('Error al generar hash:', err);
    return;
  }
  
  console.log('Password:', password);
  console.log('Hash generado:', hash);
  
  // Verificar que el hash sea correcto
  bcrypt.compare(password, hash, (err, result) => {
    if (err) {
      console.error('Error al verificar hash:', err);
      return;
    }
    
    console.log('Hash verificado:', result);
  });
});