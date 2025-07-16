import * as schema from '../shared/schema';
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { eq, and, ilike, asc, desc, not, isNull, inArray, gt, gte, lte, count } from 'drizzle-orm';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';

import { 
  User, InsertUser, 
  Contact, InsertContact, 
  Consultation, InsertConsultation,
  Newsletter, InsertNewsletter,
  Resource, Technology, AnalyticsEvent,
  UserPreferences, InsertUserPreferences,
  PasswordChange, InsertPasswordChange
} from '../shared/schema';

// Interfaces para cada servicio
export interface IStorage {
  // Usuarios
  getUser(id: number): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: number, userData: Partial<User>): Promise<User | undefined>;
  generateVerificationToken(userId: number): Promise<string | undefined>;
  verifyUser(token: string): Promise<boolean>;
  requestPasswordReset(email: string): Promise<string | undefined>;
  resetPassword(token: string, newPassword: string): Promise<boolean>;
  updateLastLogin(id: number): Promise<boolean>;
  
  // Preferencias de usuario
  getUserPreferences(userId: number): Promise<UserPreferences | undefined>;
  createUserPreferences(preferences: InsertUserPreferences): Promise<UserPreferences>;
  updateUserPreferences(userId: number, preferences: Partial<UserPreferences>): Promise<UserPreferences | undefined>;
  
  // Cambios de contraseña
  recordPasswordChange(userId: number): Promise<PasswordChange>;
  getLastPasswordChange(userId: number): Promise<PasswordChange | undefined>;
  
  // Contactos
  createContact(contact: InsertContact): Promise<Contact>;
  getContacts(page?: number, limit?: number): Promise<Contact[]>;
  getContactsCount(): Promise<number>;
  getContactById(id: number): Promise<Contact | undefined>;
  markContactAsRead(id: number): Promise<boolean>;
  
  // Consultas
  createConsultation(consultation: InsertConsultation, serviceDetails?: string[], sections?: string[]): Promise<Consultation>;
  getConsultations(page?: number, limit?: number): Promise<Consultation[]>;
  getConsultationsCount(): Promise<number>;
  getConsultationById(id: number): Promise<Consultation | undefined>;
  markConsultationAsProcessed(id: number): Promise<boolean>;
  
  // Newsletter
  subscribeToNewsletter(data: InsertNewsletter): Promise<Newsletter>;
  unsubscribeFromNewsletter(email: string): Promise<boolean>;
  
  // Recursos
  getResources(): Promise<Resource[]>;
  getResourceById(id: number): Promise<Resource | undefined>;
  incrementDownloadCount(id: number): Promise<boolean>;
  
  // Tecnologías
  getTechnologies(category?: string): Promise<Technology[]>;
  
  // Analíticas
  trackEvent(event: Partial<AnalyticsEvent>): Promise<void>;
}

// DB connection setup
const connectionString = process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/postgres';

// Implementación completa usando PostgreSQL
export class DatabaseStorage implements IStorage {
  private db;
  private saltRounds = 10;
  
  constructor() {
    try {
      const pool = postgres(connectionString);
      this.db = drizzle(pool, { schema });
    } catch (error) {
      console.error('Error connecting to database:', error);
      throw new Error('Failed to connect to database');
    }
  }
  
