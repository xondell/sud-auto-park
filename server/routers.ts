import { z } from "zod";
import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { protectedProcedure, publicProcedure, router } from "./_core/trpc";
import { createVehicle, deleteVehicle, getVehicleBySlug, getVehicleStats, listVehicles, updateVehicle } from "./db";

const vehicleInput = z.object({
  slug: z.string().min(2), type: z.enum(["car", "motorcycle", "minibus"]), make: z.string().min(1), model: z.string().min(1), year: z.number().int().min(1950).max(2035), price: z.number().int().min(0), mileage: z.number().int().min(0), fuel: z.string().min(1), transmission: z.string().min(1), engine: z.string().min(1), drive: z.string().optional(), color: z.string().optional(), location: z.string().min(1), condition: z.string().min(1), status: z.enum(["available", "reserved", "sold"]).default("available"), featured: z.number().int().min(0).max(1).default(0), imageUrl: z.string().url(), description: z.string().min(10),
});

const adminOnly = protectedProcedure.use(({ ctx, next }) => {
  if (ctx.user.role !== "admin") throw new Error("Admin access required");
  return next();
});

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return { success: true } as const;
    }),
  }),
  vehicles: router({
    list: publicProcedure.input(z.object({ query: z.string().optional(), type: z.enum(["car", "motorcycle", "minibus"]).optional(), minPrice: z.number().optional(), maxPrice: z.number().optional(), yearFrom: z.number().optional(), yearTo: z.number().optional(), status: z.enum(["available", "reserved", "sold"]).optional() }).optional()).query(({ input }) => listVehicles(input ?? {})),
    bySlug: publicProcedure.input(z.object({ slug: z.string() })).query(({ input }) => getVehicleBySlug(input.slug)),
    stats: publicProcedure.query(() => getVehicleStats()),
    adminList: adminOnly.query(() => listVehicles()),
    create: adminOnly.input(vehicleInput).mutation(({ input }) => createVehicle(input)),
    update: adminOnly.input(z.object({ id: z.number().int(), data: vehicleInput.partial() })).mutation(({ input }) => updateVehicle(input.id, input.data)),
    remove: adminOnly.input(z.object({ id: z.number().int() })).mutation(({ input }) => deleteVehicle(input.id)),
  }),
});

export type AppRouter = typeof appRouter;
