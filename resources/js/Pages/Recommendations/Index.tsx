import { Head, Link, router } from "@inertiajs/react";
import { ExternalLink, Linkedin, MessageSquareQuote, Pencil, Plus, Trash2 } from "lucide-react";
import { EmptyState, PageHeader, SiteShell } from "@/components/site/SiteShell";
import { StatusMessage } from "@/components/site/StatusMessage";
import { Button } from "@/components/ui/button";
import type { Recommendation } from "@/types";

type Props = {
  recommendations: Recommendation[];
};

export default function RecommendationsIndex({ recommendations }: Props) {
  const destroy = (recommendation: Recommendation) => {
    if (! window.confirm(`Delete ${recommendation.name}'s recommendation?`)) return;

    router.delete(`/dashboard/recommendations/${recommendation.id}`);
  };

  return (
    <SiteShell>
      <Head title="Manage Recommendations" />
      <PageHeader
        eyebrow="Portfolio content"
        title="Recommendations"
        description="Manage real LinkedIn recommendations, recommender profiles, images, and the projects behind them."
      >
        <Button asChild>
          <Link href="/dashboard/recommendations/create">
            <Plus className="mr-2 h-4 w-4" /> Add recommendation
          </Link>
        </Button>
      </PageHeader>

      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <StatusMessage />

        {recommendations.length === 0 ? (
          <div className="mt-6">
            <EmptyState
              icon={MessageSquareQuote}
              title="No recommendations yet"
              description="Add your first LinkedIn recommendation and it will appear on your public portfolio."
              action={
                <Button asChild>
                  <Link href="/dashboard/recommendations/create">
                    <Plus className="mr-2 h-4 w-4" /> Add recommendation
                  </Link>
                </Button>
              }
            />
          </div>
        ) : (
          <div className="mt-6 grid gap-4">
            {recommendations.map((recommendation) => (
              <article
                key={recommendation.id}
                className="grid gap-5 rounded-2xl border border-border bg-card p-5 shadow-card lg:grid-cols-[minmax(0,1fr)_13rem]"
              >
                <div className="flex min-w-0 gap-4">
                  <Avatar recommendation={recommendation} />
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <h2 className="font-display text-xl font-semibold">{recommendation.name}</h2>
                      <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                        recommendation.is_published
                          ? "bg-primary/15 text-primary"
                          : "bg-muted text-muted-foreground"
                      }`}
                      >
                        {recommendation.is_published ? "Published" : "Draft"}
                      </span>
                    </div>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {[recommendation.role, recommendation.company].filter(Boolean).join(" at ")}
                    </p>
                    <div className="mt-2 flex flex-wrap gap-2 text-xs text-muted-foreground">
                      {recommendation.project && <span className="rounded-md border border-border px-2 py-1">Project: {recommendation.project}</span>}
                      {recommendation.relationship && <span className="rounded-md border border-border px-2 py-1">{recommendation.relationship}</span>}
                      {recommendation.recommended_at && <span className="rounded-md border border-border px-2 py-1">{formatDate(recommendation.recommended_at)}</span>}
                      <span className="rounded-md border border-border px-2 py-1">Order: {recommendation.sort_order}</span>
                    </div>
                    <p className="mt-4 line-clamp-3 text-sm leading-6 text-foreground/90">{recommendation.body}</p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center justify-start gap-2 lg:flex-col lg:items-stretch lg:justify-center">
                  {recommendation.linkedin_url && (
                    <Button asChild variant="outline">
                      <a href={recommendation.linkedin_url} target="_blank" rel="noreferrer">
                        <Linkedin className="mr-2 h-4 w-4" /> LinkedIn
                        <ExternalLink className="ml-2 h-3.5 w-3.5" />
                      </a>
                    </Button>
                  )}
                  <Button asChild variant="ghost">
                    <Link href={`/dashboard/recommendations/${recommendation.id}/edit`}>
                      <Pencil className="mr-2 h-4 w-4" /> Edit
                    </Link>
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                    onClick={() => destroy(recommendation)}
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

function Avatar({ recommendation }: { recommendation: Recommendation }) {
  if (recommendation.image_url) {
    return (
      <img
        src={recommendation.image_url}
        alt={`${recommendation.name} profile`}
        className="h-16 w-16 shrink-0 rounded-full border border-border object-cover"
      />
    );
  }

  return (
    <div className="grid h-16 w-16 shrink-0 place-items-center rounded-full border border-border bg-primary/10 text-lg font-semibold text-primary">
      {getInitials(recommendation.name)}
    </div>
  );
}

function getInitials(name: string) {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
}

function formatDate(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;

  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date);
}
