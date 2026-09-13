"use client";

import Link from "next/link";
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

const navItems = [
  { label: "Услуги", id: "services" },
  { label: "Кейсы", id: "portfolio" },
  { label: "Калькулятор", id: "calculator" },
  { label: "Этапы", id: "process" },
  { label: "Контакты", id: "contacts" },
];

const proofItems = [
  { value: "10 лет", title: "гарантия по договору", text: "Закрепляем перечень работ и обязательства в документах." },
  { value: "24 часа", title: "на подготовку сметы", text: "Показываем объём, этапы и диапазон бюджета до старта." },
  { value: "400+", title: "объектов в портфолио", text: "Квартиры, кухни, санузлы, быстрые обновления и капитальные работы." },
  { value: "По этапам", title: "оплата после приёмки", text: "Сначала результат, затем следующий шаг по графику." },
];

const serviceItems = [
  {
    title: "Пол и потолок за 1 день",
    text: "Подходит для быстрого обновления комнаты перед сдачей, продажей или переездом.",
    result: "Чистый монтаж, понятный объём работ, быстрый запуск.",
  },
  {
    title: "Натяжные потолки за 3 часа",
    text: "Быстро закрываем потолок без долгого простоя квартиры и крупных мокрых процессов.",
    result: "Ровная геометрия, встроенный свет, минимум пыли.",
  },
  {
    title: "Ремонт кухни под ключ",
    text: "Берём на себя демонтаж, черновые работы, отделку и подготовку под установку техники.",
    result: "Кухня готова к сборке гарнитура и подключению техники.",
  },
  {
    title: "Ремонт ванной и санузла",
    text: "Гидроизоляция, плитка, сантехника и скрытые узлы в одном цикле работ.",
    result: "Сдаём узел полностью готовым к эксплуатации.",
  },
  {
    title: "Косметический ремонт квартиры",
    text: "Для тех, кому нужен быстрый визуальный апгрейд без перепланировки и долгой стройки.",
    result: "Свежая отделка, обновлённые поверхности и контролируемый бюджет.",
  },
  {
    title: "Капитальный ремонт по этапам",
    text: "Когда нужна замена инженерии, выравнивание, новые покрытия и понятный календарный план.",
    result: "Прозрачная последовательность работ и контроль каждого этапа.",
  },
];

const portfolioItems = [
  {
    title: "Кухня 14 м²",
    format: "Капитальное обновление",
    summary: "Демонтаж старой отделки, новая электрика, выравнивание стен и подготовка под гарнитур.",
    metrics: ["14 м²", "19 дней", "от 540 000 ₽"],
    before: ["Устаревшая отделка", "Недостаток розеток", "Неровные стены"],
    after: ["Подготовка под технику", "Новая световая схема", "Чистовая отделка"],
  },
  {
    title: "Санузел 6 м²",
    format: "Ремонт под ключ",
    summary: "Полный цикл с гидроизоляцией, плиткой, заменой сантехнических узлов и финальной установкой.",
    metrics: ["6 м²", "16 дней", "от 390 000 ₽"],
    before: ["Старые коммуникации", "Течь в мокрой зоне", "Плитка с дефектами"],
    after: ["Новая гидроизоляция", "Скрытая разводка", "Готовность к ежедневной эксплуатации"],
  },
  {
    title: "Гостиная 22 м²",
    format: "Пол и потолок за 1 день",
    summary: "Быстрое обновление комнаты без длительного вывода квартиры из использования.",
    metrics: ["22 м²", "1 день", "от 135 000 ₽"],
    before: ["Изношенный пол", "Следы старой отделки", "Неровный потолок"],
    after: ["Ровный потолок", "Новый пол", "Чистый монтаж без долгой стройки"],
  },
  {
    title: "Студия 38 м²",
    format: "Косметический ремонт",
    summary: "Обновили стены, освещение и чистовые покрытия перед заселением арендаторов.",
    metrics: ["38 м²", "12 дней", "от 420 000 ₽"],
    before: ["Потёртые поверхности", "Слабый свет", "Уставший интерьер"],
    after: ["Светлая отделка", "Обновлённые покрытия", "Готовность к заселению"],
  },
  {
    title: "Квартира 64 м²",
    format: "Капитальный ремонт",
    summary: "Поэтапная замена инженерии и отделки с понятным бюджетом и промежуточной приёмкой.",
    metrics: ["64 м²", "9 недель", "от 1,85 млн ₽"],
    before: ["Старые сети", "Разнородная отделка", "Изношенные покрытия"],
    after: ["Новая инженерия", "Единая отделка", "Подготовка под мебель"],
  },
  {
    title: "Спальня 18 м²",
    format: "Натяжной потолок и свет",
    summary: "Сфокусированный проект на потолке, освещении и аккуратной сдаче без строительного мусора.",
    metrics: ["18 м²", "3 часа", "от 48 000 ₽"],
    before: ["Пятна и трещины", "Один сценарий света", "Неаккуратные стыки"],
    after: ["Ровный потолок", "Точечный свет", "Чистый финиш"],
  },
];

