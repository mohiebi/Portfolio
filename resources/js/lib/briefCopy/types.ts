import type { BriefFormData, OptionGroup, OptionValue, StepId } from "@/lib/brief";

export type BriefLocale = "en" | "fa" | "tr" | "de";

export type OptionText = { label: string; hint?: string };

export type FieldText = { label: string; hint?: string; placeholder?: string };

/** Every question on the form. The honeypot is not shown to people, so it has no copy. */
export type FieldKey = Exclude<keyof BriefFormData, "nickname">;

/**
 * Everything a visitor reads on the brief page, for one language.
 * Functions take values that are already formatted for the language (numbers, file names),
 * so a dictionary only decides wording and word order.
 */
export type BriefCopy = {
  seo: { title: string; description: string };

  page: {
    backToPortfolio: string;
    eyebrow: string;
    title: string;
    intro: string;
    badgeTime: string;
    badgeSteps: string;
    badgeSaved: string;
    privacyNote: string;
    languageLabel: string;
    /** Label of the hidden spam trap. Never shown, but kept readable for assistive tools. */
    honeypot: string;
  };

  nav: {
    back: string;
    next: string;
    send: string;
    sending: string;
    uploading: (percent: string) => string;
    uploadProgress: string;
  };

  progress: {
    stepOf: (current: string, total: string) => string;
    ariaLabel: (current: string, total: string) => string;
    completed: string;
  };

  steps: Record<StepId, { title: string; description: string }>;

  common: {
    /** Read out by screen readers after the star of a required question. */
    required: string;
    selectedCount: (selected: string, max: string) => string;
  };

  fields: Record<FieldKey, FieldText>;

  options: { [G in OptionGroup]: Record<OptionValue<G>, OptionText> };

  files: {
    dropTitle: string;
    dropHelp: (types: string, megabytes: string, max: string) => string;
    selected: string;
    remove: (name: string) => string;
    wrongType: (name: string, types: string) => string;
    tooLarge: (name: string, megabytes: string) => string;
    tooMany: (name: string, max: string) => string;
  };

  likedSites: {
    urlPlaceholder: string;
    notePlaceholder: string;
    addressLabel: (position: string) => string;
    noteLabel: (position: string) => string;
    remove: (position: string) => string;
    add: string;
  };

  errors: {
    nameRequired: string;
    emailRequired: string;
    emailInvalid: string;
    descriptionShort: string;
    projectType: string;
    goals: string;
    audienceShort: string;
    styles: string;
    budget: string;
    timeline: string;
    contact: string;
    phoneRequired: string;
    phoneInvalid: string;
    consent: string;
  };

  thanks: {
    /** The name may be empty. */
    title: (name: string) => string;
    /** The email address is shown between these two parts. */
    bodyBefore: string;
    bodyAfter: string;
    backToPortfolio: string;
    sendAnother: string;
  };
};
