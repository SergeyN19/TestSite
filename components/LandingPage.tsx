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
  { icon: "🧱", title: "Пол и потолок за 1 день", text: "Точный расчёт и закрытие работ в течение дня." },
  { icon: "✨", title: "Натяжные потолки за 3 часа", text: "Чистый монтаж без пыли и долгих простоев." },
  { icon: "🍽️", title: "Ремонт кухни под ключ", text: "От демонтажа до финальной установки техники." },
  { icon: "🛁", title: "Ремонт ванной и санузла", text: "Гидроизоляция, плитка, сантехника с гарантией." },
  { icon: "🎨", title: "Косметический ремонт", text: "Быстрое обновление квартиры без перепланировки." },
  { icon: "🏗️", title: "Капитальный ремонт", text: "Полная замена инженерии и отделки по этапам." },
];

const processItems = [
  {
    icon: "📐",
    title: "Замерщик приезжает",
    text: "Бесплатно, в удобное время. 1 день.",
  },
  {
    icon: "🧾",
    title: "Смета за 24 часа",
    text: "Фиксированная, по позициям.",
  },
  {
    icon: "🔨",
    title: "Ремонт по этапам",
    text: "Вы платите за принятый этап.",
  },
  {
    icon: "✅",
    title: "Сдача и гарантия",
    text: "Уборка + акт + 10 лет гарантии.",
  },
];

