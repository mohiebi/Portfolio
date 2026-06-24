import { Head, Link } from "@inertiajs/react";
import { motion } from "framer-motion";
import {
  ArrowRight,
  BarChart3,
  Bot,
  BriefcaseBusiness,
  CalendarClock,
  Check,
  CheckCircle2,
  CircleDollarSign,
  CircleDot,
  ExternalLink,
  FileText,
  Home,
  Landmark,
  LayoutDashboard,
  MapPin,
  Search,
  Sparkles,
  Star,
} from "lucide-react";
import type { ComponentType, ReactNode } from "react";
import { SiteShell } from "@/components/site/SiteShell";
import { Button } from "@/components/ui/button";
import { getProjects, type PortfolioProject } from "@/lib/projects";
import { useI18n } from "@/i18n";

export default function ProjectsIndex() {
  const { locale } = useI18n();
  const projects = getProjects(locale);
  const featuredCount = projects.filter((project) => project.featured).length;
  return (
    <SiteShell>
      <Head title="Projects">
        <meta
          name="description"
          content="Portfolio projects by Mohi, including TaskManager, CashPilot, AI Routine Coach, Mahdieh Design, Job Board, BookReview, and Real Estate."
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
            <ProjectCard key={project.name} project={project} index={index} featuredCount={featuredCount} />
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

function ProjectCard({ project, index, featuredCount }: { project: PortfolioProject; index: number; featuredCount: number }) {
  const isFeatured = index < featuredCount;
  const theme = projectTheme[project.preview];
  const Icon = theme.icon;

  return (
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.5, delay: index * 0.04 }}
      className={`group/card relative grid overflow-hidden rounded-[1.75rem] border bg-[#071222]/95 shadow-[0_30px_90px_-48px_rgba(0,0,0,0.9)] transition-colors lg:min-h-[540px] lg:grid-cols-[0.42fr_0.58fr] ${theme.border} ${theme.glow}`}
    >
      <div className={`pointer-events-none absolute inset-0 opacity-70 ${theme.backdrop}`} />
      <div className="pointer-events-none absolute inset-0 bg-grid opacity-[0.08]" />
      <div className="relative flex flex-col p-6 sm:p-8 lg:p-10">
        <div className="flex flex-wrap items-center gap-3">
          <span className={`grid h-16 w-16 place-items-center rounded-2xl border bg-background/50 shadow-card ${theme.border} ${theme.accentText}`}>
            <Icon className="h-8 w-8" />
          </span>
          <div className="flex min-w-0 flex-col gap-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-full border border-white/10 bg-white/[0.04] px-2.5 py-1 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                0{index + 1}
              </span>
              {isFeatured && (
                <span className={`rounded-full border px-2.5 py-1 font-mono text-[10px] uppercase tracking-wider ${theme.badge}`}>
                  Featured build
                </span>
              )}
              <span className="rounded-full border border-white/10 bg-white/[0.04] px-2.5 py-1 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                {project.tag}
              </span>
            </div>
          </div>
        </div>

        <h2 className={`mt-6 max-w-xl text-balance font-display text-4xl font-semibold leading-none tracking-tight sm:text-5xl ${theme.title}`}>
          {project.name}
        </h2>
        <p className={`mt-3 max-w-md text-lg font-medium ${theme.accentText}`}>{project.outcome}</p>
        <p className="mt-5 max-w-md text-base leading-8 text-muted-foreground">{project.blurb}</p>

        <div className="mt-8 border-t border-white/10 pt-7">
          <div className="flex items-center gap-3">
            <span className={`grid h-9 w-9 place-items-center rounded-xl border bg-white/[0.04] ${theme.border} ${theme.accentText}`}>
              <CircleDot className="h-4 w-4" />
            </span>
            <h3 className={`font-display text-xl font-semibold ${theme.accentText}`}>What the project does</h3>
          </div>
          <p className="mt-4 max-w-md text-sm leading-7 text-muted-foreground">{project.blurb}</p>
        </div>

        <div className="mt-7 border-t border-white/10 pt-7">
          <div className="flex items-center gap-3">
            <span className={`grid h-9 w-9 place-items-center rounded-xl border bg-white/[0.04] ${theme.border} ${theme.accentText}`}>
              <Star className="h-4 w-4" />
            </span>
            <h3 className={`font-display text-xl font-semibold ${theme.accentText}`}>Key abilities</h3>
          </div>
          <ul className="mt-4 grid gap-2.5">
            {project.features.map((feature) => (
              <li key={feature} className="flex items-start gap-3 text-sm leading-6 text-foreground/90">
                <CheckCircle2 className={`mt-0.5 h-4 w-4 shrink-0 ${theme.accentText}`} />
                {feature}
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-8 flex flex-wrap items-center gap-x-2 gap-y-2 border-t border-white/10 pt-5 text-xs text-muted-foreground">
          {project.tech.map((item, itemIndex) => (
            <span key={item} className="inline-flex items-center gap-2">
              {itemIndex > 0 && <span className={`h-1 w-1 rounded-full ${theme.dot}`} />}
              <span>{item}</span>
            </span>
          ))}
        </div>

        <div className="mt-8 flex justify-center lg:mt-auto lg:pt-8">
          <ProjectCardLink
            project={project}
            className={`inline-flex h-11 w-full max-w-full items-center justify-center gap-2 whitespace-nowrap rounded-xl px-4 text-sm font-semibold shadow transition-all duration-300 hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring sm:w-1/2 ${theme.button}`}
          >
            View project
            {project.external ? <ExternalLink className="h-4 w-4" /> : <ArrowRight className="h-4 w-4" />}
          </ProjectCardLink>
        </div>
      </div>

      <ProjectCardLink
        project={project}
        className="group/showcase relative block min-h-[420px] overflow-hidden border-t border-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset lg:min-h-full lg:border-l lg:border-t-0"
      >
        <div className="absolute inset-0 transition-transform duration-500 group-hover/showcase:scale-[1.012]">
          <ProjectShowcase project={project} />
        </div>
      </ProjectCardLink>
    </motion.article>
  );
}

function ProjectCardLink({ project, children, className }: { project: PortfolioProject; children: ReactNode; className: string }) {
  if (project.external) {
    return (
      <a href={project.href} target="_blank" rel="noreferrer" className={className}>
        {children}
      </a>
    );
  }

  return (
    <Link href={project.href} className={className}>
      {children}
    </Link>
  );
}

function ProjectShowcase({ project }: { project: PortfolioProject }) {
  if (project.preview === "cash") return <CashPilotShowcase />;
  if (project.preview === "routine") return <RoutineCoachShowcase />;
  if (project.preview === "design") return <DesignShowcase />;
  if (project.preview === "jobs") return <JobBoardShowcase />;
  if (project.preview === "books") return <BookReviewShowcase />;
  if (project.preview === "realestate") return <RealEstateShowcase />;

  return <TaskManagerShowcase />;
}

type Theme = {
  icon: ComponentType<{ className?: string }>;
  title: string;
  accentText: string;
  border: string;
  badge: string;
  button: string;
  dot: string;
  glow: string;
  backdrop: string;
};

const projectTheme: Record<PortfolioProject["preview"], Theme> = {
  tasks: {
    icon: CheckCircle2,
    title: "text-white",
    accentText: "text-emerald-300",
    border: "border-emerald-400/30",
    badge: "border-emerald-400/30 bg-emerald-400/10 text-emerald-300",
    button: "bg-emerald-400 text-emerald-950 hover:bg-emerald-300",
    dot: "bg-emerald-300",
    glow: "shadow-emerald-950/30",
    backdrop: "bg-[radial-gradient(circle_at_0%_0%,rgba(16,185,129,0.18),transparent_36%),radial-gradient(circle_at_100%_100%,rgba(20,184,166,0.12),transparent_34%)]",
  },
  cash: {
    icon: CircleDollarSign,
    title: "text-white",
    accentText: "text-emerald-300",
    border: "border-emerald-400/30",
    badge: "border-emerald-400/30 bg-emerald-400/10 text-emerald-300",
    button: "bg-emerald-400 text-emerald-950 hover:bg-emerald-300",
    dot: "bg-emerald-300",
    glow: "shadow-emerald-950/30",
    backdrop: "bg-[radial-gradient(circle_at_0%_10%,rgba(16,185,129,0.2),transparent_34%),radial-gradient(circle_at_100%_100%,rgba(124,58,237,0.14),transparent_34%)]",
  },
  routine: {
    icon: Bot,
    title: "bg-gradient-to-r from-cyan-300 via-sky-300 to-violet-300 bg-clip-text text-transparent",
    accentText: "text-cyan-300",
    border: "border-cyan-300/30",
    badge: "border-cyan-300/30 bg-cyan-300/10 text-cyan-200",
    button: "bg-cyan-300 text-slate-950 hover:bg-cyan-200",
    dot: "bg-cyan-300",
    glow: "shadow-cyan-950/30",
    backdrop: "bg-[radial-gradient(circle_at_0%_0%,rgba(34,211,238,0.16),transparent_32%),radial-gradient(circle_at_100%_20%,rgba(139,92,246,0.18),transparent_36%)]",
  },
  design: {
    icon: Sparkles,
    title: "text-[#f3ddd1]",
    accentText: "text-[#ff8a76]",
    border: "border-[#ff8a76]/25",
    badge: "border-[#ff8a76]/30 bg-[#ff8a76]/10 text-[#ff9a88]",
    button: "bg-[#ff806f] text-[#180c09] hover:bg-[#ff9a88]",
    dot: "bg-[#ff8a76]",
    glow: "shadow-orange-950/30",
    backdrop: "bg-[radial-gradient(circle_at_0%_0%,rgba(255,128,111,0.13),transparent_34%),radial-gradient(circle_at_80%_50%,rgba(245,158,11,0.08),transparent_38%)]",
  },
  jobs: {
    icon: BriefcaseBusiness,
    title: "text-white",
    accentText: "text-sky-300",
    border: "border-sky-300/25",
    badge: "border-sky-300/30 bg-sky-300/10 text-sky-200",
    button: "bg-sky-300 text-slate-950 hover:bg-sky-200",
    dot: "bg-sky-300",
    glow: "shadow-sky-950/30",
    backdrop: "bg-[radial-gradient(circle_at_0%_0%,rgba(56,189,248,0.15),transparent_34%),radial-gradient(circle_at_100%_70%,rgba(16,185,129,0.1),transparent_34%)]",
  },
  books: {
    icon: Star,
    title: "text-white",
    accentText: "text-amber-300",
    border: "border-amber-300/25",
    badge: "border-amber-300/30 bg-amber-300/10 text-amber-200",
    button: "bg-amber-300 text-slate-950 hover:bg-amber-200",
    dot: "bg-amber-300",
    glow: "shadow-amber-950/30",
    backdrop: "bg-[radial-gradient(circle_at_0%_0%,rgba(251,191,36,0.15),transparent_34%),radial-gradient(circle_at_100%_70%,rgba(244,63,94,0.1),transparent_34%)]",
  },
  realestate: {
    icon: Home,
    title: "text-white",
    accentText: "text-teal-300",
    border: "border-teal-300/25",
    badge: "border-teal-300/30 bg-teal-300/10 text-teal-200",
    button: "bg-teal-300 text-slate-950 hover:bg-teal-200",
    dot: "bg-teal-300",
    glow: "shadow-teal-950/30",
    backdrop: "bg-[radial-gradient(circle_at_0%_0%,rgba(45,212,191,0.14),transparent_34%),radial-gradient(circle_at_100%_70%,rgba(56,189,248,0.1),transparent_34%)]",
  },
};

function ChromeFrame({ children, title }: { children: ReactNode; title: string }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-white/10 bg-[#0a1220]/90 shadow-2xl backdrop-blur">
      <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
        <div className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-rose-400/75" />
          <span className="h-2.5 w-2.5 rounded-full bg-amber-300/75" />
          <span className="h-2.5 w-2.5 rounded-full bg-emerald-400/75" />
        </div>
        <span className="font-mono text-[10px] text-muted-foreground">{title}</span>
      </div>
      {children}
    </div>
  );
}

function MetricTile({ label, value, icon: Icon, tone = "text-emerald-300" }: { label: string; value: string; icon: ComponentType<{ className?: string }>; tone?: string }) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/[0.04] p-4">
      <div className="flex items-center justify-between">
        <span className="text-xs text-muted-foreground">{label}</span>
        <Icon className={`h-4 w-4 ${tone}`} />
      </div>
      <p className="mt-2 font-display text-2xl font-semibold text-white">{value}</p>
    </div>
  );
}

function TaskManagerShowcase() {
  const tasks = [
    ["Write project overview", "In progress", "text-amber-300"],
    ["Design dashboard UI", "In progress", "text-amber-300"],
    ["Authentication flow", "Completed", "text-emerald-300"],
    ["Task CRUD operations", "Completed", "text-emerald-300"],
  ];

  return (
    <div className="absolute inset-0 grid place-items-center p-5 sm:p-8">
      <ChromeFrame title="/taskmanager">
        <div className="grid min-h-[420px] grid-cols-[11rem_minmax(0,1fr)] bg-[#081120]">
          <aside className="hidden border-r border-white/10 p-5 sm:block">
            <div className="flex items-center gap-2 font-semibold text-white">
              <CheckCircle2 className="h-5 w-5 text-emerald-300" />
              TaskManager
            </div>
            <div className="mt-8 grid gap-2 text-sm">
              {["Dashboard", "Tasks", "Completed", "Profile"].map((item, index) => (
                <span key={item} className={`flex items-center gap-2 rounded-xl px-3 py-2 ${index === 0 ? "bg-emerald-300/10 text-emerald-300" : "text-muted-foreground"}`}>
                  {index === 0 ? <LayoutDashboard className="h-4 w-4" /> : <CircleDot className="h-4 w-4" />}
                  {item}
                </span>
              ))}
            </div>
          </aside>
          <main className="col-span-2 p-5 sm:col-span-1 sm:p-7">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-2xl font-semibold text-white">Welcome back, Jane</p>
                <p className="text-sm text-muted-foreground">Here&apos;s what&apos;s on your plate today.</p>
              </div>
              <span className="hidden rounded-lg bg-emerald-400 px-4 py-2 text-sm font-semibold text-emerald-950 sm:inline-flex">
                New task
              </span>
            </div>
            <div className="mt-6 grid gap-3 sm:grid-cols-3">
              <MetricTile label="Total" value="6" icon={BarChart3} />
              <MetricTile label="In progress" value="3" icon={CalendarClock} tone="text-amber-300" />
              <MetricTile label="Completed" value="3" icon={CheckCircle2} />
            </div>
            <div className="mt-6 overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03]">
              {tasks.map(([title, status, tone], index) => (
                <div key={title} className="grid grid-cols-[1.5rem_minmax(0,1fr)_auto] items-center gap-4 border-b border-white/10 px-4 py-4 last:border-0">
                  <span className={`h-4 w-4 rounded-full border ${index > 1 ? "border-emerald-300 bg-emerald-300/70" : "border-amber-300"}`} />
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-white">{title}</p>
                    <p className="truncate text-xs text-muted-foreground">Clean scoped user workflow</p>
                  </div>
                  <span className={`rounded-md bg-white/[0.05] px-2 py-1 text-[10px] font-semibold ${tone}`}>{status}</span>
                </div>
              ))}
            </div>
          </main>
        </div>
      </ChromeFrame>
    </div>
  );
}

function CashPilotShowcase() {
  return (
    <div className="absolute inset-0 grid place-items-center p-5 sm:p-8">
      <ChromeFrame title="cashpilot.mohiebi.com">
        <div className="min-h-[430px] bg-[#0b111b] p-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 text-white">
              <span className="grid h-9 w-9 place-items-center rounded-xl bg-emerald-400/15 text-emerald-300">
                <Landmark className="h-5 w-5" />
              </span>
              <span className="font-semibold">CashPilot</span>
            </div>
            <div className="flex gap-2 text-[10px]">
              {["TOMAN", "USD", "EUR"].map((item, index) => (
                <span key={item} className={`rounded-full px-3 py-1 ${index === 0 ? "bg-emerald-400/15 text-emerald-300" : "bg-white/[0.05] text-muted-foreground"}`}>{item}</span>
              ))}
            </div>
          </div>
          <div className="mt-5 grid gap-3 lg:grid-cols-4">
            <MetricTile label="Income" value="150M" icon={BarChart3} />
            <MetricTile label="Costs" value="22.5M" icon={CircleDollarSign} tone="text-violet-300" />
            <MetricTile label="Balance" value="+127M" icon={Landmark} />
            <div className="grid place-items-center rounded-xl border border-white/10 bg-white/[0.04] p-4 text-center">
              <div className="grid h-20 w-20 place-items-center rounded-full border-[7px] border-emerald-300/80 text-lg font-semibold text-white">87%</div>
              <p className="mt-2 text-xs text-muted-foreground">Cash flow rate</p>
            </div>
          </div>
          <div className="mt-4 grid gap-4 lg:grid-cols-[1.05fr_0.95fr]">
            <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5">
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>Monthly overview</span>
                <span className="text-emerald-300">Income</span>
              </div>
              <div className="mt-5 flex h-28 items-end gap-3 border-b border-white/10 pb-3">
                {[44, 58, 52, 66, 61, 74, 90].map((height, index) => (
                  <span key={index} className="flex-1 rounded-t-lg bg-gradient-to-t from-emerald-500/20 to-emerald-300/90" style={{ height: `${height}%` }} />
                ))}
              </div>
            </div>
            <div className="rounded-2xl border border-violet-300/30 bg-violet-400/10 p-5">
              <p className="font-semibold text-white">CSV import workflow</p>
              <div className="mt-5 flex items-center justify-between">
                {["Upload", "Dates", "Normalize", "Done"].map((item, index) => (
                  <span key={item} className="grid gap-2 text-center text-[10px] text-muted-foreground">
                    <span className={`mx-auto grid h-9 w-9 place-items-center rounded-full border ${index === 3 ? "border-emerald-300 bg-emerald-300/15 text-emerald-300" : "border-violet-300/40 text-violet-200"}`}>
                      {index === 3 ? <Check className="h-4 w-4" /> : <FileText className="h-4 w-4" />}
                    </span>
                    {item}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </ChromeFrame>
    </div>
  );
}

function RoutineCoachShowcase() {
  return (
    <div className="absolute inset-0 grid place-items-center p-5 sm:p-7">
      <div className="grid w-full max-w-4xl gap-4 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="mx-auto w-full max-w-[17rem] rounded-[2.2rem] border border-white/20 bg-slate-950 p-3 shadow-2xl">
          <div className="overflow-hidden rounded-[1.7rem] border border-white/10 bg-[#07111f]">
            <div className="flex items-center justify-between border-b border-white/10 px-4 py-3 text-xs text-white">
              <span>9:41</span>
              <span className="rounded-full bg-black px-8 py-2" />
              <span>5G</span>
            </div>
            <div className="p-4">
              <div className="flex items-center gap-3">
                <span className="grid h-9 w-9 place-items-center rounded-xl bg-cyan-300/15 text-cyan-300">
                  <Bot className="h-5 w-5" />
                </span>
                <div>
                  <p className="font-semibold text-white">AI Routine Coach</p>
                  <p className="text-xs text-muted-foreground">bot</p>
                </div>
              </div>
              <div className="mt-5 ml-auto w-fit rounded-2xl bg-blue-500 px-4 py-2 text-sm text-white">/today</div>
              <div className="mt-3 rounded-2xl bg-white/[0.07] p-3 text-sm leading-6 text-white">
                Good morning. Here are your tasks for today.
              </div>
              <div className="mt-3 rounded-2xl border border-white/10 bg-white/[0.04] p-3">
                <div className="flex justify-between text-sm text-white">
                  <span>Streak: 12 days</span>
                  <span>67%</span>
                </div>
                <div className="mt-3 h-2 rounded-full bg-white/10">
                  <span className="block h-full w-2/3 rounded-full bg-cyan-300" />
                </div>
              </div>
              {["Workout", "Read 20 pages", "Plan tomorrow"].map((item, index) => (
                <div key={item} className="mt-3 rounded-2xl border border-white/10 bg-white/[0.04] p-3">
                  <div className="flex items-center justify-between text-sm text-white">
                    <span>{item}</span>
                    <span className={`h-4 w-4 rounded-full border ${index === 1 ? "border-emerald-300 bg-emerald-300" : "border-cyan-300"}`} />
                  </div>
                  <div className="mt-3 grid grid-cols-3 gap-2 text-[10px]">
                    {["Complete", "Skip", "Fail"].map((action) => (
                      <span key={action} className="rounded-lg bg-white/[0.07] px-2 py-1.5 text-center text-muted-foreground">{action}</span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="grid gap-4">
          <div className="rounded-2xl border border-cyan-300/25 bg-white/[0.04] p-5">
            <p className="font-mono text-sm text-cyan-300">/progress</p>
            <div className="mt-4 grid grid-cols-3 gap-3">
              {["82", "12", "67%"].map((value, index) => (
                <div key={value} className="text-center">
                  <div className="mx-auto grid h-20 w-20 place-items-center rounded-full border-[7px] border-cyan-300/70 text-xl font-semibold text-white">{value}</div>
                  <p className="mt-2 text-xs text-muted-foreground">{["Health", "Streak", "Complete"][index]}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="rounded-2xl border border-violet-300/30 bg-violet-400/10 p-5">
            <p className="font-mono text-sm text-violet-200">/coach I keep skipping workouts</p>
            <p className="mt-4 font-semibold text-white">AI insights</p>
            <p className="mt-2 text-sm text-muted-foreground">You tend to skip workouts on busy days. Let&apos;s make it easier to win.</p>
            <div className="mt-4 grid gap-2">
              {["Optimize routines", "Analyze my week", "Ask coach"].map((item) => (
                <span key={item} className="flex items-center justify-between rounded-xl bg-white/[0.06] px-3 py-2 text-sm text-white">
                  {item}
                  <ArrowRight className="h-3.5 w-3.5 text-muted-foreground" />
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function DesignShowcase() {
  return (
    <div className="absolute inset-0 p-3 sm:p-5">
      <div className="relative h-full overflow-hidden rounded-[1.6rem] border border-[#ff8a76]/20 bg-[#17130f] shadow-2xl">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_32%_24%,rgba(255,128,111,0.16),transparent_28%),radial-gradient(circle_at_78%_62%,rgba(245,158,11,0.08),transparent_34%)]" />
        <div className="absolute -right-20 top-8 h-72 w-72 rounded-full border border-[#ff8a76]/10 bg-[radial-gradient(circle,rgba(255,128,111,0.16),transparent_64%)]" />

        <div className="relative grid h-full min-h-0 gap-3 p-3 lg:grid-cols-[minmax(0,1.05fr)_minmax(230px,0.95fr)]">
          <div className="flex min-h-0 flex-col overflow-hidden rounded-2xl border border-[#ff8a76]/20 bg-[#1d1812]/85">
            <div className="flex items-center justify-between gap-4 border-b border-[#ff8a76]/15 px-4 py-3">
              <span className="shrink-0 whitespace-nowrap font-display text-base text-[#ff7f6f]">Mahdieh<span className="text-[#f3ddd1]">Design</span></span>
              <div className="hidden min-w-0 items-center justify-end gap-4 overflow-hidden font-mono text-[8px] uppercase tracking-wider text-[#c4b2a8] xl:flex">
                <span>Work</span>
                <span>Services</span>
                <span>Process</span>
                <span>Contact</span>
              </div>
            </div>
            <div className="relative flex min-h-0 flex-1 flex-col justify-center p-5">
              <div className="absolute right-0 top-1/2 h-80 w-80 -translate-y-1/2 rounded-full border border-[#f3ddd1]/10 bg-[radial-gradient(circle,rgba(255,128,111,0.18),transparent_58%)]" />
              <p className="relative truncate font-mono text-[9px] uppercase tracking-[0.22em] text-[#b99b8d]">Brand and visual design</p>
              <h4 className="relative mt-4 max-w-sm font-display text-3xl leading-[0.98] text-[#f3ddd1] xl:text-4xl">
                Strategy meets <span className="text-[#ff806f]">aesthetics</span>, in service of growth.
              </h4>
              <p className="relative mt-4 max-w-xs text-xs leading-5 text-[#c8b9af]">
                A public portfolio, case-study archive, bilingual brief flow, and authenticated content dashboard.
              </p>
              <span className="relative mt-5 inline-flex w-fit items-center gap-2 whitespace-nowrap rounded-lg border border-[#ff806f]/35 px-3 py-2 text-[11px] text-[#f3ddd1]">
                View selected work
                <ArrowRight className="h-3.5 w-3.5 text-[#ff806f]" />
              </span>
              <div className="relative mt-auto grid grid-cols-4 items-center gap-3 border-t border-[#ff806f]/15 pt-4 text-[9px] uppercase tracking-wider text-[#b99b8d]">
                <span className="truncate">Clients</span>
                <span>AIKO</span>
                <span>Arex.</span>
                <span>AKT</span>
              </div>
            </div>
          </div>

          <div className="grid min-h-0 gap-3 lg:grid-rows-[minmax(0,1fr)_auto]">
            <div className="min-w-0 rounded-2xl border border-[#ff8a76]/20 bg-[#1d1812]/85 p-4">
              <div className="flex min-w-0 items-end justify-between gap-3">
                <div className="min-w-0">
                  <p className="truncate font-display text-xl text-[#f3ddd1]">Case studies</p>
                  <p className="mt-1 truncate text-[11px] text-[#9f8e84]">Selected work archive</p>
                </div>
                <span className="shrink-0 text-[10px] text-[#ff806f]">Popular</span>
              </div>
              <div className="mt-3 grid grid-cols-2 gap-2">
                {[
                  ["Aiko Real Estate", "bg-emerald-300/12"],
                  ["Arex Digital", "bg-violet-300/12"],
                  ["Sepid Nuts", "bg-amber-300/14"],
                  ["AKT Office", "bg-slate-300/10"],
                ].map(([item, bg]) => (
                  <div key={item} className="min-w-0 rounded-xl border border-white/10 bg-white/[0.035] p-2.5">
                    <div className={`h-14 rounded-lg ${bg}`} />
                    <p className="mt-2 truncate text-[11px] text-[#f3ddd1]">{item}</p>
                    <p className="mt-1 truncate text-[9px] text-[#ff806f]">View case study</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid min-w-0 gap-3 xl:grid-cols-[minmax(0,1fr)_minmax(0,0.9fr)]">
              <div className="min-w-0 rounded-2xl border border-[#ff8a76]/20 bg-[#1d1812]/85 p-4">
                <div className="flex min-w-0 items-center justify-between gap-3">
                  <p className="truncate font-display text-lg text-[#f3ddd1]">Project brief</p>
                  <span className="shrink-0 text-[10px] text-[#ff806f]">EN</span>
                </div>
                <div className="mt-3 grid gap-2">
                  {["About brand", "Project goals", "Scope"].map((item, index) => (
                    <div key={item} className="grid grid-cols-[1.5rem_minmax(0,1fr)] items-center gap-2 rounded-lg border border-white/10 bg-black/15 p-2.5">
                      <p className="font-mono text-[10px] text-[#ff806f]">0{index + 1}</p>
                      <p className="truncate text-[11px] text-[#f3ddd1]">{item}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="min-w-0 rounded-2xl border border-white/10 bg-[#1d1812]/85 p-4">
                <p className="truncate font-display text-lg text-[#f3ddd1]">Dashboard</p>
                <div className="mt-3 grid grid-cols-2 gap-2">
                  {[
                    ["12", "Projects"],
                    ["23", "Reviews"],
                    ["32", "Briefs"],
                    ["4", "Services"],
                  ].map(([value, label]) => (
                    <div key={label} className="min-w-0 rounded-xl border border-white/10 bg-white/[0.04] p-2.5">
                      <p className="font-display text-lg text-[#f3ddd1]">{value}</p>
                      <p className="truncate text-[9px] text-[#9f8e84]">{label}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function JobBoardShowcase() {
  return (
    <div className="absolute inset-0 grid place-items-center p-5 sm:p-8">
      <ChromeFrame title="/jobs">
        <div className="min-h-[410px] bg-[#071220] p-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="font-display text-3xl font-semibold text-white">Find your next role</p>
              <p className="text-sm text-muted-foreground">Filter by salary, experience and category.</p>
            </div>
            <div className="flex gap-2">
              {["All", "Remote", "Senior"].map((item, index) => (
                <span key={item} className={`rounded-full border px-3 py-1 text-xs ${index === 0 ? "border-sky-300/40 bg-sky-300/10 text-sky-200" : "border-white/10 text-muted-foreground"}`}>{item}</span>
              ))}
            </div>
          </div>
          <div className="mt-6 grid gap-3">
            {["Senior Laravel Developer", "Vue Engineer", "NestJS Backend Engineer", "Product-minded Full Stack"].map((item, index) => (
              <div key={item} className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="font-semibold text-white">{item}</p>
                    <p className="mt-1 text-xs text-muted-foreground">Remote | Product team | Full-time</p>
                  </div>
                  <span className={`rounded-lg px-3 py-1 text-xs ${index === 0 ? "bg-sky-300 text-slate-950" : "bg-white/[0.06] text-sky-200"}`}>Apply</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </ChromeFrame>
    </div>
  );
}

function BookReviewShowcase() {
  return (
    <div className="absolute inset-0 grid place-items-center p-5 sm:p-8">
      <ChromeFrame title="/books">
        <div className="min-h-[410px] bg-[#10100b] p-6">
          <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3">
            <Search className="h-5 w-5 text-amber-300" />
            <span className="text-sm text-muted-foreground">search books, authors, ratings...</span>
          </div>
          <div className="mt-6 grid grid-cols-3 gap-4">
            {[0, 1, 2, 3, 4, 5].map((item) => (
              <div key={item} className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.04]">
                <div className="aspect-[3/4] bg-gradient-to-br from-amber-300/40 to-rose-400/10" />
                <div className="p-3">
                  <p className="truncate text-sm font-medium text-white">Book title</p>
                  <div className="mt-2 flex gap-0.5">
                    {[0, 1, 2, 3, 4].map((star) => (
                      <Star key={star} className={`h-3 w-3 ${star < 4 ? "fill-amber-300 text-amber-300" : "text-muted-foreground/30"}`} />
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </ChromeFrame>
    </div>
  );
}

function RealEstateShowcase() {
  return (
    <div className="absolute inset-0 grid place-items-center p-5 sm:p-8">
      <ChromeFrame title="/listing">
        <div className="min-h-[410px] bg-[#07151b] p-6">
          <div className="grid grid-cols-3 gap-3">
            {["2+ beds", "Under $500k", "Austin"].map((item) => (
              <span key={item} className="rounded-full border border-teal-300/25 bg-teal-300/10 px-3 py-2 text-center text-xs text-teal-200">{item}</span>
            ))}
          </div>
          <div className="mt-6 grid gap-4 lg:grid-cols-2">
            {["$480,000", "$320,000", "$650,000", "$715,000"].map((price, index) => (
              <div key={price} className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.04]">
                <div className={`h-28 ${index % 2 === 0 ? "bg-teal-300/15" : "bg-sky-300/15"}`} />
                <div className="p-4">
                  <div className="flex items-center justify-between">
                    <p className="font-display text-xl font-semibold text-white">{price}</p>
                    <MapPin className="h-4 w-4 text-teal-300" />
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground">{index + 2} bd | {index + 1} ba | Listed property</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </ChromeFrame>
    </div>
  );
}
