"use client";

import { FormEvent, useMemo, useState } from "react";

type RepairType = "Косметический" | "Капитальный" | "Дизайнерский" | "Только пол и потолок";

type ExtraOption = "Натяжные потолки" | "Замена пола" | "Электрика" | "Санузел" | "Кухня";

const REPAIR_RATES: Record<RepairType, { min: number; max: number }> = {
  "Косметический": { min: 6000, max: 9000 },
  "Капитальный": { min: 12000, max: 18000 },
  "Дизайнерский": { min: 20000, max: 30000 },
  "Только пол и потолок": { min: 3500, max: 5000 },
};

const OPTION_RATES: Record<ExtraOption, number> = {
  "Натяжные потолки": 800,
  "Замена пола": 1200,
  "Электрика": 1500,
  "Санузел": 2000,
  "Кухня": 1800,
};

const proofItems = [
  { icon: "🛡️", title: "10 лет гарантии", text: "В договоре. С перечнем работ." },
  { icon: "🏠", title: "400+ объектов", text: "Портфолио с фото до/после." },
  { icon: "📈", title: "97% возвращаются", text: "По данным Отзовика." },
  { icon: "📋", title: "Смета до начала работ", text: "Фиксируем. Без доплат сверх." },
];

const serviceItems = [
  { title: "Пол и потолок за 1 день", text: "Точный расчёт и закрытие работ в течение дня." },
  { title: "Натяжные потолки за 3 часа", text: "Чистый монтаж без пыли и долгих простоев." },
  { title: "Ремонт кухни под ключ", text: "От демонтажа до финальной установки техники." },
  { title: "Ремонт ванной и санузла", text: "Гидроизоляция, плитка, сантехника с гарантией." },
  { title: "Косметический ремонт", text: "Быстрое обновление квартиры без перепланировки." },
  { title: "Капитальный ремонт", text: "Полная замена инженерии и отделки по этапам." },
];

const processItems = [
  {
    title: "Замерщик приезжает",
    text: "Бесплатно, в удобное время. 1 день.",
  },
  {
    title: "Смета за 24 часа",
    text: "Фиксированная, по позициям.",
  },
  {
    title: "Ремонт по этапам",
    text: "Вы платите за принятый этап.",
  },
  {
    title: "Сдача и гарантия",
    text: "Уборка + акт + 10 лет гарантии.",
  },
];

const faqItems = [
  {
    question: "Почему смета может вырасти?",
    answer:
      "Только если вы меняете объём работ после согласования или вскрываются скрытые дефекты, которые нельзя было увидеть до демонтажа. Все изменения оформляем допсметой до начала нового этапа.",
  },
  {
    question: "Есть ли скрытые доплаты за вывоз мусора и подъём?",
    answer:
      "Нет. В смету заранее вносим вывоз мусора, подъём материалов и расходники. Отдельных платежей после старта работ не добавляем без вашего согласования.",
  },
  {
    question: "Можно ли платить по этапам?",
    answer:
      "Да. Оплата разбивается на этапы: демонтаж, черновые работы, чистовая отделка и сдача. Переход к следующему этапу только после приёмки предыдущего.",
  },
  {
    question: "Что если бригада затянет сроки?",
    answer:
      "Сроки фиксируем в договоре и календарном плане. При отклонениях заранее уведомляем и пересогласовываем график, чтобы вы понимали причину и новые даты.",
  },
  {
    question: "Гарантия на работы — где прописана?",
    answer:
      "Гарантия 10 лет прописывается в договоре и акте сдачи с перечнем выполненных работ. Документы передаём в день финальной приёмки.",
  },
];

const numberFormatter = new Intl.NumberFormat("ru-RU");

