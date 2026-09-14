"use client";

import { FormEvent, useMemo, useState } from "react";

type TriggerType = "По нажатию" | "По событию" | "По расписанию";
type RequestType =
  | "Безопасность дома"
  | "Освещение и сценарии"
  | "Климат и энергоэффективность"
  | "Видеонаблюдение и доступ"
  | "Нужна консультация"
  | "Другое";

const LOGO_URL =
  "https://github.com/user-attachments/assets/615df21e-3100-4ae5-818f-234573de224a";
const CONTACT_PHONE = "+7-915-252-74-07";
const CONTACT_PHONE_DISPLAY = "+7-915-252-74-07";
const CONTACT_NAME = "Сергей Жулидов";

const concernGroups = [
  {
    title: "Начать нужно со своих страхов",
    subtitle: "Понимаем, какие риски система должна закрыть в первую очередь.",
    items: [
      "Пожар, взрыв газа и протечки",
      "Проникновение в дом и контроль доступа",
      "Безопасность детей и пожилых родственников",
    ],
  },
  {
    title: "Что раздражает в быту",
    subtitle: "Находим повторяющиеся неудобства и превращаем их в автоматизации.",
    items: [
      "Приехали на дачу — внутри холодно",
      "Нужно выходить из машины, чтобы открыть ворота",
      "Приходится помнить о рутинных действиях самому",
    ],
  },
  {
    title: "Ваш личный ритм жизни",
    subtitle: "Подстраиваем сценарии под привычки, комфорт и расход энергии.",
    items: [
      "Тепловые режимы для разных комнат",
      "Когда и где вы проводите время дома",
      "Как используются свет, техника и инженерные системы",
    ],
  },
];

const benefits = [
  { icon: "🛡️", title: "Безопасность", text: "Протечки, газ, вторжение, тревожные сценарии и уведомления." },
  { icon: "💡", title: "Комфорт", text: "Свет, шторы, ворота, климат и бытовые сцены запускаются сами." },
  { icon: "📉", title: "Экономия", text: "Отопление и приборы переходят в нужный режим, когда никого нет дома." },
  { icon: "📲", title: "Простое управление", text: "Телефон, Telegram, Алиса, панели на стене и планшет." },
];

const triggerTypes: { title: TriggerType; text: string }[] = [
  {
    title: "По нажатию",
    text: "Сценарий стартует по голосовой команде, кнопке в приложении, мастер-клавише или панели.",
  },
  {
    title: "По событию",
    text: "Система реагирует на условия: закрылась дверь, включилась охрана, сработал датчик, приехала машина.",
  },
  {
    title: "По расписанию",
    text: "Автоматизации запускаются в конкретный день и час, например по будням утром или перед приездом на дачу.",
  },
];

const scenarioItems: Array<{
  title: string;
  trigger: TriggerType;
  text: string;
  bullets: string[];
}> = [
  {
    title: "Я вернулась",
    trigger: "По событию",
    text: "Дом встречает хозяев без лишних действий.",
    bullets: ["Открываются ворота", "Включается свет на фасаде и участке", "Подсвечиваются гараж и прихожая"],
  },
  {
    title: "Уезжаю",
    trigger: "По событию",
    text: "Дом сам переходит в защищённый и экономный режим.",
    bullets: ["Ставит дом на охрану", "Перекрывает воду", "Переводит отопление в энергосбережение"],
  },
  {
    title: "Все ушли",
    trigger: "По событию",
    text: "Освещение и подключённые приборы выключаются, когда дома никого нет.",
    bullets: ["Отключает свет", "Выключает электроприборы", "Может запускаться по геолокации или двери"],
  },
  {
    title: "Гости",
    trigger: "По нажатию",
    text: "Быстрый переход дома в режим приёма гостей.",
    bullets: ["Музыка или нейтральный телеканал", "Камеры переходят на запись", "Вентиляция и кондиционирование усиливаются"],
  },
  {
    title: "Отпуск",
    trigger: "По нажатию",
    text: "Дом остаётся под контролем даже во время длительного отсутствия.",
    bullets: ["Экономит отопление", "Имитирует присутствие светом", "Отправляет оповещения в Telegram"],
  },
  {
    title: "Завтрак / Обед / Ужин",
    trigger: "По расписанию",
    text: "Световые сценарии под время суток и ваши привычки.",
    bullets: ["Утром больше мягкого света", "Днём учитывается естественное освещение", "Вечером добавляется уютная подсветка"],
  },
  {
    title: "Кино",
    trigger: "По нажатию",
    text: "Один голосовой запрос — и комната готова к просмотру.",
    bullets: ["Закрываются шторы", "Свет остаётся на минимальной яркости", "После выключения сцены освещение возвращается"],
  },
  {
    title: "Будильник",
    trigger: "По расписанию",
    text: "Утро начинается мягко и без резкого света.",
    bullets: ["Открываются шторы", "Сценарий настраивается по комнате", "Можно запускать голосом или с панели"],
  },
];