const quizItems = [
  "Какой тип ремонта вам нужен",
  "Площадь и количество комнат",
  "Состояние квартиры сейчас",
  "Желаемые сроки старта и сдачи",
  "Ваши приоритеты по бюджету и материалам",
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
    <div className="bg-transparent text-[#0d2026]">
      <header className="sticky top-0 z-50 border-b border-white/10 bg-[#061217]/80 text-white backdrop-blur-xl">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-4 px-4 py-3">
          <a href="https://ena-group.ru/" className="flex items-center gap-3" target="_blank" rel="noreferrer">
            {/* TODO: Заменить текстовый логотип на официальный логотип из ena-group.ru */}
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-gradient-to-br from-[#06A5B8] via-[#18bfd0] to-[#0b7b8f] text-sm font-black text-white shadow-[0_18px_40px_rgba(6,165,184,0.35)]">
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

      <main className="pb-24 md:pb-0">
        <section className="relative overflow-hidden bg-[#041014]">
          <div className="pointer-events-none absolute inset-x-0 top-0 z-0 h-full">
            <div className="absolute left-[8%] top-10 h-40 w-40 rounded-full bg-[#06A5B8]/25 blur-3xl" />
            <div className="absolute right-[10%] top-24 h-52 w-52 rounded-full bg-[#41d9e4]/20 blur-3xl" />
          </div>
          <div className="relative z-10 mx-auto grid w-full max-w-6xl gap-8 px-4 pb-16 pt-10 md:grid-cols-2 md:items-center md:py-24">
            <div className="text-white">
              <span className="inline-flex rounded-full border border-white/10 bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-[#8fe8f0] backdrop-blur">
                Современный ремонт с гарантией
              </span>
              <h1 className="mt-5 text-3xl font-extrabold leading-tight sm:text-4xl md:text-6xl">
              Ремонт квартир в Москве и МО. Пол и потолок — за 1 день.
              </h1>
              <p className="mt-4 max-w-xl text-base text-[#d6eef1] sm:text-lg">
              Выезд замерщика бесплатно. Фиксированная смета до начала работ. Гарантия 10 лет.
              </p>
              <p className="mt-4 inline-flex rounded-full border border-[#ffcd75]/30 bg-[#ffcd75]/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-[#ffe3a8]">
               ⏳ Осталось 5 мест на этот месяц
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
               <button type="button" className="cta-btn" onClick={() => scrollToId("calculator")}>
                 Рассчитать стоимость за 2 минуты
                </button>
                <a
                  href="tel:84952294422"
                  className="inline-flex items-center justify-center rounded-2xl border border-white/15 bg-white/10 px-5 py-3 text-base font-semibold text-white shadow-[0_16px_40px_rgba(0,0,0,0.18)] transition hover:bg-white/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8fe8f0] focus-visible:ring-offset-2 focus-visible:ring-offset-[#08181d]"
                >
                  Позвонить сейчас
                </a>
              </div>
              <div className="mt-8 grid gap-3 sm:max-w-xl sm:grid-cols-3">
                {proofItems.slice(0, 3).map((item) => (
                  <div key={item.title} className="rounded-2xl border border-white/10 bg-white/10 px-4 py-3 backdrop-blur">
                    <p className="text-lg">{item.icon}</p>
                    <p className="mt-2 text-sm font-semibold">{item.title}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="dark-card min-h-[320px] p-4">
              <div aria-hidden="true" className="photo-placeholder relative min-h-[288px] rounded-[24px] border-white/15 overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.24),transparent_34%),linear-gradient(135deg,rgba(255,255,255,0.08),transparent_55%)]" />
                <div className="relative z-10 grid w-full gap-3">
                  <div className="ml-auto w-[58%] rounded-2xl border border-white/20 bg-white/10 px-4 py-3 text-left backdrop-blur">
                    <p className="text-xs uppercase tracking-[0.2em] text-white/70">Смета</p>
                    <p className="mt-2 text-lg font-bold">за 24 часа</p>
                  </div>
                  <div className="w-[65%] rounded-2xl border border-white/20 bg-[#041014]/25 px-4 py-3 text-left backdrop-blur">
                    <p className="text-xs uppercase tracking-[0.2em] text-white/70">Гарантия</p>
                    <p className="mt-2 text-lg font-bold">10 лет</p>
                  </div>
                  <div className="mt-6 grid grid-cols-2 gap-3">
                    <div className="rounded-2xl border border-white/15 bg-[#041014]/20 p-4 text-left backdrop-blur">
                      <p className="text-xs uppercase tracking-[0.2em] text-white/70">Чистый монтаж</p>
                      <p className="mt-2 text-sm font-semibold">Аккуратно и без пыли</p>
                    </div>
                    <div className="rounded-2xl border border-white/15 bg-white/10 p-4 text-left backdrop-blur">
                      <p className="text-xs uppercase tracking-[0.2em] text-white/70">Сроки</p>
                      <p className="mt-2 text-sm font-semibold">Поэтапно и прозрачно</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="calculator" className="py-14 text-[#eff9fb]">
          <div className="mx-auto w-full max-w-6xl px-4">
            <div className="dark-card p-6 sm:p-8">
              <h2 className="text-3xl font-extrabold sm:text-4xl">Калькулятор стоимости</h2>
              <p className="mt-3 max-w-2xl text-sm text-[#c3e6ea] sm:text-base">
                Соберите предварительную смету в современном калькуляторе и сразу получите понятный диапазон цены.
              </p>
              <div className="mt-6 grid gap-6 lg:grid-cols-2">
                <div className="rounded-[24px] border border-white/10 bg-white/5 p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] sm:p-6">
                  <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#8fe8f0]">Шаг 1. Тип ремонта</p>
                  <div className="mt-3 grid gap-2 sm:grid-cols-2">
                    {(Object.keys(REPAIR_RATES) as RepairType[]).map((type) => (
                      <button
                        type="button"
                        key={type}
                        className={`rounded-xl border px-3 py-3 text-left text-sm font-semibold transition ${
                          repairType === type
                            ? "border-[#51dceb] bg-gradient-to-br from-[#06A5B8] to-[#0c7b8d] text-white shadow-[0_16px_30px_rgba(6,165,184,0.24)]"
                            : "border-white/10 bg-white/5 hover:bg-white/10"
                        } focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8fe8f0] focus-visible:ring-offset-2 focus-visible:ring-offset-[#08181d]`}
                        onClick={() => setRepairType(type)}
                      >
                        {type}
                      </button>
                    ))}
                  </div>

                  <p className="mt-6 text-sm font-semibold uppercase tracking-[0.18em] text-[#8fe8f0]">Шаг 2. Площадь: {area} м²</p>
                  <input
                    type="range"
                    min={20}
                    max={200}
                    value={area}
                    onChange={(e) => setArea(Number(e.target.value))}
                    className="mt-3 w-full accent-[#06A5B8]"
                  />
                  <input
                    type="number"
                    min={20}
                    max={200}
                    value={area}
                    onChange={(e) => setArea(Math.min(200, Math.max(20, Number(e.target.value) || 20)))}
                    className="mt-3 w-28 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8fe8f0] focus-visible:ring-offset-2 focus-visible:ring-offset-[#08181d]"
                  />

                  <p className="mt-6 text-sm font-semibold uppercase tracking-[0.18em] text-[#8fe8f0]">Шаг 3. Дополнительные опции</p>
                  <div className="mt-3 grid gap-2 sm:grid-cols-2">
                    {(Object.keys(OPTION_RATES) as ExtraOption[]).map((option) => (
                      <label key={option} className="flex cursor-pointer items-center gap-2 rounded-xl border border-white/10 bg-white/5 p-3 text-sm transition hover:bg-white/10">
                        <input
                          type="checkbox"
                          checked={options.includes(option)}
                          onChange={() => toggleOption(option)}
                          className="size-4 accent-[#06A5B8]"
                        />
                        {option}
                      </label>
                    ))}
                  </div>
                </div>

                <div className="glass-card p-5 text-[#0c2025] sm:p-6">
                  <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#0b7b8f]">Ваша вилка стоимости</p>
                  <p className="mt-2 text-3xl font-extrabold sm:text-4xl">
                    {numberFormatter.format(calculation.minTotal)} ₽ — {numberFormatter.format(calculation.maxTotal)} ₽
                  </p>
                  <p className="mt-3 text-sm text-[#32535b]">
                    {numberFormatter.format(calculation.minPerM2)}–{numberFormatter.format(calculation.maxPerM2)} ₽/м² · {area} м²
                  </p>
                  <div className="mt-6 rounded-2xl border border-[#06A5B8]/15 bg-[#06A5B8]/10 p-4 text-sm text-[#1d4f58]">
                    Точный расчёт подготовим после замера и закрепим его в смете до старта работ.
                  </div>
                  <button type="button" className="cta-btn mt-6" onClick={handleTransferToForm}>
                    Получить точную смету
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto w-full max-w-6xl px-4 py-14">
          <h2 className="text-3xl font-extrabold text-[#0d2026] sm:text-4xl">Факты вместо обещаний</h2>
          <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {proofItems.map((item) => (
              <article key={item.title} className="glass-card p-5">
                <p className="text-2xl">{item.icon}</p>
                <h3 className="mt-2 text-xl font-bold">{item.title}</h3>
                <p className="mt-1 text-sm text-[#446269]">{item.text}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="py-14 text-[#eff9fb]">
          <div className="mx-auto w-full max-w-6xl px-4">
            <div className="dark-card p-6 sm:p-8">
              <h2 className="text-3xl font-extrabold sm:text-4xl">Услуги</h2>
            <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {serviceItems.map((item) => (
                  <article key={item.title} className="rounded-[24px] border border-white/10 bg-white/5 p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]">
                   <p className="text-2xl">{item.icon}</p>
                  <h3 className="text-xl font-bold">{item.title}</h3>
                   <p className="mt-2 text-sm text-[#c3e6ea]">{item.text}</p>
                  <button type="button" className="cta-btn mt-4" onClick={() => scrollToId("calculator")}>
                    Узнать цену
                  </button>
                </article>
              ))}
            </div>
            </div>
          </div>
        </section>

        <section className="mx-auto w-full max-w-6xl px-4 py-14">
          <h2 className="text-3xl font-extrabold text-[#0d2026] sm:text-4xl">Портфолио</h2>
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {Array.from({ length: 6 }, (_, i) => i + 1).map((caseIndex) => (
              <article key={caseIndex} className="glass-card p-4">
                <div className="grid grid-cols-2 gap-3">
                  <div className="photo-placeholder min-h-[120px] text-sm">До</div>
                  <div className="photo-placeholder min-h-[120px] text-sm">После</div>
                </div>
                {/* TODO: Заменить заглушечные параметры кейса на реальные данные проекта */}
                <p className="mt-3 text-sm text-[#446269]">Площадь: {42 + caseIndex} м² · Срок: {18 + caseIndex} дней · Бюджет: {2.2 + caseIndex / 10} млн ₽</p>
              </article>
            ))}
          </div>
          <a href="/portfolio" className="cta-btn mt-6 inline-block">
            Смотреть все работы
          </a>
        </section>

        <section className="py-14 text-[#eff9fb]">
          <div className="mx-auto w-full max-w-6xl px-4">
            <div className="dark-card p-6 sm:p-8">
              <h2 className="text-3xl font-extrabold sm:text-4xl">Как проходит работа</h2>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              {processItems.map((item, index) => (
                  <article key={item.title} className="rounded-[24px] border border-white/10 bg-white/5 p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]">
                   <p className="text-2xl">{item.icon}</p>
                   <p className="mt-2 text-2xl font-black text-[#66e3ef]">{index + 1}</p>
                  <h3 className="mt-2 text-xl font-bold">{item.title}</h3>
                   <p className="mt-2 text-sm text-[#c3e6ea]">{item.text}</p>
                  <div className="photo-placeholder mt-4 min-h-[120px] text-sm">Фото этапа</div>
                </article>
              ))}
            </div>
            </div>
          </div>
        </section>

        <section className="mx-auto w-full max-w-6xl px-4 py-14">
          <h2 className="text-3xl font-extrabold text-[#0d2026] sm:text-4xl">FAQ</h2>
          <div className="mt-6 space-y-3">
            {faqItems.map((item, index) => {
              const isOpen = openFaq === index;
              return (
                <article key={item.question} className="glass-card overflow-hidden">
                  <button
                    type="button"
                    className="flex w-full items-center justify-between gap-3 px-4 py-4 text-left text-base font-bold sm:px-5"
                    onClick={() => setOpenFaq(isOpen ? null : index)}
                    aria-expanded={isOpen}
                    aria-controls={`faq-answer-${index}`}
                  >
                    {item.question}
                    <span className="text-[#06A5B8]">{isOpen ? "−" : "+"}</span>
                  </button>
                  {isOpen ? <p id={`faq-answer-${index}`} className="border-t border-[#d5ebee] px-4 py-4 text-sm text-[#446269] sm:px-5">{item.answer}</p> : null}
                </article>
              );
            })}
          </div>
        </section>

        <section id="quiz" className="mx-auto w-full max-w-6xl px-4 py-14">
          <div className="glass-card p-6 sm:p-8">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#0b7b8f]">Квиз за 2 минуты</p>
            <h2 className="mt-3 text-3xl font-extrabold text-[#0d2026] sm:text-4xl">Ответьте на 5 вопросов и получите смету и 3 планировочных решения</h2>
            <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
              {quizItems.map((item, index) => (
                <article key={item} className="rounded-2xl border border-[#d5ebee] bg-white p-4">
                  <p className="text-sm font-black text-[#06A5B8]">{index + 1}/5</p>
                  <p className="mt-2 text-sm font-semibold text-[#1b3d45]">{item}</p>
                </article>
              ))}
            </div>
            <button type="button" className="cta-btn mt-6" onClick={() => scrollToId("lead-form")}>
              Пройти квиз и получить смету
            </button>
          </div>
        </section>

        <section id="lead-form" className="py-14 text-[#eff9fb]">
          <div className="mx-auto w-full max-w-6xl px-4">
            <div className="dark-card p-6 sm:p-8">
              <h2 className="text-3xl font-extrabold sm:text-4xl">Получите смету по вашей квартире</h2>
              <form onSubmit={handleSubmit} className="mt-6 grid gap-3 rounded-[24px] border border-white/10 bg-white/5 p-5 sm:max-w-xl sm:p-6">
              <label className="text-sm">
                Имя
                <input
                  className="mt-1 w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-base text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8fe8f0] focus-visible:ring-offset-2 focus-visible:ring-offset-[#08181d]"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </label>
              <label className="text-sm">
                Телефон
                <input
                  className="mt-1 w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-base text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8fe8f0] focus-visible:ring-offset-2 focus-visible:ring-offset-[#08181d]"
                  placeholder="+79991234567"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </label>
              <label className="text-sm">
                Что нужно отремонтировать
                <select
                  className="mt-1 w-full rounded-xl border border-white/10 bg-[#0d2328] px-3 py-2 text-base text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8fe8f0] focus-visible:ring-offset-2 focus-visible:ring-offset-[#08181d]"
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
              <button type="submit" disabled={isSubmitting} className="cta-btn mt-2 disabled:cursor-not-allowed disabled:opacity-70">
                {isSubmitting ? "Отправка..." : "Получить смету"}
              </button>
              {submitError ? <p role="alert" aria-live="assertive" className="text-sm text-[#ff9f9f]">{submitError}</p> : null}
              {submitMessage ? <p role="status" aria-live="polite" className="text-sm text-[#9ef5b3]">{submitMessage}</p> : null}
            </form>
            </div>
          </div>
        </section>

        <section className="mx-auto w-full max-w-6xl px-4 py-14">
          <h2 className="text-3xl font-extrabold text-[#0d2026] sm:text-4xl">Контакты</h2>
          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            <a href="tel:84952294422" className="glass-card p-4 font-bold">
              Телефон: 8-495-229-44-22
            </a>
            <div className="grid grid-cols-2 gap-3">
              <a href="https://max.ru" target="_blank" rel="noreferrer" className="cta-btn text-center">
                MAX
              </a>
              <a href="https://t.me/ena_group" target="_blank" rel="noreferrer" className="cta-btn text-center">
                Telegram
              </a>
            </div>
            <p className="glass-card p-4 text-sm sm:col-span-2">
              Адрес: г. Москва, Анадырский пр-д, д.21
              <br />
              Работаем в Москве и Подмосковье
            </p>
          </div>
        </section>
      </main>

      <div className="fixed inset-x-0 bottom-0 z-50 border-t border-white/15 bg-[#061217]/95 p-3 backdrop-blur md:hidden">
        <div className="mx-auto grid w-full max-w-6xl grid-cols-2 gap-2">
          <button type="button" className="cta-btn w-full px-3 py-2 text-sm" onClick={() => scrollToId("quiz")}>
            Пройти квиз
          </button>
          <button type="button" className="inline-flex w-full items-center justify-center rounded-2xl border border-white/20 bg-white/10 px-3 py-2 text-sm font-bold text-white transition hover:bg-white/15" onClick={() => scrollToId("calculator")}>
            Калькулятор
          </button>
        </div>
      </div>

      <footer className="border-t border-[#dcecef] bg-[#edf7f8] py-6">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-2 px-4 text-sm text-[#567178] sm:flex-row sm:items-center sm:justify-between">
          <p>© 2026 ЕНА ГРУПП</p>
          <a href="/privacy">Политика конфиденциальности</a>
          <p>ИНН: 0000000000 · ОГРН: 0000000000000</p>
        </div>
      </footer>
    </div>
  );
}
