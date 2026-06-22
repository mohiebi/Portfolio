import { Head, Link } from "@inertiajs/react";
import {
  ArrowRight, Mail, Linkedin, FileDown, Sparkles, Database, Code2,
  Layers, Server, Shield, Zap, Search, Star, Filter, Check, Plus, MapPin,
  Building2, Phone, Globe, Copy, MessageCircle, GraduationCap, Briefcase,
  Cpu, GitBranch, Github, Quote, ChevronLeft, ChevronRight,
  CalendarDays, Clock, Newspaper, Rocket, Settings2, BrainCircuit, ExternalLink,
} from "lucide-react";
import servicesCoverImg from "@/assets/services cover on main.webp";
import { motion, useScroll, useTransform, useReducedMotion, type Variants } from "framer-motion";
import { useRef, useState, type ReactNode } from "react";
import { SiteShell } from "@/components/site/SiteShell";
import portraitUrl from "@/assets/portrait.webp";
import { Button } from "@/components/ui/button";
import { featuredProjects, type PortfolioProject } from "@/lib/projects";
import type { Article, CaseStudy, Recommendation } from "@/types";

const CALENDLY_URL = "https://calendly.com/e-mohamadhosein/30min";

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

function CashPilotPreview() {
  const rows = [
    { label: "Income", value: "+$4,820", tone: "text-emerald-400" },
    { label: "Bills", value: "-$1,240", tone: "text-rose-300" },
    { label: "Savings", value: "$980", tone: "text-cyan-300" },
  ];

  return (
    <div className="space-y-3 p-4">
      <div className="grid grid-cols-[1fr_auto] items-end gap-3 rounded-lg border border-border bg-card p-3">
        <div>
          <span className="font-mono text-[9px] uppercase tracking-wider text-muted-foreground">Balance</span>
          <p className="mt-1 font-display text-xl font-semibold">$8,430</p>
        </div>
        <div className="flex h-10 items-end gap-1">
          {[45, 72, 54, 88, 66].map((height, index) => (
            <span key={index} className="w-2 rounded-sm bg-primary/70" style={{ height: `${height}%` }} />
          ))}
        </div>
      </div>
      <ul className="space-y-1.5">
        {rows.map((row, index) => (
          <motion.li
            key={row.label}
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.06 }}
            viewport={{ once: true }}
            className="flex items-center justify-between rounded-md border border-border bg-background/60 px-2.5 py-1.5"
          >
            <span className="text-[11px] text-muted-foreground">{row.label}</span>
            <span className={`font-mono text-[11px] ${row.tone}`}>{row.value}</span>
          </motion.li>
        ))}
      </ul>
    </div>
  );
}

function RoutinePreview() {
  const habits = [
    { label: "Morning focus", complete: true },
    { label: "Workout", complete: true },
    { label: "Deep work", complete: false },
  ];

  return (
    <div className="space-y-3 p-4">
      <div className="rounded-lg border border-primary/30 bg-primary/10 p-3">
        <div className="flex items-center gap-2">
          <BrainCircuit className="h-4 w-4 text-primary" />
          <span className="font-mono text-[10px] uppercase tracking-wider text-primary">AI coach</span>
        </div>
        <p className="mt-2 text-[11px] leading-5 text-foreground/85">
          Today: protect your focus block before admin work.
        </p>
      </div>
      <ul className="space-y-1.5">
        {habits.map((habit, index) => (
          <motion.li
            key={habit.label}
            initial={{ opacity: 0, x: -8 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.06 }}
            viewport={{ once: true }}
            className="flex items-center gap-2 rounded-md border border-border bg-card px-2 py-1.5"
          >
            <span className={`h-2.5 w-2.5 rounded-full ${habit.complete ? "bg-primary" : "bg-muted"}`} />
            <span className="text-[11px] text-muted-foreground">{habit.label}</span>
          </motion.li>
        ))}
      </ul>
    </div>
  );
}

