import { Head, Link } from "@inertiajs/react";
import {
  ArrowRight, Mail, Linkedin, Send, FileDown, Sparkles, Database, Code2,
  Layers, Server, Shield, Zap, Search, Star, Filter, Check, Plus, MapPin,
  Building2, Phone, Globe, Copy, MessageCircle, GraduationCap, Briefcase,
  Cpu, GitBranch,
} from "lucide-react";
import { motion, useScroll, useTransform, type Variants } from "framer-motion";
import { useRef, useState } from "react";
import { SiteShell } from "@/components/site/SiteShell";
import portraitUrl from "@/assets/portrait.png";
import { Button } from "@/components/ui/button";

const skills = [
  { name: "PHP / Symfony", icon: Server },
  { name: "Laravel", icon: Server },
  { name: "Vue.js", icon: Code2 },
  { name: "NestJS", icon: Server },
  { name: "TypeScript", icon: Code2 },
  { name: "Solidity / Web3", icon: Shield },
  { name: "Node.js", icon: Cpu },
  { name: "MySQL / PostgreSQL", icon: Database },
  { name: "REST APIs", icon: Layers },
  { name: "Tailwind CSS", icon: Sparkles },
  { name: "Docker / CI-CD", icon: GitBranch },
  { name: "Unit Testing", icon: Zap },
];

const projects = [
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

export default function HomePage() {
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroY = useTransform(scrollYProgress, [0, 1], [0, 120]);
  const heroOpacity = useTransform(scrollYProgress, [0, 1], [1, 0.4]);

  const [copied, setCopied] = useState<string | null>(null);
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
                <a href="#projects">View projects</a>
              </Button>
              <Button asChild size="lg" variant="ghost">
                <a href="/CV/mohi-cv.pdf"><FileDown className="mr-2 h-4 w-4" /> Download CV</a>
              </Button>
            </motion.div>

            <motion.dl variants={fadeUp} className="mt-10 grid grid-cols-3 gap-6 border-t border-border pt-6 max-w-md">
              <div><dt className="text-xs uppercase text-muted-foreground">Exprience</dt><dd className="mt-1 font-display text-2xl">3+ yrs</dd></div>
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

      {/* PROJECTS */}
      <section id="projects" className="scroll-mt-20 border-t border-border/60 bg-surface/30">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden" whileInView="show" viewport={{ once: true, margin: "-80px" }}
            variants={stagger}
            className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between"
          >
            <motion.div variants={fadeUp}>
              <p className="font-mono text-xs uppercase tracking-wider text-primary">// Projects</p>
              <h2 className="mt-2 font-display text-3xl font-semibold sm:text-4xl">Selected case studies</h2>
              <p className="mt-3 max-w-xl text-sm text-muted-foreground">
                Three runnable full-stack demos. Each project ships with auth, validation, policies and a clean UI — built to mirror real production work.
              </p>
            </motion.div>
            <motion.div variants={fadeUp} className="flex flex-wrap gap-2">
              {["All", "Backend", "Full-stack", "Marketplace"].map((chip, i) => (
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
              Pragmatic fullstack developer with a Web3 edge
            </h2>
            <p className="mt-5 text-muted-foreground">
              Highly motivated developer with 3+ years of professional experience, specialized in
              <span className="text-foreground"> PHP</span>, <span className="text-foreground">JavaScript</span>,
              and Node.js frameworks (Vue.js, Symfony, Laravel, NestJS). I also build on Ethereum with
              <span className="text-foreground"> Solidity</span> — wallet integrations, on-chain watchers, and
              smart contracts (lottery, fundraising) using Chainlink helpers.
            </p>
            <p className="mt-3 text-muted-foreground">
              I care about clean architecture, unit testing, and shipping reliable features.
              At ABC Hosting I delivered 150+ tasks (80+ features, 50+ bug fixes) across 2000+ commits,
              raised JS test coverage by 87%, and engineered a Node.js Web3 gateway with Metamask &
              Solflare across multiple networks.
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              <Button asChild variant="outline">
                <a href="/CV/mohi-cv.pdf"><FileDown className="mr-2 h-4 w-4" /> Download CV</a>
              </Button>
              <Button asChild variant="ghost"><a href="#contact">Get in touch</a></Button>
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
                  <span className="text-foreground font-medium">PHP/JS Developer</span> �/ ABC Hosting Ltd.
                  <span className="block text-xs text-muted-foreground">Jun 2024 — Present �/ Remote</span>
                </p>
                <p className="mt-2 text-sm">
                  <span className="text-foreground font-medium">Web Developer</span> �/ Health Tourism Center
                  <span className="block text-xs text-muted-foreground">2021 �/ Tehran</span>
                </p>
              </motion.div>

              <motion.div variants={fadeUp} className="rounded-xl border border-border bg-card/60 p-5">
                <div className="flex items-center gap-2">
                  <GraduationCap className="h-4 w-4 text-primary" />
                  <h4 className="font-display text-base font-semibold">Education</h4>
                </div>
                <p className="mt-2 text-sm">
                  <span className="text-foreground font-medium">MBA — Marketing</span>
                  <span className="block text-xs text-muted-foreground">Khorasgan University �/ 2022 — Present</span>
                </p>
                <p className="mt-2 text-sm">
                  <span className="text-foreground font-medium">B.Sc. Mechanical Eng.</span>
                  <span className="block text-xs text-muted-foreground">University of Kashan �/ 2015 — 2019</span>
                </p>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

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
                key: "telegram",
                icon: Send,
                label: "Telegram",
                value: "@emohamadhosein",
                href: "https://t.me/emohamadhosein",
                cta: "Start a chat",
                accent: "from-cyan-400/30 via-cyan-400/10 to-transparent",
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
