var __defProp = Object.defineProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};

// server/index.ts
import dotenv2 from "dotenv";
import express3 from "express";

// server/routes.ts
import dotenv from "dotenv";
import { resolve } from "path";
import { z } from "zod";
import bcrypt2 from "bcryptjs";

// shared/schema.ts
var schema_exports = {};
__export(schema_exports, {
  analytics: () => analytics,
  consultationSections: () => consultationSections,
  consultationServices: () => consultationServices,
  consultations: () => consultations,
  consultationsRelations: () => consultationsRelations,
  contacts: () => contacts,
  insertConsultationSchema: () => insertConsultationSchema,
  insertContactSchema: () => insertContactSchema,
  insertNewsletterSchema: () => insertNewsletterSchema,
  insertPasswordChangeSchema: () => insertPasswordChangeSchema,
  insertUserPreferencesSchema: () => insertUserPreferencesSchema,
  insertUserSchema: () => insertUserSchema,
  newsletter: () => newsletter,
  passwordChanges: () => passwordChanges,
  resources: () => resources,
  sessions: () => sessions,
  technologies: () => technologies,
  userPreferences: () => userPreferences,
  users: () => users,
  usersRelations: () => usersRelations
});
import { relations } from "drizzle-orm";
import { pgTable, serial, varchar, text, timestamp, boolean, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
var users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: varchar("username", { length: 255 }).notNull().unique(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  password: varchar("password", { length: 255 }).notNull(),
  name: varchar("name", { length: 255 }),
  role: varchar("role", { length: 50 }).default("user").notNull(),
  image: text("image"),
  // Campo para la imagen de perfil (base64 o URL)
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
  lastLogin: timestamp("last_login"),
  isActive: boolean("is_active").default(true),
  verificationToken: varchar("verification_token", { length: 255 }),
  resetPasswordToken: varchar("reset_password_token", { length: 255 })
});
var contacts = pgTable("contacts", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).notNull(),
  message: text("message").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  isRead: boolean("is_read").default(false),
  source: varchar("source", { length: 100 }).default("contact_form")
});
var consultations = pgTable("consultations", {
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
  isProcessed: boolean("is_processed").default(false)
});
var consultationServices = pgTable("consultation_services", {
  id: serial("id").primaryKey(),
  consultationId: integer("consultation_id").notNull().references(() => consultations.id, { onDelete: "cascade" }),
  serviceDetail: varchar("service_detail", { length: 255 }).notNull()
});
var consultationSections = pgTable("consultation_sections", {
  id: serial("id").primaryKey(),
  consultationId: integer("consultation_id").notNull().references(() => consultations.id, { onDelete: "cascade" }),
  section: varchar("section", { length: 255 }).notNull()
});
var newsletter = pgTable("newsletter", {
  id: serial("id").primaryKey(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  isActive: boolean("is_active").default(true),
  source: varchar("source", { length: 100 })
});
var resources = pgTable("resources", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  type: varchar("type", { length: 50 }).notNull(),
  url: varchar("url", { length: 255 }).notNull(),
  description: text("description"),
  isPublic: boolean("is_public").default(true),
  downloadCount: integer("download_count").default(0),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull()
});
var technologies = pgTable("technologies", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  category: varchar("category", { length: 50 }).notNull(),
  icon: varchar("icon", { length: 50 }).notNull(),
  description: text("description")
});
var userPreferences = pgTable("user_preferences", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  emailNotifications: boolean("email_notifications").default(true),
  newsletter: boolean("newsletter").default(false),
  darkMode: boolean("dark_mode").default(false),
  language: varchar("language", { length: 10 }).default("es"),
  updatedAt: timestamp("updated_at").defaultNow().notNull()
});
var passwordChanges = pgTable("password_changes", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  changedAt: timestamp("changed_at").defaultNow().notNull()
});
var sessions = pgTable("sessions", {
  sid: varchar("sid", { length: 255 }).primaryKey(),
  sess: text("sess").notNull(),
  expire: timestamp("expire").notNull()
});
var analytics = pgTable("analytics", {
  id: serial("id").primaryKey(),
  eventType: varchar("event_type", { length: 100 }).notNull(),
  eventCategory: varchar("event_category", { length: 100 }),
  eventAction: varchar("event_action", { length: 100 }),
  eventLabel: text("event_label"),
  // Cambiado a TEXT para permitir contenido más largo
  eventValue: integer("event_value"),
  userId: integer("user_id").references(() => users.id),
  sessionId: varchar("session_id", { length: 255 }),
  path: varchar("path", { length: 512 }),
  // Aumentado a 512
  referrer: text("referrer"),
  // Cambiado a TEXT
  userAgent: text("user_agent"),
  // Cambiado a TEXT
  createdAt: timestamp("created_at").defaultNow().notNull(),
  ipAddress: varchar("ip_address", { length: 50 })
});
var usersRelations = relations(users, ({ many, one }) => ({
  contacts: many(contacts),
  consultations: many(consultations),
  preferences: one(userPreferences, {
    fields: [users.id],
    references: [userPreferences.userId]
  }),
  passwordChanges: many(passwordChanges)
}));
var consultationsRelations = relations(consultations, ({ one, many }) => ({
  user: one(users, {
    fields: [consultations.email],
    references: [users.email]
  }),
  services: many(consultationServices),
  sections: many(consultationSections)
}));
var insertUserSchema = createInsertSchema(users).pick({
  username: true,
  email: true,
  password: true,
  name: true
});
var insertContactSchema = createInsertSchema(contacts).pick({
  name: true,
  email: true,
  message: true,
  source: true
});
var insertConsultationSchema = createInsertSchema(consultations).omit({
  id: true,
  createdAt: true,
  isProcessed: true
});
var insertNewsletterSchema = createInsertSchema(newsletter).pick({
  email: true,
  source: true
});
var insertUserPreferencesSchema = createInsertSchema(userPreferences).omit({
  id: true,
  updatedAt: true
});
var insertPasswordChangeSchema = createInsertSchema(passwordChanges).omit({
  id: true,
  changedAt: true
});