const automationCards = [
  {
    title: "Тёмная комната",
    text: "Освещение в санузлах учитывает движение и положение двери, поэтому свет включается вовремя и не горит лишнего.",
  },
  {
    title: "Дневной и ночной режим",
    text: "Ночью подсветка включается мягко и не слепит, а днём работает на полной яркости там, где это нужно.",
  },
  {
    title: "Автоматический свет",
    text: "Прихожая, коридоры, гардеробные, кладовые и техпомещения сами включают подходящий уровень освещения.",
  },
  {
    title: "Микроклимат по датчикам",
    text: "Контроль CO₂, влажности и температуры через отопление, вентиляцию, кондиционирование и увлажнение.",
  },
  {
    title: "Навигатор, открой ворота",
    text: "Команда из Яндекс Навигатора передаётся через Яндекс Станцию на реле и открывает ворота без выхода из машины.",
  },
  {
    title: "Тревога при проникновении",
    text: "Кнопки тревоги, запись с камер, мигание света, сообщения родственникам и блокировка электронных замков.",
  },
];

const controlMethods = ["Телефон", "Каналы в Telegram", "Алиса", "Панели на стене", "Планшет", "Ноутбук"];

const faqItems = [
  {
    question: "С чего начать внедрение умного дома?",
    answer:
      "С тех сценариев, которые закрывают ваши риски и дискомфорт: безопасность, доступ, климат, автоматический свет или управление воротами. Сначала определяем задачи, потом подбираем оснащение дома под них.",
  },
  {
    question: "Все сценарии нужно запускать вручную?",
    answer:
      "Нет. Разумная изба поддерживает запуск по нажатию, по событию и по расписанию. Самые удобные автоматизации работают сами и не требуют открывать приложение каждый раз.",
  },
  {
    question: "Можно ли настроить сценарии под конкретную семью?",
    answer:
      "Да. Например, отдельный сценарий «Выключить всё» для ребёнка, ночной режим для санузлов, мягкий свет для детской или разные климатические режимы по комнатам.",
  },
  {
    question: "Какими устройствами можно управлять?",
    answer:
      "Освещением, шторами, воротами, отоплением, вентиляцией, кондиционированием, розетками, охранными датчиками, электронными замками и камерами видеонаблюдения — в зависимости от оснащения дома.",
  },
  {
    question: "Как управлять системой каждый день?",
    answer:
      "Через телефон, Telegram, Алису, настенные панели, планшет или ноутбук. Способ управления подбирается под ваш сценарий использования.",
  },
];

const requestTypes: RequestType[] = [
  "Безопасность дома",
  "Освещение и сценарии",
  "Климат и энергоэффективность",
  "Видеонаблюдение и доступ",
  "Нужна консультация",
  "Другое",
];

