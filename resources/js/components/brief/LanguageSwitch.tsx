import { Link } from "@inertiajs/react";
import { useBrief } from "@/components/brief/BriefProvider";
import { BRIEF_LOCALES, briefLocaleMeta } from "@/lib/briefCopy";

/** Switches between the language versions of the brief without losing what was typed. */
export function LanguageSwitch() {
  const { locale, copy } = useBrief();

  return (
    <nav
      aria-label={copy.page.languageLabel}
      className="inline-flex flex-wrap items-center gap-1 rounded-full border border-border bg-background/60 p-1 text-xs"
    >
      {BRIEF_LOCALES.map((code) => {
        const meta = briefLocaleMeta[code];
        const active = code === locale;

        return (
          <Link
            key={code}
            href={meta.path}
            lang={meta.lang}
            hrefLang={meta.lang}
            preserveState
            preserveScroll
            aria-current={active ? "page" : undefined}
            className={`rounded-full px-3 py-1.5 transition-colors ${
              active
                ? "bg-primary/15 text-primary"
                : "text-muted-foreground hover:bg-accent hover:text-foreground"
            }`}
          >
            {meta.nativeName}
          </Link>
        );
      })}
    </nav>
  );
}
