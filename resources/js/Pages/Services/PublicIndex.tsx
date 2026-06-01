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
} from "lucide-react";
import { SiteShell } from "@/components/site/SiteShell";
import { Button } from "@/components/ui/button";
import type { Service } from "@/types";
import heroImg from "@/assets/services-hero.jpg";
import launchImg from "@/assets/service-launch.jpg";
import operationsImg from "@/assets/service-operations.jpg";
import aiImg from "@/assets/service-ai.jpg";

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
  "Backend-focused full-stack engineer who sells outcomes, not hours.",
  "Deep expertise in Laravel, Symfony, NestJS and Vue.js.",
  "API architecture and Web3 integrations for modern platforms.",
  "Business systems thinking - I solve operational pain, not just ship code.",
  "Scalable backend development built to grow without rebuilding.",
  "Clear milestone delivery with updates every 48 hours.",
];

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0 },
};

export default function PublicServicesIndex({ services }: Props) {
  const featuredService = services.find((service) => service.badge) ?? services[0];

  return (
    <SiteShell>
      <Head>
        <title>Services - Business Systems, Automation & AI</title>
        <meta
          name="description"
          content="Backend-focused business systems, modern websites, workflow automation and AI-powered platforms delivered in weeks, not months."
        />
      </Head>

      <section className="relative overflow-hidden border-b border-border/60">
        <div className="absolute inset-0 bg-grid opacity-30 [mask-image:radial-gradient(ellipse_at_center,black,transparent_70%)]" />
        <motion.div
          aria-hidden
          className="absolute -top-24 left-0 h-80 w-80 rounded-full bg-primary/15 blur-3xl"
          animate={{ scale: [1, 1.15, 1] }}
          transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
        />
        <div className="relative mx-auto grid max-w-7xl items-center gap-10 px-4 py-20 sm:px-6 lg:grid-cols-2 lg:px-8 lg:py-28">
          <div>
            <motion.p initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="font-mono text-xs uppercase tracking-wider text-primary">
              // Backend-Focused AI Systems Engineer
            </motion.p>
            <motion.h1
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 }}
              className="mt-3 font-display text-4xl font-semibold tracking-tight text-balance sm:text-5xl lg:text-6xl"
            >
              Modern business systems built in <span className="text-primary">weeks, not months</span>.
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="mt-5 max-w-xl text-lg text-muted-foreground"
            >
              I help businesses replace outdated websites and manual workflows with backend-focused systems, modern websites, workflow automation and AI-powered solutions that scale.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
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
          </div>
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1, duration: 0.6 }}
            className="relative"
          >
            <div className="overflow-hidden rounded-3xl border border-border shadow-card">
              <img src={heroImg} alt="Modern AI-enabled business systems infrastructure" width={1536} height={1024} className="h-full w-full object-cover" />
            </div>
          </motion.div>
        </div>
      </section>

      <section id="packages" className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="// Services"
          title="Choose the system your business is ready for"
          description="Three focused engagements - from a fast modern launch to a full AI-enabled operations platform."
        />
        <div className="mt-12 grid gap-8 lg:grid-cols-3">
          {services.map((service, index) => (
            <ServiceCard key={service.id} service={service} index={index} />
          ))}
        </div>
      </section>

      <section className="border-y border-border/60 bg-surface/30">
        <div className="mx-auto max-w-7xl space-y-20 px-4 py-20 sm:px-6 lg:px-8">
          {services.map((service, index) => (
            <DetailedSection key={service.id} service={service} flip={index % 2 === 1} />
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="// Compare"
          title="Compare value, scope and timeline"
          description="A clear view of where each package fits so you can decide with confidence."
        />
        <div className="mt-10 overflow-x-auto rounded-2xl border border-border bg-card/60 shadow-card">
          <table className="w-full min-w-[680px] text-left text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="p-5 font-display text-base font-semibold">Package</th>
                <th className="p-5 font-display text-base font-semibold">Investment</th>
                <th className="p-5 font-display text-base font-semibold">Timeline</th>
                <th className="p-5 font-display text-base font-semibold">Best for</th>
                <th className="p-5 font-display text-base font-semibold">Main outcome</th>
              </tr>
            </thead>
            <tbody>
              {services.map((service) => (
                <tr key={service.id} className="border-b border-border/60 align-top last:border-0">
                  <td className="p-5">
                    <div className="flex items-center gap-2 font-medium">
                      {service.name}
                      {service.badge && (
                        <span className="rounded-full bg-primary/15 px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider text-primary">
                          {service.badge}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="p-5 font-mono text-primary">{service.investment}</td>
                  <td className="p-5 text-muted-foreground">{service.timeline}</td>
                  <td className="p-5 text-muted-foreground">{service.best_for}</td>
                  <td className="p-5 text-muted-foreground">{service.outcome}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {featuredService && (
        <section className="border-y border-border/60 bg-surface/30">
          <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
            <SectionHeading
              eyebrow="// Trust"
              title="Bonuses and guarantees, on every engagement"
              description="Built-in extras and risk reversal so you can move forward with confidence."
            />
            <div className="mt-12 grid gap-6 md:grid-cols-2">
              <div className="rounded-2xl border border-border bg-card/60 p-7 shadow-card">
                <div className="flex items-center gap-2 text-primary">
                  <Gift className="h-5 w-5" />
                  <h3 className="font-display text-lg font-semibold">Free bonuses</h3>
                </div>
                <ul className="mt-5 space-y-3 text-sm">
                  {(featuredService.bonuses ?? []).map((bonus) => (
                    <li key={bonus.name} className="flex items-start justify-between gap-3">
                      <span className="text-muted-foreground">{bonus.name}</span>
                      <span className="shrink-0 font-mono text-xs text-primary">{bonus.value}</span>
                    </li>
                  ))}
                </ul>
                <p className="mt-4 text-xs text-muted-foreground">
                  Bonuses vary by package - see each service page for the full list.
                </p>
              </div>
              <div className="rounded-2xl border border-border bg-card/60 p-7 shadow-card">
                <div className="flex items-center gap-2 text-primary">
                  <ShieldCheck className="h-5 w-5" />
                  <h3 className="font-display text-lg font-semibold">Guarantees</h3>
                </div>
                <ul className="mt-5 space-y-4 text-sm">
                  {(featuredService.guarantees ?? []).map((guarantee) => (
                    <li key={guarantee.name}>
                      <p className="font-medium">{guarantee.name}</p>
                      <p className="mt-0.5 text-muted-foreground">{guarantee.detail}</p>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>
      )}

      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="// Process"
          title="How working together happens"
          description="A clear, milestone-based process designed to reduce risk and keep you informed."
        />
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-5">
          {processSteps.map((step, index) => {
            const Icon = stepIcon[index];

            return (
              <motion.div
                key={step.step}
                variants={fadeUp}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                className="relative rounded-2xl border border-border bg-card/60 p-6 shadow-card"
              >
                <span className="font-mono text-xs text-primary">{step.step}</span>
                <div className="mt-3 grid h-11 w-11 place-items-center rounded-xl border border-border bg-background/60 text-primary">
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="mt-4 font-display text-base font-semibold">{step.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{step.detail}</p>
              </motion.div>
            );
          })}
        </div>
      </section>

      <section className="border-y border-border/60 bg-surface/30">
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 py-20 sm:px-6 lg:grid-cols-2 lg:px-8">
          <div>
            <p className="font-mono text-xs uppercase tracking-wider text-primary">// Why me</p>
            <h2 className="mt-3 font-display text-3xl font-semibold tracking-tight sm:text-4xl">
              A backend-focused engineer who builds for your business outcomes
            </h2>
            <p className="mt-4 text-muted-foreground">
              I do not sell templates or hours - I solve operational pain and build scalable systems that pay for themselves.
            </p>
          </div>
          <ul className="grid gap-3">
            {whyWorkWithMe.map((item) => (
              <li key={item} className="flex items-start gap-3 rounded-xl border border-border bg-card/60 p-4 text-sm">
                <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="relative overflow-hidden">
        <motion.div
          aria-hidden
          className="absolute left-1/2 top-0 h-72 w-72 -translate-x-1/2 rounded-full bg-primary/20 blur-3xl"
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        <div className="relative mx-auto max-w-3xl px-4 py-24 text-center sm:px-6 lg:px-8">
          <Star className="mx-auto h-8 w-8 text-primary" />
          <h2 className="mt-5 font-display text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
            Let&apos;s modernize your business system, website or operations
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
            Tell me where leads, time or customers are getting lost - and I&apos;ll show you the fastest path to a system that fixes it.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
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
      {description && <p className="mt-4 text-muted-foreground">{description}</p>}
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
      transition={{ duration: 0.5, delay: index * 0.06 }}
      className={`group relative flex flex-col overflow-hidden rounded-3xl border bg-card/70 shadow-card backdrop-blur transition-colors hover:border-primary/60 ${
        service.badge ? "border-primary/50" : "border-border"
      }`}
    >
      {service.badge && (
        <div className="absolute right-4 top-4 z-10 rounded-full bg-primary px-3 py-1 font-mono text-[10px] uppercase tracking-wider text-primary-foreground">
          {service.badge}
        </div>
      )}
      <div className={`relative h-36 overflow-hidden bg-gradient-to-br ${service.accent}`}>
        <div className="absolute inset-0 bg-grid opacity-30" />
        <img src={coverImg[service.cover]} alt={service.name} loading="lazy" width={768} height={768} className="absolute -right-6 -top-4 h-44 w-44 object-contain opacity-90" />
        <div className="relative flex h-full flex-col justify-end p-6">
          <div className="grid h-11 w-11 place-items-center rounded-xl border border-border bg-background/70 text-primary backdrop-blur">
            <Icon className="h-5 w-5" />
          </div>
        </div>
      </div>

      <div className="flex flex-1 flex-col p-7">
        <p className="font-mono text-[11px] uppercase tracking-wider text-primary">{service.tagline}</p>
        <h3 className="mt-1 font-display text-2xl font-semibold">{service.name}</h3>
        <p className="mt-3 text-sm text-muted-foreground">{service.benefit}</p>

        <div className="mt-5 flex flex-wrap gap-2 text-xs">
          <span className="rounded-md border border-border bg-background/40 px-2.5 py-1 font-mono text-primary">{service.investment}</span>
          <span className="rounded-md border border-border bg-background/40 px-2.5 py-1 text-muted-foreground">{service.timeline}</span>
        </div>

        <div className="mt-5">
          <p className="text-xs font-medium text-muted-foreground">Best for</p>
          <p className="mt-1 text-sm">{service.best_for}</p>
        </div>

        <div className="mt-5">
          <p className="text-xs font-medium text-muted-foreground">Key deliverables</p>
          <ul className="mt-2 space-y-1.5">
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
      className="grid items-center gap-10 lg:grid-cols-2"
    >
      <div className={flip ? "lg:order-2" : ""}>
        <div className="flex items-center gap-2 text-primary">
          <Icon className="h-5 w-5" />
          <span className="font-mono text-xs uppercase tracking-wider">{service.tagline}</span>
        </div>
        <h3 className="mt-3 font-display text-2xl font-semibold sm:text-3xl">{service.name}</h3>
        <p className="mt-2 text-lg text-muted-foreground">{service.promise}</p>

        <div className="mt-6 space-y-5 text-sm">
          <div>
            <p className="font-medium text-foreground">The problem it solves</p>
            <p className="mt-1 text-muted-foreground">{service.problem}</p>
          </div>
          <div>
            <p className="font-medium text-foreground">What you get</p>
            <p className="mt-1 text-muted-foreground">{service.what_you_get}</p>
          </div>
          <div>
            <p className="font-medium text-foreground">Why it matters</p>
            <p className="mt-1 text-muted-foreground">{service.why_it_matters}</p>
          </div>
        </div>

        <Button asChild className="mt-7">
          <Link href={`/services/${service.slug}`}>
            Explore {service.name} <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </div>

      <div className={flip ? "lg:order-1" : ""}>
        <div className="grid grid-cols-2 gap-4 rounded-3xl border border-border bg-card/60 p-6 shadow-card">
          <div>
            <p className="text-xs font-medium text-destructive/80">Before</p>
            <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
              {(service.before ?? []).map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
          <div>
            <p className="text-xs font-medium text-primary">After</p>
            <ul className="mt-3 space-y-2 text-sm">
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
    </motion.div>
  );
}
