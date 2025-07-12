// Este archivo ha sido modificado para no conectarse a PostgreSQL
// y usar en su lugar almacenamiento en memoria
import * as schema from "@shared/schema";

// Mock de la conexión a la base de datos para que no falle al importarse
export const pool = null;
export const db = {
  // Mock de métodos básicos para evitar errores
  select: () => ({ from: () => ({ where: () => [] }) }),
  insert: () => ({ values: () => ({ returning: () => [] }) })
};
