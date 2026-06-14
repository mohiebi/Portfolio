import { Head, Link } from "@inertiajs/react";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Bot,
  Check,
  ExternalLink,
  Filter,
  Landmark,
  MapPin,
  Plus,
  Search,
  Star,
} from "lucide-react";
import type { ReactNode } from "react";
import { SiteShell } from "@/components/site/SiteShell";
import { Button } from "@/components/ui/button";
import { projects, type PortfolioProject } from "@/lib/projects";

const featuredCount = projects.filter((project) => project.featured).length;

export default function ProjectsIndex() {
  return (
    <SiteShell>
      <Head title="Projects">
        <meta
          name="description"
          content="Portfolio projects by MohammadHosein Ebrahimi, including TaskManager, CashPilot, AI Routine Coach, Mahdieh Design, Job Board, BookReview, and Real Estate."
        />
      </Head>

      <section className="relative overflow-hidden border-b border-border/60">
        <div className="absolute inset-0 bg-grid opacity-30 [mask-image:radial-gradient(ellipse_at_center,black,transparent_70%)]" />
        <motion.div
          aria-hidden
          className="absolute -right-16 -top-24 h-72 w-72 rounded-full bg-primary/15 blur-3xl"
          animate={{ scale: [1, 1.12, 1], opacity: [0.45, 0.7, 0.45] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        <div className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <motion.p initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="font-mono text-xs uppercase tracking-wider text-primary">
            // Projects
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="mt-2 max-w-4xl font-display text-4xl font-semibold tracking-tight sm:text-5xl lg:text-6xl"
          >
            Production-minded builds, <span className="text-primary">from tools to client sites</span>.
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mt-5 max-w-2xl text-lg text-muted-foreground"
          >
            The first four are the current highlights: TaskManager, CashPilot, AI Routine Coach, and Mahdieh Design. Older Laravel demos are still here for browsing.
          </motion.p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="space-y-8">
          {projects.map((project, index) => (
            <ProjectCard key={project.name} project={project} index={index} />
          ))}
        </div>

        <div className="mt-16 flex flex-wrap items-center justify-between gap-4 border-t border-border pt-8">
          <div>
            <h2 className="font-display text-2xl font-semibold">Want a similar build?</h2>
            <p className="mt-1 text-sm text-muted-foreground">I work best on practical backend-heavy products with clear business workflows.</p>
          </div>
          <Button asChild>
            <a href="/#contact">
              Get in touch
              <ArrowRight className="ml-2 h-4 w-4" />
            </a>
          </Button>
        </div>
      </section>
    </SiteShell>
  );
}

function ProjectCard({ project, index }: { project: PortfolioProject; index: number }) {
  const isFeatured = index < featuredCount;

  return (
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.5, delay: index * 0.04 }}
      className="group relative grid overflow-hidden rounded-3xl border border-border bg-card/75 shadow-card transition-colors hover:border-primary/60 lg:grid-cols-[0.92fr_1.08fr]"
    >
      <div className={`relative min-h-[320px] overflow-hidden bg-gradient-to-br ${project.accent}`}>
        <ProjectImage project={project} />
      </div>

      <div className="flex min-h-full flex-col p-6 sm:p-8 lg:p-10">
        <div className="mb-4 flex flex-wrap items-center gap-2">
          <span className="rounded-full border border-border bg-background/40 px-2.5 py-1 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
            0{index + 1}
          </span>
          {isFeatured && (
            <span className="rounded-full border border-primary/40 bg-primary/10 px-2.5 py-1 font-mono text-[10px] uppercase tracking-wider text-primary">
              Top project
            </span>
          )}
          <span className="rounded-full border border-border bg-background/40 px-2.5 py-1 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
            {project.tag}
          </span>
        </div>

        <h2 className="font-display text-3xl font-semibold tracking-tight sm:text-4xl">{project.name}</h2>
        <p className="mt-4 text-base font-medium leading-7 text-foreground/90">{project.outcome}</p>
        <p className="mt-3 text-sm leading-6 text-muted-foreground sm:text-base">{project.blurb}</p>

        <div className="mt-7 grid gap-5 md:grid-cols-[1fr_0.8fr]">
          <div>
            <h3 className="font-mono text-[11px] uppercase tracking-wider text-primary">Key details</h3>
            <ul className="mt-3 grid gap-2">
              {project.features.map((feature) => (
                <li key={feature} className="flex items-start gap-2 text-sm text-foreground/90">
                  <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full border border-primary/40 bg-primary/10">
                    <Check className="h-3 w-3 text-primary" />
                  </span>
                  {feature}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="font-mono text-[11px] uppercase tracking-wider text-primary">Stack and signal</h3>
            <div className="mt-3 flex flex-wrap gap-1.5">
              {project.tech.map((item) => (
                <span key={item} className="rounded-md border border-border bg-background/40 px-2 py-0.5 text-xs font-mono text-muted-foreground">
                  {item}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-auto flex flex-wrap items-center gap-3 pt-8">
          <Button asChild>
            <ProjectPrimaryLink project={project}>
              View project
              {project.external ? <ExternalLink className="ml-2 h-4 w-4" /> : <ArrowRight className="ml-2 h-4 w-4" />}
            </ProjectPrimaryLink>
          </Button>
        </div>
      </div>
    </motion.article>
  );
}

function ProjectImage({ project }: { project: PortfolioProject }) {
  return (
    <div className="absolute inset-0 p-5 sm:p-7">
      <div className="absolute inset-0 bg-grid opacity-30" />
      <div className="relative flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-background/85 shadow-2xl backdrop-blur">
        <div className="flex items-center justify-between border-b border-border px-4 py-3">
          <div className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-destructive/70" />
            <span className="h-2.5 w-2.5 rounded-full bg-warning/70" />
            <span className="h-2.5 w-2.5 rounded-full bg-success/70" />
          </div>
          <span className="max-w-[13rem] truncate font-mono text-[10px] text-muted-foreground">{project.href}</span>
        </div>
        <div className="min-h-0 flex-1 p-5">
          <ProjectVisualContent project={project} />
        </div>
      </div>
    </div>
  );
}

function ProjectVisualContent({ project }: { project: PortfolioProject }) {
  if (project.preview === "cash") {
    return (
      <div className="flex h-full flex-col gap-4">
        <div className="rounded-xl border border-border bg-card p-4">
          <div className="flex items-center justify-between">
            <span className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">Net balance</span>
            <Landmark className="h-4 w-4 text-primary" />
          </div>
          <p className="mt-2 font-display text-3xl font-semibold">$8,430</p>
          <div className="mt-4 flex h-20 items-end gap-2">
            {[42, 70, 58, 88, 64, 94, 76].map((height, index) => (
              <span key={index} className="flex-1 rounded-t-md bg-primary/70" style={{ height: `${height}%` }} />
            ))}
          </div>
        </div>
        <div className="grid gap-2 sm:grid-cols-3">
          {["+ $4,820 income", "- $1,240 bills", "$980 saved"].map((item) => (
            <span key={item} className="rounded-lg border border-border bg-background/60 px-3 py-2 font-mono text-[11px] text-muted-foreground">
              {item}
            </span>
          ))}
        </div>
      </div>
    );
  }

  if (project.preview === "routine") {
    return (
      <div className="flex h-full flex-col gap-4">
        <div className="rounded-xl border border-primary/30 bg-primary/10 p-4">
          <div className="flex items-center gap-2">
            <Bot className="h-5 w-5 text-primary" />
            <span className="font-mono text-[10px] uppercase tracking-wider text-primary">@AIRoutineCoachBot</span>
          </div>
          <p className="mt-3 text-sm leading-6 text-foreground/90">Today: protect a 90-minute focus block, then review the next habit loop.</p>
        </div>
        <div className="space-y-2">
          {["Morning focus", "Workout", "Deep work", "Evening review"].map((item, index) => (
            <div key={item} className="flex items-center gap-2 rounded-lg border border-border bg-card px-3 py-2">
              <span className={`h-2.5 w-2.5 rounded-full ${index < 2 ? "bg-primary" : "bg-muted"}`} />
              <span className="text-sm text-muted-foreground">{item}</span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (project.preview === "design") {
    return (
      <div className="grid h-full gap-4 sm:grid-cols-[1.1fr_0.9fr]">
        <div className="overflow-hidden rounded-xl border border-border bg-card">
          <div className="h-28 bg-gradient-to-br from-pink-300/60 via-rose-300/30 to-amber-200/50" />
          <div className="space-y-2 p-4">
            <div className="h-3 w-2/3 rounded bg-foreground/80" />
            <div className="h-2 w-full rounded bg-muted" />
            <div className="h-2 w-4/5 rounded bg-muted" />
          </div>
        </div>
        <div className="grid content-start gap-2">
          {["Brand", "Portfolio", "Contact", "Responsive"].map((item) => (
            <span key={item} className="rounded-lg border border-border bg-background/60 px-3 py-2 font-mono text-[11px] text-muted-foreground">
              {item}
            </span>
          ))}
        </div>
      </div>
    );
  }

  if (project.preview === "books") {
    return (
      <div className="flex h-full flex-col gap-4">
        <div className="flex items-center gap-2 rounded-lg border border-border bg-muted/40 px-3 py-2">
          <Search className="h-4 w-4 text-muted-foreground" />
          <span className="font-mono text-xs text-muted-foreground">search books...</span>
        </div>
        <div className="grid flex-1 grid-cols-3 gap-3">
          {[0, 1, 2].map((item) => (
            <div key={item} className="overflow-hidden rounded-xl border border-border bg-card">
              <div className="aspect-[3/4] bg-gradient-to-br from-amber-400/40 to-orange-500/20" />
              <div className="space-y-2 p-3">
                <div className="h-2 w-3/4 rounded bg-muted" />
                <div className="flex gap-0.5">
                  {[0, 1, 2, 3, 4].map((star) => (
                    <Star key={star} className={`h-3 w-3 ${star < 4 ? "fill-amber-400 text-amber-400" : "text-muted"}`} />
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (project.preview === "jobs") {
    return (
      <div className="flex h-full flex-col gap-4">
        <div className="flex flex-wrap gap-2">
          {["All", "Remote", "Senior"].map((item, index) => (
            <span key={item} className={`inline-flex items-center gap-1 rounded-full border px-3 py-1 font-mono text-[10px] ${index === 0 ? "border-primary/40 bg-primary/10 text-primary" : "border-border text-muted-foreground"}`}>
              {index === 0 && <Filter className="h-3 w-3" />}
              {item}
            </span>
          ))}
        </div>
        {["Senior Laravel Dev", "Vue Engineer", "NestJS Backend"].map((item) => (
          <div key={item} className="rounded-xl border border-border bg-card p-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">{item}</span>
              <span className="font-mono text-[10px] text-primary">Apply</span>
            </div>
            <p className="mt-1 text-xs text-muted-foreground">Remote | Product team | Full-time</p>
          </div>
        ))}
      </div>
    );
  }

  if (project.preview === "realestate") {
    return (
      <div className="flex h-full flex-col gap-4">
        <div className="grid grid-cols-3 gap-2">
          {["2+ beds", "Under $500k", "Austin"].map((item) => (
            <span key={item} className="rounded-full border border-border px-3 py-1 text-center font-mono text-[10px] text-muted-foreground">
              {item}
            </span>
          ))}
        </div>
        {["$480,000", "$320,000", "$650,000"].map((price, index) => (
          <div key={price} className="rounded-xl border border-border bg-card p-4">
            <div className="flex items-center justify-between">
              <span className="font-display text-lg font-semibold">{price}</span>
              <MapPin className="h-4 w-4 text-primary" />
            </div>
            <p className="mt-1 text-xs text-muted-foreground">{index + 2} bd | {index + 1} ba | Listed property</p>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col gap-4">
      <div className="flex items-center justify-between">
        <span className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground">My tasks</span>
        <span className="inline-flex items-center gap-1 rounded bg-primary/15 px-2 py-1 text-[10px] font-mono text-primary">
          <Plus className="h-3 w-3" /> New
        </span>
      </div>
      {["Ship landing page", "Review PR #248", "Plan sprint demo", "Refactor auth guard"].map((item, index) => (
        <div key={item} className="flex items-center gap-3 rounded-xl border border-border bg-card px-4 py-3">
          <span className={`grid h-5 w-5 place-items-center rounded border ${index % 3 === 0 ? "border-emerald-500 bg-emerald-500/20" : "border-border"}`}>
            {index % 3 === 0 && <Check className="h-3 w-3 text-emerald-500" />}
          </span>
          <span className={`text-sm ${index % 3 === 0 ? "text-muted-foreground line-through" : ""}`}>{item}</span>
        </div>
      ))}
    </div>
  );
}

function ProjectPrimaryLink({ project, children }: { project: PortfolioProject; children: ReactNode }) {
  if (project.external) {
    return (
      <a href={project.href} target="_blank" rel="noreferrer">
        {children}
      </a>
    );
  }

  return <Link href={project.href}>{children}</Link>;
}
