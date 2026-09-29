import { useMemo, useState } from "react";
import { Bot, MessageCircle, Sparkles, X } from "lucide-react";
import type { Vehicle } from "@/data/vehicles";

type Answer = { question: string; answer: string };

export default function CatalogAssistant({ vehicles }: { vehicles: Vehicle[] }) {
  const [open, setOpen] = useState(false);
  const [answer, setAnswer] = useState<Answer | null>(null);
  const answers = useMemo<Answer[]>(() => {
    const budget = vehicles.filter((vehicle) => vehicle.price <= 10000).sort((a, b) => a.price - b.price);
    const family = vehicles.filter((vehicle) => vehicle.type === "car" && vehicle.year >= 2017).slice(0, 3);
    const business = vehicles.filter((vehicle) => vehicle.type === "minibus").slice(0, 2);
    return [
      { question: "Что есть до €10 000?", answer: budget.length ? `Сейчас под бюджет подходят: ${budget.map((vehicle) => `${vehicle.make} ${vehicle.model} — €${new Intl.NumberFormat("ru-RU").format(vehicle.price)}`).join("; ")}.` : "Сейчас в каталоге нет вариантов до €10 000." },
      { question: "Какой автомобиль выбрать для семьи?", answer: family.length ? `Для семьи стоит посмотреть: ${family.map((vehicle) => `${vehicle.make} ${vehicle.model}`).join(", ")}. У них современный год выпуска и комфортная комплектация.` : "Сейчас подходящих семейных автомобилей не найдено." },
      { question: "Есть ли транспорт для бизнеса?", answer: business.length ? `Да. В каталоге есть ${business.map((vehicle) => `${vehicle.make} ${vehicle.model}`).join(" и ")}. Откройте карточку, чтобы посмотреть комплектацию.` : "Сейчас микроавтобусов в каталоге нет." },
      { question: "Можно ли оставить заявку?", answer: "Да. Откройте карточку понравившегося транспорта, укажите имя и телефон — заявка сразу уйдёт менеджеру в Telegram." },
    ];
  }, [vehicles]);
  return <aside className="fixed bottom-5 left-1/2 z-40 -translate-x-1/2"><div className={`mb-3 w-[min(360px,calc(100vw-32px))] overflow-hidden rounded-[24px] border border-[#3a3a42] bg-[#17171a] shadow-2xl transition ${open ? "block" : "hidden"}`}><div className="flex items-center justify-between bg-[#242428] px-5 py-4"><div className="flex items-center gap-3"><span className="grid h-9 w-9 place-items-center rounded-xl bg-[#d71920]"><Bot className="h-5 w-5" /></span><div><p className="font-extrabold">Помощник по каталогу</p><p className="text-xs text-[#a6a6ad]">Подскажу подходящий вариант</p></div></div><button onClick={() => setOpen(false)} className="rounded-lg p-2 text-[#a6a6ad] hover:bg-white/10" aria-label="Закрыть помощника"><X className="h-4 w-4" /></button></div><div className="p-5"><p className="text-sm text-[#c4c4ca]">Выберите вопрос — помощник сразу ответит.</p><div className="mt-4 grid gap-2">{answers.map((item) => <button key={item.question} onClick={() => setAnswer(item)} className="rounded-xl border border-[#3a3a42] px-4 py-3 text-left text-sm font-semibold transition hover:border-[#d71920] hover:bg-[#242428]">{item.question}</button>)}</div>{answer && <div className="mt-4 rounded-xl bg-[#242428] p-4"><div className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#ef233c]"><Sparkles className="h-3.5 w-3.5" /> Ответ помощника</div><p className="text-sm leading-relaxed text-[#e7e7ea]">{answer.answer}</p></div>}</div></div><button onClick={() => setOpen(!open)} className="mx-auto flex items-center gap-2 rounded-full bg-[#d71920] px-5 py-3.5 font-bold shadow-lg transition hover:bg-[#ef233c]"><MessageCircle className="h-5 w-5" /> Помощник</button></aside>;
}
