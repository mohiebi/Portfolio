import { Head, Link } from "@inertiajs/react";
import { motion } from "framer-motion";
import { ArrowRight, CalendarDays, Clock, FileText, Tag } from "lucide-react";
import { SiteShell } from "@/components/site/SiteShell";
import { Button } from "@/components/ui/button";
import type { Article } from "@/types";

type Props = {
  articles: Article[];
};

export default function PublicArticlesIndex({ articles }: Props) {
  return (
    <SiteShell>
      <Head title="Articles" />

      <section className="relative overflow-hidden border-b border-border/60">
        <div className="absolute inset-0 bg-grid opacity-30 [mask-image:radial-gradient(ellipse_at_center,black,transparent_70%)]" />
        <div className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <motion.p initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="font-mono text-xs uppercase tracking-wider text-primary">
            // Articles
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="mt-2 font-display text-4xl font-semibold tracking-tight sm:text-5xl lg:text-6xl"
          >
            Notes from the <span className="text-primary">engineering desk</span>.
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mt-5 max-w-2xl text-lg text-muted-foreground"
          >
            Practical writing about backend systems, Laravel, architecture, production debugging, and full-stack delivery.
          </motion.p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        {articles.length === 0 ? (
          <div className="rounded-2xl border border-border bg-card/70 p-10 text-center">
            <FileText className="mx-auto h-8 w-8 text-primary" />
            <h2 className="mt-4 font-display text-2xl font-semibold">Articles are coming soon</h2>
            <p className="mt-2 text-sm text-muted-foreground">New technical notes will show up here once they are published.</p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {articles.map((article, index) => (
              <ArticleCard key={article.id} article={article} index={index} />
            ))}
          </div>
        )}

        <div className="mt-16 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-border bg-card/60 p-6">
          <div>
            <h3 className="font-display text-xl">Want to talk through one of these ideas?</h3>
            <p className="mt-1 text-sm text-muted-foreground">I am happy to discuss architecture, trade-offs, and implementation details.</p>
          </div>
          <Button asChild>
            <a href="/#contact">Get in touch <ArrowRight className="ml-2 h-4 w-4" /></a>
          </Button>
        </div>
      </section>
    </SiteShell>
  );
}

function ArticleCard({ article, index }: { article: Article; index: number }) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.5, delay: index * 0.05 }}
      className="group flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-card/75 shadow-card transition-colors hover:border-primary/60"
    >
      <div className="relative overflow-hidden border-b border-border bg-surface/40">
        {article.cover_url ? (
          <img src={article.cover_url} alt="" className="aspect-video w-full object-cover transition-transform duration-500 group-hover:scale-105" />
        ) : (
          <div className="aspect-video bg-grid" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-background/85 via-background/10 to-transparent" aria-hidden />
        <div className="absolute bottom-4 left-4 right-4 flex flex-wrap items-center gap-3 text-xs text-foreground">
          {article.category && <span className="inline-flex items-center gap-1 rounded-full bg-background/75 px-2 py-1 font-mono uppercase tracking-wider text-primary backdrop-blur"><Tag className="h-3.5 w-3.5" /> {article.category}</span>}
          <span className="inline-flex items-center gap-1 rounded-full bg-background/75 px-2 py-1 backdrop-blur"><Clock className="h-3.5 w-3.5" /> {article.reading_time} min</span>
        </div>
      </div>
      <div className="flex flex-1 flex-col p-6">
        <h2 className="font-display text-2xl font-semibold leading-tight">{article.title}</h2>
        <p className="mt-3 text-sm leading-6 text-muted-foreground">{article.excerpt}</p>
        <div className="mt-5 flex items-center gap-1.5 text-xs text-muted-foreground">
          <CalendarDays className="h-3.5 w-3.5 text-primary" />
          {article.published_at ? formatArticleDate(article.published_at) : "Published note"}
        </div>
        <div className="mt-auto pt-7">
          <Button asChild variant="outline" className="group/btn">
            <Link href={`/articles/${article.slug}`}>
              Read article
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover/btn:translate-x-1" />
            </Link>
          </Button>
        </div>
      </div>
    </motion.article>
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
