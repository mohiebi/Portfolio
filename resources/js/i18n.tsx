import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";

export type Locale = "en" | "de";
export type LocalizedRecord = {
  translations?: Partial<Record<Locale, Record<string, unknown>>> | null;
};

const STORAGE_KEY = "mohi.locale";
const SUPPORTED_LOCALES: Locale[] = ["en", "de"];

const german: Record<string, string> = {
  "Portfolio": "Portfolio",
  "Services": "Leistungen",
  "Recommendations": "Empfehlungen",
  "Projects": "Projekte",
  "Case Studies": "Fallstudien",
  "About": "Über mich",
  "Articles": "Artikel",
  "Contact": "Kontakt",
  "All Projects": "Alle Projekte",
  "Project shelf": "Projektübersicht",
  "Log in": "Anmelden",
  "Sign up": "Registrieren",
  "Logout": "Abmelden",
  "Toggle menu": "Menü öffnen",
  "Language": "Sprache",
  "Switch to English": "Zu Englisch wechseln",
  "Mohi home": "Mohi Startseite",
  "Mohi logo": "Mohi-Logo",
  "Mohi portrait": "Porträt von Mohi",
  "Modern AI-enabled business systems infrastructure": "Moderne Infrastruktur für KI-gestützte Geschäftssysteme",
  "Launch Sprint, Operations System and AI Operations Platform":
    "Launch-Sprint, Operations-System und KI-Operations-Plattform",
  "Hi": "Hallo",

  "Back-end / full-stack engineer specializing in Laravel, Symfony, and NestJS — with AI integration and Web3 experience. Available for freelance and full-time work.":
    "Back-End-/Full-Stack-Entwickler mit Schwerpunkt auf Laravel, Symfony und NestJS — inklusive KI-Integration und Web3-Erfahrung. Verfügbar für Freelance- und Festanstellungen.",
  "Download CV": "Lebenslauf herunterladen",
  "All projects": "Alle Projekte",
  "Email": "E-Mail",
  "All rights reserved.": "Alle Rechte vorbehalten.",
  "Mohi - Back-End / Full-Stack Engineer": "Mohi — Back-End-/Full-Stack-Entwickler",
  "Projects - Mohi": "Projekte — Mohi",
  "Articles - Mohi": "Artikel — Mohi",
  "Case Studies - Mohi": "Fallstudien — Mohi",
  "LinkedIn Recommendations - Mohi": "LinkedIn-Empfehlungen — Mohi",
  "// About": "// Über mich",
  "// Services": "// Leistungen",
  "// Recommendations": "// Empfehlungen",
  "// Projects": "// Projekte",
  "// Case Studies": "// Fallstudien",
  "// Articles": "// Artikel",
  "// Contact": "// Kontakt",
  "// Compare": "// Vergleich",
  "// Value stack": "// Leistungsumfang",
  "// Process": "// Ablauf",
  "// Why me": "// Warum ich",
  "// Fit check": "// Passt es?",
  "// Work together": "// Zusammenarbeit",
  "// Up next": "// Als Nächstes",
  "// Problem": "// Problem",
  "// Approach": "// Vorgehen",
  "// Highlights": "// Highlights",

  "Now taking 2 new clients — July 2026": "Aktuell 2 neue Kundenplätze — Juli 2026",
  "I build the backend systems that": "Ich entwickle die Backend-Systeme, die",
  "keep your business running": "Ihr Unternehmen am Laufen halten",
  "Hi, I'm": "Hallo, ich bin",
  "- a back-end / full-stack engineer with": "— ein Back-End-/Full-Stack-Entwickler mit",
  "3+ years delivering production systems across fintech, blockchain, and AI-integrated platforms.":
    "über 3 Jahren Erfahrung mit produktiven Systemen in Fintech, Blockchain und KI-integrierten Plattformen.",
  "Book a free call": "Kostenloses Gespräch buchen",
  "View services": "Leistungen ansehen",
  "Faster page loads delivered": "Schnellere Ladezeiten erreicht",
  "Years in production": "Jahre Produktionserfahrung",
  "Commits — S-tier output": "Commits — Leistung auf Top-Niveau",
  "AI CRM integration · Laravel + NestJS": "KI-CRM-Integration · Laravel + NestJS",

  "Kind words from": "Wertschätzende Worte von",
  "Recommendations from people I have worked with across engineering, product, and delivery.":
    "Empfehlungen von Menschen, mit denen ich in Entwicklung, Produkt und Delivery zusammengearbeitet habe.",
  "Real recommendations from teammates and senior engineers I've worked with.":
    "Echte Empfehlungen von Teamkollegen und erfahrenen Entwicklern, mit denen ich zusammengearbeitet habe.",
  "All recommendations": "Alle Empfehlungen",
  "Show recommendation": "Empfehlung anzeigen",
  "Previous recommendation": "Vorherige Empfehlung",
  "Next recommendation": "Nächste Empfehlung",
  "View all recommendations": "Alle Empfehlungen ansehen",
  "View on LinkedIn": "Auf LinkedIn ansehen",
  "(read more)": "(weiterlesen)",
  "LinkedIn recommendation": "LinkedIn-Empfehlung",

  "I turn complicated backend problems into reliable products.":
    "Ich verwandle komplexe Backend-Probleme in zuverlässige Produkte.",
  "A legacy PHP stack was costing a business customers every day. I migrated it to Vue.js, rebuilt the backend architecture, and shipped it in weeks.":
    "Ein veralteter PHP-Stack kostete ein Unternehmen täglich Kunden. Ich migrierte ihn zu Vue.js, baute die Backend-Architektur neu auf und lieferte innerhalb weniger Wochen.",
  "85% faster. Zero downtime. Still running.": "85 % schneller. Keine Ausfallzeit. Läuft bis heute.",
  "With": "Mit",
  "across fintech, blockchain, and AI-integrated platforms, I've delivered":
    "in Fintech, Blockchain und KI-integrierten Plattformen habe ich",
  "on production systems using": "auf Produktivsystemen geliefert — mit",
  "and": "und",
  "— built Web3 pipelines processing 1,000+ daily transactions, and shipped AI-gated backend services including a custom non-custodial crypto payment system.":
    "— Web3-Pipelines für über 1.000 tägliche Transaktionen entwickelt und KI-gestützte Backend-Dienste geliefert, darunter ein eigenes Non-Custodial-Krypto-Zahlungssystem.",
  "Tech stack": "Tech-Stack",
  "Experience": "Berufserfahrung",
  "Education": "Ausbildung",
  "Full-Stack Developer": "Full-Stack-Entwickler",
  "AI Integration Developer": "Entwickler für KI-Integration",
  "Web Developer": "Webentwickler",
  "Present": "Heute",
  "Remote": "Remote",
  "MBA - Marketing": "MBA — Marketing",
  "B.Sc. Mechanical Eng.": "B.Sc. Maschinenbau",

  "Let's build something": "Lassen Sie uns etwas",
  "solid": "Solides entwickeln",
  "Have a backend-heavy product, a system that needs modernization, or an AI workflow to ship? Let's talk.":
    "Sie haben ein backendlastiges Produkt, ein System mit Modernisierungsbedarf oder einen KI-Workflow? Lassen Sie uns sprechen.",
  "Start with a focused 30-minute call": "Starten Sie mit einem fokussierten 30-Minuten-Gespräch",
  "We will clarify the problem, the right scope, and whether I am the right engineer for it.":
    "Wir klären das Problem, den passenden Umfang und ob ich der richtige Entwickler dafür bin.",
  "Schedule a free consultation": "Kostenlose Beratung vereinbaren",
  "30 minutes": "30 Minuten",
  "Free consultation": "Kostenlose Beratung",
  "No obligation": "Unverbindlich",
  "No commitment": "Unverbindlich",
  "or reach out directly": "oder direkt Kontakt aufnehmen",
  "Choose the channel that fits": "Wählen Sie den passenden Kanal",
  "Email is best for scoped project details. LinkedIn works well for quick context.":
    "E-Mail eignet sich am besten für konkrete Projektdetails. LinkedIn ist ideal für einen kurzen ersten Austausch.",
  "Send an email": "E-Mail senden",
  "Open LinkedIn": "LinkedIn öffnen",
  "copied": "kopiert",
  "copy": "kopieren",

  "Backend services that": "Backend-Leistungen, die",
  "run your business": "Ihr Unternehmen voranbringen",
  "From focused launch sprints to AI-powered operations platforms — clear scope, production-ready delivery, and no agency overhead.":
    "Von fokussierten Launch-Sprints bis zu KI-gestützten Betriebsplattformen — klarer Umfang, produktionsreife Umsetzung und kein Agentur-Overhead.",
  "Explore the full service packages, timelines, deliverables, and guarantees.":
    "Entdecken Sie alle Leistungspakete, Zeitpläne, Ergebnisse und Garantien.",
  "Explore all services": "Alle Leistungen entdecken",
  "Launch sprint": "Launch-Sprint",
  "Launch Sprint": "Launch-Sprint",
  "Operations system": "Betriebssystem",
  "Operations System": "Operations-System",
  "AI operations platform": "KI-Betriebsplattform",
  "AI Operations Platform": "KI-Operations-Plattform",

  "Real engineering work, end-to-end": "Echte Entwicklungsarbeit — von Anfang bis Ende",
  "Selected work across backend architecture, Laravel, Symfony, Vue, Node.js, Web3, AI integrations, and production modernization.":
    "Ausgewählte Arbeiten aus Backend-Architektur, Laravel, Symfony, Vue, Node.js, Web3, KI-Integrationen und Produktivmodernisierung.",
  "All case studies": "Alle Fallstudien",
  "Read case study": "Fallstudie lesen",
  "Featured builds": "Ausgewählte Projekte",
  "The top projects now lead with TaskManager, CashPilot, AI Routine Coach, and Mahdieh Design. The full project archive has the rest.":
    "Im Mittelpunkt stehen TaskManager, CashPilot, AI Routine Coach und Mahdieh Design. Weitere Projekte finden Sie im vollständigen Archiv.",
  "View all projects": "Alle Projekte ansehen",
  "View Project": "Projekt ansehen",
  "View project": "Projekt ansehen",
  "Discuss this project": "Dieses Projekt besprechen",
  "Technical notes and build logs": "Technische Notizen und Entwicklungsberichte",
  "Practical writing on backend design, Laravel delivery, production debugging, and the choices behind real systems.":
    "Praxisnahe Beiträge über Backend-Design, Laravel-Umsetzung, Produktions-Debugging und die Entscheidungen hinter echten Systemen.",
  "Read how I think about systems": "Meine Gedanken zu Systemen lesen",
  "Published note": "Veröffentlichter Beitrag",
  "Read": "Lesen",
  "min": "Min.",

  "Production-minded builds,": "Produktionsreife Projekte —",
  "from tools to client sites": "von Tools bis zu Kundenwebsites",
  "The first four are the current highlights: TaskManager, CashPilot, AI Routine Coach, and Mahdieh Design. Older Laravel demos are still here for browsing.":
    "Die ersten vier sind die aktuellen Highlights: TaskManager, CashPilot, AI Routine Coach und Mahdieh Design. Ältere Laravel-Demos können weiterhin erkundet werden.",
  "Want a similar build?": "Sie möchten ein ähnliches Projekt?",
  "I work best on practical backend-heavy products with clear business workflows.":
    "Am stärksten bin ich bei praxisnahen, backendlastigen Produkten mit klaren Geschäftsabläufen.",
  "Get in touch": "Kontakt aufnehmen",
  "Featured build": "Ausgewähltes Projekt",
  "What the project does": "Was das Projekt leistet",
  "Key abilities": "Kernfunktionen",

  "Notes from the": "Notizen vom",
  "engineering desk": "Entwicklertisch",
  "Practical writing about backend systems, Laravel, architecture, production debugging, and full-stack delivery.":
    "Praxisnahe Beiträge über Backend-Systeme, Laravel, Architektur, Produktions-Debugging und Full-Stack-Umsetzung.",
  "Articles are coming soon": "Artikel folgen in Kürze",
  "New technical notes will show up here once they are published.":
    "Neue technische Beiträge erscheinen hier, sobald sie veröffentlicht sind.",
  "Want to talk through one of these ideas?": "Möchten Sie eine dieser Ideen besprechen?",
  "I am happy to discuss architecture, trade-offs, and implementation details.":
    "Gerne bespreche ich Architektur, Abwägungen und Umsetzungsdetails.",
  "Read article": "Artikel lesen",
  "All articles": "Alle Artikel",
  "About this article": "Über diesen Artikel",
  "min read": "Min. Lesezeit",
  "Have a project in mind?": "Sie haben ein Projekt im Kopf?",
  "I can help shape the architecture and ship the implementation.":
    "Ich unterstütze bei der Architektur und liefere die Umsetzung.",
  "Up next": "Als Nächstes",
  "Work together": "Zusammenarbeiten",
  "Have a related project?": "Sie haben ein passendes Projekt?",

  "Real engineering work,": "Echte Entwicklungsarbeit,",
  "end-to-end": "von Anfang bis Ende",
  "Have something similar in mind?": "Sie planen etwas Ähnliches?",
  "I'm open to fullstack roles, freelance projects, and Web3 work.":
    "Ich bin offen für Full-Stack-Positionen, Freelance-Projekte und Web3-Arbeit.",
  "The challenge": "Die Herausforderung",
  "Problem": "Problem",
  "What I did": "Mein Vorgehen",
  "Approach": "Ansatz",
  "What stood out": "Besondere Ergebnisse",
  "Highlights": "Highlights",
  "Want to dig deeper?": "Möchten Sie tiefer einsteigen?",
  "Happy to walk you through the architecture, trade-offs, and outcomes.":
    "Gerne führe ich Sie durch Architektur, Abwägungen und Ergebnisse.",
  "Next case study": "Nächste Fallstudie",

  "Full LinkedIn recommendations": "Vollständige LinkedIn-Empfehlungen",
  "Full text from the recommendations featured on the portfolio.":
    "Vollständige Texte der im Portfolio gezeigten Empfehlungen.",
  "Back to portfolio": "Zurück zum Portfolio",
  "Recommender profile": "Profil der empfehlenden Person",

  "Reset password": "Passwort zurücksetzen",
  "Enter your email and we will send a reset link.": "Geben Sie Ihre E-Mail-Adresse ein. Wir senden Ihnen einen Link zum Zurücksetzen.",
  "Back to login": "Zurück zur Anmeldung",
  "Forgot password": "Passwort vergessen",
  "Email reset link": "Link zum Zurücksetzen senden",
  "Choose a new password": "Neues Passwort wählen",
  "Confirm password": "Passwort bestätigen",
  "This secure area needs your password.": "Dieser geschützte Bereich erfordert Ihr Passwort.",
  "Confirm": "Bestätigen",
  "Verify your email": "E-Mail-Adresse bestätigen",
  "Check your inbox for the verification link.": "Prüfen Sie Ihren Posteingang auf den Bestätigungslink.",
  "Verify email": "E-Mail bestätigen",
  "Resend verification email": "Bestätigungs-E-Mail erneut senden",
  "Log out": "Abmelden",

  "Modern business systems built in": "Moderne Geschäftssysteme entwickelt in",
  "weeks, not months": "Wochen statt Monaten",
  "Backend-Focused AI Systems Engineer": "Backend-orientierter KI-Systementwickler",
  "Now accepting 2 new clients — July 2026": "Aktuell 2 neue Kundenplätze — Juli 2026",
  "I help businesses replace outdated websites and manual workflows with backend-focused systems, workflow automation and AI-powered solutions — at a fraction of what agencies charge.":
    "Ich helfe Unternehmen, veraltete Websites und manuelle Abläufe durch backendorientierte Systeme, Workflow-Automatisierung und KI-Lösungen zu ersetzen — zu einem Bruchteil typischer Agenturkosten.",
  "Book a free consultation": "Kostenlose Beratung buchen",
  "View packages": "Pakete ansehen",
  "First live milestone": "Erster Live-Meilenstein",
  "Or your money back": "Oder Geld zurück",
  "Built into every system": "In jedes System integriert",
  "Sound familiar?": "Kommt Ihnen das bekannt vor?",
  "Stop overpaying agencies. Get the system your business actually needs.":
    "Zahlen Sie nicht länger zu viel an Agenturen. Erhalten Sie das System, das Ihr Unternehmen wirklich braucht.",
  "Compare value, scope and timeline": "Wert, Umfang und Zeitplan vergleichen",
  "Package": "Paket",
  "Investment": "Investition",
  "Timeline": "Zeitplan",
  "Best for": "Ideal für",
  "Main outcome": "Hauptergebnis",
  "Free bonuses": "Kostenlose Extras",
  "Guarantees": "Garantien",
  "Total bonus value": "Gesamtwert der Extras",

  "search books…": "Bücher suchen…",
  "My tasks": "Meine Aufgaben",
  "New": "Neu",
  "Ship landing page": "Landingpage veröffentlichen",
  "Review PR #248": "PR #248 prüfen",
  "Plan sprint demo": "Sprint-Demo planen",
  "Refactor auth guard": "Auth-Guard refaktorieren",
  "Balance": "Kontostand",
  "Income": "Einnahmen",
  "Bills": "Rechnungen",
  "Savings": "Ersparnisse",
  "AI coach": "KI-Coach",
  "Today: protect your focus block before admin work.":
    "Heute: Schützen Sie Ihren Fokusblock vor administrativen Aufgaben.",
  "Morning focus": "Morgenfokus",
  "Workout": "Training",
  "Deep work": "Konzentriertes Arbeiten",
  "Brand": "Marke",
  "Work": "Arbeiten",
  "Apply": "Bewerben",
  "All": "Alle",
  "View": "Ansehen",
  "Senior": "Senior",
  "Unit / E2E Testing": "Unit-/E2E-Tests",
  "Wallet Integration": "Wallet-Integration",
  "Clean Architecture": "Saubere Architektur",
  "delivering sprint 3": "Sprint 3 wird ausgeliefert",
  "~ /current": "~ /aktuell",

  // Portfolio and project archive
  "Productivity dashboard": "Produktivitäts-Dashboard",
  "Finance manager": "Finanzverwaltung",
  "AI routine bot": "KI-Routine-Bot",
  "Client website": "Kundenwebsite",
  "SaaS-style marketplace": "SaaS-Marktplatz",
  "Discovery and ratings": "Entdeckung und Bewertungen",
  "Property marketplace": "Immobilien-Marktplatz",
  "Create / edit / delete tasks": "Aufgaben erstellen, bearbeiten und löschen",
  "Toggle completed state": "Erledigt-Status umschalten",
  "Auth-scoped per user": "Benutzerbezogene Zugriffssteuerung",
  "Routine coaching flow": "Coaching-Ablauf für Routinen",
  "Goal-aware planning": "Zielorientierte Planung",
  "Telegram bot delivery": "Bereitstellung als Telegram-Bot",
  "Responsive brand site": "Responsive Markenwebsite",
  "Portfolio-style presentation": "Portfolio-orientierte Präsentation",
  "Clear visitor journey": "Klarer Besucherweg",
  "AI integration": "KI-Integration",
  "AI Integration": "KI-Integration",
  "Prompt design": "Prompt-Design",
  "Finance workflows": "Finanzabläufe",
  "Dashboard UX": "Dashboard-UX",
  "Responsive UI": "Responsive UI",
  "Brand website": "Markenwebsite",
  "Deployment": "Bereitstellung",
  "Production-minded builds": "Produktionsreife Projekte",
  "from tools to client sites.": "von Tools bis zu Kundenwebsites.",
  "Welcome back, Jane": "Willkommen zurück, Jane",
  "Here's what's on your plate today.": "Das steht heute auf Ihrer Aufgabenliste.",
  "New task": "Neue Aufgabe",
  "Total": "Gesamt",
  "In progress": "In Bearbeitung",
  "Completed": "Erledigt",
  "Dashboard": "Dashboard",
  "Tasks": "Aufgaben",
  "Profile": "Profil",
  "Write project overview": "Projektübersicht schreiben",
  "Design dashboard UI": "Dashboard-Oberfläche gestalten",
  "Authentication flow": "Authentifizierungsablauf",
  "Task CRUD operations": "CRUD-Funktionen für Aufgaben",
  "Clean scoped user workflow": "Sauber abgegrenzter Nutzerablauf",
  "Costs": "Ausgaben",
  "Cash flow rate": "Cashflow-Quote",
  "Monthly overview": "Monatsübersicht",
  "CSV import workflow": "CSV-Importablauf",
  "Upload": "Hochladen",
  "Dates": "Daten",
  "Normalize": "Normalisieren",
  "Done": "Fertig",
  "bot": "Bot",
  "Good morning. Here are your tasks for today.": "Guten Morgen. Hier sind Ihre Aufgaben für heute.",
  "Streak: 12 days": "Serie: 12 Tage",
  "Read 20 pages": "20 Seiten lesen",
  "Plan tomorrow": "Morgen planen",
  "Complete": "Erledigen",
  "Skip": "Überspringen",
  "Fail": "Nicht geschafft",
  "Health": "Gesundheit",
  "Streak": "Serie",
  "/coach I keep skipping workouts": "/coach Ich lasse mein Training immer wieder aus",
  "AI insights": "KI-Erkenntnisse",
  "You tend to skip workouts on busy days. Let's make it easier to win.":
    "An vollen Tagen lassen Sie das Training häufiger aus. Machen wir den Erfolg leichter.",
  "Optimize routines": "Routinen optimieren",
  "Analyze my week": "Meine Woche analysieren",
  "Ask coach": "Coach fragen",
  "Process": "Prozess",
  "Brand and visual design": "Marken- und visuelles Design",
  "Strategy meets": "Strategie trifft",
  "aesthetics": "Ästhetik",
  ", in service of growth.": "— im Dienst des Wachstums.",
  "A public portfolio, case-study archive, bilingual brief flow, and authenticated content dashboard.":
    "Ein öffentliches Portfolio, ein Fallstudienarchiv, ein zweisprachiger Briefing-Ablauf und ein geschütztes Content-Dashboard.",
  "View selected work": "Ausgewählte Arbeiten ansehen",
  "Clients": "Kunden",
  "Case studies": "Fallstudien",
  "Selected work archive": "Archiv ausgewählter Arbeiten",
  "Popular": "Beliebt",
  "View case study": "Fallstudie ansehen",
  "Project brief": "Projektbriefing",
  "About brand": "Über die Marke",
  "Project goals": "Projektziele",
  "Scope": "Umfang",
  "Reviews": "Bewertungen",
  "Briefs": "Briefings",
  "Find your next role": "Finden Sie Ihre nächste Position",
  "Filter by salary, experience and category.": "Filtern Sie nach Gehalt, Erfahrung und Kategorie.",
  "Product team": "Produktteam",
  "Full-time": "Vollzeit",
  "Senior Laravel Developer": "Senior-Laravel-Entwickler",
  "Vue Engineer": "Vue-Entwickler",
  "NestJS Backend Engineer": "NestJS-Backend-Entwickler",
  "Product-minded Full Stack": "Produktorientierter Full-Stack-Entwickler",
  "search books, authors, ratings...": "Bücher, Autoren und Bewertungen suchen …",
  "Book title": "Buchtitel",
  "2+ beds": "2+ Schlafzimmer",
  "Under $500k": "Unter 500.000 $",
  "Listed property": "Gelistete Immobilie",

  // Homepage sections and composed copy
  "I cut a client's page load time by 85% — here's how I work":
    "Ich habe die Ladezeit einer Kundenseite um 85 % reduziert — so arbeite ich",
  "That's how I approach every engagement — diagnose the real bottleneck, build the system that removes it, ship it clean.":
    "So gehe ich jedes Projekt an: den echten Engpass erkennen, das passende System entwickeln und sauber ausliefern.",
  "Open to freelance projects, fullstack roles and Web3 collaborations.":
    "Offen für Freelance-Projekte, Full-Stack-Positionen und Web3-Zusammenarbeit.",
  "Responds within 24h": "Antwort innerhalb von 24 Std.",
  "First call free": "Erstgespräch kostenlos",
  "Pick a time that works for you": "Wählen Sie einen passenden Termin",
  "A focused 30-minute call to map your project, timeline, and the fastest path to a working system.":
    "Ein fokussiertes 30-Minuten-Gespräch, um Projekt, Zeitplan und den schnellsten Weg zu einem funktionierenden System zu klären.",
  "Send scope, timeline, budget, or a rough idea.": "Senden Sie Umfang, Zeitplan, Budget oder eine erste Idee.",
  "Good for intros, hiring conversations, and quick context.": "Ideal für Vorstellungen, Gespräche zu Positionen und einen kurzen Kontext.",
  "Browse code, activity, and implementation style.": "Code, Aktivität und Umsetzungsstil ansehen.",
  "Open profile": "Profil öffnen",
  "Copy email": "E-Mail kopieren",
  "Systems that": "Systeme, die",
  "— not just your website.": "— nicht nur Ihre Website.",
  "From launch to full AI-powered operations — each engagement ships a working system with measurable business impact.":
    "Vom Launch bis zum vollständigen KI-gestützten Betrieb — jedes Projekt liefert ein funktionierendes System mit messbarer geschäftlicher Wirkung.",
  "Live in 14 days": "In 14 Tagen live",
  "Manual work → automated workflows": "Manuelle Arbeit → automatisierte Abläufe",
  "AI-powered, scales without rebuilding": "KI-gestützt und ohne Neubau skalierbar",
  "Not sure which one fits? Browse all packages with full details and pricing.":
    "Nicht sicher, welches Angebot passt? Sehen Sie alle Pakete mit Details und Preisen an.",
  "Idea → production in weeks": "Von der Idee zur Produktion in Wochen",
  "Replace manual work with systems": "Manuelle Arbeit durch Systeme ersetzen",
  "Make your product intelligent": "Ihr Produkt intelligent machen",

  // Service pages
  "Paying an agency $20K+ for a site that still doesn't convert leads":
    "Sie zahlen einer Agentur über 20.000 $, doch die Website gewinnt weiterhin keine Leads",
  "Your team spends hours on manual work that a system could do in seconds":
    "Ihr Team verbringt Stunden mit Arbeit, die ein System in Sekunden erledigen könnte",
  "Waiting 6 months for a developer to deliver something half-finished":
    "Sie warten sechs Monate auf eine nur halb fertige Lösung",
  "These are the exact problems my services solve —": "Genau diese Probleme lösen meine Leistungen —",
  "without the agency price tag or 6-month wait.": "ohne Agenturpreis und sechs Monate Wartezeit.",
  "Three focused engagements — each ships a working system at a fraction of agency rates, backed by an on-time guarantee.":
    "Drei fokussierte Angebote — jedes liefert ein funktionierendes System zu einem Bruchteil typischer Agenturpreise, abgesichert durch eine Termingarantie.",
  "Agency comparison:": "Agenturvergleich:",
  "A typical digital agency charges": "Eine typische Digitalagentur berechnet",
  "for equivalent scope — with 3–6 month timelines and no delivery guarantee.":
    "für einen vergleichbaren Umfang — bei 3–6 Monaten Laufzeit und ohne Liefergarantie.",
  "agency: $25K+": "Agentur: 25.000 $+",
  "Everything you get — including the bonuses": "Alles, was Sie erhalten — inklusive Extras",
  "On top of the deliverables, every engagement includes free bonuses and an iron-clad guarantee.":
    "Zusätzlich zu den Ergebnissen enthält jedes Projekt kostenlose Extras und eine klare Garantie.",
  "Bonuses vary by package — see each service page for the full list.":
    "Die Extras unterscheiden sich je nach Paket — die vollständige Liste finden Sie auf der jeweiligen Leistungsseite.",
  "I put my money where my mouth is. If I miss a deadline, you don't pay. Simple.":
    "Ich stehe für meine Zusagen ein. Verpasse ich eine Frist, zahlen Sie nicht. Ganz einfach.",
  "I handle everything — you just show up twice": "Ich kümmere mich um alles — Sie müssen nur zweimal dabei sein",
  "Your total time commitment across the entire project: under 2 hours. I do the rest.":
    "Ihr gesamter Zeitaufwand im Projekt: unter zwei Stunden. Den Rest übernehme ich.",
  "Discovery call": "Kennenlerngespräch",
  "We map your business model, workflows, bottlenecks and what success looks like.":
    "Wir erfassen Geschäftsmodell, Abläufe, Engpässe und die Kriterien für Erfolg.",
  "Your time: 30 min": "Ihr Aufwand: 30 Min.",
  "Business & system analysis": "Geschäfts- und Systemanalyse",
  "I diagnose where leads, tasks and time get lost, then define scope and acceptance criteria.":
    "Ich analysiere, wo Leads, Aufgaben und Zeit verloren gehen, und definiere anschließend Umfang und Abnahmekriterien.",
  "Your time: review only": "Ihr Aufwand: nur Review",
  "Design & development": "Design und Entwicklung",
  "I build the system in milestone-based sprints with clear progress updates every 48h.":
    "Ich entwickle das System in meilensteinbasierten Sprints mit klaren Fortschrittsupdates alle 48 Stunden.",
  "Your time: zero": "Ihr Aufwand: keiner",
  "Review & launch": "Review und Launch",
  "We test together, deploy to production and make sure core workflows are fully live.":
    "Wir testen gemeinsam, stellen produktiv bereit und sichern den vollständigen Betrieb der Kernabläufe.",
  "Your time: 1 hour": "Ihr Aufwand: 1 Stunde",
  "Support & improvement": "Support und Weiterentwicklung",
  "Training, documentation and a support window keep the system stable and growing.":
    "Schulung, Dokumentation und ein Supportfenster halten das System stabil und entwicklungsfähig.",
  "Your time: as needed": "Ihr Aufwand: nach Bedarf",
  "A backend-focused engineer who builds for your business outcomes":
    "Ein backendorientierter Entwickler, der für Ihre Geschäftsergebnisse baut",
  "I do not sell templates or hours — I solve operational pain and build scalable systems that pay for themselves.":
    "Ich verkaufe keine Vorlagen oder Stunden — ich löse operative Probleme und entwickle skalierbare Systeme, die sich auszahlen.",
  "Talk to me": "Gespräch vereinbaren",
  "Backend-focused full-stack engineer who sells outcomes, not hours.":
    "Backendorientierter Full-Stack-Entwickler, der Ergebnisse statt Stunden liefert.",
  "Deep expertise in Laravel, Symfony, NestJS and Vue.js.": "Fundierte Erfahrung mit Laravel, Symfony, NestJS und Vue.js.",
  "API architecture and Web3 integrations for modern platforms.": "API-Architektur und Web3-Integrationen für moderne Plattformen.",
  "Business systems thinking - I solve operational pain, not just ship code.":
    "Denken in Geschäftssystemen — ich löse operative Probleme und liefere nicht nur Code.",
  "Scalable backend development built to grow without rebuilding.":
    "Skalierbare Backend-Entwicklung, die ohne Neubau mitwächst.",
  "Clear milestone delivery with updates every 48 hours.": "Klare Meilensteine mit Updates alle 48 Stunden.",
  "Is this right for you?": "Passt dieses Angebot zu Ihnen?",
  "I work with a small number of clients at a time. Here's how to know if we're a match.":
    "Ich arbeite gleichzeitig mit wenigen Kunden. So erkennen Sie, ob wir zusammenpassen.",
  "This is NOT for you if...": "Das ist NICHT passend, wenn …",
  "This IS for you if...": "Das ist passend, wenn …",
  "You want the cheapest option available (try Fiverr)": "Sie suchen ausschließlich die billigste Option",
  "You need 10 rounds of revisions on a logo": "Sie benötigen zehn Überarbeitungsrunden für ein Logo",
  "You're not ready to move in weeks": "Sie können nicht innerhalb weniger Wochen starten",
  "You just need a simple landing page with no backend": "Sie benötigen nur eine einfache Landingpage ohne Backend",
  "Manual work is eating your team's time and revenue": "Manuelle Arbeit kostet Ihr Team Zeit und Umsatz",
  "Your website doesn't convert visitors into qualified leads": "Ihre Website verwandelt Besucher nicht in qualifizierte Leads",
  "You've been burned by slow, unreliable developers before": "Sie haben bereits schlechte Erfahrungen mit langsamen, unzuverlässigen Entwicklern gemacht",
  "You want it built right, the first time — with a guarantee": "Sie möchten eine saubere Umsetzung beim ersten Mal — mit Garantie",
  "Let's build the system your business deserves": "Entwickeln wir das System, das Ihr Unternehmen verdient",
  "Tell me where leads, time or customers are getting lost — and I'll show you the fastest path to a system that fixes it.":
    "Zeigen Sie mir, wo Leads, Zeit oder Kunden verloren gehen — ich zeige Ihnen den schnellsten Weg zu einem System, das dieses Problem löst.",
  "First milestone in 14 days or your money back.": "Erster Meilenstein in 14 Tagen oder Geld zurück.",
  "On-time guarantee — or you don't pay": "Termingarantie — sonst zahlen Sie nicht",
  "No commitment required · 30-minute call · Free system diagnosis":
    "Unverbindlich · 30-Minuten-Gespräch · Kostenlose Systemanalyse",
  "Agency rate:": "Agenturpreis:",
  "Key deliverables": "Wichtigste Ergebnisse",
  "Agency equivalent:": "Agenturvergleich:",
  "View all packages": "Alle Pakete ansehen",
  "At a glance": "Auf einen Blick",
  "Other services": "Weitere Leistungen",
  "First milestone in 14 days — or you don't pay": "Erster Meilenstein in 14 Tagen — sonst zahlen Sie nicht",
  "Compare all packages": "Alle Pakete vergleichen",
  "No commitment. 30-minute call. Free system diagnosis.":
    "Unverbindlich. 30-Minuten-Gespräch. Kostenlose Systemanalyse.",
  "On-time": "Termingerecht",
  "AI-ready": "KI-bereit",
  "Your investment:": "Ihre Investition:",
  "View package": "Paket ansehen",
  "The problem it solves": "Das gelöste Problem",
  "What you get": "Was Sie erhalten",
  "Why it matters": "Warum es wichtig ist",
  "Explore": "Entdecken:",
  "Before": "Vorher",
  "After": "Nachher",
  "A clear view of where each package fits so you can decide with confidence.":
    "Eine klare Übersicht, welches Paket zu Ihrer Situation passt, damit Sie sicher entscheiden können.",
  "Dec 2025 – Present / Belize City, Belize": "Dez. 2025 – heute / Belize City, Belize",
  "Jun 2024 – Nov 2025 / Belize City, Belize": "Juni 2024 – Nov. 2025 / Belize City, Belize",
  "Jun 2025 – Dec 2025 / Canada, Remote": "Juni 2025 – Dez. 2025 / Kanada, Remote",
  "May 2022 - Sep 2023 / Muscat, Oman": "Mai 2022 – Sept. 2023 / Maskat, Oman",
  "Khorasgan University / 2022 - Present": "Khorasgan University / 2022 – heute",
  "University of Kashan / 2015 - 2019": "University of Kashan / 2015–2019",

  // Public demo applications and authentication
  "Project / BookReview": "Projekt / BookReview",
  "Browse books": "Bücher durchsuchen",
  "Search the catalog and filter by popularity or rating.":
    "Durchsuchen Sie den Katalog und filtern Sie nach Beliebtheit oder Bewertung.",
  "Search by title...": "Nach Titel suchen …",
  "Search by title": "Nach Titel suchen",
  "Latest": "Neueste",
  "Popular / 1mo": "Beliebt / 1 Monat",
  "Popular / 6mo": "Beliebt / 6 Monate",
  "Top rated / 1mo": "Bestbewertet / 1 Monat",
  "Top rated / 6mo": "Bestbewertet / 6 Monate",
  "No books found": "Keine Bücher gefunden",
  "Try a different search term or clear the filter.": "Versuchen Sie einen anderen Suchbegriff oder entfernen Sie den Filter.",
  "reviews": "Bewertungen",
  "of 5 stars": "von 5 Sternen",
  "Previous page": "Vorherige Seite",
  "Next page": "Nächste Seite",

  "Project / Job Board": "Projekt / Jobbörse",
  "Show filters": "Filter anzeigen",
  "Hide filters": "Filter ausblenden",
  "Filters": "Filter",
  "Search": "Suche",
  "Title or company": "Titel oder Unternehmen",
  "Min salary": "Mindestgehalt",
  "Max salary": "Höchstgehalt",
  "Category": "Kategorie",
  "Any": "Beliebig",
  "Clear filters": "Filter löschen",
  "No matching jobs": "Keine passenden Stellen",
  "Try widening your filters or clearing them.": "Erweitern Sie die Filter oder setzen Sie sie zurück.",
  "Company": "Unternehmen",

  "Project / Real Estate": "Projekt / Immobilien",
  "Real Estate Listings": "Immobilienangebote",
  "Property Listings": "Immobilienangebote",
  "Browse available properties. Filter by price, beds, baths, or area.":
    "Durchsuchen Sie verfügbare Immobilien und filtern Sie nach Preis, Schlafzimmern, Bädern oder Fläche.",
  "Add Listing": "Immobilie hinzufügen",
  "Clear": "Löschen",
  "Price from": "Preis ab",
  "Price to": "Preis bis",
  "Beds": "Schlafzimmer",
  "Baths": "Bäder",
  "Area from (m²)": "Fläche ab (m²)",
  "Area to (m²)": "Fläche bis (m²)",
  "Min": "Min.",
  "Max": "Max.",
  "No properties found": "Keine Immobilien gefunden",
  "Try widening your filters.": "Erweitern Sie Ihre Filter.",

  "Project / TaskManager": "Projekt / TaskManager",
  "Your tasks": "Ihre Aufgaben",
  "A focused dashboard for what's on your plate.": "Ein fokussiertes Dashboard für Ihre aktuellen Aufgaben.",
  "You are viewing a demo. You can move these sample tasks here, but changes are not saved. Log in or register to create and manage your own tasks.":
    "Sie sehen eine Demo. Sie können die Beispielaufgaben verschieben, Änderungen werden jedoch nicht gespeichert. Melden Sie sich an oder registrieren Sie sich, um eigene Aufgaben zu erstellen und zu verwalten.",
  "Active": "Aktiv",
  "Open": "Offen",
  "New task title": "Titel der neuen Aufgabe",
  "Log in to add your own task": "Melden Sie sich an, um eine eigene Aufgabe hinzuzufügen",
  "Add an open task": "Offene Aufgabe hinzufügen",
  "Log in to add task": "Anmelden, um Aufgabe hinzuzufügen",
  "Add task": "Aufgabe hinzufügen",
  "No tasks here": "Keine Aufgaben vorhanden",
  "Create your first task to get started.": "Erstellen Sie Ihre erste Aufgabe, um zu beginnen.",
  "Create task": "Aufgabe erstellen",
  "Sub tasks": "Unteraufgaben",
  "Move task to done": "Aufgabe nach „Fertig“ verschieben",
  "Move task to open": "Aufgabe nach „Offen“ verschieben",
  "Polish portfolio hero copy": "Hero-Text des Portfolios überarbeiten",
  "Iterate on the headline, subheading, and call-to-action so the first screen explains the portfolio clearly.":
    "Überschrift, Unterzeile und Call-to-Action so überarbeiten, dass der erste Bildschirm das Portfolio klar erklärt.",
  "Write README for Job Board": "README für die Jobbörse schreiben",
  "Explain the project as a portfolio sample without local setup instructions.":
    "Das Projekt als Portfolio-Beispiel erklären, ohne lokale Installationsanleitung.",
  "Outline project setup": "Projektaufbau skizzieren",
  "Add screenshots": "Screenshots hinzufügen",
  "Refactor BookController filters": "Filter des BookControllers refaktorieren",
  "Move popular and highest-rated filters into reusable Eloquent scopes.":
    "Filter für Beliebtheit und höchste Bewertung in wiederverwendbare Eloquent-Scopes verschieben.",
  "Review task manager demo flow": "Demo-Ablauf des TaskManagers prüfen",
  "Guest interactions should feel real, but only authenticated users can persist their own tasks.":
    "Interaktionen für Gäste sollen realistisch wirken, aber nur angemeldete Nutzer können eigene Aufgaben dauerhaft speichern.",
  "Add Pest tests for Auth": "Pest-Tests für Authentifizierung ergänzen",
  "Mark": "Markieren:",

  "Welcome back": "Willkommen zurück",
  "Log in to manage your account, tasks, and applications.":
    "Melden Sie sich an, um Konto, Aufgaben und Bewerbungen zu verwalten.",
  "Password": "Passwort",
  "Forgot?": "Vergessen?",
  "Remember me": "Angemeldet bleiben",
  "login with Google": "Mit Google anmelden",
  "Don't have an account?": "Sie haben noch kein Konto?",
  "Create your account": "Konto erstellen",
  "It only takes a minute.": "Das dauert nur eine Minute.",
  "Name": "Name",
  "Create account": "Konto erstellen",
  "Continue with Google": "Mit Google fortfahren",
  "Already have an account?": "Sie haben bereits ein Konto?",
};

