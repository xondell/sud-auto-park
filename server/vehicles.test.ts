import { describe, expect, it } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

function contextFor(role: "user" | "admin" | undefined): TrpcContext {
  return {
    user: role ? { id: 1, openId: `${role}-user`, email: `${role}@example.com`, name: role, loginMethod: "test", role, createdAt: new Date(), updatedAt: new Date(), lastSignedIn: new Date() } : null,
    req: { protocol: "https", headers: {} } as TrpcContext["req"],
    res: { clearCookie: () => undefined } as TrpcContext["res"],
  };
}

describe("vehicles router", () => {
  it("allows public callers to request the catalog", async () => {
    const caller = appRouter.createCaller(contextFor(undefined));
    await expect(caller.vehicles.list({ type: "car" })).resolves.toBeDefined();
  });

  it("blocks the admin catalog from regular users", async () => {
    const caller = appRouter.createCaller(contextFor("user"));
    await expect(caller.vehicles.adminList()).rejects.toThrow();
  });

  it("accepts admin context for protected procedures", async () => {
    const caller = appRouter.createCaller(contextFor("admin"));
    await expect(caller.vehicles.adminList()).resolves.toBeDefined();
  });
});
