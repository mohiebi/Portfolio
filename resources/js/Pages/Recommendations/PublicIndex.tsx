import { Head } from "@inertiajs/react";
import { ArrowLeft, ExternalLink, Linkedin, Quote } from "lucide-react";
import { motion } from "framer-motion";
import { SiteShell } from "@/components/site/SiteShell";
import type { Recommendation } from "@/types";
import { localizedRecords, localeForIntl, useI18n, type Locale } from "@/i18n";

type Props = {
  recommendations: Recommendation[];
};

export default function PublicRecommendationsPage({ recommendations }: Props) {
  const { locale } = useI18n();
  recommendations = localizedRecords(recommendations, locale);
  return (
    <SiteShell>
      <Head title="LinkedIn Recommendations" />

      <main className="relative overflow-hidden border-t border-border/60">
        <motion.div
          aria-hidden
          className="absolute -top-24 left-1/3 h-72 w-72 rounded-full bg-primary/15 blur-3xl"
          animate={{ scale: [1, 1.15, 1], opacity: [0.4, 0.7, 0.4] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        <div className="absolute inset-0 bg-grid opacity-20 [mask-image:linear-gradient(to_bottom,black,transparent_80%)]" aria-hidden />

        <div className="relative mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
          <a href="/#recommendations" className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground">
            <ArrowLeft className="h-4 w-4" /> Back to portfolio
          </a>

          <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="font-mono text-xs uppercase tracking-wider text-primary">// Recommendations</p>
              <h1 className="mt-2 font-display text-3xl font-semibold sm:text-5xl">
                Full LinkedIn recommendations
              </h1>
              <p className="mt-3 max-w-2xl text-sm text-muted-foreground">
                Full text from the recommendations featured on the portfolio.
              </p>
            </div>
            <a
              href="https://www.linkedin.com/in/mohiebi/details/recommendations/"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 self-start rounded-full border border-border bg-background/60 px-3 py-1.5 text-xs font-mono uppercase tracking-wider text-muted-foreground transition-colors hover:border-primary/50 hover:text-primary"
            >
              <Linkedin className="h-3.5 w-3.5" /> View on LinkedIn
            </a>
          </div>

          <div className="mt-12 grid gap-6">
            {recommendations.map((recommendation, index) => (
              <motion.article
                key={recommendation.id}
                id={`recommendation-${recommendation.id}`}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.45, delay: Math.min(index * 0.06, 0.18) }}
                className="relative scroll-mt-24 overflow-hidden rounded-3xl border border-border bg-card/70 p-6 shadow-card backdrop-blur sm:p-8"
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${recommendationAccent(index)} opacity-40`} aria-hidden />
                <div className="relative">
                  <Quote className="h-9 w-9 text-primary/75" />
                  <p className="mt-5 whitespace-pre-line text-base leading-8 text-foreground/90 sm:text-lg">
                    {recommendation.body.replace(/\\n/g, "\n")}
                  </p>

                  <div className="mt-8 flex flex-col gap-5 border-t border-border/60 pt-6 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex min-w-0 items-center gap-4">
                      <RecommendationAvatar recommendation={recommendation} />
                      <div className="min-w-0">
                        <h2 className="font-display text-lg font-semibold">{recommendation.name}</h2>
                        <p className="mt-1 text-sm text-muted-foreground">
                          {[recommendation.role, recommendation.company].filter(Boolean).join(" | ")}
                        </p>
                        <p className="mt-1 font-mono text-[10px] uppercase tracking-wider text-muted-foreground/80">
                          {recommendation.recommended_at ? formatRecommendationDate(recommendation.recommended_at, locale) : "LinkedIn recommendation"}
                          {recommendation.relationship && ` - ${recommendation.relationship}`}
                        </p>
                      </div>
                    </div>

                    {recommendation.linkedin_url && (
                      <a
                        href={recommendation.linkedin_url}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center justify-center gap-1.5 rounded-full border border-border bg-background/40 px-3 py-1.5 font-mono text-[11px] uppercase tracking-wider text-primary transition-colors hover:border-primary/50 hover:bg-primary/10"
                      >
                        Recommender profile <ExternalLink className="h-3.5 w-3.5" />
                      </a>
                    )}
                  </div>
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </main>
    </SiteShell>
  );
}

const recommendationAccents = [
  "from-amber-400/30 to-orange-500/10",
  "from-sky-400/30 to-indigo-500/10",
  "from-emerald-400/30 to-teal-500/10",
];

function recommendationAccent(index: number) {
  return recommendationAccents[index % recommendationAccents.length];
}

function RecommendationAvatar({ recommendation }: { recommendation: Recommendation }) {
  if (recommendation.image_url) {
    return (
      <img
        src={recommendation.image_url}
        alt={`${recommendation.name} profile`}
        className="h-14 w-14 shrink-0 rounded-full border border-border object-cover"
      />
    );
  }

  return (
    <div className="grid h-14 w-14 shrink-0 place-items-center rounded-full border border-border bg-primary/10 font-display text-base font-semibold text-primary">
      {getRecommendationInitials(recommendation.name)}
    </div>
  );
}

function getRecommendationInitials(name: string) {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
}

function formatRecommendationDate(value: string, locale: Locale) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;

  return new Intl.DateTimeFormat(localeForIntl(locale), {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date);
}
