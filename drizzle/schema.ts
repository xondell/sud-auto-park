import { int, mysqlEnum, mysqlTable, text, timestamp, varchar } from "drizzle-orm/mysql-core";

export const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export const vehicles = mysqlTable("vehicles", {
  id: int("id").autoincrement().primaryKey(),
  slug: varchar("slug", { length: 160 }).notNull().unique(),
  type: mysqlEnum("type", ["car", "motorcycle", "minibus"]).notNull(),
  make: varchar("make", { length: 80 }).notNull(),
  model: varchar("model", { length: 120 }).notNull(),
  year: int("year").notNull(),
  price: int("price").notNull(),
  mileage: int("mileage").notNull(),
  fuel: varchar("fuel", { length: 40 }).notNull(),
  transmission: varchar("transmission", { length: 40 }).notNull(),
  engine: varchar("engine", { length: 40 }).notNull(),
  drive: varchar("drive", { length: 40 }),
  color: varchar("color", { length: 40 }),
  location: varchar("location", { length: 80 }).notNull().default("Кишинёв"),
  condition: varchar("condition", { length: 40 }).notNull().default("В наличии"),
  status: mysqlEnum("status", ["available", "reserved", "sold"]).notNull().default("available"),
  featured: int("featured").notNull().default(0),
  imageUrl: text("imageUrl").notNull(),
  description: text("description").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;
export type Vehicle = typeof vehicles.$inferSelect;
export type InsertVehicle = typeof vehicles.$inferInsert;
