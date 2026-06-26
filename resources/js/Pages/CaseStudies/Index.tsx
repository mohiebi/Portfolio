import { Head, Link, router } from "@inertiajs/react";
import { ArrowRight, Briefcase, Calendar, FileText, MapPin, Pencil, Plus, Trash2 } from "lucide-react";
import { EmptyState, PageHeader, SiteShell } from "@/components/site/SiteShell";
import { StatusMessage } from "@/components/site/StatusMessage";
import { Button } from "@/components/ui/button";
import type { CaseStudy } from "@/types";

type Props = {
  caseStudies: CaseStudy[];
};

export default function CaseStudiesIndex({ caseStudies }: Props) {
  const destroy = (caseStudy: CaseStudy) => {
    if (! window.confirm(`Delete "${caseStudy.title}"?`)) return;

    router.delete(`/dashboard/case-studies/${caseStudy.id}`);
  };

  return (
    <SiteShell>
      <Head title="Manage Case Studies" />
      <PageHeader
        eyebrow="Portfolio content"
        title="Case Studies"
        description="Manage portfolio case studies, public visibility, ordering, stack notes, impact metrics, and long-form detail pages."
      >
        <Button asChild>
          <Link href="/dashboard/case-studies/create">
            <Plus className="mr-2 h-4 w-4" /> Add case study
          </Link>
        </Button>
      </PageHeader>

      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <StatusMessage />

        {caseStudies.length === 0 ? (
          <div className="mt-6">
            <EmptyState
              icon={FileText}
              title="No case studies yet"
              description="Add your first case study and it can appear on the portfolio and public case-study pages."
              action={
                <Button asChild>
                  <Link href="/dashboard/case-studies/create">
                    <Plus className="mr-2 h-4 w-4" /> Add case study
                  </Link>
                </Button>
              }
            />
          </div>
        ) : (
          <div className="mt-6 grid gap-4">
            {caseStudies.map((caseStudy) => (
              <article
                key={caseStudy.id}
                className="grid gap-5 rounded-2xl border border-border bg-card p-5 shadow-card lg:grid-cols-[minmax(0,1fr)_14rem]"
              >
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="font-display text-xl font-semibold">{caseStudy.title}</h2>
                    <span
                      className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                        caseStudy.is_published ? "bg-primary/15 text-primary" : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {caseStudy.is_published ? "Published" : "Draft"}
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-muted-foreground">{caseStudy.summary}</p>
                  <div className="mt-3 flex flex-wrap gap-2 text-xs text-muted-foreground">
                    {caseStudy.company && <span className="inline-flex items-center gap-1 rounded-md border border-border px-2 py-1"><Briefcase className="h-3.5 w-3.5" /> {caseStudy.company}</span>}
                    {caseStudy.period && <span className="inline-flex items-center gap-1 rounded-md border border-border px-2 py-1"><Calendar className="h-3.5 w-3.5" /> {caseStudy.period}</span>}
                    {caseStudy.location && <span className="inline-flex items-center gap-1 rounded-md border border-border px-2 py-1"><MapPin className="h-3.5 w-3.5" /> {caseStudy.location}</span>}
                    <span className="rounded-md border border-border px-2 py-1">Order: {caseStudy.sort_order}</span>
                  </div>
                  <div className="mt-4 flex flex-wrap gap-1.5">
                    {(caseStudy.stack ?? []).slice(0, 8).map((item) => (
                      <span key={item} className="rounded-md border border-border bg-background/40 px-2 py-0.5 text-xs font-mono text-muted-foreground">
                        {item}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex flex-wrap items-center justify-start gap-2 lg:flex-col lg:items-stretch lg:justify-center">
                  {caseStudy.is_published && (
                    <Button asChild variant="outline">
                      <Link href={`/case-studies/${caseStudy.slug}`}>
                        View <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  )}
                  <Button asChild variant="ghost">
                    <Link href={`/dashboard/case-studies/${caseStudy.id}/edit`}>
                      <Pencil className="mr-2 h-4 w-4" /> Edit
                    </Link>
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                    onClick={() => destroy(caseStudy)}
                  >
                    <Trash2 className="mr-2 h-4 w-4" /> Delete
                  </Button>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </SiteShell>
  );
}
