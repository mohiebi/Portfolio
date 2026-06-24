export type ProjectPreview =
  | "tasks"
  | "cash"
  | "routine"
  | "design"
  | "jobs"
  | "books"
  | "realestate";

export type PortfolioProject = {
  name: string;
  href: string;
  external?: boolean;
  featured: boolean;
  tag: string;
  outcome: string;
  blurb: string;
  features: string[];
  tech: string[];
  accent: string;
  preview: ProjectPreview;
  translations?: {
    de: Pick<PortfolioProject, "tag" | "outcome" | "blurb" | "features">;
  };
};

export const projects: PortfolioProject[] = [
  {
    name: "TaskManager",
    href: "/taskmanager",
    featured: true,
    tag: "Productivity dashboard",
    outcome: "Eliminates missed tasks with per-user auth scoping, fast status updates, and a focused task flow.",
    blurb: "Authenticated task system with per-user scoping, subtasks, real-time toggle states, and flash feedback. Demonstrates clean Laravel auth architecture.",
    features: ["Create / edit / delete tasks", "Toggle completed state", "Auth-scoped per user"],
    tech: ["Laravel", "Inertia", "React", "Tailwind"],
    accent: "from-emerald-400/25 to-teal-500/10",
    preview: "tasks",
    translations: {
      de: {
        tag: "Produktivitäts-Dashboard",
        outcome: "Verhindert verpasste Aufgaben durch benutzerbezogene Zugriffssteuerung, schnelle Statusupdates und einen fokussierten Aufgabenablauf.",
        blurb: "Authentifiziertes Aufgabensystem mit benutzerbezogenen Daten, Unteraufgaben, sofortigen Statuswechseln und direktem Feedback. Zeigt eine saubere Laravel-Authentifizierungsarchitektur.",
        features: ["Aufgaben erstellen, bearbeiten und löschen", "Erledigt-Status umschalten", "Benutzerbezogene Zugriffssteuerung"],
      },
    },
  },
  {
    name: "CashPilot",
    href: "https://cashpilot.mohiebi.com",
    external: true,
    featured: true,
    tag: "Finance manager",
    outcome: "A personal finance workspace for tracking cash flow, categories, and day-to-day money decisions.",
    blurb: "CashPilot is a finance project built around clean transaction management, practical summaries, and a calmer way to understand where money is going.",
    features: ["Transaction tracking", "Category-based summaries", "Subdomain-ready product"],
    tech: ["Laravel", "Finance workflows", "Dashboard UX", "cashpilot.mohiebi.com"],
    accent: "from-lime-400/25 to-cyan-500/10",
    preview: "cash",
    translations: {
      de: {
        tag: "Finanzverwaltung",
        outcome: "Ein persönlicher Finanzbereich zur Verwaltung von Cashflow, Kategorien und täglichen Geldentscheidungen.",
        blurb: "CashPilot ist ein Finanzprojekt mit übersichtlicher Transaktionsverwaltung, praxisnahen Zusammenfassungen und einem ruhigeren Blick darauf, wohin das Geld fließt.",
        features: ["Transaktionen verwalten", "Zusammenfassungen nach Kategorien", "Eigenständiges Produkt auf Subdomain"],
      },
    },
  },
  {
    name: "AI Routine Coach",
    href: "https://t.me/AIRoutineCoachBot",
    external: true,
    featured: true,
    tag: "AI routine bot",
    outcome: "Turns personal goals into a routine coaching flow that can help users plan and stay consistent.",
    blurb: "A focused AI project for daily planning, routine guidance, and habit support. It shows practical AI integration around a real user workflow.",
    features: ["Routine coaching flow", "Goal-aware planning", "Telegram bot delivery"],
    tech: ["AI integration", "Prompt design", "Telegram", "@AIRoutineCoachBot"],
    accent: "from-fuchsia-400/25 to-violet-500/10",
    preview: "routine",
    translations: {
      de: {
        tag: "KI-Routine-Bot",
        outcome: "Verwandelt persönliche Ziele in einen Coaching-Ablauf, der Planung und beständige Routinen unterstützt.",
        blurb: "Ein fokussiertes KI-Projekt für Tagesplanung, Routinen und Gewohnheitsunterstützung. Es zeigt praxisnahe KI-Integration innerhalb eines echten Nutzerablaufs.",
        features: ["Coaching-Ablauf für Routinen", "Zielorientierte Planung", "Bereitstellung als Telegram-Bot"],
      },
    },
  },
  {
    name: "Mahdieh Design",
    href: "https://mahdiehdesign.com",
    external: true,
    featured: true,
    tag: "Client website",
    outcome: "A polished public website for a design brand, built to present work clearly and convert visitors.",
    blurb: "Mahdieh Design is a client-facing site with a visual-first presentation, responsive layout, and a straightforward path from browsing to contact.",
    features: ["Responsive brand site", "Portfolio-style presentation", "Clear visitor journey"],
    tech: ["Frontend", "Responsive UI", "Brand website", "Deployment"],
    accent: "from-pink-400/25 to-amber-400/10",
    preview: "design",
    translations: {
      de: {
        tag: "Kundenwebsite",
        outcome: "Eine hochwertige öffentliche Website für eine Designmarke, die Arbeiten klar präsentiert und Besucher in Anfragen verwandelt.",
        blurb: "Mahdieh Design ist eine kundenorientierte Website mit visueller Präsentation, responsivem Layout und einem direkten Weg vom Stöbern zur Kontaktaufnahme.",
        features: ["Responsive Markenwebsite", "Portfolio-orientierte Präsentation", "Klarer Besucherweg"],
      },
    },
  },
  {
    name: "Job Board",
    href: "/jobs",
    featured: false,
    tag: "SaaS-style marketplace",
    outcome: "A two-sided marketplace connecting employers and applicants with policy-protected, multi-role flows.",
    blurb: "Full marketplace with filterable listings, CV upload, employer dashboard, and Laravel Policies enforcing role-based access.",
    features: ["Salary / experience / category filters", "PDF CV upload", "Employer job management"],
    tech: ["Laravel", "Policies", "File uploads", "Tailwind"],
    accent: "from-sky-400/25 to-indigo-500/10",
    preview: "jobs",
    translations: {
      de: {
        tag: "SaaS-Marktplatz",
        outcome: "Ein zweiseitiger Marktplatz, der Arbeitgeber und Bewerber über geschützte Abläufe für mehrere Rollen verbindet.",
        blurb: "Vollständiger Marktplatz mit filterbaren Stellenangeboten, Lebenslauf-Upload, Arbeitgeber-Dashboard und Laravel Policies für rollenbasierte Zugriffe.",
        features: ["Filter nach Gehalt, Erfahrung und Kategorie", "PDF-Lebenslauf hochladen", "Stellenverwaltung für Arbeitgeber"],
      },
    },
  },
  {
    name: "BookReview",
    href: "/books",
    featured: false,
    tag: "Discovery and ratings",
    outcome: "Turns a flat book list into a searchable, filterable discovery engine with social proof.",
    blurb: "Discovery app with smart filters, average ratings aggregated from threaded reviews, and a fast search experience.",
    features: ["Filter by popularity and rating", "Star ratings and review counts", "Detail page with reviews"],
    tech: ["Laravel", "Eloquent", "Blade", "Tailwind"],
    accent: "from-amber-400/30 to-orange-500/10",
    preview: "books",
    translations: {
      de: {
        tag: "Entdeckung und Bewertungen",
        outcome: "Verwandelt eine einfache Bücherliste in eine durchsuchbare, filterbare Entdeckungsplattform mit Bewertungen.",
        blurb: "Entdeckungs-App mit intelligenten Filtern, aggregierten Durchschnittsbewertungen aus Rezensionen und einer schnellen Suche.",
        features: ["Nach Beliebtheit und Bewertung filtern", "Sternebewertungen und Anzahl der Rezensionen", "Detailseite mit Rezensionen"],
      },
    },
  },
  {
    name: "Real Estate",
    href: "/listing",
    featured: false,
    tag: "Property marketplace",
    outcome: "Full property marketplace with bidding, image management, and realtor dashboards.",
    blurb: "End-to-end real estate platform with advanced filters, buyer offer system with notifications, and a realtor CRUD panel.",
    features: ["Filter by price, beds, baths, area", "Buyer offer system with notifications", "Realtor CRUD + image management"],
    tech: ["Laravel", "Inertia", "Policies", "Storage"],
    accent: "from-rose-400/25 to-pink-500/10",
    preview: "realestate",
    translations: {
      de: {
        tag: "Immobilien-Marktplatz",
        outcome: "Vollständiger Immobilien-Marktplatz mit Geboten, Bildverwaltung und Makler-Dashboards.",
        blurb: "End-to-End-Immobilienplattform mit erweiterten Filtern, Käufersystem für Angebote und Benachrichtigungen sowie einem CRUD-Bereich für Makler.",
        features: ["Nach Preis, Zimmern, Bädern und Fläche filtern", "Käuferangebote mit Benachrichtigungen", "Makler-CRUD und Bildverwaltung"],
      },
    },
  },
];

export const featuredProjects = projects.filter((project) => project.featured);

export function getProjects(locale: "en" | "de" = "en"): PortfolioProject[] {
  if (locale === "en") return projects;

  return projects.map((project) => ({
    ...project,
    ...(project.translations?.[locale] ?? {}),
  }));
}

export function getFeaturedProjects(locale: "en" | "de" = "en"): PortfolioProject[] {
  return getProjects(locale).filter((project) => project.featured);
}
