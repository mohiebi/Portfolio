import type { BriefCopy } from "@/lib/briefCopy/types";

export const en: BriefCopy = {
  seo: {
    title: "Project Brief",
    description:
      "Tell me about your website or UI/UX project in a few short steps: goals, audience, content, design direction, budget and timeline.",
  },

  page: {
    backToPortfolio: "Back to portfolio",
    eyebrow: "// Project brief",
    title: "Tell me about your project",
    intro:
      "A few short questions about your goals, your audience and the look you have in mind. Everything marked with a star is required. The rest helps me prepare, so skip whatever you do not know yet.",
    badgeTime: "About 8 minutes",
    badgeSteps: "5 short steps",
    badgeSaved: "Saved while you type",
    privacyNote:
      "Your answers are only used to reply to your brief. A draft is kept in this browser while you type and is removed when you send it.",
    languageLabel: "Language",
    honeypot: "Leave this field empty",
  },

  nav: {
    back: "Back",
    next: "Next",
    send: "Send my brief",
    sending: "Sending...",
    uploading: (percent) => `Uploading files... ${percent}%`,
    uploadProgress: "Upload progress",
  },

  progress: {
    stepOf: (current, total) => `Step ${current} of ${total}`,
    ariaLabel: (current, total) => `Brief progress: step ${current} of ${total}`,
    completed: "completed",
  },

  steps: {
    about: { title: "About you", description: "Who you are and what your business does." },
    project: { title: "Project & goals", description: "What you need and what success looks like." },
    scope: { title: "Scope & content", description: "Pages, features, languages and what you already have." },
    design: { title: "Brand & design", description: "The look and feel you are aiming for." },
    budget: { title: "Budget & contact", description: "Budget, timing and how to reach you." },
  },

  common: {
    required: " (required)",
    selectedCount: (selected, max) => `${selected} of ${max} selected`,
  },

  fields: {
    name: { label: "Your name", placeholder: "Anna Müller" },
    email: { label: "Email", placeholder: "anna@studio-mueller.de" },
    company: {
      label: "Company or brand name",
      hint: "Skip this if you are an individual.",
      placeholder: "Studio Müller Interiors",
    },
    website_url: {
      label: "Current website",
      hint: "Leave empty if you do not have one yet.",
      placeholder: "studio-mueller.de",
    },
    business_description: {
      label: "What does your business do?",
      hint: "Two or three sentences are plenty: what you offer, to whom, and where.",
      placeholder: "We design and furnish interiors for small cafés and boutiques in Berlin, from concept to installation.",
    },
    project_type: {
      label: "What do you need?",
      hint: "Example: choose Redesign if you already have a site that feels outdated.",
    },
    goals: {
      label: "What should the site achieve?",
      hint: "Pick up to 3. Example: a café might choose More leads and Build credibility.",
    },
    audience: {
      label: "Who are your ideal customers?",
      hint: "Age, role, what they care about, what they struggle with.",
      placeholder:
        "Café owners aged 30–50 opening their first or second location. They care about atmosphere and have a tight budget.",
    },
    primary_action: {
      label: "The one thing a visitor should do",
      hint: "Your main call to action.",
      placeholder: "Book a free 20-minute consultation call",
    },
    competitors: {
      label: "Competitors or similar businesses",
      hint: "Add links if you can, and what you think they do well or badly.",
      placeholder: "interior-berlin.de looks premium but is hard to navigate",
    },
    pages: {
      label: "Which pages do you need?",
      hint: "Select everything you think you need. This can change later.",
    },
    features: {
      label: "Features and integrations",
      hint: "Example: a salon would likely pick Online booking and Newsletter.",
    },
    extra_requirements: {
      label: "Anything else it must do?",
      placeholder: "Sync bookings with our Google Calendar and send SMS reminders.",
    },
    languages: {
      label: "Which languages should the site be in?",
      hint: "Pick every language your visitors need.",
    },
    other_language: { label: "Other language", placeholder: "e.g. French" },
    content_readiness: {
      label: "How ready is your content?",
      hint: "Example: texts written and photos taken, or nothing yet.",
    },
    domain_status: {
      label: "Domain and hosting",
      hint: "Example: yourbrand.com plus somewhere to host it.",
    },
    brand_assets: { label: "Which brand assets do you already have?" },
    attachments: {
      label: "Upload your logo or brand files",
      hint: "Optional. A logo, a brand guide or screenshots that show what you mean.",
    },
    styles: {
      label: "Which style fits your brand?",
      hint: "Pick up to 3. The colours are only a rough hint of each mood.",
    },
    brand_words: { label: "Three words that describe your brand", placeholder: "calm, crafted, trustworthy" },
    colour_preferences: {
      label: "Colour preferences",
      hint: "Colours you love, and any you want to avoid.",
      placeholder: "Deep green and warm sand, please avoid red",
    },
    colour_mode: { label: "Light or dark interface?" },
    typography: { label: "Typography feel" },
    liked_sites: {
      label: "Websites you like",
      hint: "Up to 3. Paste the address and tell me what you like about it.",
    },
    disliked_sites: {
      label: "Sites or styles you dislike",
      placeholder: "Cluttered pages with lots of pop-ups and stock photos",
    },
    budget: {
      label: "What budget do you have in mind?",
      hint: "Rough numbers are fine. It only helps me suggest the right scope.",
    },
    timeline: { label: "When do you need it?" },
    deadline_note: {
      label: "Is there a fixed deadline or a reason for the timing?",
      placeholder: "Grand opening on 15 March",
    },
    support: { label: "Do you want support after launch?" },
    preferred_contact: { label: "How should I reach you?" },
    phone: { label: "Phone or WhatsApp number", placeholder: "+49 151 2345 6789" },
    notes: {
      label: "Anything else you would like me to know?",
      placeholder: "We would love to see a first concept before committing to the full build.",
    },
    consent: { label: "I agree that my answers are stored and used to reply to this brief." },
  },

  options: {
    projectTypes: {
      new_site: { label: "New website", hint: "Starting from scratch" },
      redesign: { label: "Redesign", hint: "My current site feels outdated" },
      landing_page: { label: "Landing page", hint: "One focused page for a campaign" },
      web_app: { label: "Web app / dashboard", hint: "Logins, data, internal tools" },
      design_only: { label: "UI/UX design only", hint: "Designs, no development" },
      unsure: { label: "Not sure yet", hint: "Let's figure it out together" },
    },
    goals: {
      leads: { label: "More leads / enquiries" },
      sell_online: { label: "Sell online" },
      bookings: { label: "Bookings / appointments" },
      credibility: { label: "Build credibility" },
      explain: { label: "Explain a product or service" },
      recruit: { label: "Recruit people" },
      replace_outdated: { label: "Replace an outdated site" },
      internal_tool: { label: "Internal tool / automation" },
    },
    pages: {
      home: { label: "Home" },
      about: { label: "About" },
      services: { label: "Services" },
      portfolio: { label: "Portfolio / case studies" },
      pricing: { label: "Pricing" },
      blog: { label: "Blog / news" },
      shop: { label: "Shop" },
      booking: { label: "Booking" },
      faq: { label: "FAQ" },
      careers: { label: "Careers" },
      contact: { label: "Contact" },
      legal: { label: "Legal (Impressum / Privacy)" },
    },
    features: {
      forms: { label: "Contact / lead forms" },
      booking: { label: "Online booking" },
      payments: { label: "Payments / e-commerce" },
      accounts: { label: "Customer accounts" },
      cms: { label: "Blog / CMS editing" },
      newsletter: { label: "Newsletter" },
      search: { label: "Search" },
      analytics_seo: { label: "Analytics & SEO" },
      crm: { label: "CRM (HubSpot, Pipedrive...)" },
      chat_ai: { label: "Live chat / AI assistant" },
      maps: { label: "Maps / locations" },
    },
    languages: {
      en: { label: "English" },
      de: { label: "German" },
      fa: { label: "Persian" },
      tr: { label: "Turkish" },
      other: { label: "Other" },
    },
    contentReadiness: {
      ready: { label: "All texts & photos are ready" },
      partial: { label: "Some are ready, I need help with the rest" },
      need_help: { label: "I need copywriting and visuals" },
      unsure: { label: "Not sure" },
    },
    domainStatus: {
      both: { label: "I have both" },
      domain_only: { label: "Domain only" },
      neither: { label: "Neither yet" },
      unsure: { label: "Not sure" },
    },
    brandAssets: {
      logo: { label: "Logo" },
      palette: { label: "Colour palette" },
      fonts: { label: "Fonts" },
      guidelines: { label: "Brand guidelines" },
      imagery: { label: "Photos / illustrations" },
      none: { label: "Nothing yet, I need a brand identity" },
    },
    styles: {
      minimal: { label: "Minimal & clean", hint: "Whitespace, few elements" },
      bold: { label: "Bold & colourful", hint: "Strong colour, big type" },
      premium: { label: "Premium / luxury", hint: "Dark, refined, gold accents" },
      friendly: { label: "Friendly & playful", hint: "Rounded, warm, illustrated" },
      corporate: { label: "Corporate & trustworthy", hint: "Structured, calm blues" },
      tech: { label: "Tech / futuristic", hint: "Dark UI, glow, gradients" },
      editorial: { label: "Editorial / magazine", hint: "Serif headlines, grid" },
      warm: { label: "Warm & organic", hint: "Earth tones, soft shapes" },
    },
    colourModes: {
      light: { label: "Light" },
      dark: { label: "Dark" },
      either: { label: "Either" },
    },
    typography: {
      sans: { label: "Modern sans-serif", hint: "Clean and neutral" },
      serif: { label: "Classic serif", hint: "Elegant and editorial" },
      mix: { label: "A mix of both", hint: "Serif headings, sans text" },
      none: { label: "No preference" },
    },
    budgets: {
      under_3k: { label: "Under $3K" },
      "3k_6k": { label: "$3K - $6K" },
      "6k_10k": { label: "$6K - $10K" },
      "10k_20k": { label: "$10K - $20K" },
      "20k_50k": { label: "$20K - $50K" },
      "50k_plus": { label: "$50K+" },
      unsure: { label: "Not sure yet" },
    },
    timelines: {
      asap: { label: "As soon as possible", hint: "Less than 1 month" },
      "1_2_months": { label: "1 - 2 months" },
      "3_6_months": { label: "3 - 6 months" },
      flexible: { label: "Flexible" },
    },
    support: {
      yes: { label: "Yes, ongoing care" },
      maybe: { label: "Maybe" },
      no: { label: "No" },
    },
    contactMethods: {
      email: { label: "Email" },
      phone: { label: "Phone / WhatsApp" },
      video: { label: "Video call" },
    },
  },

  files: {
    dropTitle: "Drop files here or click to browse",
    dropHelp: (types, megabytes, max) =>
      `Logo, brand guide or inspiration. ${types} up to ${megabytes} MB each, max ${max} files.`,
    selected: "Selected files",
    remove: (name) => `Remove ${name}`,
    wrongType: (name, types) => `${name}: only ${types} files are accepted.`,
    tooLarge: (name, megabytes) => `${name}: files must be ${megabytes} MB or smaller.`,
    tooMany: (name, max) => `${name}: you can upload up to ${max} files.`,
  },

  likedSites: {
    urlPlaceholder: "https://linear.app",
    notePlaceholder: "Clean layout, smooth animations",
    addressLabel: (position) => `Site ${position} address`,
    noteLabel: (position) => `What you like about site ${position}`,
    remove: (position) => `Remove site ${position}`,
    add: "Add another site",
  },

  errors: {
    nameRequired: "Please tell me your name.",
    emailRequired: "Please add your email address.",
    emailInvalid: "That email address does not look right.",
    descriptionShort: "A sentence or two about your business helps a lot (at least 10 characters).",
    projectType: "Pick the option that fits best.",
    goals: "Pick at least one goal.",
    audienceShort: "Describe your ideal customers in a sentence or two (at least 10 characters).",
    styles: "Pick at least one style.",
    budget: 'Pick a budget range, or choose "Not sure yet".',
    timeline: "Pick a timeline.",
    contact: "Pick how you would like me to reach you.",
    phoneRequired: "Add a phone number so I can reach you.",
    phoneInvalid: "Use digits, spaces and + ( ) - only.",
    consent: "Please confirm that I may store your answers to reply to you.",
  },

  thanks: {
    title: (name) => (name ? `Thank you, ${name}.` : "Thank you."),
    bodyBefore: "Your brief is in. I will read it carefully and reply to ",
    bodyAfter: " within 24 hours with questions or a first idea of the direction.",
    backToPortfolio: "Back to portfolio",
    sendAnother: "Send another brief",
  },
};
