import { getStore } from "@netlify/blobs";

const store = getStore({ name: "telegram-groups", consistency: "strong" });
const token = () => Netlify.env.get("TELEGRAM_BOT_TOKEN");

export async function addGroup(chatId: number) {
  const groups = ((await store.get("chat-ids", { type: "json" })) as number[] | null) ?? [];
  if (!groups.includes(chatId)) await store.setJSON("chat-ids", [...groups, chatId]);
}

export async function sendToGroups(text: string) {
  const groups = ((await store.get("chat-ids", { type: "json" })) as number[] | null) ?? [];
  const botToken = token();
  if (!botToken) throw new Error("Telegram bot is not configured");
  await Promise.all(groups.map(async (chatId) => {
    const response = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ chat_id: chatId, text }) });
    if (!response.ok) throw new Error(`Telegram delivery failed for ${chatId}`);
  }));
  return groups.length;
}
