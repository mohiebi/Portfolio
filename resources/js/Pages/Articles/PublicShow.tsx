import { Head, Link } from "@inertiajs/react";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight, CalendarDays, Clock, Tag } from "lucide-react";
import { useEffect, useState } from "react";
import { SiteShell } from "@/components/site/SiteShell";
import { Button } from "@/components/ui/button";
import type { Article } from "@/types";

type Props = {
  article: Article;
  nextArticle?: Article | null;
};

export default function PublicArticleShow({ article, nextArticle }: Props) {
  const [readingProgress, setReadingProgress] = useState(0);

  useEffect(() => {
    const update = () => {
      const total = document.documentElement.scrollHeight - window.innerHeight;
      setReadingProgress(total > 0 ? Math.min(100, (window.scrollY / total) * 100) : 0);
    };
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, []);

  // Parse body into sections — headings (# / ##) and paragraphs
  const blocks = parseBody(article.body);

  return (
    <SiteShell>
      <Head title={`${article.title} - Article`} />

      {/* Reading progress */}
      <div className="fixed left-0 top-0 z-50 h-0.5 w-full bg-border/30">
        <div className="h-full bg-primary transition-[width] duration-75" style={{ width: `${readingProgress}%` }} />
      </div>

      {/* ── Hero ──────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden border-b border-border/60 bg-surface/30">
        <div className="absolute inset-0 bg-grid opacity-20 [mask-image:radial-gradient(ellipse_at_center,black,transparent_70%)]" />
        <motion.div
          aria-hidden
          className="absolute -right-20 -top-32 h-80 w-80 rounded-full bg-primary/15 blur-3xl"
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          aria-hidden
          className="absolute -left-20 bottom-0 h-64 w-64 rounded-full bg-primary/8 blur-3xl"
          animate={{ scale: [1, 1.15, 1], opacity: [0.4, 0.7, 0.4] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        />

        <div className="relative mx-auto max-w-4xl px-4 py-20 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.4 }}>
            <Link
              href="/articles"
              className="inline-flex items-center gap-1.5 font-mono text-xs uppercase tracking-wider text-muted-foreground transition-colors hover:text-primary"
            >
              <ArrowLeft className="h-3.5 w-3.5" /> All articles
            </Link>
          </motion.div>

          {/* Badges */}
          <div className="mt-7 flex flex-wrap items-center gap-2.5">
            {article.category && (
              <motion.span
                initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.1 }}
                className="inline-flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 font-mono text-xs uppercase tracking-wider text-primary"
              >
                <Tag className="h-3 w-3" /> {article.category}
              </motion.span>
            )}
            <motion.span
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }}
              className="inline-flex items-center gap-1.5 rounded-full border border-border bg-background/60 px-3 py-1 font-mono text-xs text-muted-foreground"
            >
              <Clock className="h-3 w-3 text-primary" /> {article.reading_time} min read
            </motion.span>
            {article.published_at && (
              <motion.span
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
                className="inline-flex items-center gap-1.5 rounded-full border border-border bg-background/60 px-3 py-1 font-mono text-xs text-muted-foreground"
              >
                <CalendarDays className="h-3 w-3 text-primary" /> {formatDate(article.published_at)}
              </motion.span>
            )}
          </div>

          {/* Title */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mt-5 font-display text-4xl font-semibold leading-tight tracking-tight sm:text-5xl lg:text-[3.5rem]"
          >
            {article.title}
          </motion.h1>

          {/* Excerpt / lead */}
          <motion.p
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-6 max-w-3xl border-l-2 border-primary/50 pl-5 text-lg leading-relaxed text-muted-foreground"
          >
            {article.excerpt}
          </motion.p>
        </div>
      </section>

      {/* ── Cover image ───────────────────────────────────────────────── */}
      {article.cover_url && (
        <motion.section
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6, delay: 0.3 }}
          className="border-b border-border/60"
        >
          <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
            <img
              src={article.cover_url}
              alt={article.title}
              className="w-full rounded-2xl border border-border object-cover shadow-card aspect-video"
            />
          </div>
        </motion.section>
      )}

      {/* ── Body + sidebar ────────────────────────────────────────────── */}
      <section className="mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="lg:grid lg:grid-cols-[1fr_220px] lg:gap-14">

          {/* Article content */}
          <article className="min-w-0">
            {blocks.map((block, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.45, delay: i < 6 ? i * 0.04 : 0 }}
              >
                {block.type === "h1" && (
                  <h2 className="mt-12 mb-4 font-display text-3xl font-semibold tracking-tight first:mt-0">
                    {block.text}
                  </h2>
                )}
                {block.type === "h2" && (
                  <h3 className="mt-10 mb-3 font-display text-xl font-semibold tracking-tight text-foreground/90 first:mt-0">
                    {block.text}
                  </h3>
                )}
                {block.type === "paragraph" && (
                  <p className={`mb-6 whitespace-pre-line leading-8 text-foreground/85 ${i === 0 ? "text-lg" : "text-base"}`}>
                    {block.text}
                  </p>
                )}
                {block.type === "divider" && (
                  <div className="my-10 flex items-center gap-3">
                    <div className="h-px flex-1 bg-border/60" />
                    <span className="h-1.5 w-1.5 rounded-full bg-primary/50" />
                    <span className="h-1 w-1 rounded-full bg-primary/30" />
                    <span className="h-1.5 w-1.5 rounded-full bg-primary/50" />
                    <div className="h-px flex-1 bg-border/60" />
                  </div>
                )}
              </motion.div>
            ))}

            {/* End marker */}
            <div className="mt-12 flex items-center gap-3">
              <div className="h-px flex-1 bg-border/60" />
              <div className="flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-primary/60" />
                <span className="h-1 w-1 rounded-full bg-primary/30" />
                <span className="h-1.5 w-1.5 rounded-full bg-primary/60" />
              </div>
              <div className="h-px flex-1 bg-border/60" />
            </div>
          </article>

          {/* Sticky sidebar */}
          <aside className="mt-12 space-y-5 lg:mt-0 lg:sticky lg:top-24 lg:self-start">
            {/* Meta card */}
            <div className="rounded-2xl border border-border bg-card/70 p-5">
              <h4 className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground">About this article</h4>
              <div className="mt-4 space-y-3 text-sm">
                {article.category && (
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Tag className="h-3.5 w-3.5 shrink-0 text-primary" />
                    <span className="capitalize">{article.category}</span>
                  </div>
                )}
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Clock className="h-3.5 w-3.5 shrink-0 text-primary" />
                  <span>{article.reading_time} min read</span>
                </div>
                {article.published_at && (
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <CalendarDays className="h-3.5 w-3.5 shrink-0 text-primary" />
                    <span>{formatDate(article.published_at)}</span>
                  </div>
                )}
              </div>
            </div>

            {/* CTA card */}
            <div className="rounded-2xl border border-border bg-card/70 p-5">
              <h4 className="font-display text-base font-semibold">Have a project in mind?</h4>
              <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                I can help shape the architecture and ship the implementation.
              </p>
              <Button asChild size="sm" className="mt-4 w-full">
                <a href="/#contact">Get in touch <ArrowRight className="ml-2 h-3.5 w-3.5" /></a>
              </Button>
            </div>

            {/* Back link */}
            <Link
              href="/articles"
              className="flex items-center gap-1.5 font-mono text-xs uppercase tracking-wider text-muted-foreground transition-colors hover:text-primary"
            >
              <ArrowLeft className="h-3.5 w-3.5" /> All articles
            </Link>
          </aside>
        </div>
      </section>

      {/* ── Next article ──────────────────────────────────────────────── */}
      {nextArticle && (
        <section className="border-t border-border/60">
          <div className="mx-auto max-w-5xl px-4 py-14 sm:px-6 lg:px-8">
            <p className="font-mono text-xs uppercase tracking-wider text-muted-foreground">// Up next</p>
            <Link
              href={`/articles/${nextArticle.slug}`}
              className="group mt-4 flex overflow-hidden rounded-2xl border border-border bg-card/70 transition-colors hover:border-primary/60"
            >
              {nextArticle.cover_url && (
                <div className="relative hidden w-44 shrink-0 overflow-hidden sm:block">
                  <img
                    src={nextArticle.cover_url}
                    alt=""
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent to-card/20" />
                </div>
              )}
              <div className="flex flex-1 flex-col justify-center gap-2 p-6 sm:p-7">
                {nextArticle.category && (
                  <p className="font-mono text-[11px] uppercase tracking-wider text-primary">{nextArticle.category}</p>
                )}
                <h3 className="font-display text-xl font-semibold transition-colors group-hover:text-primary sm:text-2xl">
                  {nextArticle.title}
                </h3>
                {nextArticle.excerpt && (
                  <p className="line-clamp-2 text-sm text-muted-foreground">{nextArticle.excerpt}</p>
                )}
                <div className="mt-1 inline-flex items-center gap-1.5 text-sm text-primary">
                  Read article <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </div>
              </div>
            </Link>
          </div>
        </section>
      )}

      {/* ── Bottom CTA ────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden border-t border-border/60 bg-surface/40">
        <div className="absolute inset-0 bg-grid opacity-20 [mask-image:radial-gradient(ellipse_at_center,black,transparent_70%)]" />
        <motion.div
          aria-hidden
          className="absolute left-1/2 top-0 h-72 w-72 -translate-x-1/2 rounded-full bg-primary/15 blur-3xl"
          animate={{ scale: [1, 1.15, 1] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        />
        <div className="relative mx-auto max-w-4xl px-4 py-20 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.6 }}
            className="text-center"
          >
            <p className="font-mono text-xs uppercase tracking-wider text-primary">// Work together</p>
            <h3 className="mt-3 font-display text-3xl font-semibold sm:text-4xl">Have a related project?</h3>
            <p className="mt-4 text-muted-foreground">I can help shape the architecture and ship the implementation.</p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Button asChild size="lg">
                <a href="/#contact">Get in touch <ArrowRight className="ml-2 h-4 w-4" /></a>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link href="/services">View services <ArrowRight className="ml-2 h-4 w-4" /></Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </SiteShell>
  );
}

// ── Helpers ────────────────────────────────────────────────────────────────

type Block =
  | { type: "h1"; text: string }
  | { type: "h2"; text: string }
  | { type: "paragraph"; text: string }
  | { type: "divider"; text: "" };

function parseBody(body: string): Block[] {
  const lines = body.split(/\n/);
  const blocks: Block[] = [];
  let buffer: string[] = [];

  const flush = () => {
    const text = buffer.join("\n").trim();
    if (text) blocks.push({ type: "paragraph", text });
    buffer = [];
  };

  for (const line of lines) {
    if (line.startsWith("## ")) {
      flush();
      blocks.push({ type: "h2", text: line.slice(3).trim() });
    } else if (line.startsWith("# ")) {
      flush();
      blocks.push({ type: "h1", text: line.slice(2).trim() });
    } else if (line.trim() === "---") {
      flush();
      blocks.push({ type: "divider", text: "" });
    } else if (line.trim() === "" && buffer.length > 0) {
      flush();
    } else {
      buffer.push(line);
    }
  }
  flush();
  return blocks;
}

function formatDate(value: string): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat("en", { month: "short", day: "numeric", year: "numeric" }).format(date);
}
