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
} from "lucide-react";
import { SiteShell } from "@/components/site/SiteShell";
import { Button } from "@/components/ui/button";
import type { Service } from "@/types";
import heroImg from "@/assets/dark2.png";
import launchImg from "@/assets/service-launch.png";
import operationsImg from "@/assets/service-operations.png";
import aiImg from "@/assets/service-ai.png";

type Props = {
  services: Service[];
};

type ProcessStep = { step: string; title: string; detail: string };

const coverIcon = { launch: Rocket, operations: Settings2, ai: BrainCircuit } as const;
const coverImg = { launch: launchImg, operations: operationsImg, ai: aiImg } as const;
const stepIcon = [PhoneCall, Search, Code2, Rocket, LifeBuoy] as const;

const processSteps: ProcessStep[] = [
  { step: "01", title: "Discovery call", detail: "We map your business model, workflows, bottlenecks and what success looks like." },
  { step: "02", title: "Business & system analysis", detail: "I diagnose where leads, tasks and time get lost, then define scope and acceptance criteria." },
  { step: "03", title: "Design & development", detail: "I build the system in milestone-based sprints with clear progress updates." },
  { step: "04", title: "Review & launch", detail: "We test together, deploy to production and make sure core workflows are fully live." },
  { step: "05", title: "Support & improvement", detail: "Training, documentation and a support window keep the system stable and growing." },
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
  { value: "3×", label: "Faster delivery" },
  { value: "5+", label: "Years of experience" },
  { value: "48h", label: "Update cadence" },
];

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0 },
};

