import type { Config, Context } from "@netlify/functions";
import { sendToGroups } from "./_shared/telegram";

const headers = { "access-control-allow-origin": "*", "access-control-allow-methods": "POST, OPTIONS", "content-type": "application/json" };

export default async (request: Request, _context: Context) => {
  if (request.method === "OPTIONS") return new Response(null, { headers });
  if (request.method !== "POST") return new Response(JSON.stringify({ error: "Method not allowed" }), { status: 405, headers });
  try {
    const { name, phone, vehicle } = await request.json();
    if (!name || !phone || !vehicle) return new Response(JSON.stringify({ error: "Заполните имя и телефон" }), { status: 400, headers });
    const count = await sendToGroups(`🚗 Новая заявка с сайта SUD Auto Park\n\nТранспорт: ${vehicle}\nКлиент: ${name}\nТелефон: ${phone}`);
    if (!count) return new Response(JSON.stringify({ error: "Добавьте бота хотя бы в одну группу" }), { status: 503, headers });
    return new Response(JSON.stringify({ ok: true }), { headers });
  } catch { return new Response(JSON.stringify({ error: "Не удалось отправить заявку" }), { status: 500, headers }); }
};

export const config: Config = { path: "/api/lead", method: ["POST", "OPTIONS"] };