// server/storage.ts
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { eq, asc, desc, count } from "drizzle-orm";
import bcrypt from "bcryptjs";
import crypto from "crypto";
var connectionString = process.env.DATABASE_URL || "postgresql://postgres:postgres@localhost:5432/postgres";
var DatabaseStorage = class {
  constructor() {
    this.saltRounds = 10;
    try {
      const pool = postgres(connectionString);
      this.db = drizzle(pool, { schema: schema_exports });
    } catch (error) {
      console.error("Error connecting to database:", error);
      throw new Error("Failed to connect to database");
    }
  }
  // Métodos de usuario
  async getUser(id) {
    try {
      const result = await this.db.select().from(users).where(eq(users.id, id));
      return result[0];
    } catch (error) {
      console.error("Error getting user by ID:", error);
      return void 0;
    }
  }
  async getUserByUsername(username) {
    try {
      const result = await this.db.select().from(users).where(eq(users.username, username));
      return result[0];
    } catch (error) {
      console.error("Error getting user by username:", error);
      return void 0;
    }
  }
  async getUserByEmail(email) {
    try {
      console.log("[DB] Buscando usuario por email:", email);
      const result = await this.db.select().from(users).where(eq(users.email, email));
      return result[0];
    } catch (error) {
      console.error("[DB] Error getting user by email:", error && error.stack ? error.stack : error);
      console.error("[DB] Estado de DATABASE_URL:", process.env.DATABASE_URL);
      console.error("[DB] Email consultado:", email);
      return void 0;
    }
  }
  async createUser(insertUser) {
    try {
      console.log("[DB] Creando usuario:", insertUser.email);
      const hashedPassword = await bcrypt.hash(insertUser.password, this.saltRounds);
      const verificationToken = crypto.randomBytes(32).toString("hex");
      const newUser = {
        ...insertUser,
        password: hashedPassword,
        verificationToken,
        createdAt: /* @__PURE__ */ new Date(),
        updatedAt: /* @__PURE__ */ new Date(),
        isActive: false
      };
      const result = await this.db.insert(users).values(newUser).returning();
      return result[0];
    } catch (error) {
      console.error("[DB] Error creating user (detalle):", error && error.stack ? error.stack : error);
      console.error("[DB] Estado de DATABASE_URL:", process.env.DATABASE_URL);
      console.error("[DB] Email a crear:", insertUser.email);
      throw new Error("Error inesperado al crear usuario");
    }
  }
  async updateUser(id, userData) {
    try {
      if (userData.password) {
        userData.password = await bcrypt.hash(userData.password, this.saltRounds);
      }
      userData.updatedAt = /* @__PURE__ */ new Date();
      const result = await this.db.update(users).set(userData).where(eq(users.id, id)).returning();
      return result.length ? result[0] : void 0;
    } catch (error) {
      console.error("Error updating user:", error);
      return void 0;
    }
  }
  async verifyUser(token) {
    try {
      const result = await this.db.update(users).set({
        isActive: true,
        verificationToken: null,
        updatedAt: /* @__PURE__ */ new Date()
      }).where(eq(users.verificationToken, token)).returning();
      return result.length > 0;
    } catch (error) {
      console.error("Error verifying user:", error);
      return false;
    }
  }
  async requestPasswordReset(email) {
    try {
      const resetToken = crypto.randomBytes(32).toString("hex");
      const result = await this.db.update(users).set({
        resetPasswordToken: resetToken,
        updatedAt: /* @__PURE__ */ new Date()
      }).where(eq(users.email, email)).returning();
      return result.length ? resetToken : void 0;
    } catch (error) {
      console.error("Error requesting password reset:", error);
      return void 0;
    }
  }
  async resetPassword(token, newPassword) {
    try {
      const hashedPassword = await bcrypt.hash(newPassword, this.saltRounds);
      const result = await this.db.update(users).set({
        password: hashedPassword,
        resetPasswordToken: null,
        updatedAt: /* @__PURE__ */ new Date()
      }).where(eq(users.resetPasswordToken, token)).returning();
      if (result.length > 0) {
        const userId = result[0].id;
        await this.recordPasswordChange(userId);
      }
      return result.length > 0;
    } catch (error) {
      console.error("Error resetting password:", error);
      return false;
    }
  }
  async updateLastLogin(id) {
    try {
      const result = await this.db.update(users).set({
        lastLogin: /* @__PURE__ */ new Date(),
        updatedAt: /* @__PURE__ */ new Date()
      }).where(eq(users.id, id)).returning();
      return result.length > 0;
    } catch (error) {
      console.error("Error updating last login:", error);
      return false;
    }
  }
  async generateVerificationToken(userId) {
    try {
      const verificationToken = crypto.randomBytes(32).toString("hex");
      const result = await this.db.update(users).set({
        verificationToken,
        updatedAt: /* @__PURE__ */ new Date()
      }).where(eq(users.id, userId)).returning();
      return result.length ? verificationToken : void 0;
    } catch (error) {
      console.error("Error generating verification token:", error);
      return void 0;
    }
  }
  // Métodos de preferencias de usuario
  async getUserPreferences(userId) {
    try {
      const result = await this.db.select().from(userPreferences).where(eq(userPreferences.userId, userId));
      return result[0];
    } catch (error) {
      console.error("Error getting user preferences:", error);
      return void 0;
    }
  }
  async createUserPreferences(preferences) {
    try {
      const result = await this.db.insert(userPreferences).values({
        ...preferences,
        updatedAt: /* @__PURE__ */ new Date()
      }).returning();
      return result[0];
    } catch (error) {
      console.error("Error creating user preferences:", error);
      throw new Error("Failed to create user preferences");
    }
  }
  async updateUserPreferences(userId, preferences) {
    try {
      preferences.updatedAt = /* @__PURE__ */ new Date();
      const result = await this.db.update(userPreferences).set(preferences).where(eq(userPreferences.userId, userId)).returning();
      return result.length ? result[0] : void 0;
    } catch (error) {
      console.error("Error updating user preferences:", error);
      return void 0;
    }
  }
  // Métodos de cambios de contraseña
  async recordPasswordChange(userId) {
    try {
      const result = await this.db.insert(passwordChanges).values({
        userId,
        changedAt: /* @__PURE__ */ new Date()
      }).returning();
      return result[0];
    } catch (error) {
      console.error("Error recording password change:", error);
      throw new Error("Failed to record password change");
    }
  }
  async getLastPasswordChange(userId) {
    try {
      const result = await this.db.select().from(passwordChanges).where(eq(passwordChanges.userId, userId)).orderBy(desc(passwordChanges.changedAt)).limit(1);
      return result[0];
    } catch (error) {
      console.error("Error getting last password change:", error);
      return void 0;
    }
  }
  // Métodos de contacto
  async createContact(contact) {
    try {
      const result = await this.db.insert(contacts).values({
        ...contact,
        createdAt: /* @__PURE__ */ new Date()
      }).returning();
      return result[0];
    } catch (error) {
      console.error("Error creating contact:", error);
      throw new Error("Failed to create contact");
    }
  }
  async getContacts(page = 1, limit = 20) {
    try {
      const offset = (page - 1) * limit;
      return await this.db.select().from(contacts).orderBy(desc(contacts.createdAt)).limit(limit).offset(offset);
    } catch (error) {
      console.error("Error getting contacts:", error);
      return [];
    }
  }
  async getContactsCount() {
    try {
      const result = await this.db.select({ count: count() }).from(contacts);
      return result[0]?.count || 0;
    } catch (error) {
      console.error("Error getting contacts count:", error);
      return 0;
    }
  }
  async getContactById(id) {
    try {
      const contacts2 = await this.db.select().from(contacts).where(eq(contacts.id, id));
      return contacts2.length ? contacts2[0] : void 0;
    } catch (error) {
      console.error("Error getting contact by ID:", error);
      return void 0;
    }
  }
  async markContactAsRead(id) {
    try {
      const result = await this.db.update(contacts).set({ isRead: true }).where(eq(contacts.id, id)).returning();
      return result.length > 0;
    } catch (error) {
      console.error("Error marking contact as read:", error);
      return false;
    }
  }
  // Métodos de consulta
  async createConsultation(consultation, serviceDetails, sections) {
    try {
      const result = await this.db.insert(consultations).values({
        ...consultation,
        createdAt: /* @__PURE__ */ new Date()
      }).returning();
      const consultationId = result[0].id;
      if (serviceDetails && serviceDetails.length > 0) {
        await this.db.insert(consultationServices).values(
          serviceDetails.map((service) => ({
            consultationId,
            serviceDetail: service
          }))
        );
      }
      if (sections && sections.length > 0) {
        await this.db.insert(consultationSections).values(
          sections.map((section) => ({
            consultationId,
            section
          }))
        );
      }
      return result[0];
    } catch (error) {
      console.error("Error creating consultation:", error);
      throw new Error("Failed to create consultation");
    }
  }
  async getConsultations(page = 1, limit = 20) {
    try {
      const offset = (page - 1) * limit;
      return await this.db.select().from(consultations).orderBy(desc(consultations.createdAt)).limit(limit).offset(offset);
    } catch (error) {
      console.error("Error getting consultations:", error);
      return [];
    }
  }
  async getConsultationsCount() {
    try {
      const result = await this.db.select({ count: count() }).from(consultations);
      return result[0]?.count || 0;
    } catch (error) {
      console.error("Error getting consultations count:", error);
      return 0;
    }
  }
  async getConsultationById(id) {
    try {
      const consultations2 = await this.db.select().from(consultations).where(eq(consultations.id, id));
      return consultations2.length ? consultations2[0] : void 0;
    } catch (error) {
      console.error("Error getting consultation by ID:", error);
      return void 0;
    }
  }
  async markConsultationAsProcessed(id) {
    try {
      const result = await this.db.update(consultations).set({ isProcessed: true }).where(eq(consultations.id, id)).returning();
      return result.length > 0;
    } catch (error) {
      console.error("Error marking consultation as processed:", error);
      return false;
    }
  }
  // Métodos de newsletter
  async subscribeToNewsletter(data) {
    try {
      const result = await this.db.insert(newsletter).values({
        ...data,
        createdAt: /* @__PURE__ */ new Date()
      }).returning();
      return result[0];
    } catch (error) {
      console.error("Error subscribing to newsletter:", error);
      throw new Error("Failed to subscribe to newsletter");
    }
  }
  async unsubscribeFromNewsletter(email) {
    try {
      const result = await this.db.update(newsletter).set({ isActive: false }).where(eq(newsletter.email, email)).returning();
      return result.length > 0;
    } catch (error) {
      console.error("Error unsubscribing from newsletter:", error);
      return false;
    }
  }
  // Métodos de recursos
  async getResources() {
    try {
      return await this.db.select().from(resources).where(eq(resources.isPublic, true)).orderBy(asc(resources.title));
    } catch (error) {
      console.error("Error getting resources:", error);
      return [];
    }
  }
  async getResourceById(id) {
    try {
      const resources2 = await this.db.select().from(resources).where(eq(resources.id, id));
      return resources2.length ? resources2[0] : void 0;
    } catch (error) {
      console.error("Error getting resource by ID:", error);
      return void 0;
    }
  }
  async incrementDownloadCount(id) {
    try {
      const resource = await this.getResourceById(id);
      if (!resource) {
        return false;
      }
      const result = await this.db.update(resources).set({
        downloadCount: (resource.downloadCount || 0) + 1,
        updatedAt: /* @__PURE__ */ new Date()
      }).where(eq(resources.id, id)).returning();
      return result.length > 0;
    } catch (error) {
      console.error("Error incrementing download count:", error);
      return false;
    }
  }
  // Métodos de tecnologías
  async getTechnologies(category) {
    try {
      if (category) {
        const result = await this.db.select().from(technologies).where(eq(technologies.category, category)).orderBy(asc(technologies.name));
        return result;
      } else {
        const result = await this.db.select().from(technologies).orderBy(asc(technologies.name));
        return result;
      }
    } catch (error) {
      console.error("Error getting technologies:", error);
      return [];
    }
  }
  // Métodos de analíticas
  async trackEvent(event) {
    try {
      if (!event.eventType) {
        console.error("Error tracking event: eventType is required");
        return;
      }
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
        createdAt: /* @__PURE__ */ new Date()
      };
      await this.db.insert(analytics).values(eventData);
    } catch (error) {
      console.error("Error tracking event:", error);
    }
  }
};
var storage = new DatabaseStorage();

