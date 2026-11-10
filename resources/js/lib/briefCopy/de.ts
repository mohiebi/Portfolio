import type { BriefCopy } from "@/lib/briefCopy/types";

export const de: BriefCopy = {
  seo: {
    title: "Projekt-Briefing",
    description:
      "Beschreiben Sie Ihr Website- oder UI/UX-Projekt in wenigen kurzen Schritten: Ziele, Zielgruppe, Inhalte, Designrichtung, Budget und Zeitplan.",
  },

  page: {
    backToPortfolio: "Zurück zum Portfolio",
    eyebrow: "// Projekt-Briefing",
    title: "Erzählen Sie mir von Ihrem Projekt",
    intro:
      "Ein paar kurze Fragen zu Ihren Zielen, Ihrer Zielgruppe und dem Look, den Sie sich vorstellen. Alle mit einem Stern markierten Felder sind Pflicht. Der Rest hilft mir bei der Vorbereitung – lassen Sie einfach aus, was Sie noch nicht wissen.",
    badgeTime: "Etwa 8 Minuten",
    badgeSteps: "5 kurze Schritte",
    badgeSaved: "Wird beim Tippen gespeichert",
    privacyNote:
      "Ihre Antworten werden nur verwendet, um auf Ihr Briefing zu antworten. Ein Entwurf wird beim Tippen in diesem Browser gespeichert und nach dem Absenden gelöscht.",
    languageLabel: "Sprache",
    honeypot: "Dieses Feld bitte leer lassen",
  },

  nav: {
    back: "Zurück",
    next: "Weiter",
    send: "Briefing senden",
    sending: "Wird gesendet...",
    uploading: (percent) => `Dateien werden hochgeladen... ${percent} %`,
    uploadProgress: "Upload-Fortschritt",
  },

  progress: {
    stepOf: (current, total) => `Schritt ${current} von ${total}`,
    ariaLabel: (current, total) => `Fortschritt des Briefings: Schritt ${current} von ${total}`,
    completed: "abgeschlossen",
  },

  steps: {
    about: { title: "Über Sie", description: "Wer Sie sind und was Ihr Unternehmen macht." },
    project: { title: "Projekt & Ziele", description: "Was Sie brauchen und wie Erfolg für Sie aussieht." },
    scope: { title: "Umfang & Inhalte", description: "Seiten, Funktionen, Sprachen und was Sie schon haben." },
    design: { title: "Marke & Design", description: "Der Look, den Sie anstreben." },
    budget: { title: "Budget & Kontakt", description: "Budget, Zeitplan und wie ich Sie erreiche." },
  },

  common: {
    required: " (Pflichtfeld)",
    selectedCount: (selected, max) => `${selected} von ${max} ausgewählt`,
  },

  fields: {
    name: { label: "Ihr Name", placeholder: "Anna Müller" },
    email: { label: "E-Mail", placeholder: "anna@studio-mueller.de" },
    company: {
      label: "Firmen- oder Markenname",
      hint: "Lassen Sie das leer, wenn Sie als Privatperson anfragen.",
      placeholder: "Studio Müller Interiors",
    },
    website_url: {
      label: "Aktuelle Website",
      hint: "Leer lassen, falls Sie noch keine haben.",
      placeholder: "studio-mueller.de",
    },
    business_description: {
      label: "Was macht Ihr Unternehmen?",
      hint: "Zwei, drei Sätze genügen: was Sie anbieten, für wen und wo.",
      placeholder:
        "Wir gestalten und möblieren Innenräume für kleine Cafés und Boutiquen in Berlin – vom Konzept bis zur Installation.",
    },
    project_type: {
      label: "Was brauchen Sie?",
      hint: "Beispiel: Wählen Sie „Redesign“, wenn Sie schon eine Website haben, die veraltet wirkt.",
    },
    goals: {
      label: "Was soll die Website erreichen?",
      hint: "Wählen Sie bis zu 3. Beispiel: Ein Café wählt vielleicht „Mehr Anfragen“ und „Vertrauen aufbauen“.",
    },
    audience: {
      label: "Wer sind Ihre idealen Kunden?",
      hint: "Alter, Rolle, was ihnen wichtig ist, womit sie kämpfen.",
      placeholder:
        "Café-Inhaber zwischen 30 und 50, die ihren ersten oder zweiten Standort eröffnen. Ihnen ist Atmosphäre wichtig, das Budget ist knapp.",
    },
    primary_action: {
      label: "Das Eine, was Besucher tun sollen",
      hint: "Ihr wichtigster Handlungsaufruf.",
      placeholder: "Ein kostenloses 20-minütiges Beratungsgespräch buchen",
    },
    competitors: {
      label: "Wettbewerber oder ähnliche Unternehmen",
      hint: "Fügen Sie gern Links ein und schreiben Sie, was diese Ihrer Meinung nach gut oder schlecht machen.",
      placeholder: "interior-berlin.de wirkt hochwertig, ist aber schwer zu bedienen",
    },
    pages: {
      label: "Welche Seiten brauchen Sie?",
      hint: "Wählen Sie alles aus, was Sie für nötig halten. Das kann sich später ändern.",
    },
    features: {
      label: "Funktionen und Integrationen",
      hint: "Beispiel: Ein Friseursalon wählt wahrscheinlich „Online-Buchung“ und „Newsletter“.",
    },
    extra_requirements: {
      label: "Soll die Website noch etwas können?",
      placeholder: "Buchungen mit unserem Google Kalender abgleichen und SMS-Erinnerungen senden.",
    },
    languages: {
      label: "In welchen Sprachen soll die Website sein?",
      hint: "Wählen Sie jede Sprache, die Ihre Besucher brauchen.",
    },
    other_language: { label: "Andere Sprache", placeholder: "z. B. Französisch" },
    content_readiness: {
      label: "Wie weit sind Ihre Inhalte?",
      hint: "Beispiel: Texte geschrieben und Fotos gemacht – oder noch nichts.",
    },
    domain_status: {
      label: "Domain und Hosting",
      hint: "Beispiel: ihremarke.de plus ein Ort, an dem die Seite läuft.",
    },
    brand_assets: { label: "Welches Markenmaterial haben Sie bereits?" },
    attachments: {
      label: "Laden Sie Ihr Logo oder Ihre Markendateien hoch",
      hint: "Optional. Ein Logo, ein Markenleitfaden oder Screenshots, die zeigen, was Sie meinen.",
    },
    styles: {
      label: "Welcher Stil passt zu Ihrer Marke?",
      hint: "Wählen Sie bis zu 3. Die Farben sind nur ein grober Hinweis auf die jeweilige Stimmung.",
    },
    brand_words: { label: "Drei Wörter, die Ihre Marke beschreiben", placeholder: "ruhig, handwerklich, vertrauenswürdig" },
    colour_preferences: {
      label: "Farbwünsche",
      hint: "Farben, die Sie mögen – und solche, die Sie vermeiden möchten.",
      placeholder: "Tiefes Grün und warmer Sand, bitte kein Rot",
    },
    colour_mode: { label: "Helle oder dunkle Oberfläche?" },
    typography: { label: "Schriftgefühl" },
    liked_sites: {
      label: "Websites, die Ihnen gefallen",
      hint: "Bis zu 3. Fügen Sie die Adresse ein und schreiben Sie, was Ihnen daran gefällt.",
    },
    disliked_sites: {
      label: "Websites oder Stile, die Ihnen nicht gefallen",
      placeholder: "Überladene Seiten mit vielen Pop-ups und Stockfotos",
    },
    budget: {
      label: "Welches Budget haben Sie im Sinn?",
      hint: "Grobe Zahlen genügen. Das hilft mir nur, den passenden Umfang vorzuschlagen.",
    },
    timeline: { label: "Bis wann brauchen Sie es?" },
    deadline_note: {
      label: "Gibt es einen festen Termin oder einen Grund für den Zeitplan?",
      placeholder: "Eröffnung am 15. März",
    },
    support: { label: "Möchten Sie Support nach dem Launch?" },
    preferred_contact: { label: "Wie soll ich Sie erreichen?" },
    phone: { label: "Telefon- oder WhatsApp-Nummer", placeholder: "+49 151 2345 6789" },
    notes: {
      label: "Gibt es noch etwas, das ich wissen sollte?",
      placeholder: "Wir würden gern zuerst ein Konzept sehen, bevor wir uns auf das gesamte Projekt festlegen.",
    },
    consent: {
      label: "Ich bin damit einverstanden, dass meine Antworten gespeichert und verwendet werden, um auf dieses Briefing zu antworten.",
    },
  },

  options: {
    projectTypes: {
      new_site: { label: "Neue Website", hint: "Ich fange bei null an" },
      redesign: { label: "Redesign", hint: "Meine aktuelle Website wirkt veraltet" },
      landing_page: { label: "Landingpage", hint: "Eine fokussierte Seite für eine Kampagne" },
      web_app: { label: "Web-App / Dashboard", hint: "Logins, Daten, interne Tools" },
      design_only: { label: "Nur UI/UX-Design", hint: "Designs, keine Entwicklung" },
      unsure: { label: "Noch nicht sicher", hint: "Finden wir gemeinsam heraus" },
    },
    goals: {
      leads: { label: "Mehr Anfragen / Leads" },
      sell_online: { label: "Online verkaufen" },
      bookings: { label: "Buchungen / Termine" },
      credibility: { label: "Vertrauen aufbauen" },
      explain: { label: "Ein Produkt oder eine Leistung erklären" },
      recruit: { label: "Mitarbeitende gewinnen" },
      replace_outdated: { label: "Veraltete Website ersetzen" },
      internal_tool: { label: "Internes Tool / Automatisierung" },
    },
    pages: {
      home: { label: "Startseite" },
      about: { label: "Über uns" },
      services: { label: "Leistungen" },
      portfolio: { label: "Portfolio / Fallstudien" },
      pricing: { label: "Preise" },
      blog: { label: "Blog / News" },
      shop: { label: "Shop" },
      booking: { label: "Buchung" },
      faq: { label: "FAQ" },
      careers: { label: "Karriere" },
      contact: { label: "Kontakt" },
      legal: { label: "Rechtliches (Impressum / Datenschutz)" },
    },
    features: {
      forms: { label: "Kontakt- / Anfrageformulare" },
      booking: { label: "Online-Buchung" },
      payments: { label: "Zahlungen / E-Commerce" },
      accounts: { label: "Kundenkonten" },
      cms: { label: "Blog / Inhaltspflege (CMS)" },
      newsletter: { label: "Newsletter" },
      search: { label: "Suche" },
      analytics_seo: { label: "Analytics & SEO" },
      crm: { label: "CRM (HubSpot, Pipedrive ...)" },
      chat_ai: { label: "Live-Chat / KI-Assistent" },
      maps: { label: "Karten / Standorte" },
    },
    languages: {
      en: { label: "Englisch" },
      de: { label: "Deutsch" },
      fa: { label: "Persisch" },
      tr: { label: "Türkisch" },
      other: { label: "Andere" },
    },
    contentReadiness: {
      ready: { label: "Alle Texte und Fotos sind fertig" },
      partial: { label: "Einiges ist fertig, beim Rest brauche ich Hilfe" },
      need_help: { label: "Ich brauche Texte und Bildmaterial" },
      unsure: { label: "Nicht sicher" },
    },
    domainStatus: {
      both: { label: "Ich habe beides" },
      domain_only: { label: "Nur die Domain" },
      neither: { label: "Noch nichts davon" },
      unsure: { label: "Nicht sicher" },
    },
    brandAssets: {
      logo: { label: "Logo" },
      palette: { label: "Farbpalette" },
      fonts: { label: "Schriften" },
      guidelines: { label: "Markenleitfaden" },
      imagery: { label: "Fotos / Illustrationen" },
      none: { label: "Noch nichts, ich brauche eine Markenidentität" },
    },
    styles: {
      minimal: { label: "Minimal & klar", hint: "Viel Weißraum, wenige Elemente" },
      bold: { label: "Kräftig & farbenfroh", hint: "Starke Farben, große Schrift" },
      premium: { label: "Premium / Luxus", hint: "Dunkel, edel, goldene Akzente" },
      friendly: { label: "Freundlich & verspielt", hint: "Rund, warm, illustriert" },
      corporate: { label: "Seriös & vertrauenswürdig", hint: "Strukturiert, ruhige Blautöne" },
      tech: { label: "Tech / futuristisch", hint: "Dunkle Oberfläche, Glow, Verläufe" },
      editorial: { label: "Redaktionell / Magazin", hint: "Serifen-Überschriften, Raster" },
      warm: { label: "Warm & organisch", hint: "Erdtöne, weiche Formen" },
    },
    colourModes: {
      light: { label: "Hell" },
      dark: { label: "Dunkel" },
      either: { label: "Egal" },
    },
    typography: {
      sans: { label: "Moderne Serifenlose", hint: "Klar und neutral" },
      serif: { label: "Klassische Serifenschrift", hint: "Elegant und redaktionell" },
      mix: { label: "Mischung aus beidem", hint: "Serifen-Überschriften, serifenlose Texte" },
      none: { label: "Keine Präferenz" },
    },
    budgets: {
      under_3k: { label: "Unter 3.000 $" },
      "3k_6k": { label: "3.000 – 6.000 $" },
      "6k_10k": { label: "6.000 – 10.000 $" },
      "10k_20k": { label: "10.000 – 20.000 $" },
      "20k_50k": { label: "20.000 – 50.000 $" },
      "50k_plus": { label: "Über 50.000 $" },
      unsure: { label: "Noch nicht sicher" },
    },
    timelines: {
      asap: { label: "So bald wie möglich", hint: "Weniger als 1 Monat" },
      "1_2_months": { label: "1 – 2 Monate" },
      "3_6_months": { label: "3 – 6 Monate" },
      flexible: { label: "Flexibel" },
    },
    support: {
      yes: { label: "Ja, laufende Betreuung" },
      maybe: { label: "Vielleicht" },
      no: { label: "Nein" },
    },
    contactMethods: {
      email: { label: "E-Mail" },
      phone: { label: "Telefon / WhatsApp" },
      video: { label: "Videoanruf" },
    },
  },

  files: {
    dropTitle: "Dateien hierher ziehen oder zum Auswählen klicken",
    dropHelp: (types, megabytes, max) =>
      `Logo, Markenleitfaden oder Inspiration. ${types}, je bis zu ${megabytes} MB, maximal ${max} Dateien.`,
    selected: "Ausgewählte Dateien",
    remove: (name) => `${name} entfernen`,
    wrongType: (name, types) => `${name}: Es werden nur ${types}-Dateien akzeptiert.`,
    tooLarge: (name, megabytes) => `${name}: Dateien dürfen höchstens ${megabytes} MB groß sein.`,
    tooMany: (name, max) => `${name}: Sie können bis zu ${max} Dateien hochladen.`,
  },

  likedSites: {
    urlPlaceholder: "https://linear.app",
    notePlaceholder: "Klares Layout, flüssige Animationen",
    addressLabel: (position) => `Adresse von Website ${position}`,
    noteLabel: (position) => `Was Ihnen an Website ${position} gefällt`,
    remove: (position) => `Website ${position} entfernen`,
    add: "Weitere Website hinzufügen",
  },

  errors: {
    nameRequired: "Bitte nennen Sie mir Ihren Namen.",
    emailRequired: "Bitte geben Sie Ihre E-Mail-Adresse an.",
    emailInvalid: "Diese E-Mail-Adresse sieht nicht richtig aus.",
    descriptionShort: "Ein, zwei Sätze zu Ihrem Unternehmen helfen sehr (mindestens 10 Zeichen).",
    projectType: "Wählen Sie die passendste Option.",
    goals: "Wählen Sie mindestens ein Ziel aus.",
    audienceShort: "Beschreiben Sie Ihre idealen Kunden in ein, zwei Sätzen (mindestens 10 Zeichen).",
    styles: "Wählen Sie mindestens einen Stil aus.",
    budget: "Wählen Sie eine Budgetspanne oder „Noch nicht sicher“.",
    timeline: "Wählen Sie einen Zeitplan.",
    contact: "Wählen Sie, wie ich Sie erreichen soll.",
    phoneRequired: "Bitte geben Sie eine Telefonnummer an, damit ich Sie erreichen kann.",
    phoneInvalid: "Verwenden Sie nur Ziffern, Leerzeichen und + ( ) -.",
    consent: "Bitte bestätigen Sie, dass ich Ihre Antworten speichern darf, um Ihnen zu antworten.",
  },

  thanks: {
    title: (name) => (name ? `Vielen Dank, ${name}.` : "Vielen Dank."),
    bodyBefore:
      "Ihr Briefing ist angekommen. Ich lese es sorgfältig und antworte innerhalb von 24 Stunden mit Rückfragen oder einer ersten Idee zur Richtung an ",
    bodyAfter: ".",
    backToPortfolio: "Zurück zum Portfolio",
    sendAnother: "Weiteres Briefing senden",
  },
};