const processItems = [
  {
    title: "Короткий созвон и задача",
    text: "Уточняем формат ремонта, сроки и что важно именно для вашей квартиры.",
  },
  {
    title: "Выезд и замер",
    text: "Приезжаем на объект, фиксируем размеры, объём и ограничения по помещению.",
  },
  {
    title: "Смета и календарный план",
    text: "Показываем стоимость, этапы, материалы и точки контроля до начала работ.",
  },
  {
    title: "Ремонт с фотофиксацией",
    text: "Двигаемся по согласованным этапам и подтверждаем результат перед следующим шагом.",
  },
  {
    title: "Сдача и документы",
    text: "Передаём объект, акты и гарантийные обязательства в финале проекта.",
  },
];

const faqItems = [
  {
    question: "Почему смета может измениться?",
    answer:
      "Только если меняется объём работ после согласования или при демонтаже выявляются скрытые дефекты. Любые дополнительные работы сначала согласуем и оформляем отдельной сметой.",
  },
  {
    question: "Можно ли разбить оплату по этапам?",
    answer:
      "Да. Оплата может быть разбита по этапам: после проверки результата закрываем текущий этап и согласуем переход к следующему.",
  },
  {
    question: "Что входит в быстрые форматы работ?",
    answer:
      "Для быстрых сценариев вроде пола и потолка заранее фиксируем объём, материалы и ограничения, чтобы уложиться в короткий цикл и не растягивать работы.",
  },
  {
    question: "Как контролируются сроки?",
    answer:
      "Сроки раскладываются на календарный план и контрольные точки. Если что-то влияет на график, это проговаривается до перехода к следующему этапу.",
  },
  {
    question: "Гарантия действительно указывается в договоре?",
    answer:
      "Да. Гарантия и перечень выполненных работ закрепляются документально и передаются вместе с итоговыми актами после сдачи объекта.",
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
    <div className="bg-transparent text-[#18333a]">
      <header className="sticky top-0 z-50 border-b border-[#d5e5e8] bg-[#f7fbfb]/95 backdrop-blur">
        <div className="mx-auto flex w-full max-w-7xl flex-wrap items-center justify-between gap-4 px-4 py-4">
          <a href="https://ena-group.ru/" className="flex items-center gap-3" target="_blank" rel="noreferrer">
            <div className="flex h-11 w-11 items-center justify-center border border-[#b7d6dc] bg-[#0f7f8f] text-sm font-black text-white">
              Е
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#4c6a71]">ремонт квартир</p>
              <p className="text-base font-extrabold uppercase tracking-[0.1em] text-[#10262c]">ЕНА ГРУПП</p>
            </div>
          </a>

          <nav className="hidden items-center gap-5 text-sm font-semibold text-[#45636a] lg:flex">
            {navItems.map((item) => (
              <a key={item.id} href={`#${item.id}`} className="transition hover:text-[#0f7f8f]">
                {item.label}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <div className="hidden text-right sm:block">
              <p className="text-xs uppercase tracking-[0.2em] text-[#5e7b81]">Москва и МО</p>
              <a className="text-base font-bold text-[#10262c]" href="tel:84952294422">
                8-495-229-44-22
              </a>
            </div>
            <a href="tel:84952294422" className="cta-btn text-sm">
              Позвонить
            </a>
          </div>
        </div>
      </header>

      <main>
        <section className="border-b border-[#dbeaec] bg-[linear-gradient(180deg,#fbfefe_0%,#f1f8f9_100%)]">
          <div className="mx-auto grid w-full max-w-7xl gap-10 px-4 py-12 lg:grid-cols-[minmax(0,1.2fr)_360px] lg:py-20">
            <div>
              <p className="section-label">Ремонт квартир в Москве и МО</p>
              <h1 className="mt-5 max-w-4xl text-4xl font-extrabold leading-tight text-[#10262c] sm:text-5xl lg:text-6xl">
                Ремонт квартир под ключ, кухни, санузлы, полы и потолки — с понятной сметой и аккуратной сдачей.
              </h1>
              <p className="mt-5 max-w-2xl text-lg leading-8 text-[#4f6b71]">
                Подберём формат под ваш объект: от быстрого обновления комнаты до капитального ремонта квартиры. Замер, смета,
                сроки и этапы фиксируем до старта работ.
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                <button type="button" className="cta-btn" onClick={() => scrollToId("calculator")}>
                  Рассчитать стоимость
                </button>
                <button type="button" className="secondary-btn" onClick={() => scrollToId("portfolio")}>
                  Посмотреть примеры работ
                </button>
              </div>

              <div className="mt-10 grid gap-0 border border-[#d5e5e8] bg-white md:grid-cols-3">
                {proofItems.slice(0, 3).map((item) => (
                  <article key={item.title} className="border-b border-[#d5e5e8] p-5 last:border-b-0 md:border-b-0 md:border-r last:md:border-r-0">
                    <p className="text-3xl font-extrabold text-[#0f7f8f]">{item.value}</p>
                    <h2 className="mt-3 text-lg font-bold text-[#10262c]">{item.title}</h2>
                    <p className="mt-2 text-sm leading-6 text-[#5a757b]">{item.text}</p>
                  </article>
                ))}
              </div>
            </div>

            <aside className="flex flex-col gap-4 border border-[#d5e5e8] bg-white p-6">
              <div>
                <p className="section-label">Что важно перед стартом</p>
                <h2 className="mt-3 text-2xl font-extrabold text-[#10262c]">Сразу понимаете бюджет, сроки и формат работ</h2>
              </div>
              <div className="grid gap-0 border border-[#d5e5e8] bg-[#f7fbfb]">
                <div className="border-b border-[#d5e5e8] p-4">
                  <p className="text-xs uppercase tracking-[0.2em] text-[#5f7b81]">Что получает клиент</p>
                  <p className="mt-2 text-lg font-bold text-[#10262c]">Смету, сроки и формат работ до старта</p>
                </div>
                <div className="border-b border-[#d5e5e8] p-4">
                  <p className="text-xs uppercase tracking-[0.2em] text-[#5f7b81]">Что усиливает доверие</p>
                  <p className="mt-2 text-lg font-bold text-[#10262c]">Гарантия 10 лет и оплата по этапам</p>
                </div>
                <div className="p-4">
                  <p className="text-xs uppercase tracking-[0.2em] text-[#5f7b81]">Что ускоряет решение</p>
                  <p className="mt-2 text-lg font-bold text-[#10262c]">Калькулятор + кейсы сразу под рукой</p>
                </div>
              </div>
              <a href="#lead-form" className="cta-btn w-full">
                Получить смету за 24 часа
              </a>
            </aside>
          </div>
        </section>

        <section className="mx-auto w-full max-w-7xl px-4 py-14" id="services">
          <div className="flex flex-col gap-4 border-b border-[#dbeaec] pb-8 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="section-label">Ключевые направления</p>
              <h2 className="mt-3 text-3xl font-extrabold text-[#10262c] sm:text-4xl">Услуги для быстрых обновлений и ремонтов под ключ</h2>
            </div>
            <p className="max-w-2xl text-sm leading-6 text-[#5a757b] sm:text-base">
              Выберите подходящий сценарий: быстрый монтаж, косметическое обновление, ремонт кухни, санузла или полноценный капитальный проект.
            </p>
          </div>

          <div className="mt-8 grid gap-0 border border-[#d5e5e8] bg-white lg:grid-cols-3">
            {serviceItems.map((item) => (
              <article key={item.title} className="flex h-full flex-col border-b border-[#d5e5e8] p-6 lg:border-b-0 lg:border-r [&:nth-child(3n)]:lg:border-r-0 [&:nth-last-child(-n+3)]:lg:border-b-0">
                <h3 className="text-2xl font-bold text-[#10262c]">{item.title}</h3>
                <p className="mt-3 text-sm leading-6 text-[#516d73] sm:text-base">{item.text}</p>
                <p className="mt-4 border-t border-[#e4eff1] pt-4 text-sm font-semibold text-[#0f7f8f]">{item.result}</p>
                <a href="#calculator" className="secondary-btn mt-6">
                  Рассчитать формат
                </a>
              </article>
            ))}
          </div>
        </section>

        <section id="portfolio" className="border-y border-[#dbeaec] bg-[#f8fcfc] py-14">
          <div className="mx-auto w-full max-w-7xl px-4">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <p className="section-label">Примеры работ</p>
                <h2 className="mt-3 text-3xl font-extrabold text-[#10262c] sm:text-4xl">Примеры работ по популярным запросам клиентов</h2>
              </div>
              <p className="max-w-2xl text-sm leading-6 text-[#5a757b] sm:text-base">
                Собрали типовые кейсы по кухням, санузлам, быстрым обновлениям и капитальному ремонту, чтобы проще было соотнести услугу со своим объектом.
              </p>
            </div>

            <div className="mt-8 grid gap-5 lg:grid-cols-2 xl:grid-cols-3">
              {portfolioItems.map((item) => (
                <article key={item.title} className="flex h-full flex-col border border-[#d5e5e8] bg-white">
                  <div className="border-b border-[#d5e5e8] bg-[linear-gradient(135deg,#eef7f8_0%,#ffffff_100%)] p-5">
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#5d7980]">{item.format}</p>
                    <h3 className="mt-3 text-2xl font-bold text-[#10262c]">{item.title}</h3>
                    <p className="mt-3 text-sm leading-6 text-[#506d73]">{item.summary}</p>
                  </div>
                  <div className="grid grid-cols-3 border-b border-[#d5e5e8] text-center text-sm font-semibold text-[#10262c]">
                    {item.metrics.map((metric) => (
                      <div key={metric} className="border-r border-[#d5e5e8] px-3 py-4 last:border-r-0">
                        {metric}
                      </div>
                    ))}
                  </div>
                  <div className="grid flex-1 gap-0 md:grid-cols-2">
                    <div className="border-b border-[#d5e5e8] p-5 md:border-b-0 md:border-r">
                      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#789298]">До</p>
                      <ul className="mt-3 space-y-2 text-sm leading-6 text-[#4f6b71]">
                        {item.before.map((point) => (
                          <li key={point}>— {point}</li>
                        ))}
                      </ul>
                    </div>
                    <div className="p-5">
                      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#0f7f8f]">После</p>
                      <ul className="mt-3 space-y-2 text-sm leading-6 text-[#3f5960]">
                        {item.after.map((point) => (
                          <li key={point}>— {point}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </article>
              ))}
            </div>

            <Link href="/portfolio" className="cta-btn mt-8 inline-flex">
              Смотреть все направления работ
            </Link>
          </div>
        </section>

        <section id="calculator" className="mx-auto w-full max-w-7xl px-4 py-14">
          <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
            <div className="border border-[#d5e5e8] bg-white p-6 sm:p-8">
              <p className="section-label">Калькулятор</p>
              <h2 className="mt-3 text-3xl font-extrabold text-[#10262c] sm:text-4xl">Рассчитайте предварительный бюджет за пару минут</h2>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-[#5a757b] sm:text-base">
                Выберите тип ремонта, укажите площадь и дополнительные опции — сразу увидите ориентир по стоимости до выезда замерщика.
              </p>

              <div className="mt-8 grid gap-8 xl:grid-cols-[minmax(0,1fr)_320px]">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#0f7f8f]">Шаг 1. Тип ремонта</p>
                  <div className="mt-3 grid gap-0 border border-[#d5e5e8] sm:grid-cols-2">
                    {(Object.keys(REPAIR_RATES) as RepairType[]).map((type) => (
                      <button
                        type="button"
                        key={type}
                        className={`border-b border-[#d5e5e8] px-4 py-4 text-left text-sm font-semibold transition sm:border-r [&:nth-child(2n)]:sm:border-r-0 [&:nth-last-child(-n+2)]:sm:border-b-0 ${
                          repairType === type ? "bg-[#0f7f8f] text-white" : "bg-white text-[#18333a] hover:bg-[#f3f9fa]"
                        }`}
                        onClick={() => setRepairType(type)}
                      >
                        {type}
                      </button>
                    ))}
                  </div>

                  <p className="mt-8 text-sm font-semibold uppercase tracking-[0.18em] text-[#0f7f8f]">Шаг 2. Площадь: {area} м²</p>
                  <div className="mt-3 border border-[#d5e5e8] p-4">
                    <input
                      type="range"
                      min={20}
                      max={200}
                      value={area}
                      onChange={(e) => setArea(Number(e.target.value))}
                      className="w-full accent-[#0f7f8f]"
                    />
                    <input
                      type="number"
                      min={20}
                      max={200}
                      value={area}
                      onChange={(e) => setArea(Math.min(200, Math.max(20, Number(e.target.value) || 20)))}
                      className="mt-4 w-28 border border-[#c8dde1] bg-white px-3 py-2 text-sm text-[#18333a] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8fe8f0]"
                    />
                  </div>

                  <p className="mt-8 text-sm font-semibold uppercase tracking-[0.18em] text-[#0f7f8f]">Шаг 3. Дополнительные опции</p>
                  <div className="mt-3 grid gap-0 border border-[#d5e5e8] sm:grid-cols-2">
                    {(Object.keys(OPTION_RATES) as ExtraOption[]).map((option) => (
                      <label key={option} className="flex cursor-pointer items-center gap-3 border-b border-[#d5e5e8] px-4 py-4 text-sm text-[#28434a] transition hover:bg-[#f5fafb] sm:border-r [&:nth-child(2n)]:sm:border-r-0 [&:nth-last-child(-n+2)]:sm:border-b-0">
                        <input
                          type="checkbox"
                          checked={options.includes(option)}
                          onChange={() => toggleOption(option)}
                          className="size-4 accent-[#0f7f8f]"
                        />
                        {option}
                      </label>
                    ))}
                  </div>
                </div>

                <aside className="flex flex-col border border-[#d5e5e8] bg-[#f8fcfc] p-5">
                  <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#0f7f8f]">Вилка стоимости</p>
                  <p className="mt-3 text-3xl font-extrabold text-[#10262c] sm:text-4xl">
                    {numberFormatter.format(calculation.minTotal)} ₽ — {numberFormatter.format(calculation.maxTotal)} ₽
                  </p>
                  <p className="mt-3 text-sm leading-6 text-[#516d73]">
                    {numberFormatter.format(calculation.minPerM2)}–{numberFormatter.format(calculation.maxPerM2)} ₽/м² · {area} м²
                  </p>
                  <div className="mt-6 border-y border-[#d5e5e8] py-4 text-sm leading-6 text-[#4e6a70]">
                    Точный расчёт делаем после замера и закрепляем в смете до старта работ, чтобы вы заранее понимали бюджет и состав работ.
                  </div>
                  <button type="button" className="cta-btn mt-6" onClick={handleTransferToForm}>
                    Получить точную смету
                  </button>
                </aside>
              </div>
            </div>

            <aside className="flex flex-col justify-between border border-[#d5e5e8] bg-[#10262c] p-6 text-white">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#8fdce4]">Что покажет расчёт</p>
                <h2 className="mt-3 text-2xl font-extrabold">Вы заранее видите вилку бюджета до замера</h2>
                <ul className="mt-6 space-y-3 text-sm leading-6 text-[#d2ebee]">
                  <li>— какой бюджет нужен для выбранного формата ремонта</li>
                  <li>— как площадь и дополнительные опции меняют стоимость</li>
                  <li>— с каким запросом удобнее выходить на замер и смету</li>
                </ul>
              </div>
              <div className="mt-8 border-t border-white/15 pt-5 text-sm text-[#d2ebee]">Смета за 24 часа · бесплатный выезд · оплата по этапам</div>
            </aside>
          </div>
        </section>

        <section id="process" className="border-y border-[#dbeaec] bg-[#f8fcfc] py-14">
          <div className="mx-auto w-full max-w-7xl px-4">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <p className="section-label">Как проходит работа</p>
                <h2 className="mt-3 text-3xl font-extrabold text-[#10262c] sm:text-4xl">От первого звонка до сдачи объекта — по понятным этапам</h2>
              </div>
              <p className="max-w-2xl text-sm leading-6 text-[#5a757b] sm:text-base">
                Замер, смета, работы, приёмка и документы идут в понятной последовательности, чтобы вы видели весь путь проекта заранее.
              </p>
            </div>

            <div className="mt-8 grid gap-0 border border-[#d5e5e8] bg-white md:grid-cols-5">
              {processItems.map((item, index) => (
                <article key={item.title} className="border-b border-[#d5e5e8] p-5 last:border-b-0 md:border-b-0 md:border-r last:md:border-r-0">
                  <p className="text-4xl font-extrabold text-[#0f7f8f]">0{index + 1}</p>
                  <h3 className="mt-4 text-xl font-bold text-[#10262c]">{item.title}</h3>
                  <p className="mt-3 text-sm leading-6 text-[#516d73]">{item.text}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="mx-auto w-full max-w-7xl px-4 py-14">
          <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
            <div>
              <p className="section-label">Факты вместо обещаний</p>
              <h2 className="mt-3 text-3xl font-extrabold text-[#10262c] sm:text-4xl">Почему нам доверяют ремонт квартиры и отдельных помещений</h2>
              <div className="mt-8 grid gap-0 border border-[#d5e5e8] bg-white sm:grid-cols-2 xl:grid-cols-4">
                {proofItems.map((item) => (
                  <article key={item.title} className="border-b border-[#d5e5e8] p-5 sm:border-r [&:nth-child(2n)]:sm:border-r-0 xl:border-b-0 xl:[&:nth-child(2n)]:border-r xl:[&:last-child]:border-r-0">
                    <p className="text-3xl font-extrabold text-[#0f7f8f]">{item.value}</p>
                    <h3 className="mt-3 text-lg font-bold text-[#10262c]">{item.title}</h3>
                    <p className="mt-2 text-sm leading-6 text-[#546f75]">{item.text}</p>
                  </article>
                ))}
              </div>
            </div>

            <div className="border border-[#d5e5e8] bg-white p-6">
              <p className="section-label">Следующий шаг</p>
              <h2 className="mt-3 text-2xl font-extrabold text-[#10262c]">Выберите удобный путь: кейсы, расчёт или заявка</h2>
              <div className="mt-6 grid gap-0 border border-[#d5e5e8]">
                <button type="button" onClick={() => scrollToId("portfolio")} className="border-b border-[#d5e5e8] px-4 py-4 text-left text-sm font-semibold text-[#18333a] transition hover:bg-[#f6fbfb]">
                  Посмотреть кейсы и форматы работ
                </button>
                <button type="button" onClick={() => scrollToId("calculator")} className="border-b border-[#d5e5e8] px-4 py-4 text-left text-sm font-semibold text-[#18333a] transition hover:bg-[#f6fbfb]">
                  Собрать предварительную смету
                </button>
                <button type="button" onClick={() => scrollToId("lead-form")} className="px-4 py-4 text-left text-sm font-semibold text-[#18333a] transition hover:bg-[#f6fbfb]">
                  Оставить заявку на замер
                </button>
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto w-full max-w-7xl px-4 py-14">
          <p className="section-label">FAQ</p>
          <h2 className="mt-3 text-3xl font-extrabold text-[#10262c] sm:text-4xl">Ответы на частые вопросы перед стартом ремонта</h2>
          <div className="mt-8 border border-[#d5e5e8] bg-white">
            {faqItems.map((item, index) => {
              const isOpen = openFaq === index;
              return (
                <article key={item.question} className="border-b border-[#d5e5e8] last:border-b-0">
                  <button
                    type="button"
                    className="flex w-full items-center justify-between gap-3 px-5 py-5 text-left text-base font-bold text-[#10262c]"
                    onClick={() => setOpenFaq(isOpen ? null : index)}
                    aria-expanded={isOpen}
                    aria-controls={`faq-answer-${index}`}
                  >
                    {item.question}
                    <span className="text-[#0f7f8f]">{isOpen ? "−" : "+"}</span>
                  </button>
                  {isOpen ? (
                    <p id={`faq-answer-${index}`} className="border-t border-[#ebf2f3] px-5 py-5 text-sm leading-6 text-[#546f75]">
                      {item.answer}
                    </p>
                  ) : null}
                </article>
              );
            })}
          </div>
        </section>

        <section id="lead-form" className="border-y border-[#dbeaec] bg-[#10262c] py-14 text-white">
          <div className="mx-auto grid w-full max-w-7xl gap-8 px-4 lg:grid-cols-[minmax(0,1fr)_420px] lg:items-start">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#8fdce4]">Заявка на смету</p>
              <h2 className="mt-3 max-w-3xl text-3xl font-extrabold sm:text-4xl">Получите смету по вашей квартире и обсудите удобные сроки</h2>
              <p className="mt-4 max-w-2xl text-sm leading-7 text-[#d2ebee] sm:text-base">
                Оставьте контакт, и мы подготовим предметный разговор по вашему объекту: с перечнем работ, ориентиром по бюджету и следующим шагом после замера.
              </p>
              <div className="mt-8 grid gap-0 border border-white/15 text-sm text-[#d2ebee] sm:grid-cols-3">
                <div className="border-b border-white/15 p-4 sm:border-b-0 sm:border-r">Бесплатный замер</div>
                <div className="border-b border-white/15 p-4 sm:border-b-0 sm:border-r">Смета до начала работ</div>
                <div className="p-4">Ответ в течение 15 минут</div>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="grid gap-4 border border-white/15 bg-white/5 p-6 backdrop-blur-sm">
              <label className="text-sm">
                Имя
                <input
                  className="mt-2 w-full border border-white/15 bg-[#0d2328] px-3 py-3 text-base text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8fe8f0]"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </label>
              <label className="text-sm">
                Телефон
                <input
                  className="mt-2 w-full border border-white/15 bg-[#0d2328] px-3 py-3 text-base text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8fe8f0]"
                  placeholder="+79991234567"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </label>
              <label className="text-sm">
                Что нужно отремонтировать
                <select
                  className="mt-2 w-full border border-white/15 bg-[#0d2328] px-3 py-3 text-base text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8fe8f0]"
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
              {submitError ? <p role="alert" aria-live="assertive" className="text-sm text-[#ffb0b0]">{submitError}</p> : null}
              {submitMessage ? <p role="status" aria-live="polite" className="text-sm text-[#a7f5bd]">{submitMessage}</p> : null}
            </form>
          </div>
        </section>

        <section id="contacts" className="mx-auto w-full max-w-7xl px-4 py-14">
          <div className="grid gap-0 border border-[#d5e5e8] bg-white lg:grid-cols-[minmax(0,1fr)_280px_280px]">
            <div className="border-b border-[#d5e5e8] p-6 lg:border-b-0 lg:border-r">
              <p className="section-label">Контакты</p>
              <h2 className="mt-3 text-3xl font-extrabold text-[#10262c]">Свяжитесь удобным способом: звонок или мессенджер</h2>
              <p className="mt-4 text-sm leading-7 text-[#546f75] sm:text-base">
                Выберите звонок, WhatsApp или Telegram — ответим, уточним задачу и согласуем следующий шаг по объекту.
              </p>
            </div>
            <a href="tel:84952294422" className="border-b border-[#d5e5e8] p-6 font-bold text-[#10262c] lg:border-b-0 lg:border-r">
              Телефон
              <span className="mt-2 block text-2xl text-[#0f7f8f]">8-495-229-44-22</span>
            </a>
            <div className="grid grid-cols-2 border-b border-[#d5e5e8] lg:border-b-0">
              <a href="https://wa.me/74952294422" target="_blank" rel="noreferrer" className="flex items-center justify-center border-r border-[#d5e5e8] p-6 text-sm font-bold text-[#10262c] transition hover:bg-[#f6fbfb]">
                WhatsApp
              </a>
              <a href="https://t.me/ena_group" target="_blank" rel="noreferrer" className="flex items-center justify-center p-6 text-sm font-bold text-[#10262c] transition hover:bg-[#f6fbfb]">
                Telegram
              </a>
            </div>
          </div>
          <div className="border-x border-b border-[#d5e5e8] bg-[#f8fcfc] p-6 text-sm text-[#546f75] sm:text-base">
            Адрес: г. Москва, Анадырский пр-д, д.21 · Работаем в Москве и Подмосковье
          </div>
        </section>
      </main>

      <footer className="border-t border-[#dcecef] bg-[#edf7f8] py-6">
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-2 px-4 text-sm text-[#567178] sm:flex-row sm:items-center sm:justify-between">
          <p>© 2026 ЕНА ГРУПП</p>
          <Link href="/privacy">Политика конфиденциальности</Link>
          <p>ИНН: 0000000000 · ОГРН: 0000000000000</p>
        </div>
      </footer>
    </div>
  );
}
