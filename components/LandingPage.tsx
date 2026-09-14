"use client";

import { FormEvent, useMemo, useState } from "react";

type FunctionOption = "Управление шторами" | "Отопление" | "Ворота" | "Освещение" | "Климат" | "Безопасность";
type ScenarioPack = "Базовый" | "Стандарт" | "Расширенный";

const BASE_RATE_PER_M2 = { min: 2500, max: 4200 };

const FUNCTION_RATES: Record<FunctionOption, number> = {
  "Управление шторами": 550,
  "Отопление": 700,
  "Ворота": 650,
  "Освещение": 500,
  "Климат": 750,
  "Безопасность": 900,
};

const SCENARIO_RATES: Record<ScenarioPack, { count: number; min: number; max: number }> = {
  "Базовый": { count: 3, min: 18000, max: 28000 },
  "Стандарт": { count: 7, min: 35000, max: 52000 },
  "Расширенный": { count: 12, min: 58000, max: 88000 },
};

const proofItems = [
  { title: "10 лет гарантии", text: "В договоре. С перечнем работ." },
  { title: "400+ объектов", text: "Портфолио с фото до/после." },
  { title: "97% возвращаются", text: "По данным Отзовика." },
  { title: "Смета до начала работ", text: "Фиксируем. Без доплат сверх." },
];

const serviceItems = [
  { title: "Проектирование умного дома", text: "Подбор оборудования и логики управления под ваш объект." },
  { title: "Монтаж и пусконаладка", text: "Устанавливаем систему и запускаем все контуры без лишних подрядчиков." },
  { title: "Интеграция под ключ", text: "Объединяем отопление, свет, ворота и безопасность в одном интерфейсе." },
  { title: "Автоматизация освещения", text: "Сцены, расписания и датчики присутствия для экономии и комфорта." },
  { title: "Климат и отопление", text: "Автоподдержка температуры по зонам и времени суток." },
  { title: "Сервис и поддержка", text: "Обновления, диагностика и сопровождение после запуска." },
];

const processItems = [
  {
    title: "Обследование объекта",
    text: "Собираем требования и формируем карту зон автоматизации.",
  },
  {
    title: "Смета и проект",
    text: "Показываем состав системы и финализируем бюджет.",
  },
  {
    title: "Монтаж и настройка",
    text: "Подключаем оборудование и создаём сценарии управления.",
  },
  {
    title: "Сдача и поддержка",
    text: "Передаём инструкции и остаёмся на связи после запуска.",
  },
];

const faqItems = [
  {
    question: "Можно ли внедрять систему поэтапно?",
    answer:
      "Да. Проект можно разделить на этапы: сначала критичные функции, затем расширение по сценариям и зонам.",
  },
  {
    question: "Работает ли всё без интернета?",
    answer:
      "Базовые функции работают локально. Интернет нужен для удалённого доступа и части облачных интеграций.",
  },
  {
    question: "Можно ли подключить существующее оборудование?",
    answer:
      "Да, при совместимости протоколов и оборудования. Проверяем это до старта проекта.",
  },
  {
    question: "Сколько времени занимает запуск?",
    answer:
      "Срок зависит от площади и состава функций. После обследования фиксируем календарный план и этапы.",
  },
  {
    question: "Есть ли гарантия и сервис?",
    answer:
      "Да. В договоре фиксируются гарантия на работы и регламент сервисного сопровождения.",
  },
];

const numberFormatter = new Intl.NumberFormat("ru-RU");

