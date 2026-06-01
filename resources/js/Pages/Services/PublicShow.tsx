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
} from "lucide-react";
import { SiteShell } from "@/components/site/SiteShell";
import { Button } from "@/components/ui/button";
import type { Service } from "@/types";
import launchImg from "@/assets/service-launch.jpg";
import operationsImg from "@/assets/service-operations.jpg";
import aiImg from "@/assets/service-ai.jpg";

type Props = {
  service: Service;
  otherServices: Service[];
};

const coverIcon = { launch: Rocket, operations: Settings2, ai: BrainCircuit } as const;
const coverImg = { launch: launchImg, operations: operationsImg, ai: aiImg } as const;

export default function PublicServiceShow({ service, otherServices }: Props) {
  const Icon = coverIcon[service.cover];
  const half = Math.ceil((service.deliverables ?? []).length / 2);

  return (
    <SiteShell>
      <Head>
        <title>{service.name} - Services</title>
        <meta name="description" content={service.benefit} />
      </Head>

      <section className="relative overflow-hidden border-b border-border/60">
        <div className="absolute inset-0 bg-grid opacity-30 [mask-image:radial-gradient(ellipse_at_center,black,transparent_70%)]" />
        <motion.div
          aria-hidden
          className="absolute -top-24 right-0 h-72 w-72 rounded-full bg-primary/15 blur-3xl"
          animate={{ scale: [1, 1.15, 1] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        <div className="relative mx-auto grid max-w-7xl items-center gap-10 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:px-8 lg:py-24">
          <div>
            <Link href="/services" className="inline-flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-foreground">
              <ArrowLeft className="h-4 w-4" /> All services
            </Link>
            <div className="mt-5 flex items-center gap-2 text-primary">
              <Icon className="h-5 w-5" />
              <span className="font-mono text-xs uppercase tracking-wider">{service.tagline}</span>
              {service.badge && (
                <span className="rounded-full bg-primary/15 px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider text-primary">
                  {service.badge}
                </span>
              )}
            </div>
            <h1 className="mt-3 font-display text-4xl font-semibold tracking-tight text-balance sm:text-5xl">{service.name}</h1>
            <p className="mt-4 max-w-xl text-lg text-muted-foreground">{service.promise}</p>

            <div className="mt-6 flex flex-wrap gap-3 text-sm">
              <span className="inline-flex items-center gap-2 rounded-md border border-border bg-background/40 px-3 py-1.5 font-mono text-primary">
                <Wallet className="h-4 w-4" /> {service.investment}
              </span>
              <span className="inline-flex items-center gap-2 rounded-md border border-border bg-background/40 px-3 py-1.5 text-muted-foreground">
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
                <a href="/services#packages">View packages</a>
              </Button>
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            className={`relative overflow-hidden rounded-3xl border border-border bg-gradient-to-br ${service.accent} shadow-card`}
          >
            <div className="absolute inset-0 bg-grid opacity-30" />
            <img src={coverImg[service.cover]} alt={service.name} width={768} height={768} className="relative mx-auto h-72 w-72 object-contain" />
          </motion.div>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-3">
          <div className="space-y-12 lg:col-span-2">
            <Block title="The problem it solves">
              <p className="text-muted-foreground">{service.problem}</p>
            </Block>

            <Block title="What's included">
              <div className="grid gap-x-8 gap-y-2 sm:grid-cols-2">
                {[(service.deliverables ?? []).slice(0, half), (service.deliverables ?? []).slice(half)].map((column, columnIndex) => (
                  <ul key={columnIndex} className="space-y-2">
                    {column.map((deliverable) => (
                      <li key={deliverable} className="flex items-start gap-2 text-sm">
                        <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                        <span>{deliverable}</span>
                      </li>
                    ))}
                  </ul>
                ))}
              </div>
            </Block>

            <Block title="Practical AI capabilities">
              <div className="flex flex-wrap gap-2">
                {(service.ai_capabilities ?? []).map((capability) => (
                  <span key={capability} className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card/60 px-3 py-1.5 text-sm">
                    <Sparkles className="h-3.5 w-3.5 text-primary" /> {capability}
                  </span>
                ))}
              </div>
            </Block>

            <Block title="The transformation">
              <div className="grid grid-cols-2 gap-4 rounded-2xl border border-border bg-card/60 p-6">
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
            </Block>

            <Block title="Why it matters">
              <p className="text-muted-foreground">{service.why_it_matters}</p>
            </Block>

            <Block title="Bonuses included" icon={Gift}>
              <div className="space-y-3">
                {(service.bonuses ?? []).map((bonus) => (
                  <div key={bonus.name} className="flex flex-wrap items-start justify-between gap-2 rounded-xl border border-border bg-card/60 p-4">
                    <div className="max-w-md">
                      <p className="font-medium">{bonus.name}</p>
                      <p className="mt-0.5 text-sm text-muted-foreground">{bonus.why}</p>
                    </div>
                    <span className="font-mono text-sm text-primary">{bonus.value}</span>
                  </div>
                ))}
              </div>
            </Block>

            <Block title="Guarantees" icon={ShieldCheck}>
              <div className="grid gap-3 sm:grid-cols-2">
                {(service.guarantees ?? []).map((guarantee) => (
                  <div key={guarantee.name} className="rounded-xl border border-border bg-card/60 p-4">
                    <p className="font-medium">{guarantee.name}</p>
                    <p className="mt-1 text-sm text-muted-foreground">{guarantee.detail}</p>
                  </div>
                ))}
              </div>
            </Block>
          </div>

          <aside className="lg:col-span-1">
            <div className="sticky top-24 space-y-6">
              <div className="rounded-2xl border border-border bg-card/60 p-6 shadow-card">
                <p className="font-mono text-xs uppercase tracking-wider text-primary">At a glance</p>
                <dl className="mt-4 space-y-4 text-sm">
                  <div>
                    <dt className="text-muted-foreground">Investment</dt>
                    <dd className="mt-0.5 font-mono text-primary">{service.investment}</dd>
                  </div>
                  <div>
                    <dt className="text-muted-foreground">Timeline</dt>
                    <dd className="mt-0.5">{service.timeline}</dd>
                  </div>
                  <div>
                    <dt className="text-muted-foreground">Main outcome</dt>
                    <dd className="mt-0.5">{service.outcome}</dd>
                  </div>
                  <div>
                    <dt className="flex items-center gap-1.5 text-muted-foreground">
                      <Users className="h-3.5 w-3.5" /> Who it is for
                    </dt>
                    <dd className="mt-0.5">{service.best_for}</dd>
                  </div>
                </dl>
                <Button asChild className="mt-6 w-full glow-primary">
                  <a href="/#contact">Book a free consultation</a>
                </Button>
              </div>

              {otherServices.length > 0 && (
                <div className="rounded-2xl border border-border bg-card/60 p-6">
                  <p className="text-sm font-medium">Other services</p>
                  <div className="mt-3 space-y-2">
                    {otherServices.map((other) => (
                      <Link
                        key={other.id}
                        href={`/services/${other.slug}`}
                        className="flex items-center justify-between rounded-lg border border-border bg-background/40 px-3 py-2 text-sm transition-colors hover:border-primary/60"
                      >
                        <span>{other.name}</span>
                        <ArrowRight className="h-4 w-4 text-primary" />
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </aside>
        </div>
      </div>

      <section className="border-t border-border/60 bg-surface/30">
        <div className="mx-auto max-w-3xl px-4 py-20 text-center sm:px-6 lg:px-8">
          <h2 className="font-display text-3xl font-semibold tracking-tight text-balance">
            Ready to start your {service.name}?
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-muted-foreground">{service.benefit}</p>
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
      <h2 className="flex items-center gap-2 font-display text-xl font-semibold">
        {Icon && <Icon className="h-5 w-5 text-primary" />}
        {title}
      </h2>
      <div className="mt-4">{children}</div>
    </div>
  );
}
