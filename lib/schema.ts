import { pgTable, text, timestamp, boolean, integer } from "drizzle-orm/pg-core";

export const users = pgTable("user_data", {
  id: text("id").primaryKey(),        
  name: text("name"),
  email: text("email").notNull(),
  image: text("picture"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const userSettings = pgTable("user_settings", {
  userId: text("user_id").primaryKey().references(() => users.id),
  plan: text("plan").default("Starter"), 
  emailNotif: boolean("email_notif").default(true),
  newsletter: boolean("newsletter").default(false),
});

export const cvs = pgTable("cvs", {
  id: text("id").primaryKey(),
  userId: text("user_id").references(() => users.id),
  title: text("title").notNull(),
  language: text("language").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const interviews = pgTable("interview_panel", {
  id: text("id").primaryKey(),
  userId: text("user_id").references(() => users.id),
  cvName: text("cv_name").notNull(),
  role: text("role").notNull(),
  status: text("status").notNull(),
  score: integer("score"),
  scheduledAt: timestamp("scheduled_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
