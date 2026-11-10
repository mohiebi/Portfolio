/**
 * Everything the project brief shows to people: steps, questions, option labels,
 * placeholders and examples. The wizard and the admin detail page both read from
 * here, so adding a language later means adding a dictionary, not touching layouts.
 *
 * Option values must match App\Support\BriefOptions on the server.
 */

export type BriefOption = {
  value: string;
  label: string;
  hint?: string;
  /** Three colours shown as a small preview on style cards. */
  swatch?: [string, string, string];
};

export type BriefLikedSite = { url: string; note: string };

export type BriefFormData = {
  // Step 1
  name: string;
  email: string;
  company: string;
  website_url: string;
  business_description: string;
  // Step 2
  project_type: string;
  goals: string[];
  audience: string;
  primary_action: string;
  competitors: string;
  // Step 3
  pages: string[];
  features: string[];
  extra_requirements: string;
  languages: string[];
  other_language: string;
  content_readiness: string;
  domain_status: string;
  // Step 4
  brand_assets: string[];
  attachments: File[];
  styles: string[];
  brand_words: string;
  colour_preferences: string;
  colour_mode: string;
  typography: string;
  liked_sites: BriefLikedSite[];
  disliked_sites: string;
  // Step 5
  budget: string;
  timeline: string;
  deadline_note: string;
  support: string;
  preferred_contact: string;
  phone: string;
  notes: string;
  consent: boolean;
  /** Honeypot: stays empty for real visitors. */
  nickname: string;
};

export const BRIEF_LIMITS = {
  goals: 3,
  styles: 3,
  likedSites: 3,
  attachments: 5,
  attachmentMb: 10,
} as const;

export const ATTACHMENT_ACCEPT = ".jpg,.jpeg,.png,.webp,.svg,.pdf";
export const ATTACHMENT_EXTENSIONS = ["jpg", "jpeg", "png", "webp", "svg", "pdf"];

export const DRAFT_STORAGE_KEY = "mohi.brief-draft";

export const emptyBrief: BriefFormData = {
  name: "",
  email: "",
  company: "",
  website_url: "",
  business_description: "",
  project_type: "",
  goals: [],
  audience: "",
  primary_action: "",
  competitors: "",
  pages: [],
  features: [],
  extra_requirements: "",
  languages: [],
  other_language: "",
  content_readiness: "",
  domain_status: "",
  brand_assets: [],
  attachments: [],
  styles: [],
  brand_words: "",
  colour_preferences: "",
  colour_mode: "",
  typography: "",
  liked_sites: [{ url: "", note: "" }],
  disliked_sites: "",
  budget: "",
  timeline: "",
  deadline_note: "",
  support: "",
  preferred_contact: "",
  phone: "",
  notes: "",
  consent: false,
  nickname: "",
};

export const projectTypes: BriefOption[] = [
  { value: "new_site", label: "New website", hint: "Starting from scratch" },
  { value: "redesign", label: "Redesign", hint: "My current site feels outdated" },
  { value: "landing_page", label: "Landing page", hint: "One focused page for a campaign" },
  { value: "web_app", label: "Web app / dashboard", hint: "Logins, data, internal tools" },
  { value: "design_only", label: "UI/UX design only", hint: "Designs, no development" },
  { value: "unsure", label: "Not sure yet", hint: "Let's figure it out together" },
];

export const goals: BriefOption[] = [
  { value: "leads", label: "More leads / enquiries" },
  { value: "sell_online", label: "Sell online" },
  { value: "bookings", label: "Bookings / appointments" },
  { value: "credibility", label: "Build credibility" },
  { value: "explain", label: "Explain a product or service" },
  { value: "recruit", label: "Recruit people" },
  { value: "replace_outdated", label: "Replace an outdated site" },
  { value: "internal_tool", label: "Internal tool / automation" },
];

export const pages: BriefOption[] = [
  { value: "home", label: "Home" },
  { value: "about", label: "About" },
  { value: "services", label: "Services" },
  { value: "portfolio", label: "Portfolio / case studies" },
  { value: "pricing", label: "Pricing" },
  { value: "blog", label: "Blog / news" },
  { value: "shop", label: "Shop" },
  { value: "booking", label: "Booking" },
  { value: "faq", label: "FAQ" },
  { value: "careers", label: "Careers" },
  { value: "contact", label: "Contact" },
  { value: "legal", label: "Legal (Impressum / Privacy)" },
];