export function LandingPage() {
  const [area, setArea] = useState(120);
  const [functions, setFunctions] = useState<FunctionOption[]>(["Освещение", "Отопление"]);
  const [scenarioPack, setScenarioPack] = useState<ScenarioPack>("Стандарт");
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [service, setService] = useState("Умный дом");
  const [submitMessage, setSubmitMessage] = useState("");
  const [submitError, setSubmitError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const calculation = useMemo(() => {
    const functionsRate = functions.reduce((sum, option) => sum + FUNCTION_RATES[option], 0);
    const scenarios = SCENARIO_RATES[scenarioPack];
    const minPerM2 = BASE_RATE_PER_M2.min + functionsRate;
    const maxPerM2 = BASE_RATE_PER_M2.max + functionsRate;

    return {
      minPerM2,
      maxPerM2,
      scenariosCount: scenarios.count,
      minTotal: minPerM2 * area + scenarios.min,
      maxTotal: maxPerM2 * area + scenarios.max,
    };
  }, [area, functions, scenarioPack]);

  const toggleFunction = (option: FunctionOption) => {
    setFunctions((prev) =>
      prev.includes(option) ? prev.filter((currentOption) => currentOption !== option) : [...prev, option],
    );
  };

  const scrollToId = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const handleTransferToForm = () => {
    setService("Умный дом");
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
      setService("Умный дом");
    } catch {
      setSubmitError("Не удалось отправить заявку. Попробуйте ещё раз.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-transparent text-[#0d2026]">
      <header className="sticky top-0 z-50 border-b border-[#dcecef] bg-white text-[#0d2026] backdrop-blur-xl">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-4 px-4 py-3">
          <a href="https://ena-group.ru/" className="flex items-center gap-3" target="_blank" rel="noreferrer">
            <div className="flex h-11 items-center justify-center border border-[#dcecef] bg-white px-3 text-sm font-black text-[#0d2026]">
              ЕНА
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
        <section className="relative overflow-hidden bg-[#041014]">
          <div className="pointer-events-none absolute inset-x-0 top-0 z-0 h-full">
            <div className="absolute left-[8%] top-10 h-40 w-40 bg-[#06A5B8]/25 blur-3xl" />
            <div className="absolute right-[10%] top-24 h-52 w-52 bg-[#41d9e4]/20 blur-3xl" />
          </div>
          <div className="relative z-10 mx-auto grid w-full max-w-6xl gap-8 px-4 pb-16 pt-10 md:grid-cols-2 md:items-center md:py-24">
            <div className="text-white">
              <span className="inline-flex border border-white/10 bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-[#8fe8f0] backdrop-blur">
                Автоматизация квартир и домов
              </span>
              <h1 className="mt-5 text-3xl font-extrabold leading-tight sm:text-4xl md:text-6xl">
                Умный дом в Москве и МО. Проект, монтаж и запуск под ключ.
              </h1>
              <p className="mt-4 max-w-xl text-base text-[#d6eef1] sm:text-lg">
                Подберём функции под ваш объект и сразу рассчитаем ориентир по бюджету.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <button type="button" className="cta-btn" onClick={() => scrollToId("calculator")}>
                  Рассчитать стоимость за 2 минуты
                </button>
                <a
                  href="tel:84952294422"
                  className="inline-flex items-center justify-center border border-white/15 bg-white/10 px-5 py-3 text-base font-semibold text-white shadow-[0_16px_40px_rgba(0,0,0,0.18)] transition hover:bg-white/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8fe8f0] focus-visible:ring-offset-2 focus-visible:ring-offset-[#08181d]"
                >
                  Позвонить сейчас
                </a>
              </div>
              <div className="mt-8 grid gap-3 sm:max-w-xl sm:grid-cols-3">
                {proofItems.slice(0, 3).map((item) => (
                  <div key={item.title} className="border border-white/10 bg-white/10 px-4 py-3 backdrop-blur">
                    <p className="text-sm font-semibold">{item.title}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="dark-card min-h-[320px] p-4">
              <div aria-hidden="true" className="photo-placeholder relative min-h-[288px] border-white/15 overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.24),transparent_34%),linear-gradient(135deg,rgba(255,255,255,0.08),transparent_55%)]" />
                <div className="relative z-10 grid w-full gap-3">
                  <div className="ml-auto w-[58%] border border-white/20 bg-white/10 px-4 py-3 text-left backdrop-blur">
                    <p className="text-xs uppercase tracking-[0.2em] text-white/70">Проект</p>
                    <p className="mt-2 text-lg font-bold">под ваш объект</p>
                  </div>
                  <div className="w-[65%] border border-white/20 bg-[#041014]/25 px-4 py-3 text-left backdrop-blur">
                    <p className="text-xs uppercase tracking-[0.2em] text-white/70">Сценарии</p>
                    <p className="mt-2 text-lg font-bold">по вашему ритму жизни</p>
                  </div>
                  <div className="mt-6 grid grid-cols-2 gap-3">
                    <div className="border border-white/15 bg-[#041014]/20 p-4 text-left backdrop-blur">
                      <p className="text-xs uppercase tracking-[0.2em] text-white/70">Интеграция</p>
                      <p className="mt-2 text-sm font-semibold">Единое управление функциями</p>
                    </div>
                    <div className="border border-white/15 bg-white/10 p-4 text-left backdrop-blur">
                      <p className="text-xs uppercase tracking-[0.2em] text-white/70">Сроки</p>
                      <p className="mt-2 text-sm font-semibold">План и этапы до старта</p>
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
                Расчёт по площади помещений, выбранным функциям и количеству сценариев.
              </p>
              <div className="mt-6 grid gap-6 lg:grid-cols-2">
                <div className="border border-white/10 bg-white/5 p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] sm:p-6">
                  <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#8fe8f0]">Шаг 1. Площадь помещений: {area} м²</p>
                  <input
                    type="range"
                    min={20}
                    max={400}
                    value={area}
                    onChange={(e) => setArea(Number(e.target.value))}
                    className="mt-3 w-full accent-[#06A5B8]"
                  />
                  <input
                    type="number"
                    min={20}
                    max={400}
                    value={area}
                    onChange={(e) => setArea(Math.min(400, Math.max(20, Number(e.target.value) || 20)))}
                    className="mt-3 w-28 border border-white/10 bg-white/5 px-3 py-2 text-sm text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8fe8f0] focus-visible:ring-offset-2 focus-visible:ring-offset-[#08181d]"
                  />

                  <p className="mt-6 text-sm font-semibold uppercase tracking-[0.18em] text-[#8fe8f0]">Шаг 2. Функции</p>
                  <div className="mt-3 grid gap-2 sm:grid-cols-2">
                    {(Object.keys(FUNCTION_RATES) as FunctionOption[]).map((option) => (
                      <label key={option} className="flex cursor-pointer items-center gap-2 border border-white/10 bg-white/5 p-3 text-sm transition hover:bg-white/10">
                        <input
                          type="checkbox"
                          checked={functions.includes(option)}
                          onChange={() => toggleFunction(option)}
                          className="size-4 accent-[#06A5B8]"
                        />
                        {option}
                      </label>
                    ))}
                  </div>

                  <p className="mt-6 text-sm font-semibold uppercase tracking-[0.18em] text-[#8fe8f0]">Шаг 3. Сценарии</p>
                  <div className="mt-3 grid gap-2 sm:grid-cols-3">
                    {(Object.keys(SCENARIO_RATES) as ScenarioPack[]).map((pack) => (
                      <button
                        type="button"
                        key={pack}
                        className={`border px-3 py-3 text-left text-sm font-semibold transition ${
                          scenarioPack === pack
                            ? "border-[#51dceb] bg-gradient-to-br from-[#06A5B8] to-[#0c7b8d] text-white shadow-[0_16px_30px_rgba(6,165,184,0.24)]"
                            : "border-white/10 bg-white/5 hover:bg-white/10"
                        } focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8fe8f0] focus-visible:ring-offset-2 focus-visible:ring-offset-[#08181d]`}
                        onClick={() => setScenarioPack(pack)}
                      >
                        <p>{pack}</p>
                        <p className="mt-1 text-xs font-medium text-white/80">{SCENARIO_RATES[pack].count} сценариев</p>
                      </button>
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
                  <p className="mt-2 text-sm text-[#32535b]">Сценарии: {calculation.scenariosCount}</p>
                  <div className="mt-6 border border-[#06A5B8]/15 bg-[#06A5B8]/10 p-4 text-sm text-[#1d4f58]">
                    Точный расчёт закрепим в коммерческом предложении после обследования объекта.
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
                <h3 className="text-xl font-bold">{item.title}</h3>
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
                  <article key={item.title} className="border border-white/10 bg-white/5 p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]">
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
                <p className="mt-3 text-sm text-[#446269]">
                  Площадь: {42 + caseIndex} м² · Срок: {18 + caseIndex} дней · Бюджет: {2.2 + caseIndex / 10} млн ₽
                </p>
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
                  <article key={item.title} className="border border-white/10 bg-white/5 p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]">
                    <p className="text-2xl font-black text-[#66e3ef]">{index + 1}</p>
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
                  {isOpen ? (
                    <p id={`faq-answer-${index}`} className="border-t border-[#d5ebee] px-4 py-4 text-sm text-[#446269] sm:px-5">
                      {item.answer}
                    </p>
                  ) : null}
                </article>
              );
            })}
          </div>
        </section>

        <section id="lead-form" className="py-14 text-[#eff9fb]">
          <div className="mx-auto w-full max-w-6xl px-4">
            <div className="dark-card p-6 sm:p-8">
              <h2 className="text-3xl font-extrabold sm:text-4xl">Получите смету по вашему объекту</h2>
              <form onSubmit={handleSubmit} className="mt-6 grid gap-3 border border-white/10 bg-white/5 p-5 sm:max-w-xl sm:p-6">
                <label className="text-sm">
                  Имя
                  <input
                    className="mt-1 w-full border border-white/10 bg-white/5 px-3 py-2 text-base text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8fe8f0] focus-visible:ring-offset-2 focus-visible:ring-offset-[#08181d]"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </label>
                <label className="text-sm">
                  Телефон
                  <input
                    className="mt-1 w-full border border-white/10 bg-white/5 px-3 py-2 text-base text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8fe8f0] focus-visible:ring-offset-2 focus-visible:ring-offset-[#08181d]"
                    placeholder="+79991234567"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                </label>
                <label className="text-sm">
                  Что нужно автоматизировать
                  <select
                    className="mt-1 w-full border border-white/10 bg-[#0d2328] px-3 py-2 text-base text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8fe8f0] focus-visible:ring-offset-2 focus-visible:ring-offset-[#08181d]"
                    value={service}
                    onChange={(e) => setService(e.target.value)}
                  >
                    <option>Умный дом</option>
                    <option>Квартира</option>
                    <option>Частный дом</option>
                    <option>Коммерческий объект</option>
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
              <a href="https://wa.me/74952294422" target="_blank" rel="noreferrer" className="cta-btn text-center">
                WhatsApp
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