export function LandingPage() {
  const [repairType, setRepairType] = useState<RepairType>("Косметический");
  const [area, setArea] = useState(45);
  const [options, setOptions] = useState<ExtraOption[]>([]);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [service, setService] = useState<RepairType | "Другое">("Косметический");
  const [submitMessage, setSubmitMessage] = useState("");
  const [submitError, setSubmitError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const calculation = useMemo(() => {
    const base = REPAIR_RATES[repairType];
    const extraRate = options.reduce((sum, option) => sum + OPTION_RATES[option], 0);

    const minPerM2 = base.min + extraRate;
    const maxPerM2 = base.max + extraRate;

    return {
      minPerM2,
      maxPerM2,
      minTotal: minPerM2 * area,
      maxTotal: maxPerM2 * area,
    };
  }, [area, options, repairType]);

  const toggleOption = (option: ExtraOption) => {
    setOptions((prev) =>
      prev.includes(option) ? prev.filter((currentOption) => currentOption !== option) : [...prev, option],
    );
  };

  const scrollToId = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const handleTransferToForm = () => {
    setService(repairType);
    scrollToId("lead-form");
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitError("");
    setSubmitMessage("");

    if (!name.trim()) {
      setSubmitError("Введите имя.");
      return;
    }

    const phoneDigits = phone.replace(/\D/g, "");
    if (!phone.startsWith("+7") || phoneDigits.length !== 11) {
      setSubmitError("Введите телефон в формате +7.");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          phone: phone.trim(),
          service,
        }),
      });

      if (!response.ok) {
        throw new Error("Ошибка отправки");
      }

      setSubmitMessage("Спасибо! Перезвоним в течение 15 минут");
      setName("");
      setPhone("");
      setService("Косметический");
    } catch {
      setSubmitError("Не удалось отправить заявку. Попробуйте ещё раз.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-[#F7F5F0] text-[#1C1C1C]">
      <header className="sticky top-0 z-50 border-b border-[#1c1c1c1a] bg-[#F7F5F0]/95 backdrop-blur">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-4 px-4 py-3">
          <a href="https://ena-group.ru/" className="flex items-center gap-3" target="_blank" rel="noreferrer">
            {/* TODO: Заменить текстовый логотип на официальный логотип из ena-group.ru */}
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-[#ff5a1f] to-[#ff8c5f] text-sm font-black text-white">
              Е
            </div>
            <span className="text-sm font-extrabold uppercase tracking-wide sm:text-base">ЕНА ГРУПП</span>
          </a>
          <div className="flex items-center gap-2 sm:gap-3">
            <a className="hidden text-sm font-bold sm:block" href="tel:84952294422">
              8-495-229-44-22
            </a>
            <a href="tel:84952294422" className="cta-btn text-sm">
              Позвонить
            </a>
          </div>
        </div>
      </header>

      <main>
        <section className="mx-auto grid w-full max-w-6xl gap-8 px-4 pb-16 pt-10 md:grid-cols-2 md:items-center md:py-20">
          <div>
            <h1 className="text-3xl font-extrabold leading-tight sm:text-4xl md:text-5xl">
              Ремонт квартир в Москве и МО. Пол и потолок — за 1 день.
            </h1>
            <p className="mt-4 text-base text-[#1c1c1ccc] sm:text-lg">
              Выезд замерщика бесплатно. Фиксированная смета до начала работ. Гарантия 10 лет.
            </p>
            <button className="cta-btn mt-6" onClick={() => scrollToId("calculator")}>
              Рассчитать стоимость за 2 минуты
            </button>
          </div>
          <div className="photo-placeholder min-h-[260px]">
            {/* TODO: Заменить блок-заглушку на реальное фото объекта */}
            Фото объекта
          </div>
        </section>

        <section id="calculator" className="bg-[#1C1C1C] py-14 text-[#F7F5F0]">
          <div className="mx-auto w-full max-w-6xl px-4">
            <h2 className="text-3xl font-extrabold sm:text-4xl">Калькулятор стоимости</h2>
            <div className="mt-6 grid gap-6 lg:grid-cols-2">
              <div className="rounded-2xl bg-[#2a2a2a] p-5 sm:p-6">
                <p className="text-sm font-semibold text-[#ffb79e]">Шаг 1. Тип ремонта</p>
                <div className="mt-3 grid gap-2 sm:grid-cols-2">
                  {(Object.keys(REPAIR_RATES) as RepairType[]).map((type) => (
                    <button
                      key={type}
                      className={`rounded-xl border px-3 py-3 text-left text-sm font-semibold transition ${
                        repairType === type
                          ? "border-[#FF5A1F] bg-[#FF5A1F] text-white"
                          : "border-[#ffffff33] bg-[#ffffff0d] hover:bg-[#ffffff1a]"
                      }`}
                      onClick={() => setRepairType(type)}
                    >
                      {type}
                    </button>
                  ))}
                </div>

                <p className="mt-6 text-sm font-semibold text-[#ffb79e]">Шаг 2. Площадь: {area} м²</p>
                <input
                  type="range"
                  min={20}
                  max={200}
                  value={area}
                  onChange={(e) => setArea(Number(e.target.value))}
                  className="mt-3 w-full accent-[#FF5A1F]"
                />
                <input
                  type="number"
                  min={20}
                  max={200}
                  value={area}
                  onChange={(e) => setArea(Math.min(200, Math.max(20, Number(e.target.value) || 20)))}
                  className="mt-3 w-28 rounded-lg border border-[#ffffff33] bg-[#ffffff0d] px-3 py-2 text-sm"
                />

                <p className="mt-6 text-sm font-semibold text-[#ffb79e]">Шаг 3. Дополнительные опции</p>
                <div className="mt-3 grid gap-2 sm:grid-cols-2">
                  {(Object.keys(OPTION_RATES) as ExtraOption[]).map((option) => (
                    <label key={option} className="flex cursor-pointer items-center gap-2 rounded-lg border border-[#ffffff26] p-2 text-sm">
                      <input
                        type="checkbox"
                        checked={options.includes(option)}
                        onChange={() => toggleOption(option)}
                        className="size-4 accent-[#FF5A1F]"
                      />
                      {option}
                    </label>
                  ))}
                </div>
              </div>

              <div className="rounded-2xl bg-[#F7F5F0] p-5 text-[#1C1C1C] sm:p-6">
                <p className="text-sm font-semibold text-[#b5441a]">Ваша вилка стоимости</p>
                <p className="mt-2 text-3xl font-extrabold sm:text-4xl">
                  {numberFormatter.format(calculation.minTotal)} ₽ — {numberFormatter.format(calculation.maxTotal)} ₽
                </p>
                <p className="mt-3 text-sm text-[#1c1c1ccc]">
                  {numberFormatter.format(calculation.minPerM2)}–{numberFormatter.format(calculation.maxPerM2)} ₽/м² · {area} м²
                </p>
                <button className="cta-btn mt-6" onClick={handleTransferToForm}>
                  Получить точную смету
                </button>
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto w-full max-w-6xl px-4 py-14">
          <h2 className="text-3xl font-extrabold sm:text-4xl">Факты вместо обещаний</h2>
          <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {proofItems.map((item) => (
              <article key={item.title} className="rounded-2xl border border-[#1c1c1c1f] bg-white p-5">
                <p className="text-2xl">{item.icon}</p>
                <h3 className="mt-2 text-xl font-bold">{item.title}</h3>
                <p className="mt-1 text-sm text-[#1c1c1ccc]">{item.text}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="bg-[#1C1C1C] py-14 text-[#F7F5F0]">
          <div className="mx-auto w-full max-w-6xl px-4">
            <h2 className="text-3xl font-extrabold sm:text-4xl">Услуги</h2>
            <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {serviceItems.map((item) => (
                <article key={item.title} className="rounded-2xl border border-[#ffffff29] bg-[#ffffff08] p-5">
                  <h3 className="text-xl font-bold">{item.title}</h3>
                  <p className="mt-2 text-sm text-[#f7f5f0cc]">{item.text}</p>
                  <button className="cta-btn mt-4" onClick={() => scrollToId("calculator")}>
                    Узнать цену
                  </button>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="mx-auto w-full max-w-6xl px-4 py-14">
          <h2 className="text-3xl font-extrabold sm:text-4xl">Портфолио</h2>
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {Array.from({ length: 6 }, (_, i) => i + 1).map((caseIndex) => (
              <article key={caseIndex} className="rounded-2xl border border-[#1c1c1c1f] bg-white p-4">
                <div className="grid grid-cols-2 gap-3">
                  <div className="photo-placeholder min-h-[120px] text-sm">До</div>
                  <div className="photo-placeholder min-h-[120px] text-sm">После</div>
                </div>
                {/* TODO: Заменить заглушечные параметры кейса на реальные данные проекта */}
                <p className="mt-3 text-sm text-[#1c1c1ccc]">Площадь: {42 + caseIndex} м² · Срок: {18 + caseIndex} дней · Бюджет: {2.2 + caseIndex / 10} млн ₽</p>
              </article>
            ))}
          </div>
          <a href="#" className="cta-btn mt-6 inline-block">
            Смотреть все работы
          </a>
        </section>

        <section className="bg-[#1C1C1C] py-14 text-[#F7F5F0]">
          <div className="mx-auto w-full max-w-6xl px-4">
            <h2 className="text-3xl font-extrabold sm:text-4xl">Как проходит работа</h2>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              {processItems.map((item, index) => (
                <article key={item.title} className="rounded-2xl border border-[#ffffff29] bg-[#ffffff08] p-5">
                  <p className="text-2xl font-black text-[#FF5A1F]">{index + 1}</p>
                  <h3 className="mt-2 text-xl font-bold">{item.title}</h3>
                  <p className="mt-2 text-sm text-[#f7f5f0cc]">{item.text}</p>
                  <div className="photo-placeholder mt-4 min-h-[120px] text-sm">Фото этапа</div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="mx-auto w-full max-w-6xl px-4 py-14">
          <h2 className="text-3xl font-extrabold sm:text-4xl">FAQ</h2>
          <div className="mt-6 space-y-3">
            {faqItems.map((item, index) => {
              const isOpen = openFaq === index;
              return (
                <article key={item.question} className="overflow-hidden rounded-2xl border border-[#1c1c1c26] bg-white">
                  <button
                    className="flex w-full items-center justify-between gap-3 px-4 py-4 text-left text-base font-bold sm:px-5"
                    onClick={() => setOpenFaq(isOpen ? null : index)}
                  >
                    {item.question}
                    <span className="text-[#FF5A1F]">{isOpen ? "−" : "+"}</span>
                  </button>
                  {isOpen ? <p className="border-t border-[#1c1c1c14] px-4 py-4 text-sm text-[#1c1c1ccc] sm:px-5">{item.answer}</p> : null}
                </article>
              );
            })}
          </div>
        </section>

        <section id="lead-form" className="bg-[#1C1C1C] py-14 text-[#F7F5F0]">
          <div className="mx-auto w-full max-w-6xl px-4">
            <h2 className="text-3xl font-extrabold sm:text-4xl">Получите смету по вашей квартире</h2>
            <form onSubmit={handleSubmit} className="mt-6 grid gap-3 rounded-2xl bg-[#2a2a2a] p-5 sm:max-w-xl sm:p-6">
              <label className="text-sm">
                Имя
                <input
                  className="mt-1 w-full rounded-lg border border-[#ffffff2e] bg-[#ffffff0f] px-3 py-2 text-base"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </label>
              <label className="text-sm">
                Телефон
                <input
                  className="mt-1 w-full rounded-lg border border-[#ffffff2e] bg-[#ffffff0f] px-3 py-2 text-base"
                  placeholder="+79991234567"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </label>
              <label className="text-sm">
                Что нужно отремонтировать
                <select
                  className="mt-1 w-full rounded-lg border border-[#ffffff2e] bg-[#2a2a2a] px-3 py-2 text-base"
                  value={service}
                  onChange={(e) => setService(e.target.value as RepairType | "Другое")}
                >
                  <option>Косметический</option>
                  <option>Капитальный</option>
                  <option>Дизайнерский</option>
                  <option>Только пол и потолок</option>
                  <option>Другое</option>
                </select>
              </label>
              <button disabled={isSubmitting} className="cta-btn mt-2 disabled:cursor-not-allowed disabled:opacity-70">
                {isSubmitting ? "Отправка..." : "Получить смету"}
              </button>
              {submitError ? <p className="text-sm text-[#ff9f9f]">{submitError}</p> : null}
              {submitMessage ? <p className="text-sm text-[#9ef5b3]">{submitMessage}</p> : null}
            </form>
          </div>
        </section>

        <section className="mx-auto w-full max-w-6xl px-4 py-14">
          <h2 className="text-3xl font-extrabold sm:text-4xl">Контакты</h2>
          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            <a href="tel:84952294422" className="rounded-2xl border border-[#1c1c1c1f] bg-white p-4 font-bold">
              Телефон: 8-495-229-44-22
            </a>
            <div className="grid grid-cols-2 gap-3">
              <a href="#" className="cta-btn text-center">
                WhatsApp
              </a>
              <a href="#" className="cta-btn text-center">
                Telegram
              </a>
            </div>
            <p className="rounded-2xl border border-[#1c1c1c1f] bg-white p-4 text-sm sm:col-span-2">
              Адрес: г. Москва, Анадырский пр-д, д.21
              <br />
              Работаем в Москве и Подмосковье
            </p>
          </div>
        </section>
      </main>

      <footer className="border-t border-[#1c1c1c1a] bg-[#F7F5F0] py-6">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-2 px-4 text-sm text-[#1c1c1ca8] sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} ЕНА ГРУПП</p>
          <a href="#">Политика конфиденциальности</a>
          <p>ИНН: 0000000000 · ОГРН: 0000000000000</p>
        </div>
      </footer>
    </div>
  );
}