export function LandingPage() {
  const [activeTrigger, setActiveTrigger] = useState<TriggerType>("По событию");
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [service, setService] = useState<RequestType>("Нужна консультация");
  const [submitMessage, setSubmitMessage] = useState("");
  const [submitError, setSubmitError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const visibleScenarios = useMemo(
    () => scenarioItems.filter((item) => item.trigger === activeTrigger),
    [activeTrigger],
  );

  const scrollToId = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
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

      setSubmitMessage("Спасибо! Свяжемся с вами и подберём сценарии для дома.");
      setName("");
      setPhone("");
      setService("Нужна консультация");
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
          <button type="button" className="flex items-center gap-3 text-left" onClick={() => scrollToId("top")}>
            <div
              className="h-12 w-28 rounded-2xl border border-white/10 bg-contain bg-center bg-no-repeat"
              style={{ backgroundImage: `url(${LOGO_URL})` }}
              aria-hidden="true"
            />
            <div>
              <p className="text-sm font-extrabold uppercase tracking-[0.18em] text-[#8fe8f0]">Умный дом</p>
              <p className="text-xs text-white/70">Разумная изба</p>
            </div>
          </button>
          <div className="flex items-center gap-2 sm:gap-3">
            <a className="hidden text-sm font-bold sm:block" href={`tel:${CONTACT_PHONE}`}>
              {CONTACT_PHONE_DISPLAY}
            </a>
            <a href={`tel:${CONTACT_PHONE}`} className="cta-btn text-sm">
              Позвонить
            </a>
          </div>
        </div>
      </header>

      <main id="top">
        <section className="relative overflow-hidden bg-[#041014]">
          <div className="pointer-events-none absolute inset-x-0 top-0 z-0 h-full">
            <div className="absolute left-[6%] top-10 h-44 w-44 rounded-full bg-[#06A5B8]/25 blur-3xl" />
            <div className="absolute right-[8%] top-24 h-56 w-56 rounded-full bg-[#41d9e4]/20 blur-3xl" />
          </div>
          <div className="relative z-10 mx-auto grid w-full max-w-6xl gap-8 px-4 pb-16 pt-10 md:grid-cols-[1.1fr_0.9fr] md:items-center md:py-24">
            <div className="text-white">
              <span className="inline-flex rounded-full border border-white/10 bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-[#8fe8f0] backdrop-blur">
                Умный дом — просто!
              </span>
              <h1 className="mt-5 max-w-3xl text-3xl font-extrabold leading-tight sm:text-4xl md:text-6xl">
                Разумная изба автоматизирует безопасность, климат и бытовые сценарии вашего дома.
              </h1>
              <p className="mt-4 max-w-2xl text-base text-[#d6eef1] sm:text-lg">
                Подбираем систему умного дома от ваших реальных задач: защита от протечек и вторжений, управление
                воротами, мягкий ночной свет, микроклимат и экономия энергии.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <button type="button" className="cta-btn" onClick={() => scrollToId("lead-form")}>
                  Получить консультацию
                </button>
                <button
                  type="button"
                  className="inline-flex items-center justify-center rounded-2xl border border-white/15 bg-white/10 px-5 py-3 text-base font-semibold text-white shadow-[0_16px_40px_rgba(0,0,0,0.18)] transition hover:bg-white/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8fe8f0] focus-visible:ring-offset-2 focus-visible:ring-offset-[#08181d]"
                  onClick={() => scrollToId("scenarios")}
                >
                  Посмотреть сценарии
                </button>
              </div>
              <div className="mt-8 grid gap-3 sm:max-w-3xl sm:grid-cols-2 xl:grid-cols-4">
                {benefits.map((item) => (
                  <div key={item.title} className="rounded-2xl border border-white/10 bg-white/10 px-4 py-3 backdrop-blur">
                    <p className="text-lg">{item.icon}</p>
                    <p className="mt-2 text-sm font-semibold">{item.title}</p>
                    <p className="mt-1 text-sm text-[#d6eef1]">{item.text}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="dark-card p-4 sm:p-5">
              <div className="overflow-hidden rounded-[24px] border border-white/15 bg-[linear-gradient(180deg,rgba(255,255,255,0.08),rgba(255,255,255,0.02))]">
                <div
                  className="min-h-[220px] bg-contain bg-center bg-no-repeat"
                  style={{ backgroundImage: `url(${LOGO_URL})` }}
                  role="img"
                  aria-label="Логотип Разумная изба"
                />
                <div className="grid gap-3 border-t border-white/10 p-5 text-white sm:grid-cols-2">
                  <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                    <p className="text-xs uppercase tracking-[0.2em] text-white/70">Сценарии</p>
                    <p className="mt-2 text-sm font-semibold">По нажатию, событию и расписанию</p>
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                    <p className="text-xs uppercase tracking-[0.2em] text-white/70">Управление</p>
                    <p className="mt-2 text-sm font-semibold">Телефон, Telegram, Алиса, панели</p>
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-white/5 p-4 sm:col-span-2">
                    <p className="text-xs uppercase tracking-[0.2em] text-white/70">Контакт</p>
                    <p className="mt-2 text-lg font-bold">{CONTACT_NAME}</p>
                    <a href={`tel:${CONTACT_PHONE}`} className="mt-1 inline-block text-sm text-[#8fe8f0]">
                      {CONTACT_PHONE_DISPLAY}
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto w-full max-w-6xl px-4 py-14">
          <h2 className="text-3xl font-extrabold text-[#0d2026] sm:text-4xl">С чего начинается умный дом</h2>
          <p className="mt-3 max-w-3xl text-base text-[#446269]">
            Не с набора датчиков, а с ваших страхов, раздражающих мелочей и личных привычек. Интегратор предлагает
            варианты, а вы выбираете те сценарии, которые действительно нужны дому и семье.
          </p>
          <div className="mt-6 grid gap-4 lg:grid-cols-3">
            {concernGroups.map((group) => (
              <article key={group.title} className="glass-card p-6">
                <h3 className="text-2xl font-bold">{group.title}</h3>
                <p className="mt-2 text-sm text-[#446269]">{group.subtitle}</p>
                <ul className="mt-4 space-y-3 text-sm text-[#23414a]">
                  {group.items.map((item) => (
                    <li key={item} className="rounded-2xl bg-[#f1fbfc] px-4 py-3">
                      {item}
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </section>

        <section className="py-14 text-[#eff9fb]">
          <div className="mx-auto w-full max-w-6xl px-4">
            <div className="dark-card p-6 sm:p-8">
              <h2 className="text-3xl font-extrabold sm:text-4xl">Как запускаются сценарии</h2>
              <div className="mt-6 grid gap-4 md:grid-cols-3">
                {triggerTypes.map((item) => (
                  <article key={item.title} className="rounded-[24px] border border-white/10 bg-white/5 p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]">
                    <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#8fe8f0]">{item.title}</p>
                    <p className="mt-3 text-sm text-[#c3e6ea]">{item.text}</p>
                  </article>
                ))}
              </div>
              <div className="mt-6 rounded-[24px] border border-white/10 bg-white/5 p-5 text-sm text-[#c3e6ea]">
                Для каждого сценария можно задать длительность выполнения. После её окончания устройства возвращаются к
                предыдущему состоянию.
              </div>
            </div>
          </div>
        </section>

        <section id="scenarios" className="mx-auto w-full max-w-6xl px-4 py-14">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="text-3xl font-extrabold text-[#0d2026] sm:text-4xl">Популярные сценарии</h2>
              <p className="mt-3 max-w-3xl text-base text-[#446269]">
                Ниже — только часть вариаций. Итоговый набор зависит от оснащения дома, привычек семьи и приоритетов по
                безопасности и комфорту.
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              {triggerTypes.map((item) => {
                const isActive = item.title === activeTrigger;
                return (
                  <button
                    key={item.title}
                    type="button"
                    className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                      isActive
                        ? "bg-[#06A5B8] text-white shadow-[0_16px_30px_rgba(6,165,184,0.24)]"
                        : "bg-white text-[#0d2026] shadow-[0_10px_20px_rgba(8,34,40,0.08)] hover:bg-[#e8f7f9]"
                    }`}
                    onClick={() => setActiveTrigger(item.title)}
                  >
                    {item.title}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {visibleScenarios.map((item) => (
              <article key={item.title} className="glass-card p-6">
                <div className="flex items-center justify-between gap-3">
                  <h3 className="text-2xl font-bold">{item.title}</h3>
                  <span className="rounded-full bg-[#e8f7f9] px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-[#0b7b8f]">
                    {item.trigger}
                  </span>
                </div>
                <p className="mt-3 text-sm text-[#446269]">{item.text}</p>
                <ul className="mt-4 space-y-2 text-sm text-[#23414a]">
                  {item.bullets.map((bullet) => (
                    <li key={bullet} className="rounded-2xl bg-[#f1fbfc] px-4 py-3">
                      {bullet}
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </section>

        <section className="py-14 text-[#eff9fb]">
          <div className="mx-auto w-full max-w-6xl px-4">
            <div className="dark-card p-6 sm:p-8">
              <h2 className="text-3xl font-extrabold sm:text-4xl">Автоматизации для комфорта и безопасности</h2>
              <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {automationCards.map((item) => (
                  <article key={item.title} className="rounded-[24px] border border-white/10 bg-white/5 p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]">
                    <h3 className="text-xl font-bold">{item.title}</h3>
                    <p className="mt-3 text-sm text-[#c3e6ea]">{item.text}</p>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto w-full max-w-6xl px-4 py-14">
          <h2 className="text-3xl font-extrabold text-[#0d2026] sm:text-4xl">Способы управления</h2>
          <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
            {controlMethods.map((item) => (
              <article key={item} className="glass-card flex min-h-[120px] items-center justify-center p-5 text-center text-lg font-bold">
                {item}
              </article>
            ))}
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
              <div className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr] lg:items-start">
                <div>
                  <h2 className="text-3xl font-extrabold sm:text-4xl">Подберём сценарии именно под ваш дом</h2>
                  <p className="mt-4 text-sm text-[#c3e6ea] sm:text-base">
                    Расскажите, что для вас важнее: безопасность, автоматический свет, климат, контроль ворот,
                    видеонаблюдение или удобное управление. Мы предложим подходящую конфигурацию системы.
                  </p>
                  <div className="mt-6 space-y-3 text-sm text-[#eff9fb]">
                    <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                      <p className="font-semibold">Контактное лицо</p>
                      <p className="mt-1 text-[#c3e6ea]">{CONTACT_NAME}</p>
                    </div>
                    <a href={`tel:${CONTACT_PHONE}`} className="block rounded-2xl border border-white/10 bg-white/5 p-4 font-semibold text-[#8fe8f0]">
                      {CONTACT_PHONE_DISPLAY}
                    </a>
                  </div>
                </div>

                <form onSubmit={handleSubmit} className="grid gap-3 rounded-[24px] border border-white/10 bg-white/5 p-5 sm:p-6">
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
                    Что хотите автоматизировать
                    <select
                      className="mt-1 w-full rounded-xl border border-white/10 bg-[#0d2328] px-3 py-2 text-base text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8fe8f0] focus-visible:ring-offset-2 focus-visible:ring-offset-[#08181d]"
                      value={service}
                      onChange={(e) => setService(e.target.value as RequestType)}
                    >
                      {requestTypes.map((item) => (
                        <option key={item}>{item}</option>
                      ))}
                    </select>
                  </label>
                  <button type="submit" disabled={isSubmitting} className="cta-btn mt-2 disabled:cursor-not-allowed disabled:opacity-70">
                    {isSubmitting ? "Отправка..." : "Получить консультацию"}
                  </button>
                  {submitError ? <p role="alert" aria-live="assertive" className="text-sm text-[#ff9f9f]">{submitError}</p> : null}
                  {submitMessage ? <p role="status" aria-live="polite" className="text-sm text-[#9ef5b3]">{submitMessage}</p> : null}
                </form>
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto w-full max-w-6xl px-4 py-14">
          <h2 className="text-3xl font-extrabold text-[#0d2026] sm:text-4xl">Контакты</h2>
          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            <a href={`tel:${CONTACT_PHONE}`} className="glass-card p-4 font-bold">
              Телефон: {CONTACT_PHONE_DISPLAY}
            </a>
            <div className="glass-card p-4">
              <p className="font-bold">Контактное лицо</p>
              <p className="mt-1 text-sm text-[#446269]">{CONTACT_NAME}</p>
            </div>
            <p className="glass-card p-4 text-sm sm:col-span-2">
              Разумная изба помогает собрать умный дом вокруг реальных жизненных сценариев: от контроля доступа и
              протечек до климата, света, ворот и уведомлений.
            </p>
          </div>
        </section>
      </main>

      <footer className="border-t border-[#dcecef] bg-[#edf7f8] py-6">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-2 px-4 text-sm text-[#567178] sm:flex-row sm:items-center sm:justify-between">
          <p>© 2026 Разумная изба</p>
          <a href="/privacy">Политика конфиденциальности</a>
          <p>{CONTACT_PHONE_DISPLAY}</p>
        </div>
      </footer>
    </div>
  );
}
