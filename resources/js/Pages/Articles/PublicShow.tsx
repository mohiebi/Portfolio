import { Head, Link } from "@inertiajs/react";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight, CalendarDays, Clock, Tag } from "lucide-react";
import { SiteShell } from "@/components/site/SiteShell";
import { Button } from "@/components/ui/button";
import type { Article } from "@/types";

type Props = {
  article: Article;
  nextArticle?: Article | null;
};

export default function PublicArticleShow({ article, nextArticle }: Props) {
  const paragraphs = article.body
    .split(/\n{2,}/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);

  return (
    <SiteShell>
      <Head title={`${article.title} - Article`} />

      <section className="relative overflow-hidden border-b border-border/60 bg-surface/30">
        <div className="absolute inset-0 bg-grid opacity-30 [mask-image:radial-gradient(ellipse_at_center,black,transparent_70%)]" />
        <motion.div
          aria-hidden
          className="absolute -right-20 -top-32 h-80 w-80 rounded-full bg-primary/15 blur-3xl"
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        <div className="relative mx-auto max-w-4xl px-4 py-20 sm:px-6 lg:px-8">
          <Link href="/articles" className="inline-flex items-center gap-1.5 font-mono text-xs uppercase tracking-wider text-muted-foreground transition-colors hover:text-primary">
            <ArrowLeft className="h-3.5 w-3.5" /> All articles
          </Link>
          <div className="mt-6 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
            {article.category && <span className="inline-flex items-center gap-1 font-mono uppercase tracking-wider text-primary"><Tag className="h-3.5 w-3.5" /> {article.category}</span>}
            <span className="inline-flex items-center gap-1"><Clock className="h-3.5 w-3.5 text-primary" /> {article.reading_time} min read</span>
            {article.published_at && <span className="inline-flex items-center gap-1"><CalendarDays className="h-3.5 w-3.5 text-primary" /> {formatArticleDate(article.published_at)}</span>}
          </div>
          <h1 className="mt-3 font-display text-4xl font-semibold leading-tight sm:text-5xl lg:text-6xl">
            {article.title}
          </h1>
          <p className="mt-5 max-w-3xl text-lg text-muted-foreground">{article.excerpt}</p>
        </div>
      </section>

      {article.cover_url && (
        <section className="border-b border-border/60">
          <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
            <img
              src={article.cover_url}
              alt=""
              className="aspect-[16/7] w-full rounded-2xl border border-border object-cover shadow-card"
            />
          </div>
        </section>
      )}

      <section className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
        <article className="space-y-6">
          {paragraphs.map((paragraph, index) => (
            <p key={index} className="whitespace-pre-line text-base leading-8 text-foreground/90">
              {paragraph}
            </p>
          ))}
        </article>
      </section>

      {nextArticle && (
        <section className="border-t border-border/60">
          <div className="mx-auto max-w-4xl px-4 py-14 sm:px-6 lg:px-8">
            <p className="font-mono text-xs uppercase tracking-wider text-muted-foreground">Next article</p>
            <Link
              href={`/articles/${nextArticle.slug}`}
              className="group mt-3 flex items-center justify-between gap-6 rounded-2xl border border-border bg-card/70 p-6 transition-colors hover:border-primary/60"
            >
              <div>
                {nextArticle.category && <p className="font-mono text-[11px] uppercase tracking-wider text-primary">{nextArticle.category}</p>}
                <h3 className="mt-1 font-display text-2xl font-semibold">{nextArticle.title}</h3>
              </div>
              <ArrowRight className="h-6 w-6 shrink-0 text-primary transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </section>
      )}

      <section className="border-t border-border/60">
        <div className="mx-auto flex max-w-4xl flex-wrap items-center justify-between gap-4 px-4 py-12 sm:px-6 lg:px-8">
          <div>
            <h3 className="font-display text-xl">Have a related project?</h3>
            <p className="mt-1 text-sm text-muted-foreground">I can help shape the architecture and ship the implementation.</p>
          </div>
          <Button asChild>
            <a href="/#contact">Get in touch <ArrowRight className="ml-2 h-4 w-4" /></a>
          </Button>
        </div>
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
