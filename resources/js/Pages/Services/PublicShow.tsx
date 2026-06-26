import { Head, Link } from "@inertiajs/react";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  BrainCircuit,
  Check,
  Clock,
  CreditCard,
  ExternalLink,
  Gift,
  Paintbrush,
  Rocket,
  Settings2,
  ShieldCheck,
  Sparkles,
  Users,
  Wallet,
  ChevronRight,
  TrendingUp,
  Building2,
  Zap,
} from "lucide-react";
import { SiteShell } from "@/components/site/SiteShell";
import { Button } from "@/components/ui/button";
import type { Service, ServiceProject } from "@/types";
import launchImg from "@/assets/launch.webp";
import operationsImg from "@/assets/service-operations.webp";
import aiImg from "@/assets/service-ai.webp";
import { localizedRecord, localizedRecords, useI18n } from "@/i18n";

const CALENDLY_URL = "https://calendly.com/e-mohamadhosein/30min";

type Props = {
  service: Service;
  otherServices: Service[];
};

const coverIcon = { launch: Rocket, operations: Settings2, ai: BrainCircuit } as const;
const coverImg = { launch: launchImg, operations: operationsImg, ai: aiImg } as const;
const sampleAccent = {
  cash: "from-lime-400/25 to-cyan-500/10",
  design: "from-fuchsia-400/25 to-amber-400/10",
  web: "from-emerald-400/25 to-sky-500/10",
  tasks: "from-emerald-400/25 to-sky-500/10",
  routine: "from-indigo-400/25 to-cyan-500/10",
  jobs: "from-sky-400/25 to-emerald-500/10",
  books: "from-amber-400/25 to-rose-500/10",
  realestate: "from-teal-400/25 to-sky-500/10",
} as const;

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

