import { Head, Link } from "@inertiajs/react";
import { motion } from "framer-motion";
import {
  ArrowRight,
  BrainCircuit,
  Check,
  Code2,
  Gift,
  LifeBuoy,
  PhoneCall,
  Rocket,
  Search,
  Settings2,
  ShieldCheck,
  Sparkles,
  Star,
  TrendingUp,
  Zap,
  Clock,
  X,
  BadgeCheck,
  AlertTriangle,
  Building2,
} from "lucide-react";
import { SiteShell } from "@/components/site/SiteShell";
import { Button } from "@/components/ui/button";
import type { Service } from "@/types";
import heroImg from "@/assets/dark2.webp";
import launchImg from "@/assets/launch.webp";
import operationsImg from "@/assets/service-operations.webp";
import aiImg from "@/assets/service-ai.webp";
import { localizedRecords, useI18n } from "@/i18n";

const CALENDLY_URL = "https://calendly.com/e-mohamadhosein/30min";

type Props = {
  services: Service[];
};

type ProcessStep = { step: string; title: string; detail: string; clientTime: string };

const coverIcon = { launch: Rocket, operations: Settings2, ai: BrainCircuit } as const;
const coverImg = { launch: launchImg, operations: operationsImg, ai: aiImg } as const;
const stepIcon = [PhoneCall, Search, Code2, Rocket, LifeBuoy] as const;

const processSteps: ProcessStep[] = [
  { step: "01", title: "Discovery call", detail: "We map your business model, workflows, bottlenecks and what success looks like.", clientTime: "Your time: 30 min" },
  { step: "02", title: "Business & system analysis", detail: "I diagnose where leads, tasks and time get lost, then define scope and acceptance criteria.", clientTime: "Your time: review only" },
  { step: "03", title: "Design & development", detail: "I build the system in milestone-based sprints with clear progress updates every 48h.", clientTime: "Your time: zero" },
  { step: "04", title: "Review & launch", detail: "We test together, deploy to production and make sure core workflows are fully live.", clientTime: "Your time: 1 hour" },
  { step: "05", title: "Support & improvement", detail: "Training, documentation and a support window keep the system stable and growing.", clientTime: "Your time: as needed" },
];

const painPoints = [
  { icon: AlertTriangle, text: "Paying an agency $20K+ for a site that still doesn't convert leads" },
  { icon: AlertTriangle, text: "Your team spends hours on manual work that a system could do in seconds" },
  { icon: AlertTriangle, text: "Waiting 6 months for a developer to deliver something half-finished" },
];

const notForMe = [
  "You want the cheapest option available (try Fiverr)",
  "You need 10 rounds of revisions on a logo",
  "You're not ready to move in weeks",
  "You just need a simple landing page with no backend",
];

const forMe = [
  "Manual work is eating your team's time and revenue",
  "Your website doesn't convert visitors into qualified leads",
  "You've been burned by slow, unreliable developers before",
  "You want it built right, the first time — with a guarantee",
];

const whyWorkWithMe = [
  { text: "Backend-focused full-stack engineer who sells outcomes, not hours.", icon: TrendingUp },
  { text: "Deep expertise in Laravel, Symfony, NestJS and Vue.js.", icon: Code2 },
  { text: "API architecture and Web3 integrations for modern platforms.", icon: Zap },
  { text: "Business systems thinking - I solve operational pain, not just ship code.", icon: BrainCircuit },
  { text: "Scalable backend development built to grow without rebuilding.", icon: Rocket },
  { text: "Clear milestone delivery with updates every 48 hours.", icon: Clock },
];

const metrics = [
  { value: "14 days", label: "First live milestone" },
  { value: "On-time", label: "Or your money back" },
  { value: "AI-ready", label: "Built into every system" },
];

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0 },
};

