import { Head, Link, router } from "@inertiajs/react";
import { ArrowRight, CalendarDays, Clock, FileText, Pencil, Plus, Tag, Trash2 } from "lucide-react";
import { EmptyState, PageHeader, SiteShell } from "@/components/site/SiteShell";
import { StatusMessage } from "@/components/site/StatusMessage";
import { Button } from "@/components/ui/button";
import type { Article } from "@/types";

type Props = {
  articles: Article[];
};

export default function ArticlesIndex({ articles }: Props) {
  const destroy = (article: Article) => {
    if (!window.confirm(`Delete "${article.title}"?`)) return;

    router.delete(`/dashboard/articles/${article.id}`);
  };

  return (
    <SiteShell>
      <Head title="Manage Articles" />
      <PageHeader
        eyebrow="Portfolio content"
        title="Articles"
        description="Manage portfolio articles, publishing, ordering, reading time, and public detail pages."
      >
        <Button asChild>
          <Link href="/dashboard/articles/create">
            <Plus className="mr-2 h-4 w-4" /> Add article
          </Link>
        </Button>
      </PageHeader>

      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <StatusMessage />

        {articles.length === 0 ? (
          <div className="mt-6">
            <EmptyState
              icon={FileText}
              title="No articles yet"
              description="Add your first article and it can appear on the portfolio homepage and public article pages."
              action={
                <Button asChild>
                  <Link href="/dashboard/articles/create">
                    <Plus className="mr-2 h-4 w-4" /> Add article
                  </Link>
                </Button>
              }
            />
          </div>
        ) : (
          <div className="mt-6 grid gap-4">
            {articles.map((article) => (
              <article
                key={article.id}
                className="grid gap-5 rounded-2xl border border-border bg-card p-5 shadow-card lg:grid-cols-[11rem_minmax(0,1fr)_14rem]"
              >
                <div className="overflow-hidden rounded-xl border border-border bg-background/50">
                  {article.cover_url ? (
                    <img src={article.cover_url} alt="" className="aspect-video h-full w-full object-cover lg:aspect-square" />
                  ) : (
                    <div className="grid aspect-video h-full w-full place-items-center text-muted-foreground lg:aspect-square">
                      <FileText className="h-7 w-7" />
                    </div>
                  )}
                </div>

                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="font-display text-xl font-semibold">{article.title}</h2>
                    <span
                      className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                        article.is_published ? "bg-primary/15 text-primary" : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {article.is_published ? "Published" : "Draft"}
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-muted-foreground">{article.excerpt}</p>
                  <div className="mt-3 flex flex-wrap gap-2 text-xs text-muted-foreground">
                    {article.category && <span className="inline-flex items-center gap-1 rounded-md border border-border px-2 py-1"><Tag className="h-3.5 w-3.5" /> {article.category}</span>}
                    <span className="inline-flex items-center gap-1 rounded-md border border-border px-2 py-1"><Clock className="h-3.5 w-3.5" /> {article.reading_time} min read</span>
                    {article.published_at && <span className="inline-flex items-center gap-1 rounded-md border border-border px-2 py-1"><CalendarDays className="h-3.5 w-3.5" /> {formatArticleDate(article.published_at)}</span>}
                    <span className="rounded-md border border-border px-2 py-1">Order: {article.sort_order}</span>
                  </div>
                </div>

                <div className="flex flex-wrap items-center justify-start gap-2 lg:flex-col lg:items-stretch lg:justify-center">
                  {article.is_published && (
                    <Button asChild variant="outline">
                      <Link href={`/articles/${article.slug}`}>
                        View <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  )}
                  <Button asChild variant="ghost">
                    <Link href={`/dashboard/articles/${article.id}/edit`}>
                      <Pencil className="mr-2 h-4 w-4" /> Edit
                    </Link>
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                    onClick={() => destroy(article)}
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

function formatArticleDate(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;

  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date);
}
