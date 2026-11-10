import { Head, Link, router } from "@inertiajs/react";
import { ClipboardList, Eye, ExternalLink, Trash2 } from "lucide-react";
import { EmptyState, PageHeader, SiteShell } from "@/components/site/SiteShell";
import { PaginationNav } from "@/components/site/PaginationNav";
import { StatusMessage } from "@/components/site/StatusMessage";
import { Button } from "@/components/ui/button";
import { localeNames, optionLabel } from "@/lib/brief";
import type { PaginatedData, ProjectBriefSummary } from "@/types";

type Props = {
  briefs: PaginatedData<ProjectBriefSummary>;
  unreviewedCount: number;
};

export default function BriefIndex({ briefs, unreviewedCount }: Props) {
  const destroy = (brief: ProjectBriefSummary) => {
    if (!window.confirm(`Delete the brief from ${brief.name}? Uploaded files are deleted too and this cannot be undone.`)) return;

    router.delete(route("dashboard.briefs.destroy", { projectBrief: brief.id }), { preserveScroll: true });
  };

  return (
    <SiteShell>
      <Head title="Project Briefs" />
      <PageHeader
        eyebrow="Client intake"
        title="Project briefs"
        description={
          unreviewedCount > 0
            ? `${unreviewedCount} ${unreviewedCount === 1 ? "brief is" : "briefs are"} waiting for your review.`
            : "Everything submitted through the public brief form lands here."
        }
      >
        <Button asChild variant="outline">
          <Link href={route("brief.create")}>
            <ExternalLink className="mr-2 h-4 w-4" /> View public form
          </Link>
        </Button>
      </PageHeader>

      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <StatusMessage />

        {briefs.data.length === 0 ? (
          <div className="mt-6">
            <EmptyState
              icon={ClipboardList}
              title="No briefs yet"
              description="When a visitor sends the project brief, it appears here and you get a notification."
            />
          </div>
        ) : (
          <div className="mt-6 grid gap-4">
            {briefs.data.map((brief) => (
              <article
                key={brief.id}
                className="grid gap-4 rounded-2xl border border-border bg-card p-5 shadow-card lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center"
              >
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="font-display text-xl font-semibold">{brief.name}</h2>
                    <span
                      className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                        brief.reviewed_at ? "bg-muted text-muted-foreground" : "bg-primary/15 text-primary"
                      }`}
                    >
                      {brief.reviewed_at ? "Reviewed" : "New"}
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {[brief.company, brief.email].filter(Boolean).join(" · ")}
                  </p>
                  <div className="mt-3 flex flex-wrap gap-2 text-xs text-muted-foreground">
                    <span className="rounded-md border border-border px-2 py-1">
                      {optionLabel("projectTypes", brief.project_type)}
                    </span>
                    <span className="rounded-md border border-border px-2 py-1">
                      Budget: {optionLabel("budgets", brief.budget)}
                    </span>
                    <span className="rounded-md border border-border px-2 py-1">
                      Timeline: {optionLabel("timelines", brief.timeline)}
                    </span>
                    <span className="rounded-md border border-border px-2 py-1">
                      {localeNames[brief.locale] ?? brief.locale}
                    </span>
                    <span className="rounded-md border border-border px-2 py-1">{formatDate(brief.created_at)}</span>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <Button asChild>
                    <Link href={route("dashboard.briefs.show", { projectBrief: brief.id })}>
                      <Eye className="mr-2 h-4 w-4" /> View brief
                    </Link>
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                    onClick={() => destroy(brief)}
                  >
                    <Trash2 className="mr-2 h-4 w-4" /> Delete
                  </Button>
                </div>
              </article>
            ))}
          </div>
        )}

        <PaginationNav links={briefs.links} />
      </section>
    </SiteShell>
  );
}

function formatDate(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;

  return new Intl.DateTimeFormat("en", { month: "short", day: "numeric", year: "numeric" }).format(date);
}
