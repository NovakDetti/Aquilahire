import { pgTable, text, timestamp, boolean, integer, uuid, json, serial } from "drizzle-orm/pg-core";

export const users = pgTable("user_data", {
  id: uuid("id"),
  name: text("name"),
  email: text("email").notNull().unique(),
  image: text("picture"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
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
  text_content: text("text_content"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const interviews = pgTable("interview_panel", {
  id: text("id").primaryKey(),
  userId: text("user_id").references(() => users.id),
  cvName: text("cv_name").notNull(),
  role: text("role").notNull(),
  status: text("status").notNull(),
  score: integer("score"),
  correctCount: integer("correct_count"),
  totalQuestions: integer("total_questions"),
  scheduledAt: timestamp("scheduled_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const interviewQuestions = pgTable("interview_questions", {
  id: serial("id").primaryKey(),    
  interviewId: uuid("interview_id").notNull(),
  questionOrder: integer("question_order").notNull(),
  questionText: text("question_text").notNull(),
  optionsJson: json("options_json").notNull(),
  correctOptionId: text("correct_option_id").notNull(),
});

export const interviewAnswers = pgTable("interview_answers", {
  id: serial("id").primaryKey(),
  interviewId: uuid("interview_id").notNull(),
  questionId: integer("question_id")
    .notNull()
    .references(() => interviewQuestions.id, { onDelete: "cascade" }),
  selectedOptionId: text("selected_option_id").notNull(),
  isCorrect: boolean("is_correct").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