  // Métodos de usuario
  async getUser(id: number): Promise<User | undefined> {
    try {
      const result = await this.db.select().from(schema.users).where(eq(schema.users.id, id));
      return result[0];
    } catch (error) {
      console.error('Error getting user by ID:', error);
      return undefined;
    }
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    try {
      console.log('[DB] Buscando usuario por email:', email);
      console.log('[DB] DATABASE_URL configurado:', !!process.env.DATABASE_URL);
      
      const result = await this.db.select().from(schema.users).where(eq(schema.users.email, email));
      console.log('[DB] Usuario encontrado:', result.length > 0 ? 'Sí' : 'No');
      return result[0];
    } catch (error: any) {
      console.error('[DB] ❌ Error crítico de conexión a la base de datos:');
      console.error('[DB] Error type:', error?.constructor?.name);
      console.error('[DB] Error message:', error?.message);
      console.error('[DB] Error code:', error?.code);
      console.error('[DB] Error stack:', error?.stack);
      console.error('[DB] DATABASE_URL presente:', !!process.env.DATABASE_URL);
      console.error('[DB] Email consultado:', email);
      
      // Si es error de conexión específico, devolver undefined para que OAuth maneje el error
      if (error?.code === 'ECONNREFUSED' || 
          error?.code === 'ENOTFOUND' || 
          error?.code === 'ETIMEDOUT' ||
          error?.message?.includes('connection') ||
          error?.message?.includes('timeout')) {
        console.error('[DB] 🚨 Error de conexión detectado - OAuth fallará');
        return undefined;
      }
      
      // Para otros errores, también devolver undefined para evitar crashes
      console.error('[DB] 🚨 Error de base de datos - OAuth fallará');
      return undefined;
    }
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    try {
      console.log('[DB] Creando usuario:', insertUser.email);
      console.log('[DB] DATABASE_URL configurado:', !!process.env.DATABASE_URL);
      
      const hashedPassword = await bcrypt.hash(insertUser.password, this.saltRounds);
      const verificationToken = crypto.randomBytes(32).toString('hex');
      const newUser = {
        first_name: insertUser.first_name,
        last_name: insertUser.last_name,
        email: insertUser.email,
        password: hashedPassword,
        verificationToken,
        createdAt: new Date(),
        updatedAt: new Date(),
        isActive: false
      };
      const result = await this.db.insert(schema.users).values(newUser).returning();
      console.log('[DB] ✅ Usuario creado exitosamente:', result[0]?.id);
      return result[0];
    } catch (error: any) {
      console.error('[DB] ❌ Error crítico al crear usuario:');
      console.error('[DB] Error type:', error?.constructor?.name);
      console.error('[DB] Error message:', error?.message);
      console.error('[DB] Error code:', error?.code);
      console.error('[DB] Error stack:', error?.stack);
      console.error('[DB] DATABASE_URL presente:', !!process.env.DATABASE_URL);
      console.error('[DB] Email a crear:', insertUser.email);
      
      // Si es error de conexión específico, lanzar error específico
      if (error?.code === 'ECONNREFUSED' || 
          error?.code === 'ENOTFOUND' || 
          error?.code === 'ETIMEDOUT' ||
          error?.message?.includes('connection') ||
          error?.message?.includes('timeout')) {
        console.error('[DB] 🚨 Error de conexión al crear usuario');
        throw new Error('db_connection_error');
      }
      
      // Para otros errores, lanzar error genérico
      throw new Error('Error inesperado al crear usuario');
    }
  }
  
  async updateUser(id: number, userData: Partial<User>): Promise<User | undefined> {
    try {
      // Si se incluye una nueva contraseña, la hasheamos
      if (userData.password) {
        userData.password = await bcrypt.hash(userData.password, this.saltRounds);
      }
      
      userData.updatedAt = new Date();
      
      const allowedFields = ['first_name', 'last_name', 'email', 'password', 'image', 'isActive', 'verificationToken', 'resetPasswordToken', 'lastLogin', 'role'];
      const updateFields: any = {};
      for (const key of allowedFields) {
        if (userData[key] !== undefined) updateFields[key] = userData[key];
      }
      const result = await this.db.update(schema.users)
        .set(updateFields)
        .where(eq(schema.users.id, id))
        .returning();
        
      return result.length ? result[0] : undefined;
    } catch (error) {
      console.error('Error updating user:', error);
      return undefined;
    }
  }
  
  async verifyUser(token: string): Promise<boolean> {
    try {
      const result = await this.db.update(schema.users)
        .set({ 
          isActive: true, 
          verificationToken: null as any,
          updatedAt: new Date()
        })
        .where(eq(schema.users.verificationToken as any, token))
        .returning();
        
      return result.length > 0;
    } catch (error) {
      console.error('Error verifying user:', error);
      return false;
    }
  }
  
