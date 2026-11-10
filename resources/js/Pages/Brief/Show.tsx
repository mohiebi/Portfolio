import { Head, Link, router } from "@inertiajs/react";
import { ArrowLeft, CheckCircle2, Download, ExternalLink, Mail, RotateCcw, Trash2 } from "lucide-react";
import type { ReactNode } from "react";
import { formatSize } from "@/components/brief/FileDrop";
import { SiteShell } from "@/components/site/SiteShell";
import { StatusMessage } from "@/components/site/StatusMessage";
import { Button } from "@/components/ui/button";
import { localeNames, optionLabel, optionLabels } from "@/lib/brief";
import type { ProjectBrief } from "@/types";

type Props = {
  brief: ProjectBrief;
};

export default function BriefShow({ brief }: Props) {
  const reviewed = brief.reviewed_at !== null;

  const toggleReviewed = () => {
    router.patch(route("dashboard.briefs.reviewed", { projectBrief: brief.id }), {}, { preserveScroll: true });
  };

  const destroy = () => {
    if (!window.confirm(`Delete the brief from ${brief.name}? Uploaded files are deleted too and this cannot be undone.`)) return;

    router.delete(route("dashboard.briefs.destroy", { projectBrief: brief.id }));
  };

  const languageLabels = optionLabels("languages", brief.languages);
  if (brief.other_language) languageLabels.push(brief.other_language);

  const subject = encodeURIComponent(`Your project brief`);

  return (
    <SiteShell>
      <Head title={`Brief from ${brief.name}`} />

      <section className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
        <Link
          href={route("dashboard.briefs.index")}
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" /> Back to briefs
        </Link>

        <div className="mt-6 grid gap-6">
          <StatusMessage />

          <header className="rounded-2xl border border-border bg-card p-6 shadow-card sm:p-8">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div className="min-w-0">
                <p className="font-mono text-xs uppercase tracking-wider text-primary">Project brief</p>
                <div className="mt-2 flex flex-wrap items-center gap-3">
                  <h1 className="font-display text-3xl font-semibold">{brief.name}</h1>
                  <span
                    className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
                      reviewed ? "bg-muted text-muted-foreground" : "bg-primary/15 text-primary"
                    }`}
                  >
                    {reviewed ? "Reviewed" : "New"}
                  </span>
                </div>
                <p className="mt-1 text-sm text-muted-foreground">
                  {[brief.company, brief.email].filter(Boolean).join(" · ")}
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  Submitted {formatDateTime(brief.created_at)} · Form language: {localeNames[brief.locale] ?? brief.locale}
                </p>
              </div>

              <div className="flex flex-wrap gap-2">
                <Button asChild>
                  <a href={`mailto:${brief.email}?subject=${subject}`}>
                    <Mail className="mr-2 h-4 w-4" /> Reply by email
                  </a>
                </Button>
                <Button type="button" variant="outline" onClick={toggleReviewed}>
                  {reviewed ? (
                    <>
                      <RotateCcw className="mr-2 h-4 w-4" /> Mark as new
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="mr-2 h-4 w-4" /> Mark reviewed
                    </>
                  )}
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                  onClick={destroy}
                >
                  <Trash2 className="mr-2 h-4 w-4" /> Delete
                </Button>
              </div>
            </div>

            <dl className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              <Fact label="Project" value={optionLabel("projectTypes", brief.project_type)} />
              <Fact label="Budget" value={optionLabel("budgets", brief.budget)} />
              <Fact label="Timeline" value={optionLabel("timelines", brief.timeline)} />
              <Fact
                label="Reach via"
                value={`${optionLabel("contactMethods", brief.preferred_contact)}${brief.phone ? ` · ${brief.phone}` : ""}`}
              />
            </dl>
          </header>

          <Section title="About the business">
            <Row label="What the business does" value={brief.business_description} />
            <Row label="Current website">{brief.website_url && <SafeLink url={brief.website_url} />}</Row>
          </Section>

          <Section title="Project and goals">
            <ChipsRow label="Goals" values={optionLabels("goals", brief.goals)} />
            <Row label="Ideal customers" value={brief.audience} />
            <Row label="Main visitor action" value={brief.primary_action} />
            <Row label="Competitors" value={brief.competitors} />
          </Section>

          <Section title="Scope and content">
            <ChipsRow label="Pages" values={optionLabels("pages", brief.pages)} />
            <ChipsRow label="Features" values={optionLabels("features", brief.features)} />
            <Row label="Extra requirements" value={brief.extra_requirements} />
            <ChipsRow label="Languages" values={languageLabels} />
            <Row label="Content readiness" value={optionLabel("contentReadiness", brief.content_readiness)} />
            <Row label="Domain and hosting" value={optionLabel("domainStatus", brief.domain_status)} />
          </Section>

          <Section title="Brand and design direction">
            <ChipsRow label="Style and mood" values={optionLabels("styles", brief.styles)} />
            <Row label="Brand words" value={brief.brand_words} />
            <Row label="Colours" value={brief.colour_preferences} />
            <Row label="Interface" value={optionLabel("colourModes", brief.colour_mode)} />
            <Row label="Typography" value={optionLabel("typography", brief.typography)} />
            <ChipsRow label="Brand assets they have" values={optionLabels("brandAssets", brief.brand_assets)} />
            <Row label="Uploaded files">
              {brief.attachments.length > 0 && (
                <ul className="grid gap-2">
                  {brief.attachments.map((file) => (
                    <li key={file.url}>
                      <a
                        href={file.url}
                        download
                        className="inline-flex items-center gap-2 rounded-lg border border-border bg-background/50 px-3 py-2 text-sm transition-colors hover:border-primary/50 hover:text-primary"
                      >
                        <Download className="h-4 w-4" />
                        <span>{file.name}</span>
                        <span className="text-xs text-muted-foreground">{formatSize(file.size)}</span>
                      </a>
                    </li>
                  ))}
                </ul>
              )}
            </Row>
            <Row label="Sites they like">
              {brief.liked_sites.length > 0 && (
                <ul className="grid gap-2">
                  {brief.liked_sites.map((site) => (
                    <li key={site.url} className="text-sm">
                      <SafeLink url={site.url} />
                      {site.note && (
                        <p dir="auto" className="mt-0.5 text-muted-foreground">
                          {site.note}
                        </p>
                      )}
                    </li>
                  ))}
                </ul>
              )}
            </Row>
            <Row label="Sites or styles they dislike" value={brief.disliked_sites} />
          </Section>

          <Section title="Budget, timing and notes">
            <Row label="Deadline or reason" value={brief.deadline_note} />
            <Row label="Support after launch" value={optionLabel("support", brief.support)} />
            <Row label="Anything else" value={brief.notes} />
            <Row label="Consent given" value={formatDateTime(brief.consented_at)} />
          </Section>
        </div>
      </section>
    </SiteShell>
  );
}

function Fact({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-border bg-background/40 px-4 py-3">
      <dt className="text-xs uppercase tracking-wider text-muted-foreground">{label}</dt>
      <dd className="mt-1 text-sm font-medium">{value || "-"}</dd>
    </div>
  );
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="rounded-2xl border border-border bg-card shadow-card">
      <h2 className="border-b border-border bg-surface/40 px-6 py-4 font-display text-lg font-semibold sm:px-8">{title}</h2>
      <dl className="divide-y divide-border">{children}</dl>
    </section>
  );
}

/** A labelled answer. Rows without an answer are hidden so the page stays short. */
function Row({ label, value, children }: { label: string; value?: string | null; children?: ReactNode }) {
  const content = children ?? (value ? <p dir="auto" className="whitespace-pre-line text-sm leading-relaxed">{value}</p> : null);

  if (!content) return null;

  return (
    <div className="grid gap-1 px-6 py-4 sm:grid-cols-[13rem_minmax(0,1fr)] sm:gap-6 sm:px-8">
      <dt className="text-sm text-muted-foreground">{label}</dt>
      <dd className="min-w-0 break-words">{content}</dd>
    </div>
  );
}

function ChipsRow({ label, values }: { label: string; values: string[] }) {
  if (values.length === 0) return null;

  return (
    <Row label={label}>
      <ul className="flex flex-wrap gap-2">
        {values.map((value) => (
          <li key={value} className="rounded-full border border-primary/25 bg-primary/10 px-3 py-1 text-xs text-primary/90">
            {value}
          </li>
        ))}
      </ul>
    </Row>
  );
}

/** Only http(s) addresses become links, whatever is stored. */
function SafeLink({ url }: { url: string | null }) {
  if (!url) return null;

  if (!/^https?:\/\//i.test(url)) return <span className="text-sm">{url}</span>;

  return (
    <a
      href={url}
      target="_blank"
      rel="noreferrer noopener"
      className="inline-flex items-center gap-1.5 text-sm text-primary hover:underline"
    >
      {url} <ExternalLink className="h-3.5 w-3.5" />
    </a>
  );
}

function formatDateTime(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;

  return new Intl.DateTimeFormat("en", { dateStyle: "medium", timeStyle: "short" }).format(date);
}
