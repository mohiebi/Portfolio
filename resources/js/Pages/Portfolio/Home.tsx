import { Head, Link } from "@inertiajs/react";
import {
  ArrowRight, Mail, Linkedin, FileDown, Sparkles, Database, Code2,
  Layers, Server, Shield, Zap, Search, Star, Filter, Check, Plus, MapPin,
  Building2, Phone, Globe, Copy, MessageCircle, GraduationCap, Briefcase,
  Cpu, GitBranch, Github, Quote, ChevronLeft, ChevronRight,
} from "lucide-react";
import { motion, useScroll, useTransform, type Variants } from "framer-motion";
import { useRef, useState } from "react";
import { SiteShell } from "@/components/site/SiteShell";
import portraitUrl from "@/assets/portrait.webp";
import { Button } from "@/components/ui/button";
import type { Recommendation } from "@/types";

const skills = [
  { name: "PHP", icon: Server },
  { name: "JavaScript / TypeScript", icon: Code2 },
  { name: "Laravel", icon: Server },
  { name: "Symfony", icon: Server },
  { name: "NestJS / Node.js", icon: Cpu },
  { name: "Vue.js", icon: Code2 },
  { name: "Inertia.js / Livewire", icon: Layers },
  { name: "Tailwind CSS / Bootstrap", icon: Sparkles },
  { name: "REST APIs", icon: Layers },
  { name: "AI Integration", icon: Sparkles },
  { name: "MySQL / PostgreSQL", icon: Database },
  { name: "Docker / Git / CI-CD", icon: GitBranch },
  { name: "Unit / E2E Testing", icon: Zap },
  { name: "Solidity / Web3", icon: Shield },
  { name: "Smart Contracts", icon: Shield },
  { name: "Wallet Integration", icon: Shield },
  { name: "OOP / MVC / DDD", icon: Layers },
  { name: "Clean Architecture", icon: Sparkles },
];

const projects = [
  {
    name: "TaskManager",
    href: "/taskmanager",
    tag: "Productivity dashboard",
    blurb: "Authenticated task CRUD with toggle-complete, validation, flash messages and clean empty states.",
    features: ["Create / edit / delete tasks", "Toggle completed state", "Auth-scoped per user"],
    tech: ["Laravel", "Auth", "Form requests", "Tailwind"],
    accent: "from-emerald-400/25 to-teal-500/10",
    preview: "tasks" as const,
  },
  {
    name: "BookReview",
    href: "/books",
    tag: "Discovery & ratings",
    blurb: "A book discovery app with search, smart filters, average ratings and threaded reviews.",
    features: ["Filter by popularity & rating", "Star ratings & review counts", "Detail page with reviews"],
    tech: ["Laravel", "Eloquent", "Blade", "Tailwind"],
    accent: "from-amber-400/30 to-orange-500/10",
    preview: "books" as const,
  },
  {
    name: "Job Board",
    href: "/jobs",
    tag: "SaaS-style marketplace",
    blurb: "A small job marketplace with filterable jobs, applications with CV upload, and an employer dashboard.",
    features: ["Salary / experience / category filters", "PDF CV upload", "Employer job management"],
    tech: ["Laravel", "Policies", "File uploads", "Tailwind"],
    accent: "from-sky-400/25 to-indigo-500/10",
    preview: "jobs" as const,
  },
];

