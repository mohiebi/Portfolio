import { Link, useForm } from "@inertiajs/react";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowLeft, ArrowRight, CheckCircle2, Clock, Layers, Loader2, Save, Send } from "lucide-react";
import { useEffect, useRef, useState, type FormEvent } from "react";
import { BriefProvider, useBrief } from "@/components/brief/BriefProvider";
import { LanguageSwitch } from "@/components/brief/LanguageSwitch";
import { StepProgress } from "@/components/brief/StepProgress";
import { AboutStep, BudgetStep, DesignStep, ProjectStep, ScopeStep, type StepProps } from "@/components/brief/steps";
import { SeoHead } from "@/components/site/SeoHead";
import { SiteShell } from "@/components/site/SiteShell";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  BRIEF_LIMITS,
  DRAFT_STORAGE_KEY,
  briefSteps,
  emptyBrief,
  normalizeDigits,
  stepIndexForField,
  validateBriefStep,
  type BriefFormData,
  type BriefLikedSite,
} from "@/lib/brief";
import { BRIEF_LOCALES, briefLocaleMeta, isBriefLocale, type BriefLocale } from "@/lib/briefCopy";

type Props = {
  locale: BriefLocale;
};

type Draft = { step: number; data: BriefFormData };

const stepComponents = [AboutStep, ProjectStep, ScopeStep, DesignStep, BudgetStep];

/** Files, consent and the honeypot are never kept in the saved draft. */
const TRANSIENT_FIELDS: Array<keyof BriefFormData> = ["attachments", "consent", "nickname"];

/** The public address of every language version, for search engines. */
const ALTERNATES: Record<string, string> = {
  ...Object.fromEntries(BRIEF_LOCALES.map((code) => [code, briefLocaleMeta[code].path])),
  "x-default": briefLocaleMeta.en.path,
};

function blankBrief(): BriefFormData {
  return { ...emptyBrief, liked_sites: [{ url: "", note: "" }] };
}

function loadDraft(): Draft {
  const fallback: Draft = { step: 0, data: blankBrief() };

  try {
    const raw = window.localStorage.getItem(DRAFT_STORAGE_KEY);
    if (!raw) return fallback;

    const saved = JSON.parse(raw) as { step?: unknown; data?: Record<string, unknown> };
    const data = blankBrief();

    for (const key of Object.keys(emptyBrief) as Array<keyof BriefFormData>) {
      if (TRANSIENT_FIELDS.includes(key) || key === "liked_sites") continue;

      const value = saved.data?.[key];
      const expected = emptyBrief[key];

      if (Array.isArray(expected) && Array.isArray(value) && value.every((item) => typeof item === "string")) {
        (data as Record<string, unknown>)[key] = value;
      } else if (typeof expected === "string" && typeof value === "string") {
        (data as Record<string, unknown>)[key] = value;
      }
    }

    const rows = saved.data?.liked_sites;
    if (Array.isArray(rows)) {
      const likedSites = rows
        .filter((row): row is Record<string, unknown> => typeof row === "object" && row !== null)
        .slice(0, BRIEF_LIMITS.likedSites)
        .map((row): BriefLikedSite => ({
          url: typeof row.url === "string" ? row.url : "",
          note: typeof row.note === "string" ? row.note : "",
        }));

      if (likedSites.length > 0) data.liked_sites = likedSites;
    }

    const step = typeof saved.step === "number" ? Math.min(Math.max(Math.trunc(saved.step), 0), briefSteps.length - 1) : 0;

    return { step, data };
  } catch {
    return fallback;
  }
}

function saveDraft(draft: Draft) {
  try {
    const data = Object.fromEntries(
      Object.entries(draft.data).filter(([key]) => !TRANSIENT_FIELDS.includes(key as keyof BriefFormData)),
    );

    window.localStorage.setItem(DRAFT_STORAGE_KEY, JSON.stringify({ step: draft.step, data }));
  } catch {
    // Private windows and blocked storage simply mean no draft is kept.
  }
}

function clearDraft() {
  try {
    window.localStorage.removeItem(DRAFT_STORAGE_KEY);
  } catch {
    // Nothing to clear.
  }
}

export default function BriefCreate({ locale }: Props) {
  return (
    <BriefProvider locale={isBriefLocale(locale) ? locale : "en"}>
      <BriefPage />
    </BriefProvider>
  );
}

