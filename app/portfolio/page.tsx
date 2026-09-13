const portfolioItems = [
  {
    title: "Кухня 14 м²",
    type: "Капитальное обновление",
    details: ["Новая электрика", "Подготовка под гарнитур", "Выравнивание стен"],
    meta: "19 дней · от 540 000 ₽",
  },
  {
    title: "Санузел 6 м²",
    type: "Ремонт под ключ",
    details: ["Гидроизоляция", "Скрытая разводка", "Финальная установка сантехники"],
    meta: "16 дней · от 390 000 ₽",
  },
  {
    title: "Гостиная 22 м²",
    type: "Пол и потолок за 1 день",
    details: ["Быстрый монтаж", "Новый пол", "Чистая сдача"],
    meta: "1 день · от 135 000 ₽",
  },
  {
    title: "Студия 38 м²",
    type: "Косметический ремонт",
    details: ["Обновление отделки", "Светлая палитра", "Подготовка к заселению"],
    meta: "12 дней · от 420 000 ₽",
  },
  {
    title: "Квартира 64 м²",
    type: "Капитальный ремонт",
    details: ["Замена инженерии", "Единая отделка", "Поэтапная приёмка"],
    meta: "9 недель · от 1,85 млн ₽",
  },
  {
    title: "Спальня 18 м²",
    type: "Натяжной потолок и свет",
    details: ["Ровная плоскость", "Точечное освещение", "Сдача без мусора"],
    meta: "3 часа · от 48 000 ₽",
  },
];

export default function PortfolioPage() {
  return (
    <main className="mx-auto min-h-screen w-full max-w-7xl px-4 py-16 text-[#18333a]">
      <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#5d7980]">Портфолио ЕНА ГРУПП</p>
      <h1 className="mt-4 max-w-4xl text-4xl font-extrabold text-[#10262c] sm:text-5xl">Примеры работ по основным направлениям ремонта</h1>
      <p className="mt-5 max-w-3xl text-base leading-8 text-[#536f76] sm:text-lg">
        Здесь собраны типовые проекты по кухням, санузлам, быстрым обновлениям и капитальному ремонту, чтобы вы могли выбрать близкий к своему объекту формат работ.
      </p>

      <div className="mt-10 grid gap-5 lg:grid-cols-2 xl:grid-cols-3">
        {portfolioItems.map((item) => (
          <article key={item.title} className="border border-[#d5e5e8] bg-white">
            <div className="border-b border-[#d5e5e8] bg-[linear-gradient(135deg,#eef7f8_0%,#ffffff_100%)] p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#5d7980]">{item.type}</p>
              <h2 className="mt-3 text-2xl font-bold text-[#10262c]">{item.title}</h2>
              <p className="mt-3 text-sm font-semibold text-[#0f7f8f]">{item.meta}</p>
            </div>
            <div className="p-5">
              <ul className="space-y-2 text-sm leading-6 text-[#4f6b71]">
                {item.details.map((detail) => (
                  <li key={detail}>— {detail}</li>
                ))}
              </ul>
            </div>
          </article>
        ))}
      </div>
    </main>
  );
}