function BooksPreview() {
  return (
    <div className="space-y-3 p-4">
      <div className="flex items-center gap-2 rounded-md border border-border bg-muted/40 px-2.5 py-1.5">
        <Search className="h-3 w-3 text-muted-foreground" />
        <span className="font-mono text-[10px] text-muted-foreground">search books…</span>
      </div>
      <div className="grid grid-cols-3 gap-2">
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            viewport={{ once: true }}
            className="overflow-hidden rounded-md border border-border bg-card"
          >
            <div className="aspect-[3/4] bg-gradient-to-br from-amber-400/40 to-orange-500/20" />
            <div className="space-y-1 p-1.5">
              <div className="h-1.5 w-3/4 rounded bg-muted" />
              <div className="flex items-center gap-0.5">
                {[0, 1, 2, 3, 4].map((s) => (
                  <Star key={s} className={`h-2 w-2 ${s < 4 ? "fill-amber-400 text-amber-400" : "text-muted"}`} />
                ))}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function TasksPreview() {
  const items = [
    { text: "Ship landing page", done: true },
    { text: "Review PR #248", done: false },
    { text: "Plan sprint demo", done: false },
    { text: "Refactor auth guard", done: true },
  ];
  return (
    <div className="space-y-2 p-4">
      <div className="flex items-center justify-between">
        <span className="font-mono text-[10px] uppercase text-muted-foreground">My tasks</span>
        <span className="inline-flex items-center gap-1 rounded bg-primary/15 px-1.5 py-0.5 text-[9px] font-mono text-primary">
          <Plus className="h-2.5 w-2.5" /> New
        </span>
      </div>
      <ul className="space-y-1.5">
        {items.map((t, i) => (
          <motion.li
            key={t.text}
            initial={{ opacity: 0, x: -10 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.06 }}
            viewport={{ once: true }}
            className="flex items-center gap-2 rounded-md border border-border bg-card px-2 py-1.5"
          >
            <span className={`grid h-3.5 w-3.5 place-items-center rounded border ${t.done ? "border-emerald-500 bg-emerald-500/20" : "border-border"}`}>
              {t.done && <Check className="h-2.5 w-2.5 text-emerald-500" />}
            </span>
            <span className={`text-[11px] ${t.done ? "text-muted-foreground line-through" : ""}`}>{t.text}</span>
          </motion.li>
        ))}
      </ul>
    </div>
  );
}

function JobsPreview() {
  const jobs = [
    { title: "Senior Laravel Dev", co: "Acme", loc: "Remote" },
    { title: "Vue Engineer", co: "Northwind", loc: "Berlin" },
    { title: "NestJS Backend", co: "Globex", loc: "Hybrid" },
  ];
  return (
    <div className="space-y-2 p-4">
      <div className="flex items-center gap-1.5">
        <span className="inline-flex items-center gap-1 rounded-full border border-primary/40 bg-primary/10 px-1.5 py-0.5 text-[9px] font-mono text-primary">
          <Filter className="h-2.5 w-2.5" /> All
        </span>
        <span className="rounded-full border border-border px-1.5 py-0.5 text-[9px] font-mono text-muted-foreground">Remote</span>
        <span className="rounded-full border border-border px-1.5 py-0.5 text-[9px] font-mono text-muted-foreground">Senior</span>
      </div>
      <ul className="space-y-1.5">
        {jobs.map((j, i) => (
          <motion.li
            key={j.title}
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            viewport={{ once: true }}
            className="rounded-md border border-border bg-card p-2"
          >
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-medium">{j.title}</span>
              <span className="font-mono text-[9px] text-primary">Apply</span>
            </div>
            <div className="mt-0.5 flex items-center gap-2 text-[9px] text-muted-foreground">
              <span className="inline-flex items-center gap-0.5"><Building2 className="h-2.5 w-2.5" />{j.co}</span>
              <span className="inline-flex items-center gap-0.5"><MapPin className="h-2.5 w-2.5" />{j.loc}</span>
            </div>
          </motion.li>
        ))}
      </ul>
    </div>
  );
}

const previewMap = {
  books: BooksPreview,
  tasks: TasksPreview,
  jobs: JobsPreview,
};

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] } },
};

const stagger: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};

type Props = {
  recommendations?: Recommendation[];
};