const dictionaries: Record<Locale, Record<string, string>> = {
  en: {},
  de: german,
};

type I18nContextValue = {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (text: string) => string;
};

const I18nContext = createContext<I18nContextValue | null>(null);

function isLocale(value: string | null): value is Locale {
  return value !== null && SUPPORTED_LOCALES.includes(value as Locale);
}

function initialLocale(): Locale {
  if (typeof window === "undefined") return "en";

  const fromUrl = new URL(window.location.href).searchParams.get("lang");
  if (isLocale(fromUrl)) return fromUrl;

  const stored = window.localStorage.getItem(STORAGE_KEY);
  return isLocale(stored) ? stored : "en";
}

function translate(locale: Locale, source: string): string {
  return dictionaries[locale][source] ?? source;
}

function splitWhitespace(value: string) {
  const leading = value.match(/^\s*/)?.[0] ?? "";
  const trailing = value.match(/\s*$/)?.[0] ?? "";
  return { leading, core: value.slice(leading.length, value.length - trailing.length), trailing };
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(initialLocale);
  const sourceText = useRef(new WeakMap<Text, string>());
  const sourceAttributes = useRef(new WeakMap<Element, Map<string, string>>());
  const changingDom = useRef(false);

  const t = useCallback((text: string) => translate(locale, text), [locale]);

  const setLocale = useCallback((nextLocale: Locale) => {
    setLocaleState(nextLocale);
    window.localStorage.setItem(STORAGE_KEY, nextLocale);

    const url = new URL(window.location.href);
    if (nextLocale === "en") {
      url.searchParams.delete("lang");
    } else {
      url.searchParams.set("lang", nextLocale);
    }
    window.history.replaceState(window.history.state, "", `${url.pathname}${url.search}${url.hash}`);
  }, []);

  useLayoutEffect(() => {
    document.documentElement.lang = locale;

    const translateTextNode = (node: Text) => {
      const current = node.nodeValue ?? "";
      const { leading, core, trailing } = splitWhitespace(current);
      if (!core) return;

      let source = sourceText.current.get(node);
      if (source && core !== source && core !== german[source]) {
        if (core in german) {
          source = core;
          sourceText.current.set(node, source);
        } else {
          sourceText.current.delete(node);
          return;
        }
      } else if (!source) {
        if (!(core in german)) return;
        source = core;
        sourceText.current.set(node, source);
      }

      const next = `${leading}${translate(locale, source)}${trailing}`;
      if (current !== next) node.nodeValue = next;
    };

    const translateElementAttributes = (element: Element) => {
      const attributes = ["aria-label", "title", "placeholder", "content", "alt"];
      let sources = sourceAttributes.current.get(element);

      for (const attribute of attributes) {
        const current = element.getAttribute(attribute);
        if (!current) continue;

        let knownSource = sources?.get(attribute);
        if (knownSource && current !== knownSource && current !== german[knownSource]) {
          knownSource = current in german ? current : undefined;
          if (knownSource) sources?.set(attribute, knownSource);
          else sources?.delete(attribute);
        }

        const source = knownSource ?? (current in german ? current : null);
        if (!source) continue;

        if (!sources) {
          sources = new Map();
          sourceAttributes.current.set(element, sources);
        }
        sources.set(attribute, source);

        const next = translate(locale, source);
        if (current !== next) element.setAttribute(attribute, next);
      }
    };

    const visit = (root: Node) => {
      if (root.nodeType === Node.TEXT_NODE) {
        translateTextNode(root as Text);
        return;
      }

      if (root.nodeType !== Node.ELEMENT_NODE && root.nodeType !== Node.DOCUMENT_NODE) return;
      if (root.nodeType === Node.ELEMENT_NODE) translateElementAttributes(root as Element);

      const walker = document.createTreeWalker(
        root,
        NodeFilter.SHOW_ELEMENT | NodeFilter.SHOW_TEXT,
      );
      let node = walker.nextNode();
      while (node) {
        if (node.nodeType === Node.TEXT_NODE) translateTextNode(node as Text);
        else translateElementAttributes(node as Element);
        node = walker.nextNode();
      }
    };

    changingDom.current = true;
    visit(document.documentElement);
    changingDom.current = false;

    const observer = new MutationObserver((mutations) => {
      if (changingDom.current) return;
      changingDom.current = true;
      for (const mutation of mutations) {
        if (mutation.type === "characterData") {
          translateTextNode(mutation.target as Text);
        } else {
          mutation.addedNodes.forEach(visit);
          if (mutation.type === "attributes") translateElementAttributes(mutation.target as Element);
        }
      }
      changingDom.current = false;
    });

    observer.observe(document.documentElement, {
      subtree: true,
      childList: true,
      characterData: true,
      attributes: true,
      attributeFilter: ["aria-label", "title", "placeholder", "content", "alt"],
    });

    return () => observer.disconnect();
  }, [locale]);

  useEffect(() => {
    const onPopState = () => {
      const requested = new URL(window.location.href).searchParams.get("lang");
      setLocaleState(isLocale(requested) ? requested : "en");
    };
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, []);

  const value = useMemo(() => ({ locale, setLocale, t }), [locale, setLocale, t]);

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  const context = useContext(I18nContext);
  if (!context) throw new Error("useI18n must be used inside LanguageProvider");
  return context;
}

export function localeForIntl(locale: Locale) {
  return locale === "de" ? "de-DE" : "en-US";
}

export function localizedRecord<T extends LocalizedRecord>(record: T, locale: Locale): T {
  if (locale === "en") return record;

  const translated = record.translations?.[locale];
  return translated ? { ...record, ...translated } : record;
}

export function localizedRecords<T extends LocalizedRecord>(records: T[], locale: Locale): T[] {
  return records.map((record) => localizedRecord(record, locale));
}