export default function PublicServiceShow({ service, otherServices }: Props) {
  const { locale } = useI18n();
  service = localizedRecord(service, locale);
  service.sample_projects = localizedRecords(service.sample_projects ?? [], locale);
  otherServices = localizedRecords(otherServices, locale);
  const Icon = coverIcon[service.cover];
  const half = Math.ceil((service.deliverables ?? []).length / 2);
  const totalBonusValue = (service.bonuses ?? []).reduce((acc, b) => {
    const num = parseInt(b.value.replace(/[^0-9]/g, ""), 10);
    return acc + (isNaN(num) ? 0 : num);
  }, 0);
  const sampleProjects = service.sample_projects ?? [];

  return (
    <SiteShell>
      <Head title={`${service.name} - ${locale === "de" ? "Leistungen" : "Services"}`}>
        {[<meta key="description" name="description" content={service.benefit} />]}
      </Head>

      {/* ── Hero ── */}
      <section className="relative overflow-hidden border-b border-border/60">
        <div className="absolute inset-0 bg-grid opacity-20 [mask-image:radial-gradient(ellipse_80%_80%_at_50%_0%,black,transparent)]" />
        <motion.div
          aria-hidden
          className="absolute -top-32 right-0 h-[400px] w-[400px] rounded-full bg-primary/10 blur-[80px]"
          animate={{ scale: [1, 1.15, 1] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />

        <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:px-8 lg:py-24">
          <div>
            {/* Badges row — all aligned, properly spaced */}
            <div className="flex flex-wrap items-center gap-2">
              <Link
                href="/services"
                className="inline-flex items-center gap-1.5 rounded-full border border-border/60 bg-background/60 px-3 py-1.5 text-sm text-muted-foreground backdrop-blur transition-colors hover:border-primary/40 hover:text-foreground"
              >
                <ArrowLeft className="h-3.5 w-3.5" /> All services
              </Link>

              <div className="inline-flex items-center gap-2 rounded-full border border-amber-500/40 bg-amber-500/10 px-3 py-1.5">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-amber-400 opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-amber-400" />
                </span>
                <span className="font-mono text-xs uppercase tracking-wider text-amber-400">
                  1 spot open — July 2026
                </span>
              </div>

              <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1.5">
                <Icon className="h-4 w-4 text-primary" />
                <span className="font-mono text-xs uppercase tracking-wider text-primary">{service.tagline}</span>
                {service.badge && (
                  <span className="rounded-full bg-primary px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider text-primary-foreground">
                    {service.badge}
                  </span>
                )}
              </div>
            </div>

            <h1 className="mt-5 font-display text-4xl font-semibold tracking-tight text-balance sm:text-5xl">
              {service.name}
            </h1>
            <p className="mt-4 max-w-xl text-lg leading-relaxed text-muted-foreground">{service.promise}</p>

            {/* Price with agency anchor */}
            <div className="mt-6 space-y-2">
              <div className="flex items-center gap-2 text-xs text-muted-foreground/70">
                <Building2 className="h-3.5 w-3.5" />
                <span>Agency equivalent: <span className="line-through">$25K–$80K+</span></span>
              </div>
              <div className="flex flex-wrap gap-3 text-sm">
                <span className="inline-flex items-center gap-2 rounded-xl border border-primary/30 bg-primary/10 px-4 py-2 font-mono font-medium text-primary shadow-sm">
                  <Wallet className="h-4 w-4" /> Your investment: {service.investment}
                </span>
                <span className="inline-flex items-center gap-2 rounded-xl border border-border bg-card/60 px-4 py-2 text-muted-foreground shadow-sm">
                  <Clock className="h-4 w-4" /> {service.timeline}
                </span>
              </div>
              <div className="inline-flex items-center gap-2 rounded-full border border-primary/40 bg-primary/15 px-4 py-1.5 text-xs font-semibold text-primary shadow-sm">
                <ShieldCheck className="h-3.5 w-3.5" />
                On-time guarantee — or you don&apos;t pay
              </div>
            </div>

            <div className="mt-6 flex flex-wrap gap-3">
              <Button asChild size="lg" className="glow-primary min-h-[48px] focus-visible:ring-2 focus-visible:ring-primary/50">
                <a href={CALENDLY_URL} target="_blank" rel="noreferrer">
                  Book a free consultation <ArrowRight className="ml-2 h-4 w-4" />
                </a>
              </Button>
              <Button asChild size="lg" variant="outline" className="min-h-[48px] focus-visible:ring-2 focus-visible:ring-primary/50">
                <a href="/services#packages">View all packages</a>
              </Button>
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="relative flex justify-center"
          >
            <div className="absolute -inset-4 rounded-[2.5rem] bg-primary/5 blur-2xl" />
            <div className={`relative w-4/5 overflow-hidden rounded-3xl border border-border/80 bg-gradient-to-br ${service.accent} shadow-[0_24px_48px_-12px_rgba(0,0,0,0.4)]`}>
              <div className="absolute inset-0 bg-grid opacity-20" />
              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background/80" />
              <img
                src={coverImg[service.cover]}
                alt={service.name}
                width={768}
                height={768}
                className="relative w-full object-contain"
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── Main content ── */}
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-3">

          {/* ── Left col – content ── */}
          <div className="space-y-14 lg:col-span-2">

            <motion.div variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }} transition={{ duration: 0.4 }}>
              <Block title="The problem it solves">
                <p className="leading-relaxed text-muted-foreground">{service.problem}</p>
              </Block>
            </motion.div>

            <motion.div variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }} transition={{ duration: 0.4 }}>
              <Block title="What's included">
                <div className="grid gap-x-8 gap-y-1.5 sm:grid-cols-2">
                  {[(service.deliverables ?? []).slice(0, half), (service.deliverables ?? []).slice(half)].map((column, columnIndex) => (
                    <ul key={columnIndex} className="space-y-2">
                      {column.map((deliverable) => (
                        <li key={deliverable} className="flex items-start gap-2.5 text-sm">
                          <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                          <span>{deliverable}</span>
                        </li>
                      ))}
                    </ul>
                  ))}
                </div>
              </Block>
            </motion.div>

            {(service.ai_capabilities ?? []).length > 0 && (
              <motion.div variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }} transition={{ duration: 0.4 }}>
                <Block title="Practical AI capabilities">
                  <div className="flex flex-wrap gap-2">
                    {(service.ai_capabilities ?? []).map((capability) => (
                      <span
                        key={capability}
                        className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card/60 px-3.5 py-2 text-sm transition-colors hover:border-primary/50"
                      >
                        <Sparkles className="h-3.5 w-3.5 text-primary" /> {capability}
                      </span>
                    ))}
                  </div>
                </Block>
              </motion.div>
            )}

            <motion.div variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }} transition={{ duration: 0.4 }}>
              <Block title="The transformation" icon={TrendingUp}>
                <div className="overflow-hidden rounded-2xl border border-border bg-card/60">
                  <div className="grid grid-cols-1 sm:grid-cols-2">
                    <div className="border-r border-border p-6">
                      <div className="mb-5 inline-flex items-center gap-1.5 rounded-full bg-orange-500/10 px-3 py-1 text-xs font-medium text-orange-400/80">
                        <span className="h-1.5 w-1.5 rounded-full bg-orange-400/70" />
                        Before
                      </div>
                      <ul className="space-y-3 text-sm text-muted-foreground">
                        {(service.before ?? []).map((item) => (
                          <li key={item} className="flex items-start gap-2">
                            <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-muted-foreground/50" />
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="p-6">
                      <div className="mb-5 inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                        <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                        After
                      </div>
                      <ul className="space-y-3 text-sm">
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
              </Block>
            </motion.div>

            <motion.div variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }} transition={{ duration: 0.4 }}>
              <Block title="Why it matters">
                <p className="leading-relaxed text-muted-foreground">{service.why_it_matters}</p>
              </Block>
            </motion.div>

            {sampleProjects.length > 0 && (
              <motion.div variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }} transition={{ duration: 0.4 }}>
                <Block title="Sample builds" icon={Zap}>
                  <div className="grid gap-4 sm:grid-cols-2">
                    {sampleProjects.map((project) => (
                      <SampleProjectCard key={project.id ?? project.slug ?? project.name} project={project} />
                    ))}
                  </div>
                </Block>
              </motion.div>
            )}

            {(service.bonuses ?? []).length > 0 && (
              <motion.div variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }} transition={{ duration: 0.4 }}>
                <Block title="Bonuses included" icon={Gift}>
                  <div className="space-y-3">
                    {(service.bonuses ?? []).map((bonus) => (
                      <div
                        key={bonus.name}
                        className="flex flex-wrap items-start justify-between gap-3 rounded-xl border border-border bg-card/60 p-4 transition-colors hover:border-primary/40"
                      >
                        <div className="flex items-start gap-3 max-w-md">
                          <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                          <div>
                            <p className="font-medium">{bonus.name}</p>
                            <p className="mt-0.5 text-sm text-muted-foreground">{bonus.why}</p>
                          </div>
                        </div>
                        <span className="rounded-md bg-primary/10 px-2.5 py-1 font-mono text-sm text-primary">{bonus.value}</span>
                      </div>
                    ))}
                    {totalBonusValue > 0 && (
                      <div className="flex items-center justify-between rounded-xl border border-primary/30 bg-primary/10 px-4 py-3">
                        <span className="font-medium text-primary">Total bonus value</span>
                        <span className="font-mono font-bold text-primary">${totalBonusValue.toLocaleString()}+ FREE</span>
                      </div>
                    )}
                  </div>
                </Block>
              </motion.div>
            )}

            {(service.guarantees ?? []).length > 0 && (
              <motion.div variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }} transition={{ duration: 0.4 }}>
                <Block title="Guarantees" icon={ShieldCheck}>
                  <div className="grid gap-3 sm:grid-cols-2">
                    {(service.guarantees ?? []).map((guarantee) => (
                      <div
                        key={guarantee.name}
                        className="rounded-xl border border-border bg-card/60 p-5 transition-colors hover:border-primary/40"
                      >
                        <div className="flex items-center gap-2">
                          <ShieldCheck className="h-4 w-4 shrink-0 text-primary" />
                          <p className="font-medium">{guarantee.name}</p>
                        </div>
                        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{guarantee.detail}</p>
                      </div>
                    ))}
                  </div>
                </Block>
              </motion.div>
            )}
          </div>

          {/* ── Right col – sidebar ── */}
          <aside className="lg:col-span-1">
            <div className="sticky top-24 space-y-5">

              {/* At a glance card */}
              <div className="overflow-hidden rounded-2xl border border-border bg-card/60 shadow-card">
                <div className="border-b border-border/60 bg-surface/40 px-6 py-4">
                  <p className="font-mono text-xs uppercase tracking-wider text-primary">At a glance</p>
                </div>
                <dl className="space-y-0 divide-y divide-border/50 px-6 text-sm">
                  {[
                    { icon: Wallet, label: "Investment", value: service.investment, mono: true },
                    { icon: Clock, label: "Timeline", value: service.timeline, mono: false },
                    { icon: TrendingUp, label: "Main outcome", value: service.outcome, mono: false },
                    { icon: Users, label: "Who it is for", value: service.best_for, mono: false },
                  ].map(({ icon: ItemIcon, label, value, mono }) => (
                    <div key={label} className="flex items-start gap-3 py-4">
                      <div className="mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-lg bg-primary/10 text-primary">
                        <ItemIcon className="h-3.5 w-3.5" />
                      </div>
                      <div>
                        <dt className="text-xs text-muted-foreground">{label}</dt>
                        <dd className={`mt-0.5 ${mono ? "font-mono text-primary" : ""}`}>{value}</dd>
                      </div>
                    </div>
                  ))}
                </dl>
                <div className="px-6 pb-6">
                  <Button asChild className="w-full min-h-[48px] glow-primary focus-visible:ring-2 focus-visible:ring-primary/50">
                    <a href={CALENDLY_URL} target="_blank" rel="noreferrer">Book a free consultation</a>
                  </Button>
                </div>
              </div>

              {/* Other services */}
              {otherServices.length > 0 && (
                <div className="rounded-2xl border border-border bg-card/60 p-5">
                  <p className="text-sm font-medium">Other services</p>
                  <div className="mt-3 space-y-2">
                    {otherServices.map((other) => (
                      <Link
                        key={other.id}
                        href={`/services/${other.slug}`}
                        className="group flex cursor-pointer items-center gap-3 rounded-xl border border-border bg-background/40 p-3 text-sm transition-all duration-200 hover:border-primary/50 hover:bg-card/60 focus-visible:ring-2 focus-visible:ring-primary/40"
                      >
                        <span className="grid h-14 w-14 shrink-0 place-items-center overflow-hidden rounded-xl border border-border bg-surface/70">
                          <img
                            src={coverImg[other.cover]}
                            alt=""
                            loading="lazy"
                            width={112}
                            height={112}
                            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
                          />
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className="block truncate font-medium">{other.name}</span>
                          <span className="mt-0.5 block truncate font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                            {other.tagline}
                          </span>
                        </span>
                        <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground transition-colors group-hover:text-primary" />
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </aside>
        </div>
      </div>

      {/* ── CTA ── */}
      <section className="relative overflow-hidden border-t border-border/60 bg-surface/30">
        <motion.div
          aria-hidden
          className="absolute left-1/2 top-0 h-64 w-64 -translate-x-1/2 rounded-full bg-primary/15 blur-[60px]"
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        <div className="relative mx-auto max-w-3xl px-4 py-24 text-center sm:px-6 lg:px-8">
          <div className="mx-auto mb-5 grid h-12 w-12 place-items-center rounded-2xl border border-primary/40 bg-primary/15">
            <Icon className="h-5 w-5 text-primary" />
          </div>
          <h2 className="font-display text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
            Ready to start your {service.name}?
          </h2>
          <p className="mx-auto mt-4 max-w-xl leading-relaxed text-muted-foreground">{service.benefit}</p>

          {/* Guarantee strip */}
          <div className="mx-auto mt-6 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-5 py-2">
            <ShieldCheck className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium text-primary">First milestone in 14 days — or you don&apos;t pay</span>
          </div>

          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Button asChild size="lg" className="glow-primary">
              <a href={CALENDLY_URL} target="_blank" rel="noreferrer">
                Book a free consultation <ArrowRight className="ml-2 h-4 w-4" />
              </a>
            </Button>
            <Button asChild size="lg" variant="outline">
              <a href="/services#packages">Compare all packages</a>
            </Button>
          </div>
          <p className="mt-4 text-xs text-muted-foreground">No commitment. 30-minute call. Free system diagnosis.</p>
        </div>
      </section>
    </SiteShell>
  );
}

function SampleProjectCard({ project }: { project: ServiceProject }) {
  const accent = resolveSampleAccent(project);

  return (
    <article className="group overflow-hidden rounded-2xl border border-border bg-card/60 shadow-card transition-colors hover:border-primary/40">
      <div className={`relative aspect-[16/9] overflow-hidden bg-gradient-to-br ${accent}`}>
        <div className="absolute inset-0 bg-grid opacity-20" />
        <div className="absolute inset-0 bg-gradient-to-b from-background/10 via-transparent to-background/40" />
        <ProjectPreview project={project} />
      </div>
      <div className="p-5">
        {project.tag && (
          <p className="font-mono text-[11px] uppercase tracking-wider text-primary">{project.tag}</p>
        )}
        <div className="mt-1 flex items-start justify-between gap-3">
          <h3 className="font-display text-xl font-semibold">{project.name}</h3>
          <a
            href={project.url}
            target="_blank"
            rel="noreferrer"
            aria-label={`Open ${project.name}`}
            className="grid h-9 w-9 shrink-0 place-items-center rounded-lg border border-border bg-background/50 text-muted-foreground transition-colors hover:border-primary/50 hover:text-primary"
          >
            <ExternalLink className="h-4 w-4" />
          </a>
        </div>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{project.summary}</p>
        {project.outcome && (
          <div className="mt-4 rounded-xl border border-primary/20 bg-primary/8 px-3.5 py-3 text-sm text-primary">
            {project.outcome}
          </div>
        )}
      </div>
    </article>
  );
}

function resolveSampleAccent(project: ServiceProject) {
  const accent = project.accent ?? "";

  if ((Object.values(sampleAccent) as string[]).includes(accent)) {
    return accent;
  }

  return sampleAccent[project.preview ?? "web"];
}

function ProjectPreview({ project }: { project: ServiceProject }) {
  if (project.preview === "cash") {
    return (
      <div className="absolute inset-0 grid place-items-center p-6">
        <div className="w-full max-w-[18rem] overflow-hidden rounded-2xl border border-white/10 bg-background/90 shadow-2xl">
          <div className="flex items-center gap-1.5 border-b border-border px-4 py-3">
            <span className="h-2.5 w-2.5 rounded-full bg-red-400" />
            <span className="h-2.5 w-2.5 rounded-full bg-amber-400" />
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
            <span className="ml-3 font-mono text-[10px] text-muted-foreground">cashpilot.mohiebi.com</span>
          </div>
          <div className="space-y-3 p-4">
            <div className="rounded-xl border border-border bg-card/70 p-4">
              <p className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">Balance</p>
              <div className="mt-2 flex items-end justify-between">
                <p className="font-display text-2xl font-semibold">$8,430</p>
                <div className="flex items-end gap-1">
                  {[24, 34, 30, 42, 36].map((height, index) => (
                    <span key={index} className="w-2 rounded-full bg-primary" style={{ height }} />
                  ))}
                </div>
              </div>
            </div>
            {["Income", "Bills", "Savings"].map((label, index) => (
              <div key={label} className="flex items-center justify-between rounded-lg border border-border bg-background/60 px-3 py-2 font-mono text-[11px]">
                <span className="text-muted-foreground">{label}</span>
                <span className={index === 1 ? "text-rose-300" : "text-primary"}>{index === 1 ? "-$1,240" : index === 0 ? "+$4,820" : "$980"}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (project.preview === "design") {
    return (
      <div className="absolute inset-0 grid place-items-center p-6">
        <div className="w-full max-w-[18rem] overflow-hidden rounded-2xl border border-white/10 bg-background/90 shadow-2xl">
          <div className="flex items-center gap-1.5 border-b border-border px-4 py-3">
            <span className="h-2.5 w-2.5 rounded-full bg-red-400" />
            <span className="h-2.5 w-2.5 rounded-full bg-amber-400" />
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
            <span className="ml-3 font-mono text-[10px] text-muted-foreground">mahdiehdesign.com</span>
          </div>
          <div className="grid gap-3 p-4">
            <div className="flex items-center gap-3">
              <div className="grid h-12 w-12 place-items-center rounded-xl bg-primary/15 text-primary">
                <Paintbrush className="h-5 w-5" />
              </div>
              <div className="space-y-2">
                <span className="block h-2.5 w-28 rounded-full bg-foreground/80" />
                <span className="block h-2 w-20 rounded-full bg-muted-foreground/35" />
              </div>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <span className="h-20 rounded-xl bg-fuchsia-300/25" />
              <span className="h-20 rounded-xl bg-amber-300/25" />
              <span className="h-20 rounded-xl bg-sky-300/20" />
            </div>
            <div className="rounded-xl border border-border bg-card/70 p-3">
              <span className="block h-2 w-full rounded-full bg-muted-foreground/25" />
              <span className="mt-2 block h-2 w-4/5 rounded-full bg-muted-foreground/20" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="absolute inset-0 grid place-items-center p-6">
      <div className="grid h-20 w-20 place-items-center rounded-2xl border border-border bg-background/80 text-primary shadow-2xl">
        <CreditCard className="h-8 w-8" />
      </div>
    </div>
  );
}

function Block({
  title,
  icon: Icon,
  children,
}: {
  title: string;
  icon?: React.ComponentType<{ className?: string }>;
  children: React.ReactNode;
}) {
  return (
    <div>
      <h2 className="flex items-center gap-2.5 font-display text-xl font-semibold">
        {Icon && (
          <span className="grid h-8 w-8 place-items-center rounded-lg bg-primary/10 text-primary">
            <Icon className="h-4 w-4" />
          </span>
        )}
        {title}
      </h2>
      <div className="mt-5">{children}</div>
    </div>
  );
}
