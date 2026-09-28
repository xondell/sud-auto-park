import { getDb } from "../server/db";
import { vehicles } from "../drizzle/schema";

const demo = [
  ["skoda-octavia-2023", "car", "Skoda", "Octavia A8", 2023, 17200, 103000, "Plug-in гибрид", "Автомат", "1.4 л", "Передний", "Серебристый", 1, "https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?auto=format&fit=crop&w=1200&q=85", "Практичный городской универсал с экономичным гибридным приводом и богатой комплектацией."],
  ["jeep-wrangler-2022", "car", "Jeep", "Wrangler IV", 2022, 32000, 37000, "Plug-in гибрид", "Автомат", "2.0 л", "4x4", "Графитовый", 1, "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=1200&q=85", "Легендарный внедорожник для города и приключений. Полный привод и низкий пробег."],
  ["toyota-corolla-2017", "car", "Toyota", "Corolla E160", 2017, 9000, 210000, "Дизель", "Механика", "1.4 л", "Передний", "Белый", 1, "https://images.unsplash.com/photo-1550355291-bbee04a92027?auto=format&fit=crop&w=1200&q=85", "Надёжный седан для ежедневных поездок с проверенной экономичностью Toyota."],
  ["toyota-auris-2008", "car", "Toyota", "Auris I", 2008, 5700, 280000, "Дизель", "Механика", "1.4 л", "Передний", "Красный", 0, "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&w=1200&q=85", "Компактный и неприхотливый автомобиль в ухоженном состоянии."],
  ["kia-sportage-2021", "car", "KIA", "Sportage IV", 2021, 16800, 150000, "Дизель", "Автомат", "1.6 л", "4x4", "Синий", 1, "https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?auto=format&fit=crop&w=1200&q=85", "Комфортный кроссовер с высоким клиренсом, камерой и климат-контролем."],
  ["mercedes-e-class-2011", "car", "Mercedes-Benz", "E-Class W212", 2011, 11700, 265000, "Бензин", "Автомат", "1.8 л", "Задний", "Чёрный", 0, "https://images.unsplash.com/photo-1502877338535-766e1452684a?auto=format&fit=crop&w=1200&q=85", "Бизнес-седан с комфортным салоном и классическим характером Mercedes-Benz."],
  ["bmw-gs-2020", "motorcycle", "BMW", "R 1250 GS", 2020, 14500, 28000, "Бензин", "Механика", "1254 см³", "Кардан", "Серый", 1, "https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&w=1200&q=85", "Турэндуро для дальних поездок: электронные ассистенты, кофры и сервисная история."],
  ["honda-cbr-2019", "motorcycle", "Honda", "CBR 650R", 2019, 8200, 19000, "Бензин", "Механика", "649 см³", "Цепь", "Красный", 0, "https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?auto=format&fit=crop&w=1200&q=85", "Спортивный мотоцикл с точной управляемостью и ярким дизайном."],
  ["mercedes-sprinter-2020", "minibus", "Mercedes-Benz", "Sprinter 316", 2020, 26900, 168000, "Дизель", "Механика", "2.1 л", "Задний", "Белый", 1, "https://images.unsplash.com/photo-1566576912321-d58ddd7a6088?auto=format&fit=crop&w=1200&q=85", "Готовый к работе микроавтобус с длинной базой и удобным доступом в салон."],
  ["ford-transit-2018", "minibus", "Ford", "Transit Custom", 2018, 18400, 198000, "Дизель", "Механика", "2.0 л", "Передний", "Серебристый", 0, "https://images.unsplash.com/photo-1609521263047-f8f205293f24?auto=format&fit=crop&w=1200&q=85", "Универсальный коммерческий микроавтобус для бизнеса и путешествий."],
] as const;

const db = await getDb();
if (!db) throw new Error("DATABASE_URL is not available");
await db.delete(vehicles);
await db.insert(vehicles).values(demo.map(([slug, type, make, model, year, price, mileage, fuel, transmission, engine, drive, color, featured, imageUrl, description]) => ({ slug, type: type as "car" | "motorcycle" | "minibus", make, model, year, price, mileage, fuel, transmission, engine, drive, color, featured, imageUrl, description, location: "Кишинёв", condition: "В наличии", status: "available" as const })));
console.log(`Seeded ${demo.length} vehicles`);