function BriefPage() {
  const { locale, copy, meta, n } = useBrief();
  const reduceMotion = useReducedMotion();
  const [initial] = useState(loadDraft);
  const [step, setStep] = useState(initial.step);
  const [submitted, setSubmitted] = useState<{ name: string; email: string } | null>(null);
  const form = useForm<BriefFormData>(initial.data);

  const cardRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const focusInvalid = useRef(false);
  const firstRender = useRef(true);

  const isLastStep = step === briefSteps.length - 1;
  const StepComponent = stepComponents[step];
  const stepCopy = copy.steps[briefSteps[step].id];
  const scrollBehavior: ScrollBehavior = reduceMotion ? "auto" : "smooth";

  const set: StepProps["set"] = (key, value) => {
    const stale = Object.keys(form.errors).filter((errorKey) => errorKey === key || errorKey.startsWith(`${key}.`));

    form.setData((data) => ({ ...data, [key]: value }));
    if (stale.length > 0) form.clearErrors(...(stale as Array<keyof BriefFormData>));
  };

  // Keep a draft in this browser so a refresh does not lose the answers.
  useEffect(() => {
    if (submitted) return;

    saveDraft({ step, data: form.data });
  }, [form.data, step, submitted]);

  // Move focus to the step heading whenever the step changes.
  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;

      return;
    }

    cardRef.current?.scrollIntoView({ block: "start", behavior: scrollBehavior });
    headingRef.current?.focus({ preventScroll: true });
  }, [step, scrollBehavior]);

  // After a failed validation, bring the first invalid field into view.
  useEffect(() => {
    if (!focusInvalid.current) return;
    focusInvalid.current = false;

    const target = formRef.current?.querySelector<HTMLElement>('[data-invalid="true"]');
    if (!target) return;

    target.scrollIntoView({ block: "center", behavior: scrollBehavior });
    target.querySelector<HTMLElement>("input, textarea, [role='checkbox']")?.focus({ preventScroll: true });
  }, [form.errors, step, scrollBehavior]);

  const showErrors = (errors: Partial<Record<string, string>>) => {
    form.clearErrors();
    form.setError(errors as Partial<Record<keyof BriefFormData, string>>);
    focusInvalid.current = true;
  };

  const goNext = () => {
    const errors = validateBriefStep(step, form.data, copy.errors);

    if (Object.keys(errors).length > 0) {
      showErrors(errors);

      return;
    }

    form.clearErrors();
    setStep(step + 1);
  };

  const goBack = () => {
    form.clearErrors();
    setStep(Math.max(step - 1, 0));
  };

  const submit = (event: FormEvent) => {
    event.preventDefault();

    if (!isLastStep) {
      goNext();

      return;
    }

    for (let index = 0; index < briefSteps.length; index++) {
      const errors = validateBriefStep(index, form.data, copy.errors);

      if (Object.keys(errors).length > 0) {
        setStep(index);
        showErrors(errors);

        return;
      }
    }

    const answer = { name: form.data.name.trim(), email: form.data.email.trim() };

    // The language travels with the answers so the owner knows what the client read,
    // and Persian digits in the phone number are sent as plain digits.
    form.transform((data) => ({ ...data, locale, phone: normalizeDigits(data.phone) }));
    form.post(route("brief.store"), {
      forceFormData: true,
      preserveScroll: true,
      onSuccess: () => {
        clearDraft();
        setSubmitted(answer);
        window.scrollTo({ top: 0, behavior: scrollBehavior });
      },
      onError: (errors) => {
        const [firstKey] = Object.keys(errors);

        if (firstKey) setStep(stepIndexForField(firstKey));
        focusInvalid.current = true;
      },
    });
  };

  const startAnother = () => {
    form.setData(blankBrief());
    form.clearErrors();
    setStep(0);
    setSubmitted(null);
  };

  return (
    <SiteShell>
      <SeoHead
        title={copy.seo.title}
        description={copy.seo.description}
        canonical={meta.path}
        alternates={ALTERNATES}
        ogLocale={meta.og}
      />

      <main dir={meta.dir} lang={meta.lang} className="relative overflow-hidden border-t border-border/60">
        <motion.div
          aria-hidden
          className="absolute -top-24 left-1/3 h-72 w-72 rounded-full bg-primary/15 blur-3xl"
          animate={reduceMotion ? undefined : { scale: [1, 1.15, 1], opacity: [0.4, 0.7, 0.4] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        <div
          className="absolute inset-0 bg-grid opacity-20 [mask-image:linear-gradient(to_bottom,black,transparent_80%)]"
          aria-hidden
        />

        <div className="relative mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              <ArrowLeft className="h-4 w-4 rtl:rotate-180" aria-hidden="true" /> {copy.page.backToPortfolio}
            </Link>
            <LanguageSwitch />
          </div>

          <header className="mt-8">
            <p className="font-mono text-xs uppercase tracking-wider text-primary rtl:font-sans rtl:tracking-normal">
              {copy.page.eyebrow}
            </p>
            <h1 className="mt-2 font-display text-3xl font-semibold sm:text-5xl rtl:leading-[1.4]">
              {copy.page.title}
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base rtl:leading-8">
              {copy.page.intro}
            </p>
            <ul className="mt-5 flex flex-wrap gap-2">
              {[
                { icon: Clock, text: copy.page.badgeTime },
                { icon: Layers, text: copy.page.badgeSteps },
                { icon: Save, text: copy.page.badgeSaved },
              ].map(({ icon: Icon, text }) => (
                <li
                  key={text}
                  className="inline-flex items-center gap-1.5 rounded-full border border-primary/25 bg-primary/10 px-3 py-1 text-xs text-primary/90"
                >
                  <Icon className="h-3 w-3" aria-hidden="true" /> {text}
                </li>
              ))}
            </ul>
          </header>

          {submitted ? (
            <ThankYou name={submitted.name} email={submitted.email} onStartAnother={startAnother} />
          ) : (
            <div
              ref={cardRef}
              className="mt-10 scroll-mt-6 rounded-3xl border border-border bg-card/70 p-5 shadow-card backdrop-blur sm:p-8"
            >
              <StepProgress steps={briefSteps} current={step} onGo={(index) => index < step && setStep(index)} />

              <form ref={formRef} onSubmit={submit} noValidate className="mt-8 border-t border-border pt-8">
                <h2
                  ref={headingRef}
                  tabIndex={-1}
                  className="font-display text-2xl font-semibold outline-none rtl:leading-[1.5]"
                >
                  {stepCopy.title}
                </h2>
                <p className="mb-6 mt-1 text-sm text-muted-foreground">{stepCopy.description}</p>

                <StepComponent data={form.data} errors={form.errors} set={set} />

                {/* Honeypot: invisible to people, tempting to bots. */}
                <div aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
                  <label>
                    {copy.page.honeypot}
                    <input
                      type="text"
                      name="nickname"
                      tabIndex={-1}
                      autoComplete="off"
                      value={form.data.nickname}
                      onChange={(event) => form.setData("nickname", event.target.value)}
                    />
                  </label>
                </div>

                {form.progress && (
                  <div className="mt-6 grid gap-1.5" role="status">
                    <Progress
                      value={form.progress.percentage ?? 0}
                      className="rtl:-scale-x-100"
                      aria-label={copy.nav.uploadProgress}
                    />
                    <p className="text-xs text-muted-foreground">{copy.nav.uploading(n(form.progress.percentage ?? 0))}</p>
                  </div>
                )}

                <div className="mt-8 flex items-center justify-between gap-3 border-t border-border pt-6">
                  {step > 0 ? (
                    <Button key="back" type="button" variant="ghost" onClick={goBack}>
                      <ArrowLeft className="me-2 h-4 w-4 rtl:rotate-180" aria-hidden="true" /> {copy.nav.back}
                    </Button>
                  ) : (
                    <span />
                  )}

                  {isLastStep ? (
                    <Button key="submit" type="submit" size="lg" className="glow-primary" disabled={form.processing}>
                      {form.processing ? (
                        <Loader2 className="me-2 h-4 w-4 animate-spin" aria-hidden="true" />
                      ) : (
                        <Send className="me-2 h-4 w-4 rtl:-scale-x-100" aria-hidden="true" />
                      )}
                      {form.processing ? copy.nav.sending : copy.nav.send}
                    </Button>
                  ) : (
                    <Button key="next" type="button" size="lg" onClick={goNext}>
                      {copy.nav.next} <ArrowRight className="ms-2 h-4 w-4 rtl:rotate-180" aria-hidden="true" />
                    </Button>
                  )}
                </div>
              </form>
            </div>
          )}

          {!submitted && (
            <p className="mt-6 text-center text-xs text-muted-foreground rtl:leading-6">{copy.page.privacyNote}</p>
          )}
        </div>
      </main>
    </SiteShell>
  );
}

function ThankYou({ name, email, onStartAnother }: { name: string; email: string; onStartAnother: () => void }) {
  const { copy } = useBrief();
  const firstName = name.split(/\s+/)[0] ?? "";

  return (
    <div
      role="status"
      className="mt-10 rounded-3xl border border-primary/40 bg-card/80 p-8 text-center shadow-card ring-1 ring-primary/20 sm:p-12"
    >
      <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl border border-primary/40 bg-primary/15 text-primary">
        <CheckCircle2 className="h-7 w-7" aria-hidden="true" />
      </div>
      <h2 className="mt-5 font-display text-3xl font-semibold rtl:leading-[1.5]">{copy.thanks.title(firstName)}</h2>
      <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-muted-foreground rtl:leading-7">
        {copy.thanks.bodyBefore}
        <bdi dir="ltr" className="text-foreground">
          {email}
        </bdi>
        {copy.thanks.bodyAfter}
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Button asChild>
          <Link href="/">{copy.thanks.backToPortfolio}</Link>
        </Button>
        <Button type="button" variant="outline" onClick={onStartAnother}>
          {copy.thanks.sendAnother}
        </Button>
      </div>
    </div>
  );
}
