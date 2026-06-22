import { Head, Link, usePage } from "@inertiajs/react";
import {
  ArrowRight,
  BrainCircuit,
  CheckCircle2,
  FileText,
  LayoutDashboard,
  MessageSquareQuote,
  Newspaper,
  PackagePlus,
  Pencil,
  Plus,
  Rocket,
  Settings2,
  ShieldCheck,
  User,
} from "lucide-react";
import type { ComponentType } from "react";
import { SiteShell } from "@/components/site/SiteShell";
import type { PageProps, Service } from "@/types";

type DashboardLink = {
  href: string;
  icon: ComponentType<{ className?: string }>;
  title: string;
  description: string;
  label: string;
  meta: string;
  tone: "emerald" | "cyan" | "amber" | "violet";
};

type DashboardProps = {
  services?: Service[];
};

const accountLinks: DashboardLink[] = [
  {
    href: "/profile",
    icon: User,
    title: "Profile",
    description: "Update your account details, password, and session settings.",
    label: "Account",
    meta: "Settings",
    tone: "violet",
  },
];

const adminLinks: DashboardLink[] = [
  {
    href: "/dashboard/recommendations",
    icon: MessageSquareQuote,
    title: "Recommendations",
    description: "Curate public LinkedIn-style proof and testimonial entries.",
    label: "Social proof",
    meta: "Admin",
    tone: "emerald",
  },
  {
    href: "/dashboard/case-studies",
    icon: FileText,
    title: "Case Studies",
    description: "Publish project stories, outcomes, covers, and sort order.",
    label: "Portfolio",
    meta: "Admin",
    tone: "cyan",
  },
  {
    href: "/dashboard/articles",
    icon: Newspaper,
    title: "Articles",
    description: "Write, publish, and organize portfolio article content.",
    label: "Writing",
    meta: "Admin",
    tone: "amber",
  },
  {
    href: "/dashboard/services",
    icon: Settings2,
    title: "Services",
    description: "Manage packages, details, bonuses, guarantees, and samples.",
    label: "Offers",
    meta: "Admin",
    tone: "violet",
  },
];

const coverIcon = {
  launch: Rocket,
  operations: Settings2,
  ai: BrainCircuit,
} as const;

const toneClass = {
  emerald: {
    text: "text-emerald-300",
    border: "border-emerald-300/30",
    bg: "bg-emerald-300/10",
    button: "group-hover:bg-emerald-300 group-hover:text-emerald-950",
  },
  cyan: {
    text: "text-cyan-300",
    border: "border-cyan-300/30",
    bg: "bg-cyan-300/10",
    button: "group-hover:bg-cyan-300 group-hover:text-cyan-950",
  },
  amber: {
    text: "text-amber-300",
    border: "border-amber-300/30",
    bg: "bg-amber-300/10",
    button: "group-hover:bg-amber-300 group-hover:text-amber-950",
  },
  violet: {
    text: "text-violet-300",
    border: "border-violet-300/30",
    bg: "bg-violet-300/10",
    button: "group-hover:bg-violet-300 group-hover:text-violet-950",
  },
};

