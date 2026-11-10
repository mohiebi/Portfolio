/**
 * The language-independent part of the project brief: the shape of the form, the allowed
 * answer keys, limits, the step layout and client-side validation.
 *
 * Everything people read lives in resources/js/lib/briefCopy, one file per language.
 * Option values must match App\Support\BriefOptions on the server.
 */
import { briefCopy } from "@/lib/briefCopy";
import type { BriefCopy, OptionText } from "@/lib/briefCopy/types";

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

/** The answer keys of every choice question, in the order they are shown. */
export const optionValues = {
  projectTypes: ["new_site", "redesign", "landing_page", "web_app", "design_only", "unsure"],
  goals: ["leads", "sell_online", "bookings", "credibility", "explain", "recruit", "replace_outdated", "internal_tool"],
  pages: ["home", "about", "services", "portfolio", "pricing", "blog", "shop", "booking", "faq", "careers", "contact", "legal"],
  features: ["forms", "booking", "payments", "accounts", "cms", "newsletter", "search", "analytics_seo", "crm", "chat_ai", "maps"],
  languages: ["en", "de", "fa", "tr", "other"],
  contentReadiness: ["ready", "partial", "need_help", "unsure"],
  domainStatus: ["both", "domain_only", "neither", "unsure"],
  brandAssets: ["logo", "palette", "fonts", "guidelines", "imagery", "none"],
  styles: ["minimal", "bold", "premium", "friendly", "corporate", "tech", "editorial", "warm"],
  colourModes: ["light", "dark", "either"],
  typography: ["sans", "serif", "mix", "none"],
  budgets: ["under_3k", "3k_6k", "6k_10k", "10k_20k", "20k_50k", "50k_plus", "unsure"],
  timelines: ["asap", "1_2_months", "3_6_months", "flexible"],
  support: ["yes", "maybe", "no"],
  contactMethods: ["email", "phone", "video"],
} as const;

export type OptionGroup = keyof typeof optionValues;
export type OptionValue<G extends OptionGroup> = (typeof optionValues)[G][number];

/** A rough colour hint shown on each style card. */
export const styleSwatches: Record<string, [string, string, string]> = {
  minimal: ["#ffffff", "#e5e7eb", "#111827"],
  bold: ["#ef4444", "#f59e0b", "#3b82f6"],
  premium: ["#0f0f10", "#8a6d3b", "#e8d9b5"],
  friendly: ["#fde68a", "#fb7185", "#60a5fa"],
  corporate: ["#1e3a8a", "#e0e7ff", "#64748b"],
  tech: ["#0b1220", "#22d3ee", "#34d399"],
  editorial: ["#faf7f2", "#1f1f1f", "#b45309"],
  warm: ["#f5ebe0", "#a3b18a", "#bc6c25"],
};

export type BriefOption = {
  value: string;
  label: string;
  hint?: string;
  /** Three colours shown as a small preview on style cards. */
  swatch?: [string, string, string];
};

export function buildOptions(group: OptionGroup, copy: BriefCopy): BriefOption[] {
  const texts = copy.options[group] as Record<string, OptionText>;

  return (optionValues[group] as readonly string[]).map((value) => ({
    value,
    label: texts[value].label,
    hint: texts[value].hint,
    swatch: group === "styles" ? styleSwatches[value] : undefined,
  }));
}

export type StepId = "about" | "project" | "scope" | "design" | "budget";

export type BriefStep = {
  id: StepId;
  /** Form fields (and server error keys) that live on this step. */
  fields: Array<keyof BriefFormData>;
};

export const briefSteps: BriefStep[] = [
  {
    id: "about",
    fields: ["name", "email", "company", "website_url", "business_description"],
  },
  {
    id: "project",
    fields: ["project_type", "goals", "audience", "primary_action", "competitors"],
  },
  {
    id: "scope",
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

// The owner reads briefs in English, whatever language the client used.
const ownerCopy = briefCopy("en");

export function optionLabel(group: OptionGroup, value: string | null | undefined): string {
  if (!value) return "";

  return (ownerCopy.options[group] as Record<string, OptionText>)[value]?.label ?? value;
}

export function optionLabels(group: OptionGroup, values: string[] | null | undefined): string[] {
  return (values ?? []).map((value) => optionLabel(group, value));
}

/** English names of the brief languages, for the admin pages. */
export const localeNames: Record<string, string> = {
  en: "English",
  fa: "Persian",
  tr: "Turkish",
  de: "German",
};

/** Persian and Arabic-Indic digits to ASCII, so a phone number typed on a Persian keyboard is valid. */
export function normalizeDigits(value: string): string {
  return value
    .replace(/[۰-۹]/g, (digit) => String(digit.charCodeAt(0) - 0x06f0))
    .replace(/[٠-٩]/g, (digit) => String(digit.charCodeAt(0) - 0x0660));
}

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_PATTERN = /^[0-9+().\-\s]{6,40}$/;

export type BriefErrors = Partial<Record<keyof BriefFormData | string, string>>;

/** Client-side check of one step, mirroring the required rules of StoreProjectBriefRequest. */
export function validateBriefStep(stepIndex: number, data: BriefFormData, messages: BriefCopy["errors"]): BriefErrors {
  const errors: BriefErrors = {};

  switch (briefSteps[stepIndex]?.id) {
    case "about":
      if (!data.name.trim()) errors.name = messages.nameRequired;
      if (!data.email.trim()) errors.email = messages.emailRequired;
      else if (!EMAIL_PATTERN.test(data.email.trim())) errors.email = messages.emailInvalid;
      if (data.business_description.trim().length < 10) errors.business_description = messages.descriptionShort;
      break;
    case "project":
      if (!data.project_type) errors.project_type = messages.projectType;
      if (data.goals.length === 0) errors.goals = messages.goals;
      if (data.audience.trim().length < 10) errors.audience = messages.audienceShort;
      break;
    case "design":
      if (data.styles.length === 0) errors.styles = messages.styles;
      break;
    case "budget":
      if (!data.budget) errors.budget = messages.budget;
      if (!data.timeline) errors.timeline = messages.timeline;
      if (!data.preferred_contact) errors.preferred_contact = messages.contact;
      if (data.preferred_contact === "phone") {
        const phone = normalizeDigits(data.phone.trim());

        if (!phone) errors.phone = messages.phoneRequired;
        else if (!PHONE_PATTERN.test(phone)) errors.phone = messages.phoneInvalid;
      }
      if (!data.consent) errors.consent = messages.consent;
      break;
    default:
      break;
  }

  return errors;
}