// server/routes.ts
import crypto2 from "crypto";
import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import express from "express";
import axios from "axios";
dotenv.config({ path: resolve(process.cwd(), ".env") });
dotenv.config({ path: resolve(process.cwd(), "config.env") });
dotenv.config({ path: resolve(process.cwd(), "config.env.example") });
console.log("\u{1F527} Verificando variables de entorno...");
console.log("\u{1F4C1} Directorio actual:", process.cwd());
console.log("\u{1F30D} NODE_ENV:", process.env.NODE_ENV);
console.log("\u{1F511} SESSION_SECRET:", process.env.SESSION_SECRET ? "Configurado" : "No configurado");
console.log("\u{1F4CA} SUPABASE_URL:", process.env.SUPABASE_URL ? "Configurado" : "No configurado");
var router = express.Router();
var ACCESS_TOKEN = process.env.MP_ACCESS_TOKEN || "";
var PLANES = {
  "Plan B\xE1sico": 1e4,
  "Plan Pro": 2e4,
  "Plan Premium": 3e4
};
router.post("/crear-preferencia", async (req, res) => {
  try {
    const { plan } = req.body;
    if (!PLANES[plan]) {
      return res.status(400).json({ error: "Plan inv\xE1lido" });
    }
    const preference = {
      items: [
        {
          title: plan,
          unit_price: PLANES[plan],
          quantity: 1
        }
      ],
      back_urls: {
        success: "https://tuweb-ai.com/pago-exitoso",
        failure: "https://tuweb-ai.com/pago-fallido",
        pending: "https://tuweb-ai.com/pago-pendiente"
      },
      auto_return: "approved"
    };
    const mpRes = await axios.post(
      "https://api.mercadopago.com/checkout/preferences",
      preference,
      {
        headers: {
          Authorization: `Bearer ${ACCESS_TOKEN}`,
          "Content-Type": "application/json"
        }
      }
    );
    return res.json({ init_point: mpRes.data.init_point });
  } catch (err) {
    return res.status(500).json({ error: "Error al crear preferencia", details: err.message });
  }
});
var googleClientId = process.env.GOOGLE_CLIENT_ID;
var googleClientSecret = process.env.GOOGLE_CLIENT_SECRET;
if (googleClientId && googleClientSecret) {
  console.log("\u{1F527} Configurando Google OAuth...");
  console.log("\u{1F4CB} Client ID configurado:", googleClientId ? "S\xED" : "No");
  console.log("\u{1F511} Client Secret configurado:", googleClientSecret ? "S\xED" : "No");
  passport.use(new GoogleStrategy({
    clientID: googleClientId,
    clientSecret: googleClientSecret,
    callbackURL: process.env.NODE_ENV === "production" && process.env.DOMAIN ? `https://${process.env.DOMAIN}/api/auth/google/callback` : "http://localhost:5000/api/auth/google/callback",
    proxy: true
    // Importante para manejar proxies correctamente
  }, async (accessToken, refreshToken, profile, done) => {
    try {
      console.log("\u{1F510} Google OAuth callback iniciado");
      console.log("\u{1F4E7} Email del perfil:", profile.emails?.[0]?.value);
      console.log("\u{1F464} Nombre del perfil:", profile.displayName);
      const email = profile.emails?.[0]?.value;
      if (!email) {
        console.log("\u274C No se pudo obtener el email de Google");
        return done(null, false, { message: "No se pudo obtener el email de Google." });
      }
      console.log("\u{1F50D} Buscando usuario por email:", email);
      let user = await storage.getUserByEmail(email);
      if (user === void 0) {
        console.error("\u274C Error de conexi\xF3n a la base de datos al buscar usuario por email.");
        return done(null, false, { message: "db_connection_error" });
      }
      if (!user) {
        console.log("\u{1F464} Usuario no encontrado, creando nuevo usuario");
        user = await storage.createUser({
          username: profile.displayName.replace(/\s+/g, "").toLowerCase() + Math.floor(Math.random() * 1e4),
          email,
          password: crypto2.randomBytes(16).toString("hex"),
          // Contraseña aleatoria (no se usa)
          name: profile.displayName
        });
        console.log("\u2705 Usuario creado exitosamente:", user.id);
        if (profile.photos?.[0]?.value) {
          console.log("\u{1F5BC}\uFE0F Actualizando imagen de perfil");
          await storage.updateUser(user.id, { image: profile.photos[0].value });
          user = await storage.getUser(user.id);
        }
      } else {
        console.log("\u{1F464} Usuario encontrado:", user.id);
        if (!user.isActive) {
          console.log("\u2705 Activando usuario inactivo");
          await storage.updateUser(user.id, { isActive: true });
        }
      }
      console.log("\u{1F389} Google OAuth completado exitosamente");
      return done(null, user);
    } catch (err) {
      console.error("\u274C Error en Google OAuth callback:", err);
      return done(err);
    }
  }));
} else {
  console.log("\u26A0\uFE0F Google OAuth no configurado - faltan GOOGLE_CLIENT_ID o GOOGLE_CLIENT_SECRET");
  console.log("\u{1F4CB} Variables de entorno disponibles:");
  console.log("   - GOOGLE_CLIENT_ID:", googleClientId ? "Configurado" : "No configurado");
  console.log("   - GOOGLE_CLIENT_SECRET:", googleClientSecret ? "Configurado" : "No configurado");
}
passport.serializeUser((user, done) => {
  done(null, { id: user.id, email: user.email });
});
passport.deserializeUser(async (obj, done) => {
  try {
    const user = await storage.getUser(obj.id);
    done(null, user);
  } catch (err) {
    done(err);
  }
});

