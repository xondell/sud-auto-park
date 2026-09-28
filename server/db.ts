import { and, desc, eq, like, or, sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { InsertUser, InsertVehicle, User, Vehicle, users, vehicles } from "../drizzle/schema";
import { ENV } from "./_core/env";

let _db: ReturnType<typeof drizzle> | null = null;

export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) throw new Error("User openId is required for upsert");
  const db = await getDb();
  if (!db) return;
  const values: InsertUser = { openId: user.openId };
  const updateSet: Record<string, unknown> = {};
  const textFields = ["name", "email", "loginMethod"] as const;
  for (const field of textFields) {
    if (user[field] !== undefined) {
      values[field] = user[field] ?? null;
      updateSet[field] = user[field] ?? null;
    }
  }
  if (user.lastSignedIn !== undefined) {
    values.lastSignedIn = user.lastSignedIn;
    updateSet.lastSignedIn = user.lastSignedIn;
  }
  if (user.role !== undefined) {
    values.role = user.role;
    updateSet.role = user.role;
  } else if (user.openId === ENV.ownerOpenId) {
    values.role = "admin";
    updateSet.role = "admin";
  }
  if (!values.lastSignedIn) values.lastSignedIn = new Date();
  if (Object.keys(updateSet).length === 0) updateSet.lastSignedIn = new Date();
  await db.insert(users).values(values).onDuplicateKeyUpdate({ set: updateSet });
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);
  return result[0];
}

export type VehicleFilters = {
  query?: string;
  type?: "car" | "motorcycle" | "minibus";
  minPrice?: number;
  maxPrice?: number;
  yearFrom?: number;
  yearTo?: number;
  status?: "available" | "reserved" | "sold";
};

export async function listVehicles(filters: VehicleFilters = {}) {
  const db = await getDb();
  if (!db) return [] as Vehicle[];
  const conditions = [];
  if (filters.type) conditions.push(eq(vehicles.type, filters.type));
  if (filters.status) conditions.push(eq(vehicles.status, filters.status));
  if (filters.minPrice !== undefined) conditions.push(sql`${vehicles.price} >= ${filters.minPrice}`);
  if (filters.maxPrice !== undefined) conditions.push(sql`${vehicles.price} <= ${filters.maxPrice}`);
  if (filters.yearFrom !== undefined) conditions.push(sql`${vehicles.year} >= ${filters.yearFrom}`);
  if (filters.yearTo !== undefined) conditions.push(sql`${vehicles.year} <= ${filters.yearTo}`);
  if (filters.query?.trim()) {
    const q = `%${filters.query.trim()}%`;
    conditions.push(or(like(vehicles.make, q), like(vehicles.model, q), like(vehicles.description, q)));
  }
  return db.select().from(vehicles).where(conditions.length ? and(...conditions) : undefined).orderBy(desc(vehicles.featured), desc(vehicles.createdAt));
}

export async function getVehicleBySlug(slug: string) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(vehicles).where(eq(vehicles.slug, slug)).limit(1);
  return result[0];
}

export async function getVehicleStats() {
  const db = await getDb();
  if (!db) return { total: 0, available: 0, reserved: 0, sold: 0 };
  const rows = await db.select({
    total: sql<number>`count(*)`,
    available: sql<number>`sum(case when ${vehicles.status} = 'available' then 1 else 0 end)`,
    reserved: sql<number>`sum(case when ${vehicles.status} = 'reserved' then 1 else 0 end)`,
    sold: sql<number>`sum(case when ${vehicles.status} = 'sold' then 1 else 0 end)`,
  }).from(vehicles);
  const row = rows[0];
  return { total: Number(row?.total ?? 0), available: Number(row?.available ?? 0), reserved: Number(row?.reserved ?? 0), sold: Number(row?.sold ?? 0) };
}

export async function createVehicle(data: InsertVehicle) {
  const db = await getDb();
  if (!db) throw new Error("Database unavailable");
  await db.insert(vehicles).values(data);
  return getVehicleBySlug(data.slug);
}

export async function updateVehicle(id: number, data: Partial<InsertVehicle>) {
  const db = await getDb();
  if (!db) throw new Error("Database unavailable");
  await db.update(vehicles).set(data).where(eq(vehicles.id, id));
  const rows = await db.select().from(vehicles).where(eq(vehicles.id, id)).limit(1);
  return rows[0];
}

export async function deleteVehicle(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database unavailable");
  await db.delete(vehicles).where(eq(vehicles.id, id));
  return { success: true as const };
}
