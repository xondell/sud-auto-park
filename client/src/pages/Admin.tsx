import { useState } from "react";
import { Link } from "wouter";
import { getVehicles, saveVehicles, type Vehicle } from "@/data/vehicles";
import { ArrowLeft, Plus, Trash2 } from "lucide-react";

export default function Admin() {
  const [vehicles, setVehicles] = useState(getVehicles);
  const [make, setMake] = useState("");
  const [model, setModel] = useState("");
  const [price, setPrice] = useState("");
  const [notice, setNotice] = useState("");
  const persist = (next: Vehicle[]) => { setVehicles(next); saveVehicles(next); };
  const addVehicle = (event: React.FormEvent) => {
    event.preventDefault(); if (!make || !model || !price) return;
    const slug = `${make}-${model}-${Date.now()}`.toLowerCase().replace(/[^a-zа-яё0-9]+/gi, "-");
    persist([...vehicles, { id: Date.now(), slug, type: "car", make, model, year: new Date().getFullYear(), price: Number(price), mileage: 0, fuel: "Бензин", transmission: "Автомат", engine: "—", drive: "Передний", color: "Не указан", featured: 0, imageUrl: "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&w=1200&q=85", description: "Новая карточка транспорта. Уточните характеристики у менеджера.", location: "Кишинёв", status: "available" }]);
    setMake(""); setModel(""); setPrice(""); setNotice("Карточка добавлена и сохранена в этом браузере.");
  };
  return <main className="min-h-screen bg-[#0d0d0f] text-white"><div className="container py-8 md:py-12"><Link href="/" className="inline-flex items-center gap-2 text-sm font-bold text-[#d71920]"><ArrowLeft className="h-4 w-4" /> На сайт</Link><div className="mt-7 flex flex-col justify-between gap-4 sm:flex-row"><div><p className="eyebrow">SUD AUTO PARK · ADMIN</p><h1 className="mt-2 text-4xl font-extrabold">Управление каталогом</h1><p className="mt-3 max-w-2xl text-sm text-[#a6a6ad]">Статическая панель: изменения сохраняются только в браузере, где они сделаны.</p></div><div className="rounded-2xl bg-[#17171a] px-5 py-4"><p className="text-sm text-[#a6a6ad]">В каталоге</p><p className="text-3xl font-extrabold text-[#d71920]">{vehicles.length}</p></div></div>{notice && <p className="mt-6 rounded-2xl bg-[#27272b] p-4 text-sm text-[#c9ffc9]">{notice}</p>}<form onSubmit={addVehicle} className="mt-7 grid gap-3 rounded-[24px] bg-[#17171a] p-5 md:grid-cols-4"><input required value={make} onChange={(e) => setMake(e.target.value)} placeholder="Марка" className="rounded-xl bg-[#242428] p-3 outline-none" /><input required value={model} onChange={(e) => setModel(e.target.value)} placeholder="Модель" className="rounded-xl bg-[#242428] p-3 outline-none" /><input required type="number" value={price} onChange={(e) => setPrice(e.target.value)} placeholder="Цена, €" className="rounded-xl bg-[#242428] p-3 outline-none" /><button className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#d71920] p-3 font-bold"><Plus className="h-4 w-4" /> Добавить</button></form><div className="mt-7 divide-y divide-[#2b2b30] overflow-hidden rounded-[24px] bg-[#17171a]">{vehicles.map((vehicle) => <article key={vehicle.id} className="flex items-center justify-between gap-4 p-4"><div><h2 className="font-bold">{vehicle.make} {vehicle.model}</h2><p className="mt-1 text-sm text-[#a6a6ad]">{vehicle.year} · €{new Intl.NumberFormat("ru-RU").format(vehicle.price)} · {vehicle.status === "available" ? "В наличии" : vehicle.status}</p></div><button onClick={() => persist(vehicles.filter((item) => item.id !== vehicle.id))} className="rounded-xl p-3 text-[#ff7d86] hover:bg-[#2b2b30]" aria-label="Удалить"><Trash2 className="h-5 w-5" /></button></article>)}</div></div></main>;
}