export default function Dashboard({ services = [] }: DashboardProps) {
  const user = usePage<PageProps>().props.auth.user;
  const isAdmin = Boolean(user?.is_admin);
  const displayName = user?.name ?? "Mohi";
  const totalPackageProjects = services.reduce((total, service) => total + (service.sample_projects_count ?? 0), 0);

  return (
    <SiteShell>
      <Head title="Dashboard" />

      <section className="relative overflow-hidden border-b border-border/60">
        <div className="absolute inset-0 bg-grid opacity-20 [mask-image:radial-gradient(ellipse_at_top,black,transparent_70%)]" />
        <div className="absolute inset-x-0 top-0 h-64 bg-[radial-gradient(circle_at_28%_0%,rgba(52,211,153,0.18),transparent_35%),radial-gradient(circle_at_82%_20%,rgba(34,211,238,0.12),transparent_34%)]" />

        <div className="relative mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
          <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_22rem]">
            <div className="rounded-3xl border border-border/80 bg-card/70 p-6 shadow-card backdrop-blur sm:p-8">
              <div className="flex flex-wrap items-center gap-3">
                <span className="inline-flex items-center gap-2 rounded-full border border-primary/35 bg-primary/10 px-3 py-1.5 font-mono text-xs uppercase tracking-wider text-primary">
                  <LayoutDashboard className="h-3.5 w-3.5" />
                  Dashboard
                </span>
                <span className="inline-flex items-center gap-2 rounded-full border border-border bg-background/55 px-3 py-1.5 text-xs text-muted-foreground">
                  {isAdmin ? <ShieldCheck className="h-3.5 w-3.5 text-emerald-300" /> : <User className="h-3.5 w-3.5 text-cyan-300" />}
                  {isAdmin ? "Admin access" : "Member access"}
                </span>
              </div>

              <h1 className="mt-6 max-w-3xl font-display text-4xl font-semibold leading-tight tracking-tight text-foreground sm:text-5xl">
                Welcome back, {displayName}.
              </h1>
              <p className="mt-4 max-w-2xl text-base leading-7 text-muted-foreground">
                Manage your account and keep package projects close to the service packages they belong to.
              </p>

              <div className="mt-8 grid gap-3 sm:grid-cols-3">
                <Metric label="Packages" value={isAdmin ? String(services.length) : "0"} detail="service offers" icon={PackagePlus} />
                <Metric label="Projects" value={isAdmin ? String(totalPackageProjects) : "0"} detail="attached samples" icon={CheckCircle2} />
                <Metric label="Admin" value={isAdmin ? "4" : "0"} detail="content tools" icon={ShieldCheck} />
              </div>
            </div>

            <aside className="rounded-3xl border border-border/80 bg-surface/60 p-6 shadow-card backdrop-blur">
              <div className="flex items-center gap-3">
                <div className="grid h-12 w-12 place-items-center rounded-2xl border border-primary/30 bg-primary/10 font-display text-lg font-semibold text-primary">
                  {displayName.charAt(0).toUpperCase()}
                </div>
                <div className="min-w-0">
                  <p className="truncate font-semibold text-foreground">{displayName}</p>
                  <p className="text-sm text-muted-foreground">{isAdmin ? "Portfolio administrator" : "Signed-in member"}</p>
                </div>
              </div>

              <div className="mt-6 grid gap-3">
                <QuickLink href="/profile" icon={User} title="Edit profile" />
                {isAdmin && <QuickLink href="/dashboard/services" icon={Settings2} title="Manage services" />}
                {isAdmin && <QuickLink href="/dashboard/services/create" icon={Plus} title="New package" />}
              </div>
            </aside>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
        {isAdmin ? (
          <div className="grid gap-8 xl:grid-cols-[minmax(0,1.1fr)_0.9fr]">
            <div>
              <SectionHeading
                eyebrow="Package projects"
                title="Add projects to any package"
                description="Choose a package, jump directly to its project section, and add the samples that should appear on the public service page."
              />

              {services.length > 0 ? (
                <div className="mt-5 grid gap-4">
                  {services.map((service) => (
                    <PackageProjectCard key={service.id} service={service} />
                  ))}
                </div>
              ) : (
                <div className="mt-5 rounded-3xl border border-border bg-card/70 p-6 shadow-card">
                  <div className="grid h-12 w-12 place-items-center rounded-2xl border border-primary/30 bg-primary/10 text-primary">
                    <PackagePlus className="h-6 w-6" />
                  </div>
                  <h2 className="mt-5 font-display text-2xl font-semibold">No packages yet</h2>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">
                    Create a service package first, then attach projects to it from this dashboard.
                  </p>
                  <Link
                    href="/dashboard/services/create"
                    className="mt-6 inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90 sm:w-1/2"
                  >
                    Create package
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              )}
            </div>

            <div>
              <SectionHeading
                eyebrow="Admin"
                title="Publishing console"
                description="Manage the portfolio content that appears across the public site."
              />
              <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-1">
                {adminLinks.map((item) => (
                  <DashboardCard key={item.href} item={item} compact />
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="max-w-2xl">
            <SectionHeading
              eyebrow="Account"
              title="Your account"
              description="This dashboard only shows the areas available to your account."
            />
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              {accountLinks.map((item) => (
                <DashboardCard key={item.href} item={item} />
              ))}
            </div>
          </div>
        )}
      </section>
    </SiteShell>
  );
}

function Metric({
  label,
  value,
  detail,
  icon: Icon,
}: {
  label: string;
  value: string;
  detail: string;
  icon: ComponentType<{ className?: string }>;
}) {
  return (
    <div className="rounded-2xl border border-border bg-background/45 p-4">
      <div className="flex items-center justify-between gap-3">
        <span className="text-xs font-medium text-muted-foreground">{label}</span>
        <Icon className="h-4 w-4 text-primary" />
      </div>
      <p className="mt-3 font-display text-3xl font-semibold text-foreground">{value}</p>
      <p className="mt-1 text-xs text-muted-foreground">{detail}</p>
    </div>
  );
}

function SectionHeading({ eyebrow, title, description }: { eyebrow: string; title: string; description: string }) {
  return (
    <div>
      <p className="font-mono text-xs uppercase tracking-wider text-primary">{eyebrow}</p>
      <h2 className="mt-2 font-display text-3xl font-semibold tracking-tight text-foreground">{title}</h2>
      <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">{description}</p>
    </div>
  );
}

function PackageProjectCard({ service }: { service: Service }) {
  const Icon = coverIcon[service.cover];
  const samples = service.sample_projects_count ?? 0;

  return (
    <article className="grid gap-4 rounded-3xl border border-border bg-card/75 p-5 shadow-card transition-colors hover:border-primary/45 lg:grid-cols-[minmax(0,1fr)_14rem]">
      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-3">
          <span className="grid h-12 w-12 place-items-center rounded-2xl border border-primary/30 bg-primary/10 text-primary">
            <Icon className="h-6 w-6" />
          </span>
          <div className="min-w-0">
            <h3 className="truncate font-display text-2xl font-semibold text-foreground">{service.name}</h3>
            <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
              {service.badge && <span className="rounded-full border border-primary/25 bg-primary/10 px-2 py-0.5 text-primary">{service.badge}</span>}
              <span className={`rounded-full px-2 py-0.5 ${service.is_published ? "bg-primary/15 text-primary" : "bg-muted text-muted-foreground"}`}>
                {service.is_published ? "Published" : "Draft"}
              </span>
              <span className="rounded-full border border-border px-2 py-0.5">Order {service.sort_order}</span>
            </div>
          </div>
        </div>

        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          <div className="rounded-2xl border border-border bg-background/45 p-4">
            <p className="text-xs text-muted-foreground">Attached projects</p>
            <p className="mt-2 font-display text-3xl font-semibold text-foreground">{samples}</p>
          </div>
          <div className="rounded-2xl border border-border bg-background/45 p-4">
            <p className="text-xs text-muted-foreground">Destination</p>
            <p className="mt-2 truncate font-mono text-sm text-primary">/services/{service.slug}</p>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2 lg:flex-col lg:items-stretch lg:justify-center">
        <Link
          href={`/dashboard/services/${service.id}/edit#package-projects`}
          className="inline-flex h-11 flex-1 items-center justify-center gap-2 rounded-xl bg-primary px-4 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90 lg:flex-none"
        >
          <PackagePlus className="h-4 w-4" />
          Add project
        </Link>
        <Link
          href={`/dashboard/services/${service.id}/edit`}
          className="inline-flex h-11 flex-1 items-center justify-center gap-2 rounded-xl border border-border bg-background/45 px-4 text-sm font-semibold text-foreground transition-colors hover:border-primary/45 hover:bg-card lg:flex-none"
        >
          <Pencil className="h-4 w-4" />
          Edit package
        </Link>
      </div>
    </article>
  );
}

function DashboardCard({ item, compact = false }: { item: DashboardLink; compact?: boolean }) {
  const Icon = item.icon;
  const tone = toneClass[item.tone];

  return (
    <Link
      href={item.href}
      className={`group relative overflow-hidden rounded-3xl border border-border bg-card/75 p-5 shadow-card transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/45 hover:bg-card focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
        compact ? "min-h-[150px]" : "min-h-[220px]"
      }`}
    >
      <div className={`absolute inset-x-0 top-0 h-1 ${tone.bg}`} />
      <div className="flex items-start justify-between gap-4">
        <span className={`grid h-12 w-12 shrink-0 place-items-center rounded-2xl border ${tone.border} ${tone.bg} ${tone.text}`}>
          <Icon className="h-6 w-6" />
        </span>
        <span className="rounded-full border border-border bg-background/50 px-3 py-1 text-xs text-muted-foreground">
          {item.meta}
        </span>
      </div>

      <div className={compact ? "mt-5" : "mt-8"}>
        <p className={`font-mono text-[11px] uppercase tracking-wider ${tone.text}`}>{item.label}</p>
        <h3 className="mt-2 font-display text-2xl font-semibold text-foreground">{item.title}</h3>
        <p className="mt-3 text-sm leading-6 text-muted-foreground">{item.description}</p>
      </div>

      <div className={`mt-6 inline-flex h-10 items-center gap-2 rounded-xl border border-border bg-background/50 px-4 text-sm font-semibold text-foreground transition-colors ${tone.button}`}>
        Open
        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
      </div>
    </Link>
  );
}

function QuickLink({
  href,
  icon: Icon,
  title,
}: {
  href: string;
  icon: ComponentType<{ className?: string }>;
  title: string;
}) {
  return (
    <Link
      href={href}
      className="flex items-center justify-between rounded-2xl border border-border bg-background/45 px-4 py-3 text-sm font-medium text-foreground transition-colors hover:border-primary/45 hover:bg-card"
    >
      <span className="inline-flex items-center gap-3">
        <Icon className="h-4 w-4 text-primary" />
        {title}
      </span>
      <ArrowRight className="h-4 w-4 text-muted-foreground" />
    </Link>
  );
}