// server/vite.ts
import express2 from "express";
import fs from "fs";
import path2 from "path";
import { createServer as createViteServer, createLogger } from "vite";

// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import themePlugin from "@replit/vite-plugin-shadcn-theme-json";
import path from "path";
import runtimeErrorOverlay from "@replit/vite-plugin-runtime-error-modal";
var vite_config_default = defineConfig({
  plugins: [
    react(),
    runtimeErrorOverlay(),
    themePlugin(),
    ...process.env.NODE_ENV !== "production" && process.env.REPL_ID !== void 0 ? [
      await import("@replit/vite-plugin-cartographer").then(
        (m) => m.cartographer()
      )
    ] : []
  ],
  server: {
    proxy: {
      "/api": "http://localhost:5000"
    }
  },
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "client", "src"),
      "@shared": path.resolve(import.meta.dirname, "shared"),
      "@assets": path.resolve(import.meta.dirname, "attached_assets")
    }
  },
  root: path.resolve(import.meta.dirname, "client"),
  build: {
    outDir: path.resolve(import.meta.dirname, "dist"),
    emptyOutDir: true
  }
});

// server/vite.ts
import { nanoid } from "nanoid";
var viteLogger = createLogger();
function log(message, source = "express") {
  const formattedTime = (/* @__PURE__ */ new Date()).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true
  });
  console.log(`${formattedTime} [${source}] ${message}`);
}
async function setupVite(app2, server) {
  const serverOptions = {
    middlewareMode: true,
    hmr: { server },
    allowedHosts: ["localhost", "127.0.0.1"]
  };
  const vite = await createViteServer({
    ...vite_config_default,
    configFile: false,
    customLogger: {
      ...viteLogger,
      error: (msg, options) => {
        viteLogger.error(msg, options);
        process.exit(1);
      }
    },
    server: serverOptions,
    appType: "custom"
  });
  app2.use(vite.middlewares);
  app2.use("*", async (req, res, next) => {
    const url = req.originalUrl;
    try {
      const clientTemplate = path2.resolve(
        import.meta.dirname,
        "..",
        "client",
        "index.html"
      );
      let template = await fs.promises.readFile(clientTemplate, "utf-8");
      template = template.replace(
        `src="/src/main.tsx"`,
        `src="/src/main.tsx?v=${nanoid()}"`
      );
      const page = await vite.transformIndexHtml(url, template);
      res.status(200).set({ "Content-Type": "text/html" }).end(page);
    } catch (e) {
      vite.ssrFixStacktrace(e);
      next(e);
    }
  });
}
function serveStatic(app2) {
  const distPath = path2.resolve(import.meta.dirname, "public");
  if (!fs.existsSync(distPath)) {
    throw new Error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`
    );
  }
  app2.use(express2.static(distPath));
  app2.use("*", (_req, res) => {
    res.sendFile(path2.resolve(distPath, "index.html"));
  });
}

// server/index.ts
import session from "express-session";
import MemoryStore from "memorystore";
import path3 from "path";
import passport2 from "passport";
import { fileURLToPath } from "url";
import { createServer } from "http";
dotenv2.config();
var __filename = fileURLToPath(import.meta.url);
var __dirname = path3.dirname(__filename);
var app = express3();
app.use(express3.json());
app.use(express3.urlencoded({ extended: false }));
app.use(router);
var index_default = app;
var Store = MemoryStore(session);
var sessionStore = new Store({
  checkPeriod: 864e5
  // Limpiar sesiones expiradas cada 24 horas
});
log("Usando MemoryStore para almacenar sesiones localmente");
app.use(
  session({
    secret: process.env.SESSION_SECRET || "tuwebai-super-secret-key",
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: false,
      // SIEMPRE false en desarrollo
      maxAge: 1e3 * 60 * 60 * 24,
      // 24 horas
      sameSite: "lax",
      // SIEMPRE lax en desarrollo
      httpOnly: true,
      domain: void 0
      // Nunca poner dominio en desarrollo
    },
    store: sessionStore,
    name: "tuwebai.sid"
  })
);
app.use(passport2.initialize());
app.use(passport2.session());
app.use((req, res, next) => {
  if (req.path.includes("/auth/")) {
    console.log(`\u{1F50D} [${(/* @__PURE__ */ new Date()).toISOString()}] ${req.method} ${req.path}`);
    console.log("\u{1F36A} Session ID:", req.sessionID);
    console.log("\u{1F464} User ID en sesi\xF3n:", req.session?.userId);
    console.log("\u{1F4E7} User Email en sesi\xF3n:", req.session?.userEmail);
  }
  next();
});
app.use((req, res, next) => {
  const start = Date.now();
  const path4 = req.path;
  let capturedJsonResponse = void 0;
  const originalResJson = res.json;
  res.json = function(bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };
  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path4.startsWith("/api")) {
      let logLine = `${req.method} ${path4} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }
      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "\u2026";
      }
      log(logLine);
    }
  });
  next();
});
app.get("/favicon.ico", (req, res) => {
  res.sendFile(path3.join(__dirname, "../public/favicon.ico"));
});
app.use(express3.static(path3.join(__dirname, "../public")));
var httpServer = createServer(app);
(async () => {
  if (app.get("env") === "development") {
    await setupVite(app, httpServer);
  } else {
    serveStatic(app);
  }
  const port = process.env.PORT ? parseInt(process.env.PORT) : 5e3;
  httpServer.listen({
    port,
    host: "127.0.0.1"
  }, () => {
    log(`serving on port ${port}`);
  });
})();
export {
  index_default as default
};