export const features: BriefOption[] = [
  { value: "forms", label: "Contact / lead forms" },
  { value: "booking", label: "Online booking" },
  { value: "payments", label: "Payments / e-commerce" },
  { value: "accounts", label: "Customer accounts" },
  { value: "cms", label: "Blog / CMS editing" },
  { value: "newsletter", label: "Newsletter" },
  { value: "search", label: "Search" },
  { value: "analytics_seo", label: "Analytics & SEO" },
  { value: "crm", label: "CRM (HubSpot, Pipedrive...)" },
  { value: "chat_ai", label: "Live chat / AI assistant" },
  { value: "maps", label: "Maps / locations" },
];

export const languages: BriefOption[] = [
  { value: "en", label: "English" },
  { value: "de", label: "German" },
  { value: "fa", label: "Persian" },
  { value: "tr", label: "Turkish" },
  { value: "other", label: "Other" },
];

export const contentReadiness: BriefOption[] = [
  { value: "ready", label: "All texts & photos are ready" },
  { value: "partial", label: "Some are ready, I need help with the rest" },
  { value: "need_help", label: "I need copywriting and visuals" },
  { value: "unsure", label: "Not sure" },
];

export const domainStatus: BriefOption[] = [
  { value: "both", label: "I have both" },
  { value: "domain_only", label: "Domain only" },
  { value: "neither", label: "Neither yet" },
  { value: "unsure", label: "Not sure" },
];

export const brandAssets: BriefOption[] = [
  { value: "logo", label: "Logo" },
  { value: "palette", label: "Colour palette" },
  { value: "fonts", label: "Fonts" },
  { value: "guidelines", label: "Brand guidelines" },
  { value: "imagery", label: "Photos / illustrations" },
  { value: "none", label: "Nothing yet, I need a brand identity" },
];

export const styles: BriefOption[] = [
  { value: "minimal", label: "Minimal & clean", hint: "Whitespace, few elements", swatch: ["#ffffff", "#e5e7eb", "#111827"] },
  { value: "bold", label: "Bold & colourful", hint: "Strong colour, big type", swatch: ["#ef4444", "#f59e0b", "#3b82f6"] },
  { value: "premium", label: "Premium / luxury", hint: "Dark, refined, gold accents", swatch: ["#0f0f10", "#8a6d3b", "#e8d9b5"] },
  { value: "friendly", label: "Friendly & playful", hint: "Rounded, warm, illustrated", swatch: ["#fde68a", "#fb7185", "#60a5fa"] },
  { value: "corporate", label: "Corporate & trustworthy", hint: "Structured, calm blues", swatch: ["#1e3a8a", "#e0e7ff", "#64748b"] },
  { value: "tech", label: "Tech / futuristic", hint: "Dark UI, glow, gradients", swatch: ["#0b1220", "#22d3ee", "#34d399"] },
  { value: "editorial", label: "Editorial / magazine", hint: "Serif headlines, grid", swatch: ["#faf7f2", "#1f1f1f", "#b45309"] },
  { value: "warm", label: "Warm & organic", hint: "Earth tones, soft shapes", swatch: ["#f5ebe0", "#a3b18a", "#bc6c25"] },
];

export const colourModes: BriefOption[] = [
  { value: "light", label: "Light" },
  { value: "dark", label: "Dark" },
  { value: "either", label: "Either" },
];

export const typography: BriefOption[] = [
  { value: "sans", label: "Modern sans-serif", hint: "Clean and neutral" },
  { value: "serif", label: "Classic serif", hint: "Elegant and editorial" },
  { value: "mix", label: "A mix of both", hint: "Serif headings, sans text" },
  { value: "none", label: "No preference" },
];

export const budgets: BriefOption[] = [
  { value: "under_3k", label: "Under $3K" },
  { value: "3k_6k", label: "$3K - $6K" },
  { value: "6k_10k", label: "$6K - $10K" },
  { value: "10k_20k", label: "$10K - $20K" },
  { value: "20k_50k", label: "$20K - $50K" },
  { value: "50k_plus", label: "$50K+" },
  { value: "unsure", label: "Not sure yet" },
];

export const timelines: BriefOption[] = [
  { value: "asap", label: "As soon as possible", hint: "Less than 1 month" },
  { value: "1_2_months", label: "1 - 2 months" },
  { value: "3_6_months", label: "3 - 6 months" },
  { value: "flexible", label: "Flexible" },
];

