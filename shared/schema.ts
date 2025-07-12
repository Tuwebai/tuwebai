import { relations } from 'drizzle-orm';
import { pgTable, serial, varchar, text, timestamp, boolean, integer, uuid, primaryKey } from 'drizzle-orm/pg-core';
import { createInsertSchema } from 'drizzle-zod';
import { z } from 'zod';

// Tabla de usuarios
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: varchar("username", { length: 255 }).notNull().unique(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  password: varchar("password", { length: 255 }).notNull(),
  name: varchar("name", { length: 255 }),
  role: varchar("role", { length: 50 }).default("user").notNull(),
  image: text("image"), // Campo para la imagen de perfil (base64 o URL)
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
  lastLogin: timestamp("last_login"),
  isActive: boolean("is_active").default(true),
  verificationToken: varchar("verification_token", { length: 255 }),
  resetPasswordToken: varchar("reset_password_token", { length: 255 }),
});

// Tabla de contactos (formularios de contacto)
export const contacts = pgTable("contacts", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).notNull(),
  message: text("message").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  isRead: boolean("is_read").default(false),
  source: varchar("source", { length: 100 }).default("contact_form"),
});

// Tabla de consultas (formularios de solicitud de propuestas)
export const consultations = pgTable("consultations", {
  id: serial("id").primaryKey(),
  nombre: varchar("nombre", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).notNull(),
  empresa: varchar("empresa", { length: 255 }),
  telefono: varchar("telefono", { length: 50 }),
  tipoProyecto: varchar("tipo_proyecto", { length: 50 }).notNull(),
  urgente: boolean("urgente").default(false),
  presupuesto: varchar("presupuesto", { length: 50 }).notNull(),
  plazo: varchar("plazo", { length: 50 }),
  mensaje: text("mensaje").notNull(),
  comoNosEncontraste: varchar("como_nos_encontraste", { length: 50 }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  isProcessed: boolean("is_processed").default(false),
});

// Tabla de detalles de servicio (relación muchos a muchos con consultas)
export const consultationServices = pgTable("consultation_services", {
  id: serial("id").primaryKey(),
  consultationId: integer("consultation_id").notNull().references(() => consultations.id, { onDelete: 'cascade' }),
  serviceDetail: varchar("service_detail", { length: 255 }).notNull(),
});

// Tabla de secciones (relación muchos a muchos con consultas)
export const consultationSections = pgTable("consultation_sections", {
  id: serial("id").primaryKey(),
  consultationId: integer("consultation_id").notNull().references(() => consultations.id, { onDelete: 'cascade' }),
  section: varchar("section", { length: 255 }).notNull(),
});

// Tabla de newsletter
export const newsletter = pgTable("newsletter", {
  id: serial("id").primaryKey(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  isActive: boolean("is_active").default(true),
  source: varchar("source", { length: 100 }),
});

// Tabla de recursos
export const resources = pgTable("resources", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  type: varchar("type", { length: 50 }).notNull(),
  url: varchar("url", { length: 255 }).notNull(),
  description: text("description"),
  isPublic: boolean("is_public").default(true),
  downloadCount: integer("download_count").default(0),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Tabla de tecnologías
export const technologies = pgTable("technologies", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  category: varchar("category", { length: 50 }).notNull(),
  icon: varchar("icon", { length: 50 }).notNull(),
  description: text("description"),
});

// Tabla de preferencias de usuario
export const userPreferences = pgTable("user_preferences", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id, { onDelete: 'cascade' }),
  emailNotifications: boolean("email_notifications").default(true),
  newsletter: boolean("newsletter").default(false),
  darkMode: boolean("dark_mode").default(false),
  language: varchar("language", { length: 10 }).default("es"),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Tabla de cambios de contraseña
export const passwordChanges = pgTable("password_changes", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id, { onDelete: 'cascade' }),
  changedAt: timestamp("changed_at").defaultNow().notNull(),
});

// Tabla de sesiones
export const sessions = pgTable("sessions", {
  sid: varchar("sid", { length: 255 }).primaryKey(),
  sess: text("sess").notNull(),
  expire: timestamp("expire").notNull(),
});

// Tabla para seguimiento de eventos/analíticas
export const analytics = pgTable("analytics", {
  id: serial("id").primaryKey(),
  eventType: varchar("event_type", { length: 100 }).notNull(),
  eventCategory: varchar("event_category", { length: 100 }),
  eventAction: varchar("event_action", { length: 100 }),
  eventLabel: text("event_label"), // Cambiado a TEXT para permitir contenido más largo
  eventValue: integer("event_value"),
  userId: integer("user_id").references(() => users.id),
  sessionId: varchar("session_id", { length: 255 }),
  path: varchar("path", { length: 512 }), // Aumentado a 512
  referrer: text("referrer"), // Cambiado a TEXT
  userAgent: text("user_agent"), // Cambiado a TEXT
  createdAt: timestamp("created_at").defaultNow().notNull(),
  ipAddress: varchar("ip_address", { length: 50 }),
});

// Relaciones
export const usersRelations = relations(users, ({ many, one }) => ({
  contacts: many(contacts),
  consultations: many(consultations),
  preferences: one(userPreferences, {
    fields: [users.id],
    references: [userPreferences.userId],
  }),
  passwordChanges: many(passwordChanges),
}));

export const consultationsRelations = relations(consultations, ({ one, many }) => ({
  user: one(users, {
    fields: [consultations.email],
    references: [users.email],
  }),
  services: many(consultationServices),
  sections: many(consultationSections),
}));

// Esquemas Zod para validación
export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  email: true,
  password: true,
  name: true,
});

export const insertContactSchema = createInsertSchema(contacts).pick({
  name: true,
  email: true,
  message: true,
  source: true,
});

export const insertConsultationSchema = createInsertSchema(consultations).omit({
  id: true, 
  createdAt: true, 
  isProcessed: true
});

export const insertNewsletterSchema = createInsertSchema(newsletter).pick({
  email: true,
  source: true,
});

// Esquemas Zod para preferencias de usuario
export const insertUserPreferencesSchema = createInsertSchema(userPreferences).omit({
  id: true,
  updatedAt: true,
});

export const insertPasswordChangeSchema = createInsertSchema(passwordChanges).omit({
  id: true,
  changedAt: true,
});

// Tipos TypeScript
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type InsertContact = z.infer<typeof insertContactSchema>;
export type Contact = typeof contacts.$inferSelect;

export type InsertConsultation = z.infer<typeof insertConsultationSchema>;
export type Consultation = typeof consultations.$inferSelect;

export type InsertNewsletter = z.infer<typeof insertNewsletterSchema>;
export type Newsletter = typeof newsletter.$inferSelect;

export type InsertUserPreferences = z.infer<typeof insertUserPreferencesSchema>;
export type UserPreferences = typeof userPreferences.$inferSelect;

export type InsertPasswordChange = z.infer<typeof insertPasswordChangeSchema>;
export type PasswordChange = typeof passwordChanges.$inferSelect;

export type Resource = typeof resources.$inferSelect;
export type Technology = typeof technologies.$inferSelect;
export type AnalyticsEvent = typeof analytics.$inferSelect;