function DesignPreview() {
  return (
    <div className="space-y-3 p-4">
      <div className="overflow-hidden rounded-lg border border-border bg-card">
        <div className="h-16 bg-gradient-to-br from-pink-300/50 via-rose-300/25 to-amber-200/40" />
        <div className="space-y-2 p-3">
          <div className="h-2 w-2/3 rounded bg-foreground/80" />
          <div className="h-1.5 w-full rounded bg-muted" />
          <div className="h-1.5 w-4/5 rounded bg-muted" />
        </div>
      </div>
      <div className="grid grid-cols-3 gap-1.5">
        {["Brand", "Work", "Contact"].map((item) => (
          <span key={item} className="rounded-md border border-border bg-background/60 px-2 py-1 text-center font-mono text-[9px] text-muted-foreground">
            {item}
          </span>
        ))}
      </div>
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

function RealEstatePreview() {
  const listings = [
    { price: "$480,000", beds: 3, baths: 2, city: "Austin" },
    { price: "$320,000", beds: 2, baths: 1, city: "Denver" },
    { price: "$650,000", beds: 4, baths: 3, city: "Seattle" },
  ];
  return (
    <div className="space-y-2 p-4">
      <div className="flex items-center gap-1.5">
        <span className="rounded-full border border-primary/40 bg-primary/10 px-1.5 py-0.5 text-[9px] font-mono text-primary">All</span>
        <span className="rounded-full border border-border px-1.5 py-0.5 text-[9px] font-mono text-muted-foreground">2+ beds</span>
        <span className="rounded-full border border-border px-1.5 py-0.5 text-[9px] font-mono text-muted-foreground">Under $500k</span>
      </div>
      <ul className="space-y-1.5">
        {listings.map((l, i) => (
          <motion.li
            key={i}
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            viewport={{ once: true }}
            className="rounded-md border border-border bg-card p-2"
          >
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold">{l.price}</span>
              <span className="font-mono text-[9px] text-primary">View</span>
            </div>
            <div className="mt-0.5 flex items-center gap-2 text-[9px] text-muted-foreground">
              <span className="inline-flex items-center gap-0.5"><MapPin className="h-2.5 w-2.5" />{l.city}</span>
              <span>{l.beds} bd · {l.baths} ba</span>
            </div>
          </motion.li>
        ))}
      </ul>
    </div>
  );
}

const previewMap = {
  books: BooksPreview,
  cash: CashPilotPreview,
  design: DesignPreview,
  tasks: TasksPreview,
  routine: RoutinePreview,
  jobs: JobsPreview,
  realestate: RealEstatePreview,
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
  articles?: Article[];
  caseStudies?: CaseStudy[];
  recommendations?: Recommendation[];
};

export default function HomePage({ articles = [], caseStudies = [], recommendations = [] }: Props) {
  const shouldReduceMotion = useReducedMotion();
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
      <Head title="Mohi - Back-End / Full-Stack Engineer">
        {[
          <meta key="description" name="description" content="Backend-focused Full-Stack Engineer with 3+ years delivering production systems across fintech, blockchain, and AI-integrated platforms." />,
          <meta key="og:title" property="og:title" content="Mohi - Back-End / Full-Stack Engineer" />,
          <meta key="og:description" property="og:description" content="PHP, Node.js, Symfony, Laravel, NestJS, Vue.js, APIs, Web3 wallet integrations, AI-gated backend services, and scalable production systems." />,
        ]}
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
          transition={{ duration: 8, repeat: shouldReduceMotion ? 0 : Infinity, ease: "easeInOut" }}
        />
        <motion.div
          aria-hidden
          className="absolute -bottom-32 -left-32 h-96 w-96 rounded-full bg-success/15 blur-3xl"
          animate={{ scale: [1, 1.2, 1], opacity: [0.4, 0.7, 0.4] }}
          transition={{ duration: 10, repeat: shouldReduceMotion ? 0 : Infinity, ease: "easeInOut", delay: 1 }}
        />

        <motion.div
          style={{ opacity: heroOpacity }}
          className="relative mx-auto grid max-w-7xl gap-12 px-4 py-16 sm:px-6 lg:grid-cols-[1.1fr_0.9fr] lg:py-24 lg:px-8"
        >
          <motion.div variants={stagger} initial="hidden" animate="show">
            <motion.div
              variants={fadeUp}
              className="inline-flex items-center gap-2 rounded-full border border-amber-500/40 bg-amber-500/10 px-3 py-1 text-xs font-mono uppercase tracking-wider text-amber-400"
            >
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-amber-400 opacity-75" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-amber-400" />
              </span>
              Now taking 2 new clients — July 2026
            </motion.div>

            <motion.h1
              variants={fadeUp}
              className="mt-5 font-display text-4xl font-semibold tracking-tight text-balance sm:text-5xl lg:text-6xl"
            >
              I build the backend systems that{" "}
              <span className="text-primary">keep your business running</span>.
            </motion.h1>

            <motion.p variants={fadeUp} className="mt-5 max-w-xl text-lg text-muted-foreground">
              Hi, I'm <span className="text-foreground font-medium">MohammadHosein Ebrahimi</span> - a back-end / full-stack engineer with
              3+ years delivering production systems across fintech, blockchain, and AI-integrated platforms.
            </motion.p>

            <motion.div variants={fadeUp} className="mt-7 flex flex-wrap items-center gap-3">
              <Button asChild size="lg" className="glow-primary">
                <a href="#contact">Book a free call <ArrowRight className="ml-2 h-4 w-4" /></a>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link href="/services">View services</Link>
              </Button>
              <Button asChild size="lg" variant="ghost">
                <a href="/CV/mohi-cv.pdf"><FileDown className="mr-2 h-4 w-4" /> Download CV</a>
              </Button>
            </motion.div>

            <motion.dl variants={fadeUp} className="mt-10 grid grid-cols-3 gap-6 border-t border-border pt-6 max-w-md">
              <div>
                <dd className="font-display text-2xl text-primary">85%</dd>
                <dt className="mt-0.5 text-xs uppercase tracking-wider text-muted-foreground">Faster page loads delivered</dt>
              </div>
              <div>
                <dd className="font-display text-2xl text-primary">3+</dd>
                <dt className="mt-0.5 text-xs uppercase tracking-wider text-muted-foreground">Years in production</dt>
              </div>
              <div>
                <dd className="font-display text-2xl text-primary">1.5K+/yr</dd>
                <dt className="mt-0.5 text-xs uppercase tracking-wider text-muted-foreground">Commits — S-tier output</dt>
              </div>
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
              transition={{ duration: 4, repeat: shouldReduceMotion ? 0 : Infinity, ease: "easeInOut" }}
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
              <div className="absolute bottom-3 left-4 right-4 rounded-xl border border-border bg-background/80 px-4 py-3 backdrop-blur">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-mono text-muted-foreground">~ /current</span>
                  <span className="inline-flex items-center gap-1 text-success">
                    <span className="h-1.5 w-1.5 rounded-full bg-success animate-pulse" />
                    delivering sprint 3
                  </span>
                </div>
                <p className="mt-1 font-display text-sm">AI CRM integration · Laravel + NestJS</p>
              </div>
            </motion.div>
          </motion.div>
        </motion.div>
      </section>


      <ServicesSection />

      {activeRecommendation && (
        <section id="recommendations" className="relative scroll-mt-20 overflow-hidden border-t border-border/60">
          <motion.div
            aria-hidden
            className="absolute -top-24 left-1/3 h-72 w-72 rounded-full bg-primary/15 blur-3xl"
            animate={{ scale: [1, 1.15, 1], opacity: [0.4, 0.7, 0.4] }}
            transition={{ duration: 8, repeat: shouldReduceMotion ? 0 : Infinity, ease: "easeInOut" }}
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
                href="/recommendations/all"
                className="inline-flex items-center gap-2 self-start rounded-full border border-border bg-background/60 px-3 py-1.5 text-xs font-mono uppercase tracking-wider text-muted-foreground transition-colors hover:border-primary/50 hover:text-primary"
              >
                All recommendations
              </a>
            </motion.div>

            <div className="relative mt-10">
              <div className="relative mx-auto max-w-3xl sm:h-[520px] md:h-[480px]">
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
                      className={`${isCenter ? "relative sm:absolute sm:inset-0" : "hidden cursor-pointer sm:absolute sm:inset-0 sm:block"} ${role === "hidden" ? "pointer-events-none" : ""}`}
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
                <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex flex-wrap items-center gap-2">
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

      <CaseStudiesSection caseStudies={caseStudies} />

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
              I cut a client's page load time by 85% — here's how I work
            </h2>
            <p className="mt-5 text-muted-foreground">
              A legacy PHP stack was costing a business customers every day. I migrated it to Vue.js, rebuilt the backend architecture, and shipped it in weeks. <span className="text-foreground font-medium">85% faster. Zero downtime. Still running.</span>
            </p>
            <p className="mt-3 text-muted-foreground">
              That's how I approach every engagement — diagnose the real bottleneck, build the system that removes it, ship it clean.
              With <span className="text-foreground">3+ years</span> across fintech, blockchain, and AI-integrated platforms, I've delivered
              <span className="text-foreground"> 1,500+ commits/year</span> on production systems using
              <span className="text-foreground"> Laravel, Symfony, NestJS</span> and <span className="text-foreground">Vue.js</span> — built Web3 pipelines processing 1,000+ daily transactions, and shipped AI-gated backend services including a custom non-custodial crypto payment system.
            </p>
            <p className="hidden">
              Highly motivated developer with 3+ years of professional experience, specialized in
              <span className="text-foreground"> PHP</span>, <span className="text-foreground">JavaScript</span>,
              and Node.js frameworks (Vue.js, Symfony, Laravel, NestJS). I also build on Ethereum with
              <span className="text-foreground"> Solidity</span> - wallet integrations, on-chain watchers, and
              smart contracts (lottery, fundraising) using Chainlink helpers.
            </p>
            <p className="hidden">
              I care about clean architecture, unit testing, and shipping reliable features.
              At ABC Hosting I modernized legacy PHP architecture, containerized the environment with Docker,
              migrated the frontend to Vue.js, and added multilingual, multi-currency support for 7 countries.
              On Mintme.com I delivered 100+ Symfony/Vue tasks, contributed 1,500+ GitLab commits, and built
              Node.js Web3 data pipelines plus wallet integrations for MetaMask and Solflare.
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
                  className="flex cursor-default items-center gap-2 rounded-lg border border-border bg-card/60 px-3 py-2.5 text-sm transition-colors"
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
                  <span className="block text-xs text-muted-foreground">Dec 2025 – Present / Belize City, Belize</span>
                </p>
                <p className="mt-2 text-sm">
                  <span className="text-foreground font-medium">Full-Stack Developer</span> / Mintme.com
                  <span className="block text-xs text-muted-foreground">Jun 2024 – Nov 2025 / Belize City, Belize</span>
                </p>
                <p className="mt-2 text-sm">
                  <span className="text-foreground font-medium">AI Integration Developer</span> / ProAce CRM Project
                  <span className="block text-xs text-muted-foreground">Jun 2025 – Dec 2025 / Canada, Remote</span>
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


      <ArticlesSection articles={articles} />

      {/* CONTACT */}
      <section id="contact" className="relative overflow-hidden border-t border-border/60 bg-surface/40">
        <div className="absolute inset-0 bg-grid opacity-20 [mask-image:radial-gradient(ellipse_at_center,black,transparent_75%)]" />
        <motion.div
          aria-hidden
          className="absolute left-1/2 top-0 h-80 w-80 -translate-x-1/2 rounded-full bg-primary/20 blur-[80px]"
          animate={{ scale: [1, 1.15, 1] }}
          transition={{ duration: 6, repeat: shouldReduceMotion ? 0 : Infinity, ease: "easeInOut" }}
        />

        <div className="relative mx-auto max-w-5xl px-4 py-20 sm:px-6 lg:px-8">

          {/* Section header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <p className="font-mono text-xs uppercase tracking-wider text-primary">// Contact</p>
            <h2 className="mt-2 font-display text-4xl font-semibold sm:text-5xl">
              Let's build something <span className="text-primary">solid</span>.
            </h2>
            <p className="mt-3 text-muted-foreground">
              Open to freelance projects, fullstack roles and Web3 collaborations.
            </p>
            <div className="mt-4 flex flex-wrap justify-center gap-2 text-sm">
              {["Responds within 24h", "No commitment", "First call free"].map((item) => (
                <span key={item} className="inline-flex items-center gap-1.5 rounded-full border border-primary/25 bg-primary/8 px-3 py-1 text-xs text-primary/90">
                  <Check className="h-3 w-3" /> {item}
                </span>
              ))}
            </div>
          </motion.div>

          {/* ── PRIMARY CTA — Calendly ── */}
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mt-10"
          >
            <div className="relative overflow-hidden rounded-3xl border border-primary/40 bg-card/80 p-8 shadow-[0_0_60px_-12px_rgba(0,0,0,0.5)] ring-1 ring-primary/20 sm:p-10">
              {/* Glow */}
              <div className="absolute -inset-px rounded-3xl bg-gradient-to-br from-primary/15 via-transparent to-transparent" aria-hidden />
              <motion.div
                aria-hidden
                className="absolute right-0 top-0 h-64 w-64 rounded-full bg-primary/10 blur-3xl"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 8, repeat: shouldReduceMotion ? 0 : Infinity, ease: "easeInOut" }}
              />

              <div className="relative flex flex-col items-start gap-6 sm:flex-row sm:items-center sm:justify-between">
                <div className="max-w-xl">
                  <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl border border-primary/40 bg-primary/15 text-primary">
                    <CalendarDays className="h-5 w-5" />
                  </div>
                  <h3 className="mt-4 font-display text-2xl font-semibold sm:text-3xl">
                    Pick a time that works for you
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    A focused 30-minute call to map your project, timeline, and the fastest path to a working system.
                  </p>
                  <div className="mt-4 flex flex-wrap gap-3 text-xs text-muted-foreground">
                    <span className="inline-flex items-center gap-1.5"><Clock className="h-3.5 w-3.5 text-primary" /> 30 minutes</span>
                    <span className="inline-flex items-center gap-1.5"><Check className="h-3.5 w-3.5 text-primary" /> Free consultation</span>
                    <span className="inline-flex items-center gap-1.5"><Check className="h-3.5 w-3.5 text-primary" /> No obligation</span>
                  </div>
                </div>
                <Button asChild size="lg" className="glow-primary shrink-0 min-h-[52px] px-8 text-base font-semibold focus-visible:ring-2 focus-visible:ring-primary/50">
                  <a href={CALENDLY_URL} target="_blank" rel="noreferrer">
                    Book a free call <ArrowRight className="ml-2 h-4 w-4" />
                  </a>
                </Button>
              </div>
            </div>
          </motion.div>

          {/* ── SECONDARY — other channels ── */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-8"
          >
            <div className="mb-5 flex flex-col gap-2 text-center sm:flex-row sm:items-end sm:justify-between sm:text-left">
              <div>
                <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground/60">or reach out directly</p>
                <h3 className="mt-1 font-display text-2xl font-semibold">Choose the channel that fits</h3>
              </div>
              <p className="max-w-sm text-sm text-muted-foreground">Email is best for scoped project details. LinkedIn works well for quick context.</p>
            </div>
            <div className="grid gap-4 sm:grid-cols-3">
              {[
                { key: "email",    icon: Mail,     label: "Email",    value: "e.mohamadhosein@gmail.com", href: "mailto:e.mohamadhosein@gmail.com", copyable: true  },
                { key: "linkedin", icon: Linkedin,  label: "LinkedIn", value: "linkedin.com/in/mohiebi",    href: "https://www.linkedin.com/in/mohiebi",             },
                { key: "github",   icon: Github,    label: "GitHub",   value: "github.com/mohiebi",         href: "https://github.com/mohiebi",                     },
              ].map((c) => (
                <a
                  key={c.key}
                  href={c.href}
                  target={c.href.startsWith("http") ? "_blank" : undefined}
                  rel="noreferrer"
                  className="group relative flex min-h-[190px] cursor-pointer flex-col items-start gap-5 overflow-hidden rounded-3xl border border-border bg-card/65 p-5 shadow-card transition-all duration-200 hover:-translate-y-1 hover:border-primary/45 hover:bg-card/85 focus-visible:ring-2 focus-visible:ring-primary/40"
                >
                  <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-primary/70 via-primary/20 to-transparent" aria-hidden />
                  <div className="flex w-full items-start justify-between gap-4">
                    <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl border border-primary/30 bg-primary/10 text-primary transition-colors group-hover:border-primary/50">
                      <c.icon className="h-5 w-5" />
                    </div>
                    <span className="rounded-full border border-border bg-background/50 px-2.5 py-1 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                      {c.label}
                    </span>
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="break-words text-base font-semibold leading-snug">{c.value}</p>
                    <p className="mt-2 text-sm leading-6 text-muted-foreground">
                      {c.key === "email" && "Send scope, timeline, budget, or a rough idea."}
                      {c.key === "linkedin" && "Good for intros, hiring conversations, and quick context."}
                      {c.key === "github" && "Browse code, activity, and implementation style."}
                    </p>
                  </div>
                  {c.copyable ? (
                    <button
                      type="button"
                      onClick={(e) => { e.preventDefault(); copy(c.value, c.key); }}
                      aria-label="Copy email"
                      className="mt-auto shrink-0 rounded-lg border border-border bg-background/50 px-3 py-2 font-mono text-xs text-muted-foreground transition-colors hover:border-primary/40 hover:text-primary"
                    >
                      {copied === c.key ? (
                        <span className="inline-flex items-center gap-1 text-success"><Check className="h-3 w-3" />copied</span>
                      ) : (
                        <span className="inline-flex items-center gap-1"><Copy className="h-3 w-3" />copy</span>
                      )}
                    </button>
                  ) : (
                    <span className="mt-auto inline-flex items-center gap-2 text-sm font-medium text-primary">
                      Open profile
                      <ArrowRight className="h-4 w-4 shrink-0 transition-transform group-hover:translate-x-1" />
                    </span>
                  )}
                </a>
              ))}
            </div>
          </motion.div>

        </div>
      </section>

    </SiteShell>
  );
}

const homeServices = [
  { id: "launch",     slug: "launch-sprint",            Icon: Rocket,       name: "Launch Sprint",          tagline: "Idea → production in weeks",       outcome: "Live in 14 days",                          color: "text-blue-400"   },
  { id: "operations", slug: "operations-system-sprint", Icon: Settings2,    name: "Operations System",      tagline: "Replace manual work with systems", outcome: "Manual work → automated workflows",         color: "text-primary"    },
  { id: "ai",         slug: "ai-operations-platform",   Icon: BrainCircuit, name: "AI Operations Platform", tagline: "Make your product intelligent",    outcome: "AI-powered, scales without rebuilding",     color: "text-violet-400" },
];

function ServicesSection() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <section id="services" className="relative overflow-hidden border-t border-border/60">
      <div className="absolute inset-0 bg-grid opacity-15 [mask-image:radial-gradient(ellipse_at_center,black,transparent_70%)]" />
      <motion.div
        aria-hidden
        className="absolute left-1/2 -top-32 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-primary/10 blur-[100px]"
        animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
        transition={{ duration: 10, repeat: shouldReduceMotion ? 0 : Infinity, ease: "easeInOut" }}
      />

      <div className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
          className="mx-auto max-w-2xl text-center"
        >
          <p className="font-mono text-xs uppercase tracking-wider text-primary">// Services</p>
          <h2 className="mt-2 font-display text-3xl font-semibold sm:text-4xl lg:text-5xl">
            Systems that{" "}
            <span className="text-primary">run your business</span>
            {" "}— not just your website.
          </h2>
          <p className="mt-4 text-muted-foreground">
            From launch to full AI-powered operations — each engagement ships a working system with measurable business impact.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="relative mt-12 rounded-3xl border border-border/60 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.5)]"
        >
          <div className="overflow-hidden rounded-3xl">
            <img
              src={servicesCoverImg}
              alt="Launch Sprint, Operations System and AI Operations Platform"
              loading="lazy"
              width={1920}
              height={960}
              className="w-full object-contain"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background/60 via-transparent to-transparent" />
          </div>

          {/* Icons straddling the bottom edge */}
          <div className="absolute bottom-0 left-0 right-0 grid translate-y-1/2 grid-cols-3">
            {homeServices.map((service) => (
              <div key={service.id} className="flex justify-center">
                <div className={`grid h-11 w-11 place-items-center rounded-xl border-2 border-border bg-card shadow-lg ${service.color}`}>
                  <service.Icon className="h-5 w-5" />
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Service labels with outcome */}
        <div className="mt-10 grid grid-cols-3 gap-4 text-center">
          {homeServices.map((service, i) => (
            <motion.div
              key={service.id}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.35, delay: i * 0.07 }}
            >
              <p className="font-display text-base font-semibold sm:text-lg">{service.name}</p>
              <p className={`mt-1 font-mono text-[10px] uppercase tracking-wider ${service.color}`}>{service.outcome}</p>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="mt-10 flex flex-col items-center gap-4"
        >
          <p className="text-sm text-muted-foreground">
            Not sure which one fits? Browse all packages with full details and pricing.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Button asChild size="lg" className="glow-primary">
              <Link href="/services">
                Explore all services <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <a href="#contact">Book a free call</a>
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
const caseStudyIcons = {
  web3: Cpu,
  modernize: Layers,
  ai: Sparkles,
  web: Globe,
} as const;

const caseStudyTabTones = {
  web3: "fill-amber-400/25",
  modernize: "fill-sky-400/25",
  ai: "fill-emerald-400/25",
  web: "fill-rose-400/25",
} as const;

function CaseStudiesSection({ caseStudies }: { caseStudies: CaseStudy[] }) {
  if (caseStudies.length === 0) {
    return null;
  }

  return (
    <section id="case-studies" className="scroll-mt-20 border-t border-border/60">
      <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-80px" }}
          variants={stagger}
          className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between"
        >
          <motion.div variants={fadeUp}>
            <p className="font-mono text-xs uppercase tracking-wider text-primary">// Case Studies</p>
            <h2 className="mt-2 font-display text-3xl font-semibold sm:text-4xl">Real engineering work, end-to-end</h2>
            <p className="mt-3 max-w-xl text-sm text-muted-foreground">
              A closer look at production work across Web3, backend architecture, AI features, and modernization.
            </p>
          </motion.div>
          <motion.div variants={fadeUp}>
            <Button asChild variant="outline">
              <Link href="/case-studies">All case studies <ArrowRight className="ml-2 h-4 w-4" /></Link>
            </Button>
          </motion.div>
        </motion.div>

        <div className="mt-12 grid gap-7 lg:grid-cols-2">
          {caseStudies.slice(0, 4).map((caseStudy, index) => (
            <CaseStudyCard key={caseStudy.id} caseStudy={caseStudy} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}

function CaseStudyCard({ caseStudy, index }: { caseStudy: CaseStudy; index: number }) {
  const Icon = caseStudyIcons[caseStudy.cover] ?? Globe;
  const tabTone = caseStudyTabTones[caseStudy.cover] ?? "fill-primary/20";
  const tabLabel = caseStudy.company ?? caseStudy.role ?? "Case study";
  const tabDetail = caseStudy.period ?? caseStudy.location;

  return (
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.5, delay: index * 0.05 }}
      className="group relative flex min-h-[25rem] flex-col pt-12"
    >
      <div className="absolute left-0 top-0 z-10 h-12 w-[60%] max-w-[24rem]">
        <svg
          aria-hidden
          viewBox="0 0 360 48"
          preserveAspectRatio="none"
          className="absolute inset-0 h-full w-full drop-shadow-sm"
        >
          <path
            d="M0 48V16Q0 0 16 0H246Q261 0 269 11L302 48H0Z"
            className={`${tabTone} stroke-border transition-colors group-hover:stroke-primary/60`}
            vectorEffect="non-scaling-stroke"
          />
        </svg>
        <div className="absolute inset-y-0 left-0 right-16 overflow-hidden rounded-tl-2xl bg-grid opacity-20" aria-hidden />
        <div className="relative flex h-full min-w-0 flex-col justify-center px-7 pr-22">
          <p className="mt-2 truncate font-display text-base font-semibold">{tabLabel}</p>
         
        </div>
      </div>

      <div className="relative flex flex-1 flex-col overflow-hidden rounded-b-3xl rounded-tr-3xl border border-border bg-card/75 p-6 pt-8 shadow-card backdrop-blur transition-colors group-hover:border-primary/60 sm:p-7 sm:pt-9">
        <div className={`absolute inset-x-0 top-0 h-1 bg-gradient-to-r ${caseStudy.accent}`} aria-hidden />
        <div className="absolute inset-0 bg-grid opacity-10" aria-hidden />
        <div className="relative flex items-start justify-between gap-4">
          <div className="min-w-0">
            <h3 className="font-display text-2xl font-semibold leading-tight">{caseStudy.title}</h3>
            {caseStudy.tag && (
              <p className="mt-2 font-mono text-[11px] uppercase tracking-wider text-primary">{caseStudy.tag}</p>
            )}
          </div>
          <div className="flex shrink-0 flex-col items-end gap-2">
            <div className="grid h-12 w-12 place-items-center rounded-xl border border-border bg-background/70 text-primary backdrop-blur">
              <Icon className="h-5 w-5" />
            </div>
            {(caseStudy.impact ?? [])[0] && (
              <div className="rounded-lg border border-primary/30 bg-primary/10 px-2.5 py-1.5 text-right">
                <p className="font-display text-lg font-bold leading-none text-primary">{(caseStudy.impact ?? [])[0].value}</p>
                <p className="mt-0.5 font-mono text-[9px] uppercase tracking-wider text-primary/70">{(caseStudy.impact ?? [])[0].label}</p>
              </div>
            )}
          </div>
        </div>

        <p className="relative mt-4 text-sm leading-6 text-muted-foreground">{caseStudy.summary}</p>

        <div className="relative mt-5 flex flex-wrap gap-1.5">
          {(caseStudy.stack ?? []).slice(0, 6).map((item) => (
            <span key={item} className="rounded-md border border-border bg-background/40 px-2 py-0.5 text-xs font-mono text-muted-foreground">
              {item}
            </span>
          ))}
        </div>

        <div className="relative mt-auto pt-7">
          <Button asChild variant="outline" className="group/btn">
            <Link href={`/case-studies/${caseStudy.slug}`}>
              Read case study
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover/btn:translate-x-1" />
            </Link>
          </Button>
        </div>
      </div>
    </motion.article>
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
            <h2 className="mt-2 font-display text-3xl font-semibold sm:text-4xl">Featured builds</h2>
            <p className="mt-3 max-w-xl text-sm text-muted-foreground">
              The top projects now lead with TaskManager, CashPilot, AI Routine Coach, and Mahdieh Design. The full project archive has the rest.
            </p>
          </motion.div>
          <motion.div variants={fadeUp}>
            <Button asChild variant="outline">
              <Link href="/projects">
                View all projects
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </motion.div>
        </motion.div>

        <div className="mt-12 space-y-10">
          {featuredProjects.map((p, idx) => (
            <motion.article
              key={p.name}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }}
              whileHover={{ y: -4 }}
              className={`group relative grid gap-0 overflow-hidden rounded-3xl border border-border bg-card shadow-card transition-colors hover:border-primary/40 ${
                idx % 2 === 0 ? "lg:grid-cols-[1.1fr_0.9fr]" : "lg:grid-cols-[0.9fr_1.1fr]"
              }`}
            >
              <ProjectPreviewLink project={p} index={idx} />

              <div className="relative flex flex-col p-7 sm:p-9">
                <div className="flex items-center justify-between">
                  <p className="font-mono text-xs uppercase tracking-wider text-primary">{p.tag}</p>
                  <span className="font-mono text-xs text-muted-foreground">0{idx + 1} / 0{featuredProjects.length}</span>
                </div>
                <h3 className="mt-3 font-display text-2xl font-semibold sm:text-3xl">{p.name}</h3>
                {/* Outcome-first — what this solves */}
                <p className="mt-2 text-sm font-medium text-foreground/90 sm:text-base">{p.outcome}</p>
                <p className="mt-2 text-sm text-muted-foreground sm:text-base">{p.blurb}</p>

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

                <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
                  <ProjectPrimaryLink
                    project={p}
                    className="inline-flex min-h-[44px] w-full items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow transition-all hover:-translate-y-0.5 hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 sm:w-auto"
                  >
                      View Project
                      {p.external ? <ExternalLink className="ml-2 h-4 w-4" /> : <ArrowRight className="ml-2 h-4 w-4" />}
                  </ProjectPrimaryLink>
                  <a
                    href="#contact"
                    className="inline-flex min-h-[44px] w-full items-center justify-center rounded-xl border border-border bg-background/55 px-6 py-3 text-sm font-semibold text-foreground shadow-sm transition-all hover:-translate-y-0.5 hover:border-primary/50 hover:bg-card focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 sm:w-auto"
                  >
                    Discuss this project
                  </a>
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}

function ProjectPreviewLink({ project, index }: { project: PortfolioProject; index: number }) {
  const className = `relative order-last min-h-[260px] overflow-hidden border-t border-border outline-none transition-opacity focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background ${
    index % 2 === 0 ? "lg:order-last" : "lg:order-first"
  } lg:border-l lg:border-t-0`;
  const content = <ProjectPreviewMockup project={project} />;

  if (project.external) {
    return (
      <a href={project.href} target="_blank" rel="noreferrer" aria-label={`View ${project.name} project`} className={className}>
        {content}
      </a>
    );
  }

  return (
    <Link href={project.href} aria-label={`View ${project.name} project`} className={className}>
      {content}
    </Link>
  );
}

function ProjectPreviewMockup({ project }: { project: PortfolioProject }) {
  const Preview = previewMap[project.preview];

  return (
    <>
      <div className={`absolute inset-0 bg-gradient-to-br ${project.accent}`} />
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
            <span className="ml-3 truncate font-mono text-[10px] text-muted-foreground">{project.href}</span>
          </div>
          <Preview />
        </motion.div>
      </div>
    </>
  );
}

function ProjectPrimaryLink({ project, children, className }: { project: PortfolioProject; children: ReactNode; className: string }) {
  if (project.external) {
    return (
      <a href={project.href} target="_blank" rel="noreferrer" className={className}>
        {children}
      </a>
    );
  }

  return <Link href={project.href} className={className}>{children}</Link>;
}

function ArticlesSection({ articles }: { articles: Article[] }) {
  if (articles.length === 0) {
    return null;
  }

  return (
    <section id="articles" className="scroll-mt-20 border-t border-border/60">
      <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-80px" }}
          variants={stagger}
          className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between"
        >
          <motion.div variants={fadeUp}>
            <p className="font-mono text-xs uppercase tracking-wider text-primary">// Articles</p>
            <h2 className="mt-2 font-display text-3xl font-semibold sm:text-4xl">Technical notes and build logs</h2>
            <p className="mt-3 max-w-xl text-sm text-muted-foreground">
              Practical writing on backend design, Laravel delivery, production debugging, and the choices behind real systems.
            </p>
          </motion.div>
          <motion.div variants={fadeUp}>
            <Button asChild variant="outline">
              <Link href="/articles">Read how I think about systems <ArrowRight className="ml-2 h-4 w-4" /></Link>
            </Button>
          </motion.div>
        </motion.div>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {articles.slice(0, 3).map((article, index) => (
            <motion.article
              key={article.id}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: index * 0.06 }}
            >
              <Link
                href={`/articles/${article.slug}`}
                className="group flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-card/75 shadow-card transition-all duration-300 hover:-translate-y-1 hover:border-primary/50 hover:shadow-[0_16px_40px_-12px_rgba(0,0,0,0.4)]"
              >
                {/* Cover */}
                <div className="relative overflow-hidden">
                  {article.cover_url ? (
                    <img
                      src={article.cover_url}
                      alt=""
                      className="aspect-[16/9] w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="aspect-[16/9] bg-grid opacity-40" />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-background/10 to-transparent" aria-hidden />

                  {/* Top-left chips */}
                  <div className="absolute left-4 top-4 flex flex-wrap items-center gap-2">
                    {article.category && (
                      <span className="rounded-full border border-primary/30 bg-background/80 px-2.5 py-1 font-mono text-[10px] uppercase tracking-wider text-primary backdrop-blur">
                        {article.category}
                      </span>
                    )}
                    <span className="inline-flex items-center gap-1 rounded-full border border-border/60 bg-background/80 px-2.5 py-1 text-xs text-muted-foreground backdrop-blur">
                      <Clock className="h-3 w-3" /> {article.reading_time} min
                    </span>
                  </div>
                </div>

                {/* Body */}
                <div className="flex flex-1 flex-col p-6">
                  <h3 className="font-display text-xl font-semibold leading-snug transition-colors group-hover:text-primary">
                    {article.title}
                  </h3>
                  <p className="mt-2.5 line-clamp-2 text-sm leading-relaxed text-muted-foreground">
                    {article.excerpt}
                  </p>

                  <div className="mt-auto flex items-center justify-between pt-5">
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <CalendarDays className="h-3.5 w-3.5 text-primary" />
                      {article.published_at ? formatArticleDate(article.published_at) : "Published note"}
                    </div>
                    <span className="inline-flex items-center gap-1 text-sm font-medium text-primary opacity-0 transition-opacity group-hover:opacity-100">
                      Read <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                    </span>
                  </div>
                </div>
              </Link>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
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
  const shouldReduceMotion = useReducedMotion();
  const longRecommendation = isLongRecommendation(recommendation.body);
  const preview = recommendationPreview(recommendation.body);

  return (
    <article
      className={`relative flex h-full overflow-hidden rounded-2xl border border-border p-6 shadow-card backdrop-blur sm:rounded-3xl sm:p-10 md:p-12 ${
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
          transition={{ duration: 6, repeat: shouldReduceMotion ? 0 : Infinity, ease: "easeInOut" }}
        />
      )}

      <div className="relative flex h-full min-w-0 flex-col">
        <Quote className="h-8 w-8 text-primary/70 sm:h-10 sm:w-10" />

        <p className="mt-4 min-h-0 flex-1 overflow-hidden whitespace-pre-line break-words text-sm leading-6 text-foreground/95 sm:mt-5 sm:text-base sm:leading-relaxed md:text-lg">
          {preview}
          {longRecommendation && active && (
            <>
              {" "}
              <a
                href={`/recommendations/all#recommendation-${recommendation.id}`}
                className="font-medium text-primary transition-colors hover:text-primary/80"
              >
                (read more)
              </a>
            </>
          )}
        </p>

        <div className="mt-5 flex flex-col gap-4 border-t border-border/60 pt-5 sm:mt-6 sm:flex-row sm:items-center sm:justify-between sm:pt-6">
          <div className="flex min-w-0 items-center gap-3 sm:flex-1 sm:gap-4">
            <RecommendationAvatar recommendation={recommendation} />
            <div className="min-w-0">
              <p className="font-display text-sm font-semibold sm:text-base">{recommendation.name}</p>
              <p className="break-words text-xs text-muted-foreground">
                {[recommendation.role, recommendation.company].filter(Boolean).join(" | ")}
              </p>
              <p className="mt-0.5 break-words font-mono text-[10px] uppercase tracking-wider text-muted-foreground/80">
                {recommendation.recommended_at ? formatRecommendationDate(recommendation.recommended_at) : "LinkedIn recommendation"}
                {recommendation.relationship && ` - ${recommendation.relationship}`}
              </p>
            </div>
          </div>

          {active && (
            <div className="flex flex-wrap items-center gap-2">
              <a
                href="https://www.linkedin.com/in/mohiebi/details/recommendations/"
                target="_blank"
                rel="noreferrer"
                className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-border bg-background/40 px-3 py-1.5 font-mono text-[11px] uppercase tracking-wider text-muted-foreground transition-colors hover:border-primary/50 hover:text-primary sm:w-auto"
              >
                <Linkedin className="h-3 w-3" /> View on LinkedIn
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
        className="h-12 w-12 shrink-0 rounded-full border border-border object-cover sm:h-14 sm:w-14"
      />
    );
  }

  return (
    <div className="grid h-12 w-12 shrink-0 place-items-center rounded-full border border-border bg-primary/10 font-display text-sm font-semibold text-primary sm:h-14 sm:w-14 sm:text-base">
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
