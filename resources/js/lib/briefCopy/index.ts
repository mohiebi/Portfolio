import { de } from "@/lib/briefCopy/de";
import { en } from "@/lib/briefCopy/en";
import { fa } from "@/lib/briefCopy/fa";
import { tr } from "@/lib/briefCopy/tr";
import type { BriefCopy, BriefLocale } from "@/lib/briefCopy/types";

export type { BriefCopy, BriefLocale } from "@/lib/briefCopy/types";

export const BRIEF_LOCALES: BriefLocale[] = ["en", "fa", "tr", "de"];

type LocaleMeta = {
  /** Reading direction of the whole page. */
  dir: "ltr" | "rtl";
  lang: string;
  /** Locale used to format numbers, for example Persian digits. */
  intl: string;
  /** The language's name in that language, shown in the language switcher. */
  nativeName: string;
  path: string;
  /** Open Graph locale. */
  og: string;
};

export const briefLocaleMeta: Record<BriefLocale, LocaleMeta> = {
  en: { dir: "ltr", lang: "en", intl: "en", nativeName: "English", path: "/brief", og: "en_US" },
  fa: { dir: "rtl", lang: "fa", intl: "fa-IR", nativeName: "فارسی", path: "/brief/fa", og: "fa_IR" },
  tr: { dir: "ltr", lang: "tr", intl: "tr-TR", nativeName: "Türkçe", path: "/brief/tr", og: "tr_TR" },
  de: { dir: "ltr", lang: "de", intl: "de-DE", nativeName: "Deutsch", path: "/brief/de", og: "de_DE" },
};

const dictionaries: Record<BriefLocale, BriefCopy> = { en, fa, tr, de };

export function briefCopy(locale: BriefLocale): BriefCopy {
  return dictionaries[locale];
}

export function isBriefLocale(value: unknown): value is BriefLocale {
  return typeof value === "string" && (BRIEF_LOCALES as string[]).includes(value);
}
