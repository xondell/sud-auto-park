import type { Config, Context } from "@netlify/functions";
import { addGroup } from "./_shared/telegram";

export default async (request: Request, _context: Context) => {
  if (request.method !== "POST") return new Response("Method not allowed", { status: 405 });
  const update = await request.json();
  const membership = update.my_chat_member;
  const chat = membership?.chat;
  if (chat && (chat.type === "group" || chat.type === "supergroup") && ["member", "administrator"].includes(membership.new_chat_member?.status)) await addGroup(chat.id);
  return new Response("ok");
};

export const config: Config = { path: "/api/telegram-webhook", method: ["POST"] };