export const supportOptions: BriefOption[] = [
  { value: "yes", label: "Yes, ongoing care" },
  { value: "maybe", label: "Maybe" },
  { value: "no", label: "No" },
];

export const contactMethods: BriefOption[] = [
  { value: "email", label: "Email" },
  { value: "phone", label: "Phone / WhatsApp" },
  { value: "video", label: "Video call" },
];

export type BriefStep = {
  id: string;
  title: string;
  description: string;
  /** Form fields (and server error keys) that live on this step. */
  fields: Array<keyof BriefFormData>;
};

export const briefSteps: BriefStep[] = [
  {
    id: "about",
    title: "About you",
    description: "Who you are and what your business does.",
    fields: ["name", "email", "company", "website_url", "business_description"],
  },
  {
    id: "project",
    title: "Project & goals",
    description: "What you need and what success looks like.",
    fields: ["project_type", "goals", "audience", "primary_action", "competitors"],
  },
  {
    id: "scope",
    title: "Scope & content",
    description: "Pages, features, languages and what you already have.",
    fields: [
      "pages",
      "features",
      "extra_requirements",
      "languages",
      "other_language",
      "content_readiness",
      "domain_status",
    ],
  },
  {
    id: "design",
    title: "Brand & design",
    description: "The look and feel you are aiming for.",
    fields: [
      "brand_assets",
      "attachments",
      "styles",
      "brand_words",
      "colour_preferences",
      "colour_mode",
      "typography",
      "liked_sites",
      "disliked_sites",
    ],
  },
  {
    id: "budget",
    title: "Budget & contact",
    description: "Budget, timing and how to reach you.",
    fields: [
      "budget",
      "timeline",
      "deadline_note",
      "support",
      "preferred_contact",
      "phone",
      "notes",
      "consent",
    ],
  },
];

/** Returns the index of the step that owns a field or a server error key such as `goals.1`. */
export function stepIndexForField(key: string): number {
  const base = key.split(".")[0] as keyof BriefFormData;
  const index = briefSteps.findIndex((step) => step.fields.includes(base));

  return index === -1 ? 0 : index;
}

export function optionLabel(options: BriefOption[], value: string | null | undefined): string {
  if (!value) return "";

  return options.find((option) => option.value === value)?.label ?? value;
}

export function optionLabels(options: BriefOption[], values: string[] | null | undefined): string[] {
  return (values ?? []).map((value) => optionLabel(options, value));
}

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_PATTERN = /^[0-9+().\-\s]{6,40}$/;

export type BriefErrors = Partial<Record<keyof BriefFormData | string, string>>;

/** Client-side check of one step, mirroring the required rules of StoreProjectBriefRequest. */
export function validateBriefStep(stepIndex: number, data: BriefFormData): BriefErrors {
  const errors: BriefErrors = {};

  switch (briefSteps[stepIndex]?.id) {
    case "about":
      if (!data.name.trim()) errors.name = "Please tell me your name.";
      if (!data.email.trim()) errors.email = "Please add your email address.";
      else if (!EMAIL_PATTERN.test(data.email.trim())) errors.email = "That email address does not look right.";
      if (data.business_description.trim().length < 10) {
        errors.business_description = "A sentence or two about your business helps a lot (at least 10 characters).";
      }
      break;
    case "project":
      if (!data.project_type) errors.project_type = "Pick the option that fits best.";
      if (data.goals.length === 0) errors.goals = "Pick at least one goal.";
      if (data.audience.trim().length < 10) {
        errors.audience = "Describe your ideal customers in a sentence or two (at least 10 characters).";
      }
      break;
    case "design":
      if (data.styles.length === 0) errors.styles = "Pick at least one style.";
      break;
    case "budget":
      if (!data.budget) errors.budget = "Pick a budget range, or choose \"Not sure yet\".";
      if (!data.timeline) errors.timeline = "Pick a timeline.";
      if (!data.preferred_contact) errors.preferred_contact = "Pick how you would like me to reach you.";
      if (data.preferred_contact === "phone") {
        if (!data.phone.trim()) errors.phone = "Add a phone number so I can reach you.";
        else if (!PHONE_PATTERN.test(data.phone.trim())) errors.phone = "Use digits, spaces and + ( ) - only.";
      }
      if (!data.consent) errors.consent = "Please confirm that I may store your answers to reply to you.";
      break;
    default:
      break;
  }

  return errors;
}
