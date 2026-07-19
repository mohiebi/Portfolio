export type ProductPreview = "tasks" | "cash" | "routine";

export type PortfolioProduct = {
  name: string;
  href: string;
  external?: boolean;
  tag: string;
  outcome: string;
  blurb: string;
  features: string[];
  tech: string[];
  accent: string;
  preview: ProductPreview;
  translations?: {
    de: Pick<PortfolioProduct, "tag" | "outcome" | "blurb" | "features">;
  };
};

export const products: PortfolioProduct[] = [
  {
    name: "TaskManager",
    href: "/taskmanager",
    tag: "Productivity dashboard",
    outcome: "Eliminates missed tasks with per-user auth scoping, fast status updates, and a focused task flow.",
    blurb: "Authenticated task system with per-user scoping, subtasks, deadline reminders, real-time toggle states, and flash feedback. Demonstrates clean Laravel auth architecture.",
    features: ["Create / edit / delete tasks", "Subtasks and statuses", "Deadline reminder notifications"],
    tech: ["Laravel", "Inertia", "React", "Tailwind"],
    accent: "from-emerald-400/25 to-teal-500/10",
    preview: "tasks",
    translations: {
      de: {
        tag: "Produktivitats-Dashboard",
        outcome: "Verhindert verpasste Aufgaben durch benutzerbezogene Zugriffssteuerung, schnelle Statusupdates und einen fokussierten Aufgabenablauf.",
        blurb: "Authentifiziertes Aufgabensystem mit benutzerbezogenen Daten, Unteraufgaben, Deadline-Erinnerungen, sofortigen Statuswechseln und direktem Feedback. Zeigt eine saubere Laravel-Authentifizierungsarchitektur.",
        features: ["Aufgaben erstellen, bearbeiten und loschen", "Unteraufgaben und Status", "Deadline-Benachrichtigungen"],
      },
    },
  },
  {
    name: "CashPilot",
    href: "https://cashpilot.mohiebi.com",
    external: true,
    tag: "Finance manager",
    outcome: "A personal finance workspace for tracking cash flow, categories, and day-to-day money decisions.",
    blurb: "CashPilot is a finance product built around clean transaction management, practical summaries, and a calmer way to understand where money is going.",
    features: ["Transaction tracking", "Category-based summaries", "Subdomain-ready product"],
    tech: ["Laravel", "Finance workflows", "Dashboard UX", "cashpilot.mohiebi.com"],
    accent: "from-lime-400/25 to-cyan-500/10",
    preview: "cash",
    translations: {
      de: {
        tag: "Finanzverwaltung",
        outcome: "Ein personlicher Finanzbereich zur Verwaltung von Cashflow, Kategorien und taglichen Geldentscheidungen.",
        blurb: "CashPilot ist ein Finanzprodukt mit ubersichtlicher Transaktionsverwaltung, praxisnahen Zusammenfassungen und einem ruhigeren Blick darauf, wohin das Geld fliesst.",
        features: ["Transaktionen verwalten", "Zusammenfassungen nach Kategorien", "Eigenstandiges Produkt auf Subdomain"],
      },
    },
  },
  {
    name: "AI Routine Coach",
    href: "https://t.me/AIRoutineCoachBot",
    external: true,
    tag: "AI routine bot",
    outcome: "Turns personal goals into a routine coaching flow that can help users plan and stay consistent.",
    blurb: "A focused AI product for daily planning, routine guidance, and habit support. It shows practical AI integration around a real user workflow.",
    features: ["Routine coaching flow", "Goal-aware planning", "Telegram bot delivery"],
    tech: ["AI integration", "Prompt design", "Telegram", "@AIRoutineCoachBot"],
    accent: "from-fuchsia-400/25 to-violet-500/10",
    preview: "routine",
    translations: {
      de: {
        tag: "KI-Routine-Bot",
        outcome: "Verwandelt personliche Ziele in einen Coaching-Ablauf, der Planung und bestandige Routinen unterstutzt.",
        blurb: "Ein fokussiertes KI-Produkt fur Tagesplanung, Routinen und Gewohnheitsunterstutzung. Es zeigt praxisnahe KI-Integration innerhalb eines echten Nutzerablaufs.",
        features: ["Coaching-Ablauf fur Routinen", "Zielorientierte Planung", "Bereitstellung als Telegram-Bot"],
      },
    },
  },
];

export function getProducts(locale: "en" | "de" = "en"): PortfolioProduct[] {
  if (locale === "en") return products;

  return products.map((product) => ({
    ...product,
    ...(product.translations?.[locale] ?? {}),
  }));
}