export default function PublicServicesIndex({ services }: Props) {
  const { locale } = useI18n();
  services = localizedRecords(services, locale);
  const featuredService = services.find((service) => service.badge) ?? services[0];
  const totalBonusValue = (featuredService?.bonuses ?? []).reduce((acc, b) => {
    const num = parseInt(b.value.replace(/[^0-9]/g, ""), 10);
    return acc + (isNaN(num) ? 0 : num);
  }, 0);

  return (
    <SiteShell>
      <Head title="Service Packages">
        {[
          <meta
            key="description"
            name="description"
            content="Backend-focused business systems, modern websites, workflow automation and AI-powered platforms delivered in weeks, not months."
          />,
        ]}
      </Head>

      {/* ── Hero ── */}
      <section className="relative overflow-hidden border-b border-border/60">
        <div className="absolute inset-0 bg-grid opacity-20 [mask-image:radial-gradient(ellipse_80%_80%_at_50%_0%,black,transparent)]" />
        <motion.div
          aria-hidden
          className="absolute -top-32 -left-16 h-[500px] w-[500px] rounded-full bg-primary/10 blur-[100px]"
          animate={{ scale: [1, 1.12, 1], opacity: [0.6, 0.9, 0.6] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />

        <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-4 py-20 sm:px-6 lg:grid-cols-[1fr_1.2fr] lg:px-8 lg:py-32">
          <div>
            {/* Scarcity badge */}
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-4 inline-flex items-center gap-2 rounded-full border border-amber-500/40 bg-amber-500/10 px-4 py-1.5"
            >
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-amber-400 opacity-75" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-amber-400" />
              </span>
              <span className="font-mono text-xs uppercase tracking-wider text-amber-400">
                Now accepting 2 new clients — July 2026
              </span>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.04 }}
              className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-primary" />
              <span className="font-mono text-xs uppercase tracking-wider text-primary">
                Backend-Focused AI Systems Engineer
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.06 }}
              className="mt-5 font-display text-4xl font-semibold tracking-tight text-balance sm:text-5xl lg:text-6xl"
            >
              Modern business systems built in{" "}
              <span className="relative inline-block">
                <span className="relative z-10 text-primary">weeks, not months</span>
                <span aria-hidden className="absolute -inset-1 -z-0 rounded-lg bg-primary/10 blur-sm" />
              </span>
              .
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="mt-5 max-w-xl text-lg leading-relaxed text-muted-foreground"
            >
              I help businesses replace outdated websites and manual workflows with backend-focused systems, workflow automation and AI-powered solutions — at a fraction of what agencies charge.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.14 }}
              className="mt-8 flex flex-wrap gap-3"
            >
              <Button asChild size="lg" className="glow-primary">
                <a href={CALENDLY_URL} target="_blank" rel="noreferrer">
                  Book a free consultation <ArrowRight className="ml-2 h-4 w-4" />
                </a>
              </Button>
              <Button asChild size="lg" variant="outline">
                <a href="#packages">View packages</a>
              </Button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.22 }}
              className="mt-10 grid grid-cols-3 gap-4 border-t border-border/50 pt-8"
            >
              {metrics.map((m) => (
                <div key={m.label}>
                  <p className="font-display text-xl font-semibold text-primary sm:text-2xl">{m.value}</p>
                  <p className="mt-0.5 text-xs text-muted-foreground">{m.label}</p>
                </div>
              ))}
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.7 }}
            className="relative flex justify-center lg:col-span-1"
          >
            <div className="absolute -inset-4 rounded-[2.5rem] bg-primary/5 blur-2xl" />
            <div className="relative w-full overflow-hidden rounded-3xl border border-border/80 shadow-[0_32px_64px_-12px_rgba(0,0,0,0.4)] lg:w-4/5">
              <img
                src={heroImg}
                alt="Modern AI-enabled business systems infrastructure"
                width={1536}
                height={1024}
                className="w-full object-contain"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/40 via-transparent to-transparent" />
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── Pain / Problem Strip ── */}
      <section className="border-b border-border/60 bg-gradient-to-b from-orange-500/6 to-transparent">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
          <p className="mb-8 text-center font-mono text-xs uppercase tracking-wider text-orange-400/90">// Sound familiar?</p>
          <div className="grid gap-4 sm:grid-cols-3">
            {painPoints.map((pain, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.07 }}
                className="flex items-start gap-3.5 rounded-2xl border border-orange-500/20 bg-orange-500/5 p-5 shadow-sm"
              >
                <div className="mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-orange-500/10 text-orange-400">
                  <pain.icon className="h-4 w-4" />
                </div>
                <p className="text-sm leading-relaxed text-foreground/80">{pain.text}</p>
              </motion.div>
            ))}
          </div>
          <p className="mt-7 text-center text-sm text-muted-foreground">
            These are the exact problems my services solve — <span className="text-foreground font-semibold">without the agency price tag or 6-month wait.</span>
          </p>
        </div>
      </section>

      {/* ── Service Packages ── */}
      <section id="packages" className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="// Services"
          title="Stop overpaying agencies. Get the system your business actually needs."
          description="Three focused engagements — each ships a working system at a fraction of agency rates, backed by an on-time guarantee."
        />
        <div className="mt-14 grid gap-8 lg:grid-cols-3">
          {services.map((service, index) => (
            <ServiceCard key={service.id} service={service} index={index} />
          ))}
        </div>
      </section>

      {/* ── Detailed breakdown ── */}
      <section className="border-y border-border/60 bg-surface/30">
        <div className="mx-auto max-w-7xl space-y-24 px-4 py-24 sm:px-6 lg:px-8">
          {services.map((service, index) => (
            <DetailedSection key={service.id} service={service} flip={index % 2 === 1} />
          ))}
        </div>
      </section>

      {/* ── Comparison table ── */}
      <section className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="// Compare"
          title="Compare value, scope and timeline"
          description="A clear view of where each package fits so you can decide with confidence."
        />

        {/* Agency anchoring banner */}
        <div className="mt-8 flex items-center gap-3 rounded-xl border border-amber-500/30 bg-amber-500/10 p-4">
          <Building2 className="h-5 w-5 shrink-0 text-amber-400" />
          <p className="text-sm text-muted-foreground">
            <span className="font-medium text-amber-400">Agency comparison:</span>{" "}
            A typical digital agency charges <span className="font-mono font-medium text-foreground">$25K–$80K+</span> for equivalent scope — with 3–6 month timelines and no delivery guarantee.
          </p>
        </div>

        <div className="mt-6 overflow-x-auto rounded-2xl border border-border bg-card/40 shadow-card backdrop-blur">
          <table className="w-full min-w-[680px] text-left text-sm">
            <thead>
              <tr className="border-b border-border bg-surface/50">
                <th className="px-6 py-5 font-display text-base font-semibold">Package</th>
                <th className="px-6 py-5 font-display text-base font-semibold">Investment</th>
                <th className="px-6 py-5 font-display text-base font-semibold">Timeline</th>
                <th className="px-6 py-5 font-display text-base font-semibold">Best for</th>
                <th className="px-6 py-5 font-display text-base font-semibold">Main outcome</th>
              </tr>
            </thead>
            <tbody>
              {services.map((service, i) => (
                <tr
                  key={service.id}
                  className={`group border-b border-border/50 align-top transition-colors last:border-0 hover:bg-primary/5 ${service.badge ? "bg-primary/5" : ""}`}
                >
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-2.5 font-medium">
                      <div className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-primary/15 text-primary">
                        {i === 0 ? <Rocket className="h-3.5 w-3.5" /> : i === 1 ? <Settings2 className="h-3.5 w-3.5" /> : <BrainCircuit className="h-3.5 w-3.5" />}
                      </div>
                      {service.name}
                      {service.badge && (
                        <span className="rounded-full bg-primary/15 px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider text-primary">
                          {service.badge}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <span className="font-mono text-primary">{service.investment}</span>
                    <span className="ml-2 font-mono text-xs text-muted-foreground/60 line-through">agency: $25K+</span>
                  </td>
                  <td className="px-6 py-5 text-muted-foreground">{service.timeline}</td>
                  <td className="px-6 py-5 text-muted-foreground">{service.best_for}</td>
                  <td className="px-6 py-5 text-muted-foreground">{service.outcome}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* ── Bonuses & Guarantees ── */}
      {featuredService && (
        <section className="border-y border-border/60 bg-surface/30">
          <div className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
            <SectionHeading
              eyebrow="// Value stack"
              title="Everything you get — including the bonuses"
              description="On top of the deliverables, every engagement includes free bonuses and an iron-clad guarantee."
            />
            <div className="mt-14 grid gap-6 md:grid-cols-2">
              {/* Bonuses */}
              <div className="relative overflow-hidden rounded-2xl border border-border bg-card/60 p-7 shadow-card">
                <div className="absolute right-0 top-0 h-32 w-32 rounded-bl-full bg-primary/5" />
                <div className="relative">
                  <div className="inline-flex items-center gap-2 rounded-xl bg-primary/10 p-2.5 text-primary">
                    <Gift className="h-5 w-5" />
                  </div>
                  <h3 className="mt-4 font-display text-xl font-semibold">Free bonuses</h3>
                  <ul className="mt-5 divide-y divide-border/50">
                    {(featuredService.bonuses ?? []).map((bonus) => (
                      <li key={bonus.name} className="flex items-start justify-between gap-3 py-3">
                        <div className="flex items-start gap-2">
                          <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                          <span className="text-sm text-muted-foreground">{bonus.name}</span>
                        </div>
                        <span className="shrink-0 rounded-md bg-primary/10 px-2 py-0.5 font-mono text-xs text-primary">{bonus.value}</span>
                      </li>
                    ))}
                  </ul>
                  {totalBonusValue > 0 && (
                    <div className="mt-4 flex items-center justify-between rounded-xl border border-primary/30 bg-primary/10 px-4 py-3">
                      <span className="text-sm font-medium text-primary">Total bonus value</span>
                      <span className="font-mono font-bold text-primary">${totalBonusValue.toLocaleString()}+</span>
                    </div>
                  )}
                  <p className="mt-3 text-xs text-muted-foreground">
                    Bonuses vary by package — see each service page for the full list.
                  </p>
                </div>
              </div>

              {/* Guarantees */}
              <div className="relative overflow-hidden rounded-2xl border border-primary/40 bg-card/60 p-7 shadow-card ring-1 ring-primary/20">
                <div className="absolute right-0 top-0 h-32 w-32 rounded-bl-full bg-primary/5" />
                <div className="relative">
                  <div className="inline-flex items-center gap-2 rounded-xl bg-primary/10 p-2.5 text-primary">
                    <ShieldCheck className="h-5 w-5" />
                  </div>
                  <h3 className="mt-4 font-display text-xl font-semibold">Guarantees</h3>
                  <p className="mt-1 text-sm text-muted-foreground">I put my money where my mouth is. If I miss a deadline, you don't pay. Simple.</p>
                  <ul className="mt-5 space-y-4">
                    {(featuredService.guarantees ?? []).map((guarantee) => (
                      <li key={guarantee.name} className="rounded-xl border border-primary/20 bg-primary/5 p-4">
                        <div className="flex items-start gap-2">
                          <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                          <div>
                            <p className="text-sm font-medium">{guarantee.name}</p>
                            <p className="mt-0.5 text-sm text-muted-foreground">{guarantee.detail}</p>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ── Process ── */}
      <section className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="// Process"
          title="I handle everything — you just show up twice"
          description="Your total time commitment across the entire project: under 2 hours. I do the rest."
        />
        <div className="relative mt-14">
          <div aria-hidden className="absolute left-6 top-6 hidden h-0.5 w-[calc(100%-3rem)] bg-gradient-to-r from-primary/40 via-primary/20 to-transparent lg:block" />
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-5">
            {processSteps.map((step, index) => {
              const Icon = stepIcon[index];
              return (
                <motion.div
                  key={step.step}
                  variants={fadeUp}
                  initial="hidden"
                  whileInView="show"
                  viewport={{ once: true, margin: "-60px" }}
                  transition={{ duration: 0.4, delay: index * 0.07 }}
                  className="group relative rounded-2xl border border-border bg-card/60 p-6 shadow-card transition-all hover:border-primary/50 hover:bg-card/80"
                >
                  <span className="font-mono text-xs font-medium text-primary">{step.step}</span>
                  <div className="mt-3 grid h-11 w-11 place-items-center rounded-xl border border-border bg-background/60 text-primary transition-colors group-hover:border-primary/50 group-hover:bg-primary/10">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="mt-4 font-display text-base font-semibold">{step.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{step.detail}</p>
                  <div className="mt-3 inline-flex items-center gap-1.5 rounded-full border border-border/60 bg-background/40 px-2.5 py-1">
                    <Clock className="h-3 w-3 text-primary" />
                    <span className="font-mono text-[10px] text-muted-foreground">{step.clientTime}</span>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Why me ── */}
      <section className="border-y border-border/60 bg-surface/30">
        <div className="mx-auto grid max-w-7xl items-center gap-14 px-4 py-24 sm:px-6 lg:grid-cols-2 lg:px-8">
          <div>
            <p className="font-mono text-xs uppercase tracking-wider text-primary">// Why me</p>
            <h2 className="mt-3 font-display text-3xl font-semibold tracking-tight sm:text-4xl">
              A backend-focused engineer who builds for your business outcomes
            </h2>
            <p className="mt-4 leading-relaxed text-muted-foreground">
              I do not sell templates or hours — I solve operational pain and build scalable systems that pay for themselves.
            </p>
            <div className="mt-8">
              <Button asChild size="lg" className="glow-primary">
                <a href={CALENDLY_URL} target="_blank" rel="noreferrer">
                  Talk to me <ArrowRight className="ml-2 h-4 w-4" />
                </a>
              </Button>
            </div>
          </div>
          <ul className="grid gap-3">
            {whyWorkWithMe.map((item) => (
              <motion.li
                key={item.text}
                variants={fadeUp}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.35 }}
                className="group flex items-start gap-3.5 rounded-xl border border-border bg-card/60 p-4 text-sm transition-all hover:border-primary/50"
              >
                <div className="mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-lg bg-primary/10 text-primary">
                  <item.icon className="h-3.5 w-3.5" />
                </div>
                <span className="leading-relaxed">{item.text}</span>
              </motion.li>
            ))}
          </ul>
        </div>
      </section>

      {/* ── Not for / For ── */}
      <section className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="// Fit check"
          title="Is this right for you?"
          description="I work with a small number of clients at a time. Here's how to know if we're a match."
        />
        <div className="mt-12 grid gap-6 md:grid-cols-2">
          {/* Not for */}
          <div className="overflow-hidden rounded-2xl border border-orange-500/20 bg-card/60">
            <div className="border-b border-orange-500/15 bg-orange-500/5 px-7 py-4">
              <div className="flex items-center gap-2.5">
                <div className="grid h-8 w-8 place-items-center rounded-lg bg-orange-500/10 text-orange-400">
                  <X className="h-4 w-4" />
                </div>
                <h3 className="font-display text-lg font-semibold">This is NOT for you if...</h3>
              </div>
            </div>
            <ul className="space-y-0 divide-y divide-border/40 px-7 py-2">
              {notForMe.map((item) => (
                <li key={item} className="flex items-center gap-3 py-3.5 text-sm text-muted-foreground">
                  <X className="h-3.5 w-3.5 shrink-0 text-orange-400/70" />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* For */}
          <div className="overflow-hidden rounded-2xl border border-primary/30 bg-card/60 ring-1 ring-primary/10">
            <div className="border-b border-primary/20 bg-primary/8 px-7 py-4">
              <div className="flex items-center gap-2.5">
                <div className="grid h-8 w-8 place-items-center rounded-lg bg-primary/15 text-primary">
                  <BadgeCheck className="h-4 w-4" />
                </div>
                <h3 className="font-display text-lg font-semibold">This IS for you if...</h3>
              </div>
            </div>
            <ul className="space-y-0 divide-y divide-border/40 px-7 py-2">
              {forMe.map((item) => (
                <li key={item} className="flex items-center gap-3 py-3.5 text-sm">
                  <Check className="h-3.5 w-3.5 shrink-0 text-primary" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* ── Final CTA ── */}
      <section className="relative overflow-hidden border-t border-border/60 bg-surface/30">
        <div className="absolute inset-0 bg-grid opacity-15 [mask-image:radial-gradient(ellipse_at_center,black,transparent_70%)]" />
        <motion.div
          aria-hidden
          className="absolute left-1/2 top-0 h-80 w-80 -translate-x-1/2 rounded-full bg-primary/20 blur-[80px]"
          animate={{ scale: [1, 1.25, 1] }}
          transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
        />
        <div className="relative mx-auto max-w-3xl px-4 py-28 text-center sm:px-6 lg:px-8">
          <div className="mx-auto mb-6 grid h-14 w-14 place-items-center rounded-2xl border border-primary/40 bg-primary/15">
            <Star className="h-6 w-6 text-primary" />
          </div>
          <h2 className="font-display text-3xl font-semibold tracking-tight text-balance sm:text-4xl lg:text-5xl">
            Let&apos;s build the system your business deserves
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-lg text-muted-foreground">
            Tell me where leads, time or customers are getting lost — and I&apos;ll show you the fastest path to a system that fixes it. <span className="text-foreground font-medium">First milestone in 14 days or your money back.</span>
          </p>
          {/* Guarantee strip */}
          <div className="mx-auto mt-8 inline-flex items-center gap-2.5 rounded-full border border-primary/40 bg-primary/15 px-6 py-2.5 shadow-sm">
            <ShieldCheck className="h-4 w-4 text-primary" />
            <span className="text-sm font-semibold text-primary">On-time guarantee — or you don&apos;t pay</span>
          </div>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Button asChild size="lg" className="glow-primary min-h-[48px] focus-visible:ring-2 focus-visible:ring-primary/50">
              <a href={CALENDLY_URL} target="_blank" rel="noreferrer">
                Book a free consultation <ArrowRight className="ml-2 h-4 w-4" />
              </a>
            </Button>
            <Button asChild size="lg" variant="outline" className="min-h-[48px] focus-visible:ring-2 focus-visible:ring-primary/50">
              <a href="#packages">View packages</a>
            </Button>
          </div>
          <p className="mt-5 text-xs text-muted-foreground">No commitment required · 30-minute call · Free system diagnosis</p>
        </div>
      </section>
    </SiteShell>
  );
}

function SectionHeading({ eyebrow, title, description }: { eyebrow: string; title: string; description?: string }) {
  return (
    <div className="max-w-2xl">
      <p className="font-mono text-xs uppercase tracking-wider text-primary">{eyebrow}</p>
      <h2 className="mt-3 font-display text-3xl font-semibold tracking-tight sm:text-4xl">{title}</h2>
      {description && <p className="mt-4 leading-relaxed text-muted-foreground">{description}</p>}
    </div>
  );
}

function ServiceCard({ service, index }: { service: Service; index: number }) {
  const Icon = coverIcon[service.cover];

  return (
    <motion.div
      variants={fadeUp}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.5, delay: index * 0.07 }}
      className={`group relative flex h-full flex-col overflow-hidden rounded-3xl border bg-card/70 shadow-card backdrop-blur transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_20px_48px_-12px_rgba(0,0,0,0.3)] ${
        service.badge ? "border-primary/50 ring-1 ring-primary/20" : "border-border hover:border-primary/40"
      }`}
    >
      <Link
        href={`/services/${service.slug}`}
        className={`group/image relative block overflow-hidden bg-gradient-to-br ${service.accent} focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:ring-inset`}
        aria-label={`View ${service.name}`}
      >
        {service.badge && (
          <div className="absolute left-1/2 top-0 z-20 -translate-x-1/2">
            <div className="flex items-center gap-1.5 rounded-b-2xl bg-primary px-5 py-2 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.5)]">
              <Star className="h-3 w-3 fill-primary-foreground text-primary-foreground" />
              <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-primary-foreground">
                {service.badge}
              </span>
              <Star className="h-3 w-3 fill-primary-foreground text-primary-foreground" />
            </div>
          </div>
        )}
        <div className="absolute inset-0 bg-grid opacity-20" />
        <img
          src={coverImg[service.cover]}
          alt={service.name}
          loading="lazy"
          width={768}
          height={768}
          className="relative w-full object-contain transition-transform duration-500 group-hover/image:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background/80" />
      </Link>

      {/* Icon straddling */}
      <div className="relative px-7">
        <div className="absolute -top-[22px] left-7 z-10 grid h-11 w-11 place-items-center rounded-xl border-2 border-border bg-card text-primary shadow-lg">
          <Icon className="h-5 w-5" />
        </div>
      </div>

      <div className="flex flex-1 flex-col p-7 pt-8">
        <p className="font-mono text-[11px] uppercase tracking-wider text-primary">{service.tagline}</p>
        <h3 className="mt-1.5 font-display text-2xl font-semibold">
          <Link
            href={`/services/${service.slug}`}
            className="transition-colors hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
          >
            {service.name}
          </Link>
        </h3>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{service.benefit}</p>

        {/* Price with agency anchor */}
        <div className="mt-5 space-y-2.5">
          <div className="flex items-center gap-1.5 rounded-md border border-border/40 bg-background/30 px-2.5 py-1.5 text-xs text-muted-foreground">
            <Building2 className="h-3 w-3 shrink-0" />
            <span>Agency rate:</span>
            <span className="font-mono line-through opacity-60">$25K–$80K+</span>
            <span className="ml-auto font-mono font-semibold text-primary">{service.investment}</span>
          </div>
          <div className="flex flex-wrap gap-2 text-xs">
            <span className="inline-flex min-h-[36px] items-center gap-1.5 rounded-md border border-primary/30 bg-primary/10 px-2.5 py-1.5 font-mono font-medium text-primary">
              <Sparkles className="h-3 w-3" /> Your investment: {service.investment}
            </span>
            <span className="inline-flex min-h-[36px] items-center gap-1.5 rounded-md border border-border bg-background/40 px-2.5 py-1.5 text-muted-foreground">
              <Clock className="h-3 w-3" /> {service.timeline}
            </span>
          </div>
          {/* Guarantee badge */}
          <div className="inline-flex min-h-[32px] items-center gap-1.5 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
            <ShieldCheck className="h-3.5 w-3.5" />
            On-time guarantee — or you don&apos;t pay
          </div>
        </div>

        <div className="mt-5">
          <p className="text-xs font-medium text-muted-foreground">Best for</p>
          <p className="mt-1 text-sm">{service.best_for}</p>
        </div>

        <div className="mt-5">
          <p className="text-xs font-medium text-muted-foreground">Key deliverables</p>
          <ul className="mt-2.5 space-y-2">
            {(service.deliverables ?? []).slice(0, 4).map((deliverable) => (
              <li key={deliverable} className="flex items-start gap-2 text-sm">
                <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                <span>{deliverable}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-auto pt-7">
          <Button asChild className="min-h-[44px] w-full focus-visible:ring-2 focus-visible:ring-primary/50">
            <Link href={`/services/${service.slug}`}>
            View package
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </motion.div>
  );
}

function DetailedSection({ service, flip }: { service: Service; flip: boolean }) {
  const Icon = coverIcon[service.cover];

  return (
    <motion.div
      variants={fadeUp}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.5 }}
      className="grid items-center gap-12 lg:grid-cols-2"
    >
      <div className={flip ? "lg:order-2" : ""}>
        <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-primary">
          <Icon className="h-4 w-4" />
          <span className="font-mono text-xs uppercase tracking-wider">{service.tagline}</span>
        </div>
        <h3 className="mt-4 font-display text-2xl font-semibold sm:text-3xl">{service.name}</h3>
        <p className="mt-2 text-lg leading-relaxed text-muted-foreground">{service.promise}</p>

        <div className="mt-7 space-y-5 text-sm">
          {[
            { label: "The problem it solves", body: service.problem },
            { label: "What you get", body: service.what_you_get },
            { label: "Why it matters", body: service.why_it_matters },
          ].map(({ label, body }) => (
            <div key={label} className="rounded-xl border border-border/60 bg-card/40 p-4">
              <p className="font-medium text-foreground">{label}</p>
              <p className="mt-1.5 leading-relaxed text-muted-foreground">{body}</p>
            </div>
          ))}
        </div>

        <Button asChild className="mt-7">
          <Link href={`/services/${service.slug}`}>
            Explore {service.name} <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </div>

      <div className={flip ? "lg:order-1" : ""}>
        <div className="overflow-hidden rounded-3xl border border-border bg-card/60 shadow-card">
          <div className="grid grid-cols-1 sm:grid-cols-2">
            <div className="border-r border-border p-6">
              <div className="mb-4 inline-flex items-center gap-1.5 rounded-full bg-orange-500/10 px-3 py-1 text-xs font-medium text-orange-400/80">
                <span className="h-1.5 w-1.5 rounded-full bg-orange-400/70" />
                Before
              </div>
              <ul className="space-y-2.5 text-sm text-muted-foreground">
                {(service.before ?? []).map((item) => (
                  <li key={item} className="flex items-start gap-2">
                    <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-muted-foreground/50" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="p-6">
              <div className="mb-4 inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                After
              </div>
              <ul className="space-y-2.5 text-sm">
                {(service.after ?? []).map((item) => (
                  <li key={item} className="flex items-start gap-2">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
