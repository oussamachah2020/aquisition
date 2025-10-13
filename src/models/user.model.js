import { pgTable, serial, timestamp, varchar } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 255 }).notNull().unique(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  password: varchar('name', { length: 50 }).notNull().default('user'),
  role: varchar('role', { length: 255 }).notNull().unique(),
  created_at: timestamp().defaultNow().notNull(),
  updated_at: timestamp().defaultNow().notNull(),
});