  async requestPasswordReset(email: string): Promise<string | undefined> {
    try {
      const resetToken = crypto.randomBytes(32).toString('hex');
      
      const result = await this.db.update(schema.users)
        .set({ 
          resetPasswordToken: resetToken,
          updatedAt: new Date()
        })
        .where(eq(schema.users.email, email))
        .returning();
        
      return result.length ? resetToken : undefined;
    } catch (error) {
      console.error('Error requesting password reset:', error);
      return undefined;
    }
  }
  
  async resetPassword(token: string, newPassword: string): Promise<boolean> {
    try {
      const hashedPassword = await bcrypt.hash(newPassword, this.saltRounds);
      
      const result = await this.db.update(schema.users)
        .set({ 
          password: hashedPassword,
          resetPasswordToken: null as any,
          updatedAt: new Date()
        })
        .where(eq(schema.users.resetPasswordToken as any, token))
        .returning();
        
      // Si el cambio fue exitoso, registramos el cambio de contraseña
      if (result.length > 0) {
        const userId = result[0].id;
        await this.recordPasswordChange(userId);
      }
      
      return result.length > 0;
    } catch (error) {
      console.error('Error resetting password:', error);
      return false;
    }
  }
  
  async updateLastLogin(id: number): Promise<boolean> {
    try {
      const result = await this.db.update(schema.users)
        .set({ 
          lastLogin: new Date(),
          updatedAt: new Date()
        })
        .where(eq(schema.users.id, id))
        .returning();
        
      return result.length > 0;
    } catch (error) {
      console.error('Error updating last login:', error);
      return false;
    }
  }
  
  async generateVerificationToken(userId: number): Promise<string | undefined> {
    try {
      const verificationToken = crypto.randomBytes(32).toString('hex');
      
      const result = await this.db.update(schema.users)
        .set({ 
          verificationToken,
          updatedAt: new Date()
        })
        .where(eq(schema.users.id, userId))
        .returning();
        
      return result.length ? verificationToken : undefined;
    } catch (error) {
      console.error('Error generating verification token:', error);
      return undefined;
    }
  }
  
  // Métodos de preferencias de usuario
  async getUserPreferences(userId: number): Promise<UserPreferences | undefined> {
    try {
      const result = await this.db.select()
        .from(schema.userPreferences)
        .where(eq(schema.userPreferences.userId, userId));
      
      return result[0];
    } catch (error) {
      console.error('Error getting user preferences:', error);
      return undefined;
    }
  }

  async createUserPreferences(preferences: InsertUserPreferences): Promise<UserPreferences> {
    try {
      const result = await this.db.insert(schema.userPreferences)
        .values({
          ...preferences,
          updatedAt: new Date()
        })
        .returning();
      
      return result[0];
    } catch (error) {
      console.error('Error creating user preferences:', error);
      throw new Error('Failed to create user preferences');
    }
  }

  async updateUserPreferences(userId: number, preferences: Partial<UserPreferences>): Promise<UserPreferences | undefined> {
    try {
      preferences.updatedAt = new Date();
      
      const result = await this.db.update(schema.userPreferences)
        .set(preferences)
        .where(eq(schema.userPreferences.userId, userId))
        .returning();
      
      return result.length ? result[0] : undefined;
    } catch (error) {
      console.error('Error updating user preferences:', error);
      return undefined;
    }
  }
  
  // Métodos de cambios de contraseña
  async recordPasswordChange(userId: number): Promise<PasswordChange> {
    try {
      const result = await this.db.insert(schema.passwordChanges)
        .values({
          userId,
          changedAt: new Date()
        })
        .returning();
      
      return result[0];
    } catch (error) {
      console.error('Error recording password change:', error);
      throw new Error('Failed to record password change');
    }
  }