export default function HomePage({ recommendations = [] }: Props) {
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroY = useTransform(scrollYProgress, [0, 1], [0, 120]);
  const heroOpacity = useTransform(scrollYProgress, [0, 1], [1, 0.4]);

  const [copied, setCopied] = useState<string | null>(null);
  const [activeRecommendationIndex, setActiveRecommendationIndex] = useState(0);
  const activeRecommendation = recommendations[activeRecommendationIndex] ?? recommendations[0];
  const showRecommendationControls = recommendations.length > 1;
  const recommendationTotal = recommendations.length;

  const showPreviousRecommendation = () => {
    setActiveRecommendationIndex((index) => (index - 1 + recommendations.length) % recommendations.length);
  };

  const showNextRecommendation = () => {
    setActiveRecommendationIndex((index) => (index + 1) % recommendations.length);
  };

  const copy = (val: string, key: string) => {
    navigator.clipboard.writeText(val);
    setCopied(key);
    setTimeout(() => setCopied(null), 1600);
  };

  return (
    <SiteShell>
      <Head>
        <title>Mohi - Fullstack and Solidity Developer</title>
        <meta name="description" content="Fullstack Developer with 3+ years building PHP, Laravel, Symfony, Vue, NestJS apps and Solidity smart contracts. Selected case studies and contact." />
        <meta property="og:title" content="Mohi - Fullstack Developer" />
        <meta property="og:description" content="PHP, JS, Laravel, Symfony, Vue, NestJS, Solidity, and Web3." />
      </Head>
      {/* HERO */}
      <section ref={heroRef} className="relative overflow-hidden">
        <motion.div
          className="absolute inset-0 bg-grid opacity-40 [mask-image:radial-gradient(ellipse_at_center,black,transparent_70%)]"
          style={{ y: heroY }}
        />
        <motion.div
          aria-hidden
          className="absolute -top-32 -right-32 h-96 w-96 rounded-full bg-primary/20 blur-3xl"
          animate={{ scale: [1, 1.15, 1], opacity: [0.5, 0.8, 0.5] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          aria-hidden
          className="absolute -bottom-32 -left-32 h-96 w-96 rounded-full bg-success/15 blur-3xl"
          animate={{ scale: [1, 1.2, 1], opacity: [0.4, 0.7, 0.4] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        />

        <motion.div
          style={{ opacity: heroOpacity }}
          className="relative mx-auto grid max-w-7xl gap-12 px-4 py-16 sm:px-6 lg:grid-cols-[1.1fr_0.9fr] lg:py-24 lg:px-8"
        >
          <motion.div variants={stagger} initial="hidden" animate="show">
            <motion.div
              variants={fadeUp}
              className="inline-flex items-center gap-2 rounded-full border border-border bg-background/60 px-3 py-1 text-xs font-mono uppercase tracking-wider text-muted-foreground"
            >
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-success opacity-75" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-success" />
              </span>
              Available for freelance & remote
            </motion.div>

            <motion.h1
              variants={fadeUp}
              className="mt-5 font-display text-4xl font-semibold tracking-tight text-balance sm:text-5xl lg:text-6xl"
            >
              Fullstack web apps with{" "}
              <span className="text-primary">PHP</span>, <span className="text-primary">JS</span> &{" "}
              <span className="text-primary">Solidity</span>.
            </motion.h1>

            <motion.p variants={fadeUp} className="mt-5 max-w-xl text-lg text-muted-foreground">
              Hi, I'm <span className="text-foreground font-medium">MohammadHosein Ebrahimi</span> — a fullstack developer with
              3+ years shipping production systems in <span className="text-foreground">Symfony</span>,{" "}
              <span className="text-foreground">Laravel</span>, <span className="text-foreground">Vue</span>, and{" "}
              <span className="text-foreground">NestJS</span>, plus Web3 gateways and smart contracts in Solidity.
            </motion.p>

            <motion.div variants={fadeUp} className="mt-7 flex flex-wrap items-center gap-3">
              <Button asChild size="lg">
                <a href="#contact">Get in touch <ArrowRight className="ml-2 h-4 w-4" /></a>
              </Button>
              <Button asChild size="lg" variant="outline">
                <a href="https://github.com/mohiebi" target="_blank" rel="noreferrer">
                  <Github className="mr-2 h-4 w-4" /> GitHub
                </a>
              </Button>
              <Button asChild size="lg" variant="ghost">
                <a href="/CV/mohi-cv.pdf"><FileDown className="mr-2 h-4 w-4" /> Download CV</a>
              </Button>
            </motion.div>

            <motion.dl variants={fadeUp} className="mt-10 grid grid-cols-3 gap-6 border-t border-border pt-6 max-w-md">
              <div><dt className="text-xs uppercase text-muted-foreground">Experience</dt><dd className="mt-1 font-display text-2xl">3+ yrs</dd></div>
              <div><dt className="text-xs uppercase text-muted-foreground">Tasks shipped</dt><dd className="mt-1 font-display text-2xl">150+</dd></div>
              <div><dt className="text-xs uppercase text-muted-foreground">Test coverage</dt><dd className="mt-1 font-display text-2xl">+87%</dd></div>
            </motion.dl>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9, rotate: -2 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }}
            className="relative"
          >
            <motion.div
              className="absolute -inset-6 rounded-3xl bg-gradient-to-tr from-primary/30 to-transparent blur-2xl"
              animate={{ opacity: [0.5, 0.9, 0.5] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            />
            <motion.div
              whileHover={{ y: -4 }}
              transition={{ type: "spring", stiffness: 200, damping: 20 }}
              className="relative overflow-hidden rounded-3xl border border-border bg-surface shadow-card"
            >
              <img
                src={portraitUrl}
                alt="MohammadHosein Ebrahimi portrait"
                className="aspect-[4/5] w-full object-cover"
              />
              <div className="absolute bottom-3 left-3 right-3 rounded-xl border border-border bg-background/80 px-4 py-3 backdrop-blur">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-mono text-muted-foreground">~ /portfolio</span>
                  <span className="inline-flex items-center gap-1 text-success">
                    <span className="h-1.5 w-1.5 rounded-full bg-success" />online
                  </span>
                </div>
                <p className="mt-1 font-display text-sm">Mohi / PHP/JS / Solidity</p>
              </div>
            </motion.div>
          </motion.div>
        </motion.div>
      </section>


      {/* ABOUT */}
      <section id="about" className="border-t border-border/60">
        <div className="mx-auto grid max-w-7xl gap-12 px-4 py-20 sm:px-6 lg:grid-cols-[1fr_1.2fr] lg:px-8">
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6 }}
          >
            <p className="font-mono text-xs uppercase tracking-wider text-primary">// About</p>
            <h2 className="mt-2 font-display text-3xl font-semibold sm:text-4xl">
              Back-end focused full-stack engineer building scalable web and Web3 systems
            </h2>
            <p className="mt-5 text-muted-foreground">
              Back-end / full-stack engineer with 3+ years of experience building scalable applications with
              <span className="text-foreground"> PHP</span>, <span className="text-foreground">Node.js</span>,
              <span className="text-foreground"> Symfony</span>, <span className="text-foreground">Laravel</span>,
              <span className="text-foreground"> NestJS</span>, and <span className="text-foreground">Vue.js</span>.
              I focus on API development, backend architecture, secure maintainable systems, and production features
              that hold up after launch.
            </p>
            <p className="mt-3 text-muted-foreground">
              I bring strong problem-solving, clean architecture, and testing habits to legacy and modern codebases.
              Recently I modernized PHP architecture with Docker, migrated legacy UI work to Vue.js, delivered 90+
              Symfony/Vue tasks on Mintme.com, and built blockchain data pipelines plus Web3 wallet flows for
              MetaMask, Solflare, and multiple networks.
            </p>
            <p className="hidden">
              Highly motivated developer with 3+ years of professional experience, specialized in
              <span className="text-foreground"> PHP</span>, <span className="text-foreground">JavaScript</span>,
              and Node.js frameworks (Vue.js, Symfony, Laravel, NestJS). I also build on Ethereum with
              <span className="text-foreground"> Solidity</span> — wallet integrations, on-chain watchers, and
              smart contracts (lottery, fundraising) using Chainlink helpers.
            </p>
            <p className="hidden">
              I care about clean architecture, unit testing, and shipping reliable features.
              At ABC Hosting I modernized legacy PHP architecture, containerized the environment with Docker,
              migrated the frontend to Vue.js, and added multilingual, multi-currency support. On Mintme.com I
              delivered 90+ Symfony/Vue tasks, contributed 1500+ GitLab commits, and built Node.js Web3 data
              pipelines plus wallet integrations for MetaMask and Solflare.
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              <Button asChild variant="outline">
                <a href="/CV/mohi-cv.pdf"><FileDown className="mr-2 h-4 w-4" /> Download CV</a>
              </Button>
              <Button asChild variant="ghost">
                <a href="https://github.com/mohiebi" target="_blank" rel="noreferrer">
                  <Github className="mr-2 h-4 w-4" /> GitHub
                </a>
              </Button>
            </div>
          </motion.div>

          <motion.div
            initial="hidden" whileInView="show" viewport={{ once: true, margin: "-80px" }}
            variants={stagger}
          >
            <h3 className="font-display text-sm uppercase tracking-wider text-muted-foreground">Tech stack</h3>
            <motion.div variants={stagger} className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3">
              {skills.map((s) => (
                <motion.div
                  key={s.name}
                  variants={fadeUp}
                  whileHover={{ y: -2, borderColor: "hsl(var(--primary) / 0.5)" }}
                  className="flex items-center gap-2 rounded-lg border border-border bg-card/60 px-3 py-2.5 text-sm transition-colors"
                >
                  <s.icon className="h-4 w-4 text-primary" /> {s.name}
                </motion.div>
              ))}
            </motion.div>

            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              <motion.div variants={fadeUp} className="rounded-xl border border-border bg-card/60 p-5">
                <div className="flex items-center gap-2">
                  <Briefcase className="h-4 w-4 text-primary" />
                  <h4 className="font-display text-base font-semibold">Experience</h4>
                </div>
                <p className="mt-2 text-sm">
                  <span className="text-foreground font-medium">Full-Stack Developer</span> / ABC Hosting Ltd.
                  <span className="block text-xs text-muted-foreground">Nov 2025 - Present / Belize City, Belize</span>
                </p>
                <p className="mt-2 text-sm">
                  <span className="text-foreground font-medium">Full-Stack Developer</span> / Mintme.com
                  <span className="block text-xs text-muted-foreground">Jun 2024 - Dec 2025 / Belize City, Belize</span>
                </p>
                <p className="mt-2 text-sm">
                  <span className="text-foreground font-medium">AI Integration Developer</span> / ProAce CRM Project
                  <span className="block text-xs text-muted-foreground">Jun 2025 - Mar 2026 / Canada, Remote</span>
                </p>
                <p className="mt-2 text-sm">
                  <span className="text-foreground font-medium">Web Developer</span> / Health Tourism Development Center (HTDC)
                  <span className="block text-xs text-muted-foreground">May 2022 - Sep 2023 / Muscat, Oman</span>
                </p>
              </motion.div>

              <motion.div variants={fadeUp} className="rounded-xl border border-border bg-card/60 p-5">
                <div className="flex items-center gap-2">
                  <GraduationCap className="h-4 w-4 text-primary" />
                  <h4 className="font-display text-base font-semibold">Education</h4>
                </div>
                <p className="mt-2 text-sm">
                  <span className="text-foreground font-medium">MBA - Marketing</span>
                  <span className="block text-xs text-muted-foreground">Khorasgan University / 2022 - Present</span>
                </p>
                <p className="mt-2 text-sm">
                  <span className="text-foreground font-medium">B.Sc. Mechanical Eng.</span>
                  <span className="block text-xs text-muted-foreground">University of Kashan / 2015 - 2019</span>
                </p>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {activeRecommendation && (
        <section id="recommendations" className="relative scroll-mt-20 overflow-hidden border-t border-border/60">
          <motion.div
            aria-hidden
            className="absolute -top-24 left-1/3 h-72 w-72 rounded-full bg-primary/15 blur-3xl"
            animate={{ scale: [1, 1.15, 1], opacity: [0.4, 0.7, 0.4] }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          />
          <div className="relative mx-auto max-w-6xl px-4 py-20 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between"
            >
              <div>
                <p className="font-mono text-xs uppercase tracking-wider text-primary">// Recommendations</p>
                <h2 className="mt-2 font-display text-3xl font-semibold sm:text-4xl">
                  Kind words from <span className="text-primary">LinkedIn</span>
                </h2>
                <p className="mt-3 max-w-xl text-sm text-muted-foreground">
                  Real recommendations from teammates and senior engineers I've worked with.
                </p>
              </div>
              <a
                href="https://www.linkedin.com/in/mohiebi/details/recommendations/"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 self-start rounded-full border border-border bg-background/60 px-3 py-1.5 text-xs font-mono uppercase tracking-wider text-muted-foreground transition-colors hover:border-primary/50 hover:text-primary"
              >
                <Linkedin className="h-3.5 w-3.5" /> View on LinkedIn
              </a>
            </motion.div>

            <div className="relative mt-10">
              <div className="relative mx-auto h-[540px] max-w-3xl sm:h-[480px]">
                {recommendations.map((recommendation, index) => {
                  const offset = (index - activeRecommendationIndex + recommendationTotal) % recommendationTotal;
                  const isCenter = offset === 0;
                  const isRight = offset === 1;
                  const isLeft = offset === recommendationTotal - 1 && recommendationTotal > 2;
                  const role = isCenter ? "center" : isRight ? "right" : isLeft ? "left" : "hidden";
                  const variants: Record<string, { x: string; y: number; scale: number; rotate: number; opacity: number; zIndex: number; filter: string }> = {
                    center: { x: "0%", y: 0, scale: 1, rotate: 0, opacity: 1, zIndex: 30, filter: "blur(0px)" },
                    right: { x: "18%", y: 32, scale: 0.88, rotate: 4, opacity: 0.32, zIndex: 20, filter: "blur(2px)" },
                    left: { x: "-18%", y: 32, scale: 0.88, rotate: -4, opacity: 0.32, zIndex: 20, filter: "blur(2px)" },
                    hidden: { x: "0%", y: 60, scale: 0.75, rotate: 0, opacity: 0, zIndex: 10, filter: "blur(2px)" },
                  };

                  return (
                    <motion.div
                      key={recommendation.id}
                      animate={variants[role]}
                      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                      onClick={() => !isCenter && setActiveRecommendationIndex(index)}
                      className={`absolute inset-0 ${isCenter ? "" : "cursor-pointer"} ${role === "hidden" ? "pointer-events-none" : ""}`}
                      style={{ transformOrigin: "center bottom" }}
                    >
                      <RecommendationShowcaseCard
                        recommendation={recommendation}
                        active={isCenter}
                        accent={recommendationAccent(index)}
                      />
                    </motion.div>
                  );
                })}
              </div>

              {showRecommendationControls && (
                <div className="mt-6 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-2">
                    {recommendations.map((recommendation, index) => (
                      <button
                        key={recommendation.id}
                        type="button"
                        onClick={() => setActiveRecommendationIndex(index)}
                        aria-label={`Show recommendation ${index + 1}`}
                        className={`h-1.5 rounded-full transition-all ${
                          index === activeRecommendationIndex ? "w-8 bg-primary" : "w-3 bg-border hover:bg-muted-foreground/40"
                        }`}
                      />
                    ))}
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={showPreviousRecommendation}
                      aria-label="Previous recommendation"
                      className="grid h-10 w-10 place-items-center rounded-full border border-border bg-background/60 text-muted-foreground transition-colors hover:border-primary/60 hover:text-primary"
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      onClick={showNextRecommendation}
                      aria-label="Next recommendation"
                      className="grid h-10 w-10 place-items-center rounded-full border border-border bg-background/60 text-muted-foreground transition-colors hover:border-primary/60 hover:text-primary"
                    >
                      <ChevronRight className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      <ProjectsSection />

      {/* CONTACT */}
      <section id="contact" className="relative overflow-hidden border-t border-border/60 bg-surface/40">
        <motion.div
          aria-hidden
          className="absolute inset-0 bg-grid opacity-30 [mask-image:radial-gradient(ellipse_at_center,black,transparent_75%)]"
        />
        <motion.div
          aria-hidden
          className="absolute left-1/2 top-0 h-72 w-72 -translate-x-1/2 rounded-full bg-primary/20 blur-3xl"
          animate={{ scale: [1, 1.15, 1] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        />

        <div className="relative mx-auto max-w-6xl px-4 py-24 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mx-auto max-w-2xl text-center"
          >
            <p className="font-mono text-xs uppercase tracking-wider text-primary">// Contact</p>
            <h2 className="mt-2 font-display text-4xl font-semibold sm:text-5xl">
              Let's build something <span className="text-primary">solid</span>.
            </h2>
            <p className="mt-4 text-muted-foreground">
              Open to fullstack roles, freelance projects and Web3 collaborations.
              I usually reply within 24 hours.
            </p>
          </motion.div>

          <motion.div
            initial="hidden" whileInView="show" viewport={{ once: true, margin: "-60px" }}
            variants={stagger}
            className="mt-14 grid gap-6 md:grid-cols-3"
          >
            {[
              {
                key: "email",
                icon: Mail,
                label: "Email",
                value: "e.mohamadhosein@gmail.com",
                href: "mailto:e.mohamadhosein@gmail.com",
                cta: "Send a message",
                copyable: true,
                accent: "from-primary/30 via-primary/10 to-transparent",
              },
              {
                key: "linkedin",
                icon: Linkedin,
                label: "LinkedIn",
                value: "linkedin.com/in/mohiebi",
                href: "https://www.linkedin.com/in/mohiebi",
                cta: "Connect with me",
                accent: "from-sky-500/30 via-sky-500/10 to-transparent",
              },
              {
                key: "github",
                icon: Github,
                label: "GitHub",
                value: "github.com/mohiebi",
                href: "https://github.com/mohiebi",
                cta: "View my code",
                accent: "from-zinc-500/30 via-zinc-500/10 to-transparent",
              },
            ].map((c) => (
              <motion.a
                key={c.key}
                variants={fadeUp}
                href={c.href}
                target={c.href.startsWith("http") ? "_blank" : undefined}
                rel="noreferrer"
                whileHover={{ y: -6 }}
                transition={{ type: "spring", stiffness: 280, damping: 20 }}
                className="group relative flex flex-col justify-between gap-8 overflow-hidden rounded-3xl border border-border bg-card/70 p-7 backdrop-blur transition-colors hover:border-primary/60 min-h-[280px]"
              >
                <motion.div
                  aria-hidden
                  className={`absolute -inset-px rounded-3xl bg-gradient-to-br ${c.accent} opacity-0 transition-opacity duration-500 group-hover:opacity-100`}
                />
                <motion.div
                  aria-hidden
                  className="absolute -right-16 -top-16 h-48 w-48 rounded-full bg-primary/10 blur-3xl"
                  animate={{ scale: [1, 1.2, 1], opacity: [0.4, 0.7, 0.4] }}
                  transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                />
                <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-primary/10 to-transparent transition-transform duration-1000 group-hover:translate-x-full" />

                <div className="relative flex items-start justify-between">
                  <motion.div
                    whileHover={{ rotate: -6, scale: 1.05 }}
                    transition={{ type: "spring", stiffness: 300 }}
                    className="grid h-14 w-14 place-items-center rounded-2xl border border-border bg-background text-primary shadow-lg shadow-primary/10"
                  >
                    <c.icon className="h-6 w-6" />
                  </motion.div>
                  {c.copyable && (
                    <button
                      type="button"
                      onClick={(e) => { e.preventDefault(); copy(c.value, c.key); }}
                      className="relative rounded-md border border-border bg-background px-2.5 py-1.5 text-[10px] font-mono uppercase tracking-wider text-muted-foreground transition-colors hover:border-primary/50 hover:text-primary"
                      aria-label={`Copy ${c.label}`}
                    >
                      {copied === c.key ? (
                        <span className="inline-flex items-center gap-1 text-success"><Check className="h-3 w-3" /> Copied</span>
                      ) : (
                        <span className="inline-flex items-center gap-1"><Copy className="h-3 w-3" /> Copy</span>
                      )}
                    </button>
                  )}
                </div>

                <div className="relative">
                  <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-muted-foreground">{c.label}</p>
                  <p className="mt-2 font-display text-xl font-semibold">{c.value}</p>
                  <div className="mt-5 inline-flex items-center gap-2 text-sm text-primary">
                    <span>{c.cta}</span>
                    <motion.span
                      animate={{ x: [0, 4, 0] }}
                      transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
                    >
                      <ArrowRight className="h-4 w-4" />
                    </motion.span>
                  </div>
                </div>
              </motion.a>
            ))}
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="mt-10 flex flex-wrap items-center justify-center gap-3"
          >
            <Button asChild size="lg">
              <a href="mailto:e.mohamadhosein@gmail.com">
                <Mail className="mr-2 h-4 w-4" /> Send an email
              </a>
            </Button>
            <Button asChild size="lg" variant="outline">
              <a href="/CV/mohi-cv.pdf">
                <FileDown className="mr-2 h-4 w-4" /> Download CV
              </a>
            </Button>
          </motion.div>
        </div>
      </section>

    </SiteShell>
  );
}

function ProjectsSection() {
  return (
    <section id="projects" className="scroll-mt-20 border-t border-border/60 bg-surface/30">
      <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-80px" }}
          variants={stagger}
          className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between"
        >
          <motion.div variants={fadeUp}>
            <p className="font-mono text-xs uppercase tracking-wider text-primary">// Projects</p>
            <h2 className="mt-2 font-display text-3xl font-semibold sm:text-4xl">Selected case studies</h2>
            <p className="mt-3 max-w-xl text-sm text-muted-foreground">
              Three runnable full-stack demos. TaskManager leads the set, followed by BookReview and the Job Board.
            </p>
          </motion.div>
          <motion.div variants={fadeUp} className="flex flex-wrap gap-2">
            {["All", "Productivity", "Backend", "Full-stack"].map((chip, i) => (
              <span
                key={chip}
                className={`rounded-full border px-3 py-1 text-xs font-mono uppercase tracking-wider ${
                  i === 0
                    ? "border-primary/50 bg-primary/10 text-primary"
                    : "border-border bg-background/40 text-muted-foreground"
                }`}
              >
                {chip}
              </span>
            ))}
          </motion.div>
        </motion.div>

        <div className="mt-12 space-y-10">
          {projects.map((p, idx) => (
            <motion.article
              key={p.name}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }}
              whileHover={{ y: -4 }}
              className="group relative grid gap-0 overflow-hidden rounded-3xl border border-border bg-card shadow-card transition-colors hover:border-primary/40 lg:grid-cols-[1.1fr_0.9fr]"
            >
              <Link
                href={p.href}
                aria-label={`View ${p.name} project`}
                className={`relative order-last min-h-[260px] overflow-hidden border-t border-border outline-none transition-opacity focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background lg:order-${idx % 2 === 0 ? "last" : "first"} lg:border-l lg:border-t-0`}
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${p.accent}`} />
                <div className="absolute inset-0 bg-grid opacity-30" />
                <div className="relative flex h-full items-center justify-center p-8">
                  <motion.div
                    whileHover={{ scale: 1.02, rotate: 0.5 }}
                    transition={{ type: "spring", stiffness: 200, damping: 18 }}
                    className="w-full max-w-sm overflow-hidden rounded-xl border border-border bg-background/95 shadow-2xl backdrop-blur"
                  >
                    <div className="flex items-center gap-1.5 border-b border-border px-3 py-2">
                      <span className="h-2.5 w-2.5 rounded-full bg-destructive/70" />
                      <span className="h-2.5 w-2.5 rounded-full bg-warning/70" />
                      <span className="h-2.5 w-2.5 rounded-full bg-success/70" />
                      <span className="ml-3 font-mono text-[10px] text-muted-foreground">{p.href}</span>
                    </div>
                    {(() => {
                      const Preview = previewMap[p.preview];
                      return <Preview />;
                    })()}
                  </motion.div>
                </div>
              </Link>

              <div className="relative flex flex-col p-7 sm:p-9">
                <div className="flex items-center justify-between">
                  <p className="font-mono text-xs uppercase tracking-wider text-primary">{p.tag}</p>
                  <span className="font-mono text-xs text-muted-foreground">0{idx + 1} / 0{projects.length}</span>
                </div>
                <h3 className="mt-3 font-display text-2xl font-semibold sm:text-3xl">{p.name}</h3>
                <p className="mt-3 text-sm text-muted-foreground sm:text-base">{p.blurb}</p>

                <ul className="mt-6 grid gap-2 sm:grid-cols-2">
                  {p.features.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-sm">
                      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" /> {f}
                    </li>
                  ))}
                </ul>

                <div className="mt-6 flex flex-wrap gap-1.5">
                  {p.tech.map((t) => (
                    <span key={t} className="rounded-md border border-border bg-background/40 px-2 py-0.5 text-xs font-mono text-muted-foreground">{t}</span>
                  ))}
                </div>

                <div className="mt-8 flex flex-wrap items-center gap-3">
                  <Button asChild>
                    <Link href={p.href}>View Project <ArrowRight className="ml-2 h-4 w-4" /></Link>
                  </Button>
                  <Button asChild variant="ghost">
                    <a href="#contact">Discuss this project</a>
                  </Button>
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}

const recommendationAccents = [
  "from-amber-400/30 to-orange-500/10",
  "from-sky-400/30 to-indigo-500/10",
  "from-emerald-400/30 to-teal-500/10",
];

function recommendationAccent(index: number) {
  return recommendationAccents[index % recommendationAccents.length];
}

function isLongRecommendation(body: string) {
  return body.length > 360;
}

function recommendationPreview(body: string) {
  const text = body.replace(/\\n/g, "\n");

  if (! isLongRecommendation(text)) {
    return text;
  }

  const limit = 300;
  const trimmed = text.slice(0, limit);
  const lastSpace = trimmed.lastIndexOf(" ");

  return `${trimmed.slice(0, lastSpace > 220 ? lastSpace : limit).trim()}...`;
}

function RecommendationShowcaseCard({
  accent,
  active,
  recommendation,
}: {
  accent: string;
  active: boolean;
  recommendation: Recommendation;
}) {
  const longRecommendation = isLongRecommendation(recommendation.body);
  const preview = recommendationPreview(recommendation.body);

  return (
    <article
      className={`relative flex h-full overflow-hidden rounded-3xl border border-border shadow-card backdrop-blur sm:p-12 p-8 ${
        active ? "" : "pointer-events-none"
      }`}
    >
      <div className="absolute inset-0 bg-card" aria-hidden />
      <div className={`absolute inset-0 bg-gradient-to-br ${accent} ${active ? "opacity-38" : "opacity-45"}`} aria-hidden />
      <div className="absolute inset-0 bg-grid opacity-10" aria-hidden />
      {active && <div className="absolute inset-0 bg-background/32" aria-hidden />}
      {!active && <div className="absolute inset-0 bg-background/70 backdrop-blur-sm" aria-hidden />}
      {active && (
        <motion.div
          aria-hidden
          className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-primary/10 blur-3xl"
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        />
      )}

      <div className="relative flex h-full flex-col">
        <Quote className="h-10 w-10 text-primary/70" />

        <p className="mt-5 flex-1 overflow-hidden whitespace-pre-line text-base leading-relaxed text-foreground/95 sm:text-lg">
          {preview}
          {longRecommendation && active && (
            <>
              <a
                href={`/recommendations/all#recommendation-${recommendation.id}`}
                className="font-medium text-primary transition-colors hover:text-primary/80"
              >
                (read more)
              </a>
            </>
          )}
        </p>

        <div className="mt-6 flex flex-wrap items-center gap-4 border-t border-border/60 pt-6">
          <div className="flex min-w-0 flex-1 items-center gap-4">
            <RecommendationAvatar recommendation={recommendation} />
            <div className="min-w-0">
              <p className="font-display text-base font-semibold">{recommendation.name}</p>
              <p className="text-xs text-muted-foreground">
                {[recommendation.role, recommendation.company].filter(Boolean).join(" | ")}
              </p>
              <p className="mt-0.5 font-mono text-[10px] uppercase tracking-wider text-muted-foreground/80">
                {recommendation.recommended_at ? formatRecommendationDate(recommendation.recommended_at) : "LinkedIn recommendation"}
                {recommendation.relationship && ` - ${recommendation.relationship}`}
              </p>
            </div>
          </div>

          {active && (
            <div className="flex flex-wrap items-center gap-2">
              <a
                href={`/recommendations/all#recommendation-${recommendation.id}`}
                className="rounded-full border border-border bg-background/40 px-3 py-1.5 font-mono text-[11px] uppercase tracking-wider text-muted-foreground transition-colors hover:border-primary/50 hover:text-primary"
              >
                All recommendations
              </a>
            </div>
          )}
        </div>
      </div>
    </article>
  );
}

function RecommendationAvatar({ recommendation }: { recommendation: Recommendation }) {
  if (recommendation.image_url) {
    return (
      <img
        src={recommendation.image_url}
        alt={`${recommendation.name} profile`}
        className="h-14 w-14 shrink-0 rounded-full border border-border object-cover"
      />
    );
  }

  return (
    <div className="grid h-14 w-14 shrink-0 place-items-center rounded-full border border-border bg-primary/10 font-display text-base font-semibold text-primary">
      {getRecommendationInitials(recommendation.name)}
    </div>
  );
}

function getRecommendationInitials(name: string) {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
}

function formatRecommendationDate(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;

  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date);
}
