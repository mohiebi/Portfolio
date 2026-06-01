import { Head, Link } from "@inertiajs/react";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  BrainCircuit,
  Check,
  Clock,
  Gift,
  Rocket,
  Settings2,
  ShieldCheck,
  Sparkles,
  Users,
  Wallet,
  ChevronRight,
  TrendingUp,
} from "lucide-react";
import { SiteShell } from "@/components/site/SiteShell";
import { Button } from "@/components/ui/button";
import type { Service } from "@/types";
import launchImg from "@/assets/service-launch.png";
import operationsImg from "@/assets/service-operations.png";
import aiImg from "@/assets/service-ai.png";

type Props = {
  service: Service;
  otherServices: Service[];
};

const coverIcon = { launch: Rocket, operations: Settings2, ai: BrainCircuit } as const;
const coverImg = { launch: launchImg, operations: operationsImg, ai: aiImg } as const;

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

export default function PublicServiceShow({ service, otherServices }: Props) {
  const Icon = coverIcon[service.cover];
  const half = Math.ceil((service.deliverables ?? []).length / 2);

  return (
    <SiteShell>
      <Head title={`${service.name} - Services`}>
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
            <Link
              href="/services"
              className="inline-flex items-center gap-1.5 rounded-full border border-border/60 bg-background/60 px-3 py-1.5 text-sm text-muted-foreground backdrop-blur transition-colors hover:border-primary/40 hover:text-foreground"
            >
              <ArrowLeft className="h-3.5 w-3.5" /> All services
            </Link>

            <div className="mt-6 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1.5">
              <Icon className="h-4 w-4 text-primary" />
              <span className="font-mono text-xs uppercase tracking-wider text-primary">{service.tagline}</span>
              {service.badge && (
                <span className="rounded-full bg-primary px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider text-primary-foreground">
                  {service.badge}
                </span>
              )}
            </div>

            <h1 className="mt-4 font-display text-4xl font-semibold tracking-tight text-balance sm:text-5xl">
              {service.name}
            </h1>
            <p className="mt-4 max-w-xl text-lg leading-relaxed text-muted-foreground">{service.promise}</p>

            <div className="mt-6 flex flex-wrap gap-3 text-sm">
              <span className="inline-flex items-center gap-2 rounded-xl border border-border bg-card/60 px-4 py-2 font-mono text-primary shadow-sm">
                <Wallet className="h-4 w-4" /> {service.investment}
              </span>
              <span className="inline-flex items-center gap-2 rounded-xl border border-border bg-card/60 px-4 py-2 text-muted-foreground shadow-sm">
                <Clock className="h-4 w-4" /> {service.timeline}
              </span>
            </div>

            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild size="lg" className="glow-primary">
                <a href="/#contact">
                  Contact me <ArrowRight className="ml-2 h-4 w-4" />
                </a>
              </Button>
              <Button asChild size="lg" variant="outline">
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
                      <div className="mb-5 inline-flex items-center gap-1.5 rounded-full bg-destructive/10 px-3 py-1 text-xs font-medium text-destructive/80">
                        <span className="h-1.5 w-1.5 rounded-full bg-destructive/70" />
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
                  <Button asChild className="w-full glow-primary">
                    <a href="/#contact">Book a free consultation</a>
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
                        className="group flex items-center gap-3 rounded-xl border border-border bg-background/40 p-3 text-sm transition-all hover:border-primary/50 hover:bg-card/60"
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
          <Button asChild size="lg" className="mt-8 glow-primary">
            <a href="/#contact">
              Contact me <ArrowRight className="ml-2 h-4 w-4" />
            </a>
          </Button>
        </div>
      </section>
    </SiteShell>
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