  async getLastPasswordChange(userId: number): Promise<PasswordChange | undefined> {
    try {
      const result = await this.db.select()
        .from(schema.passwordChanges)
        .where(eq(schema.passwordChanges.userId, userId))
        .orderBy(desc(schema.passwordChanges.changedAt))
        .limit(1);
      
      return result[0];
    } catch (error) {
      console.error('Error getting last password change:', error);
      return undefined;
    }
  }
  
  // Métodos de contacto
  async createContact(contact: InsertContact): Promise<Contact> {
    try {
      const result = await this.db.insert(schema.contacts)
        .values({
          ...contact,
          createdAt: new Date()
        })
        .returning();
        
      return result[0];
    } catch (error) {
      console.error('Error creating contact:', error);
      throw new Error('Failed to create contact');
    }
  }
  
  async getContacts(page: number = 1, limit: number = 20): Promise<Contact[]> {
    try {
      const offset = (page - 1) * limit;
      
      return await this.db.select()
        .from(schema.contacts)
        .orderBy(desc(schema.contacts.createdAt))
        .limit(limit)
        .offset(offset);
    } catch (error) {
      console.error('Error getting contacts:', error);
      return [];
    }
  }
  
  async getContactsCount(): Promise<number> {
    try {
      const result = await this.db.select({ count: count() }).from(schema.contacts);
      return result[0]?.count || 0;
    } catch (error) {
      console.error('Error getting contacts count:', error);
      return 0;
    }
  }
  
  async getContactById(id: number): Promise<Contact | undefined> {
    try {
      const contacts = await this.db.select()
        .from(schema.contacts)
        .where(eq(schema.contacts.id, id));
        
      return contacts.length ? contacts[0] : undefined;
    } catch (error) {
      console.error('Error getting contact by ID:', error);
      return undefined;
    }
  }
  
  async markContactAsRead(id: number): Promise<boolean> {
    try {
      const result = await this.db.update(schema.contacts)
        .set({ isRead: true })
        .where(eq(schema.contacts.id, id))
        .returning();
        
      return result.length > 0;
    } catch (error) {
      console.error('Error marking contact as read:', error);
      return false;
    }
  }
  
  // Métodos de consulta
  async createConsultation(consultation: InsertConsultation, serviceDetails?: string[], sections?: string[]): Promise<Consultation> {
    try {
      // Primero insertamos la consulta principal
      const result = await this.db.insert(schema.consultations)
        .values({
          ...consultation,
          createdAt: new Date()
        })
        .returning();
        
      const consultationId = result[0].id;
      
      // Luego insertamos los detalles de servicio si los hay
      if (serviceDetails && serviceDetails.length > 0) {
        await this.db.insert(schema.consultationServices)
          .values(
            serviceDetails.map(service => ({
              consultationId,
              serviceDetail: service
            }))
          );
      }
      
      // Insertamos las secciones si las hay
      if (sections && sections.length > 0) {
        await this.db.insert(schema.consultationSections)
          .values(
            sections.map(section => ({
              consultationId,
              section
            }))
          );
      }
      
      return result[0];
    } catch (error) {
      console.error('Error creating consultation:', error);
      throw new Error('Failed to create consultation');
    }
  }
  
  async getConsultations(page: number = 1, limit: number = 20): Promise<Consultation[]> {
    try {
      const offset = (page - 1) * limit;
      
      return await this.db.select()
        .from(schema.consultations)
        .orderBy(desc(schema.consultations.createdAt))
        .limit(limit)
        .offset(offset);
    } catch (error) {
      console.error('Error getting consultations:', error);
      return [];
    }
  }
  
  async getConsultationsCount(): Promise<number> {
    try {
      const result = await this.db.select({ count: count() }).from(schema.consultations);
      return result[0]?.count || 0;
    } catch (error) {
      console.error('Error getting consultations count:', error);
      return 0;
    }
  }
  
  async getConsultationById(id: number): Promise<Consultation | undefined> {
    try {
      const consultations = await this.db.select()
        .from(schema.consultations)
        .where(eq(schema.consultations.id, id));
        
      return consultations.length ? consultations[0] : undefined;
    } catch (error) {
      console.error('Error getting consultation by ID:', error);
      return undefined;
    }
  }
  
