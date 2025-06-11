import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";
import { createInsertSchema } from "drizzle-zod";

export const users = sqliteTable("users", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  email: text("email").notNull().unique(),
  name: text("name"),
  createdAt: text("created_at").notNull().default("CURRENT_TIMESTAMP"),
});

export const insertUserSchema = createInsertSchema(users).pick({
  email: true,
  name: true,
});