export default function PublicServicesIndex({ services }: Props) {
  const featuredService = services.find((service) => service.badge) ?? services[0];

  return (
    <SiteShell>
      <Head title="Services - Business Systems, Automation & AI">
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
        <motion.div
          aria-hidden
          className="absolute top-1/2 -right-24 h-96 w-96 rounded-full bg-primary/8 blur-[80px]"
          animate={{ scale: [1, 1.2, 1], opacity: [0.4, 0.7, 0.4] }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        />

        <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-4 py-20 sm:px-6 lg:grid-cols-[1fr_1.2fr] lg:px-8 lg:py-32">
          <div>
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
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
              I help businesses replace outdated websites and manual workflows with backend-focused systems, modern websites, workflow automation and AI-powered solutions that scale.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.14 }}
              className="mt-8 flex flex-wrap gap-3"
            >
              <Button asChild size="lg" className="glow-primary">
                <a href="/#contact">
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
              className="mt-10 flex flex-wrap gap-6 border-t border-border/50 pt-8"
            >
              {metrics.map((m) => (
                <div key={m.label}>
                  <p className="font-display text-2xl font-semibold text-primary">{m.value}</p>
                  <p className="mt-0.5 text-sm text-muted-foreground">{m.label}</p>
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
            <div className="relative w-4/5 overflow-hidden rounded-3xl border border-border/80 shadow-[0_32px_64px_-12px_rgba(0,0,0,0.4)]">
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

      {/* ── Service Packages ── */}
      <section id="packages" className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="// Services"
          title="Choose the system your business is ready for"
          description="Three focused engagements - from a fast modern launch to a full AI-enabled operations platform."
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
        <div className="mt-12 overflow-x-auto rounded-2xl border border-border bg-card/40 shadow-card backdrop-blur">
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
                  <td className="px-6 py-5 font-mono text-primary">{service.investment}</td>
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
              eyebrow="// Trust"
              title="Bonuses and guarantees, on every engagement"
              description="Built-in extras and risk reversal so you can move forward with confidence."
            />
            <div className="mt-14 grid gap-6 md:grid-cols-2">
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
                  <p className="mt-4 text-xs text-muted-foreground">
                    Bonuses vary by package - see each service page for the full list.
                  </p>
                </div>
              </div>

              <div className="relative overflow-hidden rounded-2xl border border-border bg-card/60 p-7 shadow-card">
                <div className="absolute right-0 top-0 h-32 w-32 rounded-bl-full bg-primary/5" />
                <div className="relative">
                  <div className="inline-flex items-center gap-2 rounded-xl bg-primary/10 p-2.5 text-primary">
                    <ShieldCheck className="h-5 w-5" />
                  </div>
                  <h3 className="mt-4 font-display text-xl font-semibold">Guarantees</h3>
                  <ul className="mt-5 space-y-4">
                    {(featuredService.guarantees ?? []).map((guarantee) => (
                      <li key={guarantee.name} className="rounded-xl border border-border/60 bg-background/40 p-4">
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
          title="How working together happens"
          description="A clear, milestone-based process designed to reduce risk and keep you informed."
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
                  <div className="relative">
                    <span className="font-mono text-xs font-medium text-primary">{step.step}</span>
                    <div className="mt-3 grid h-11 w-11 place-items-center rounded-xl border border-border bg-background/60 text-primary transition-colors group-hover:border-primary/50 group-hover:bg-primary/10">
                      <Icon className="h-5 w-5" />
                    </div>
                    <h3 className="mt-4 font-display text-base font-semibold">{step.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{step.detail}</p>
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
              I do not sell templates or hours - I solve operational pain and build scalable systems that pay for themselves.
            </p>
            <div className="mt-8">
              <Button asChild size="lg" className="glow-primary">
                <a href="/#contact">
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

      {/* ── Final CTA ── */}
      <section className="relative overflow-hidden">
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
            Let&apos;s modernize your business system, website or operations
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-lg text-muted-foreground">
            Tell me where leads, time or customers are getting lost - and I&apos;ll show you the fastest path to a system that fixes it.
          </p>
          <div className="mt-10 flex flex-wrap justify-center gap-3">
            <Button asChild size="lg" className="glow-primary">
              <a href="/#contact">
                Contact me <ArrowRight className="ml-2 h-4 w-4" />
              </a>
            </Button>
            <Button asChild size="lg" variant="outline">
              <a href="#packages">View packages</a>
            </Button>
          </div>
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
    <motion.article
      variants={fadeUp}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.5, delay: index * 0.07 }}
      className={`group relative flex flex-col overflow-hidden rounded-3xl border bg-card/70 shadow-card backdrop-blur transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_20px_48px_-12px_rgba(0,0,0,0.3)] ${
        service.badge ? "border-primary/50 ring-1 ring-primary/20" : "border-border hover:border-primary/40"
      }`}
    >
      <div className={`relative overflow-hidden bg-gradient-to-br ${service.accent}`}>
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
          className="relative w-full object-contain transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background/80" />
      </div>

      {/* Icon straddling image/body boundary — 50% inside image, 50% outside */}
      <div className="relative px-7">
        <div className="absolute -top-[22px] left-7 z-10 grid h-11 w-11 place-items-center rounded-xl border-2 border-border bg-card text-primary shadow-lg">
          <Icon className="h-5 w-5" />
        </div>
      </div>

      <div className="flex flex-1 flex-col p-7 pt-8">
        <p className="font-mono text-[11px] uppercase tracking-wider text-primary">{service.tagline}</p>
        <h3 className="mt-1.5 font-display text-2xl font-semibold">{service.name}</h3>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{service.benefit}</p>

        <div className="mt-5 flex flex-wrap gap-2 text-xs">
          <span className="inline-flex items-center gap-1.5 rounded-md border border-border bg-background/40 px-2.5 py-1.5 font-mono text-primary">
            <Sparkles className="h-3 w-3" /> {service.investment}
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-md border border-border bg-background/40 px-2.5 py-1.5 text-muted-foreground">
            <Clock className="h-3 w-3" /> {service.timeline}
          </span>
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

        <div className="mt-auto flex gap-2 pt-7">
          <Button asChild variant="outline" className="flex-1 group/btn">
            <Link href={`/services/${service.slug}`}>
              Details
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover/btn:translate-x-1" />
            </Link>
          </Button>
          <Button asChild className="flex-1">
            <a href="/#contact">Get started</a>
          </Button>
        </div>
      </div>
    </motion.article>
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
          <div className="grid grid-cols-2">
            <div className="border-r border-border p-6">
              <div className="mb-4 inline-flex items-center gap-1.5 rounded-full bg-destructive/10 px-3 py-1 text-xs font-medium text-destructive/80">
                <span className="h-1.5 w-1.5 rounded-full bg-destructive/70" />
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