  async markConsultationAsProcessed(id: number): Promise<boolean> {
    try {
      const result = await this.db.update(schema.consultations)
        .set({ isProcessed: true })
        .where(eq(schema.consultations.id, id))
        .returning();
        
      return result.length > 0;
    } catch (error) {
      console.error('Error marking consultation as processed:', error);
      return false;
    }
  }
  
  // Métodos de newsletter
  async subscribeToNewsletter(data: InsertNewsletter): Promise<Newsletter> {
    try {
      const result = await this.db.insert(schema.newsletter)
        .values({
          ...data,
          createdAt: new Date()
        })
        .returning();
        
      return result[0];
    } catch (error) {
      console.error('Error subscribing to newsletter:', error);
      throw new Error('Failed to subscribe to newsletter');
    }
  }
  
  async unsubscribeFromNewsletter(email: string): Promise<boolean> {
    try {
      const result = await this.db.update(schema.newsletter)
        .set({ isActive: false })
        .where(eq(schema.newsletter.email, email))
        .returning();
        
      return result.length > 0;
    } catch (error) {
      console.error('Error unsubscribing from newsletter:', error);
      return false;
    }
  }
  
  // Métodos de recursos
  async getResources(): Promise<Resource[]> {
    try {
      return await this.db.select()
        .from(schema.resources)
        .where(eq(schema.resources.isPublic, true))
        .orderBy(asc(schema.resources.title));
    } catch (error) {
      console.error('Error getting resources:', error);
      return [];
    }
  }
  
  async getResourceById(id: number): Promise<Resource | undefined> {
    try {
      const resources = await this.db.select()
        .from(schema.resources)
        .where(eq(schema.resources.id, id));
        
      return resources.length ? resources[0] : undefined;
    } catch (error) {
      console.error('Error getting resource by ID:', error);
      return undefined;
    }
  }
  
  async incrementDownloadCount(id: number): Promise<boolean> {
    try {
      const resource = await this.getResourceById(id);
      
      if (!resource) {
        return false;
      }
      
      const result = await this.db.update(schema.resources)
        .set({ 
          downloadCount: (resource.downloadCount || 0) + 1,
          updatedAt: new Date()
        })
        .where(eq(schema.resources.id, id))
        .returning();
        
      return result.length > 0;
    } catch (error) {
      console.error('Error incrementing download count:', error);
      return false;
    }
  }
  
  // Métodos de tecnologías
  async getTechnologies(category?: string): Promise<Technology[]> {
    try {
      if (category) {
        const result = await this.db.select()
          .from(schema.technologies)
          .where(eq(schema.technologies.category, category))
          .orderBy(asc(schema.technologies.name));
        return result;
      } else {
        const result = await this.db.select()
          .from(schema.technologies)
          .orderBy(asc(schema.technologies.name));
        return result;
      }
    } catch (error) {
      console.error('Error getting technologies:', error);
      return [];
    }
  }
  
  // Métodos de analíticas
  async trackEvent(event: Partial<AnalyticsEvent>): Promise<void> {
    try {
      // Asegurarnos de que eventType es obligatorio
      if (!event.eventType) {
        console.error('Error tracking event: eventType is required');
        return;
      }
      
      // Preparar los datos para la inserción
      const eventData = {
        eventType: event.eventType,
        eventCategory: event.eventCategory,
        eventAction: event.eventAction,
        eventLabel: event.eventLabel,
        eventValue: event.eventValue,
        userId: event.userId,
        sessionId: event.sessionId,
        path: event.path,
        referrer: event.referrer,
        userAgent: event.userAgent,
        ipAddress: event.ipAddress,
        createdAt: new Date()
      };
      
      await this.db.insert(schema.analytics).values(eventData);
    } catch (error) {
      console.error('Error tracking event:', error);
    }
  }
}

// Use DB storage in production, memory storage in development if no DB is available
// Utilizamos exclusivamente MemStorage para almacenamiento local, ignorando las variables de entorno
export const storage = new DatabaseStorage();
