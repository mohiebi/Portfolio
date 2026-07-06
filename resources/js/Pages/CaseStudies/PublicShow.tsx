import { Link } from "@inertiajs/react";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight, Briefcase, Calendar, Check, MapPin, Sparkles } from "lucide-react";
import { SiteShell } from "@/components/site/SiteShell";
import { SeoHead } from "@/components/site/SeoHead";
import { Button } from "@/components/ui/button";
import type { CaseStudy } from "@/types";
import { localizedRecord, useI18n } from "@/i18n";

type Props = {
  caseStudy: CaseStudy;
  nextCaseStudy?: CaseStudy | null;
};

export default function PublicCaseStudyShow({ caseStudy, nextCaseStudy }: Props) {
  const { locale } = useI18n();
  caseStudy = localizedRecord(caseStudy, locale);
  nextCaseStudy = nextCaseStudy ? localizedRecord(nextCaseStudy, locale) : nextCaseStudy;
  return (
    <SiteShell>
      <SeoHead
        title={`${caseStudy.title} - ${locale === "de" ? "Fallstudie" : "Case Study"}`}
        description={caseStudy.summary}
      />

      <section className={`relative overflow-hidden border-b border-border/60 bg-gradient-to-br ${caseStudy.accent}`}>
        <div className="absolute inset-0 bg-grid opacity-30 [mask-image:radial-gradient(ellipse_at_center,black,transparent_70%)]" />
        <motion.div
          aria-hidden
          className="absolute -right-20 -top-32 h-80 w-80 rounded-full bg-primary/20 blur-3xl"
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        <div className="relative mx-auto max-w-5xl px-4 py-20 sm:px-6 lg:px-8">
          <Link href="/case-studies" className="inline-flex items-center gap-1.5 font-mono text-xs uppercase tracking-wider text-muted-foreground transition-colors hover:text-primary">
            <ArrowLeft className="h-3.5 w-3.5" /> All case studies
          </Link>
          {caseStudy.tag && <p className="mt-6 font-mono text-xs uppercase tracking-wider text-primary">{caseStudy.tag}</p>}
          <h1 className="mt-2 font-display text-4xl font-semibold leading-tight sm:text-5xl lg:text-6xl">
            {caseStudy.title}
          </h1>
          <p className="mt-5 max-w-3xl text-lg text-muted-foreground">{caseStudy.summary}</p>

          <div className="mt-8 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-muted-foreground">
            {(caseStudy.role || caseStudy.company) && (
              <span className="inline-flex items-center gap-1.5">
                <Briefcase className="h-4 w-4 text-primary" /> {[caseStudy.role, caseStudy.company].filter(Boolean).join(" · ")}
              </span>
            )}
            {caseStudy.period && <span className="inline-flex items-center gap-1.5"><Calendar className="h-4 w-4 text-primary" /> {caseStudy.period}</span>}
            {caseStudy.location && <span className="inline-flex items-center gap-1.5"><MapPin className="h-4 w-4 text-primary" /> {caseStudy.location}</span>}
          </div>
        </div>
      </section>

      {(caseStudy.impact ?? []).length > 0 && (
        <section className="border-b border-border/60">
          <div className="mx-auto grid max-w-5xl grid-cols-2 gap-px overflow-hidden bg-border sm:grid-cols-4">
            {(caseStudy.impact ?? []).map((metric) => (
              <div key={`${metric.value}-${metric.label}`} className="bg-background p-6 text-center">
                <p className="font-display text-3xl font-semibold text-primary">{metric.value}</p>
                <p className="mt-1 font-mono text-[11px] uppercase tracking-wider text-muted-foreground">{metric.label}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      <section className="mx-auto grid max-w-5xl gap-12 px-4 py-16 sm:px-6 lg:grid-cols-[1.6fr_1fr] lg:px-8">
        <div className="space-y-12">
          {caseStudy.problem && (
            <Block label="Problem" title="The challenge">
              <p className="text-muted-foreground">{caseStudy.problem}</p>
            </Block>
          )}

          {(caseStudy.approach ?? []).length > 0 && (
            <Block label="Approach" title="What I did">
              <ul className="space-y-3">
                {(caseStudy.approach ?? []).map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <span className="mt-1 grid h-5 w-5 shrink-0 place-items-center rounded-full border border-primary/40 bg-primary/10 text-primary">
                      <Check className="h-3 w-3" />
                    </span>
                    <span className="text-sm leading-relaxed text-foreground/90">{item}</span>
                  </li>
                ))}
              </ul>
            </Block>
          )}

          {(caseStudy.highlights ?? []).length > 0 && (
            <Block label="Highlights" title="What stood out">
              <ul className="space-y-3">
                {(caseStudy.highlights ?? []).map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                    <span className="text-sm leading-relaxed text-foreground/90">{item}</span>
                  </li>
                ))}
              </ul>
            </Block>
          )}
        </div>

        <aside className="space-y-6 lg:sticky lg:top-24 lg:self-start">
          {(caseStudy.stack ?? []).length > 0 && (
            <div className="rounded-2xl border border-border bg-card/70 p-6">
              <h4 className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground">Stack</h4>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {(caseStudy.stack ?? []).map((item) => (
                  <span key={item} className="rounded-md border border-border bg-background/40 px-2 py-1 text-xs font-mono text-foreground/80">{item}</span>
                ))}
              </div>
            </div>
          )}

          <div className="rounded-2xl border border-border bg-card/70 p-6">
            <h4 className="font-display text-lg font-semibold">Want to dig deeper?</h4>
            <p className="mt-2 text-sm text-muted-foreground">Happy to walk you through the architecture, trade-offs, and outcomes.</p>
            <Button asChild className="mt-4 w-full">
              <a href="/#contact">Get in touch <ArrowRight className="ml-2 h-4 w-4" /></a>
            </Button>
          </div>
        </aside>
      </section>

      {nextCaseStudy && (
        <section className="border-t border-border/60">
          <div className="mx-auto max-w-5xl px-4 py-14 sm:px-6 lg:px-8">
            <p className="font-mono text-xs uppercase tracking-wider text-muted-foreground">Next case study</p>
            <Link
              href={`/case-studies/${nextCaseStudy.slug}`}
              className={`group mt-3 flex items-center justify-between gap-6 rounded-2xl border border-border bg-gradient-to-br ${nextCaseStudy.accent} p-6 transition-colors hover:border-primary/60`}
            >
              <div>
                {nextCaseStudy.tag && <p className="font-mono text-[11px] uppercase tracking-wider text-primary">{nextCaseStudy.tag}</p>}
                <h3 className="mt-1 font-display text-2xl font-semibold">{nextCaseStudy.title}</h3>
              </div>
              <ArrowRight className="h-6 w-6 shrink-0 text-primary transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </section>
      )}
    </SiteShell>
  );
}

function Block({ label, title, children }: { label: string; title: string; children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.5 }}
    >
      <p className="font-mono text-xs uppercase tracking-wider text-primary">// {label}</p>
      <h2 className="mt-2 font-display text-2xl font-semibold sm:text-3xl">{title}</h2>
      <div className="mt-4">{children}</div>
    </motion.div>
  );
}
