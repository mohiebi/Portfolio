import { createContext, useContext, useMemo, type ReactNode } from "react";
import { briefCopy, briefLocaleMeta, type BriefCopy, type BriefLocale } from "@/lib/briefCopy";

type BriefContextValue = {
  locale: BriefLocale;
  copy: BriefCopy;
  meta: (typeof briefLocaleMeta)[BriefLocale];
  /** Formats a number for the language, for example with Persian digits. */
  n: (value: number) => string;
};

const BriefContext = createContext<BriefContextValue | null>(null);

export function BriefProvider({ locale, children }: { locale: BriefLocale; children: ReactNode }) {
  const value = useMemo<BriefContextValue>(() => {
    const meta = briefLocaleMeta[locale];
    const formatter = new Intl.NumberFormat(meta.intl);

    return { locale, copy: briefCopy(locale), meta, n: (number) => formatter.format(number) };
  }, [locale]);

  return <BriefContext.Provider value={value}>{children}</BriefContext.Provider>;
}

export function useBrief(): BriefContextValue {
  const value = useContext(BriefContext);

  if (!value) throw new Error("useBrief must be used inside <BriefProvider>.");

  return value;
}
