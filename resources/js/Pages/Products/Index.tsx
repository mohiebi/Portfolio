import { Link } from "@inertiajs/react";
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  useReducedMotion,
} from "framer-motion";
import {
  ArrowRight,
  Bot,
  Check,
  ExternalLink,
  TrendingUp,
  TrendingDown,
  Zap,
  Plus,
} from "lucide-react";
import type { MouseEvent, ReactNode } from "react";
import { useRef } from "react";
import { SiteShell } from "@/components/site/SiteShell";
import { SeoHead } from "@/components/site/SeoHead";
import { Button } from "@/components/ui/button";
import { getProducts, type PortfolioProduct } from "@/lib/projects";
import { useI18n } from "@/i18n";

// ─── Per-product visual theme ────────────────────────────────────────────────

const theme = {
  tasks: {
    previewBg: "from-emerald-950 via-teal-950/80 to-card",
    orb1: "bg-emerald-500/40 h-56 w-56 -top-14 -left-14",
    orb2: "bg-teal-400/25 h-40 w-40 bottom-4 right-0",
    glowShadow: "0 0 0 1.5px rgba(16,185,129,0.45), 0 0 70px rgba(16,185,129,0.2)",
    badge: "bg-primary/10 border-primary/35 text-primary",
    badgeLabel: "Live Product",
    badgeDot: true,
  },
  cash: {
    previewBg: "from-lime-950 via-emerald-950/80 to-card",
    orb1: "bg-lime-500/35 h-56 w-56 -top-12 -right-14",
    orb2: "bg-cyan-400/20 h-36 w-36 bottom-6 left-4",
    glowShadow: "0 0 0 1.5px rgba(132,204,22,0.4), 0 0 70px rgba(132,204,22,0.18)",
    badge: "bg-sky-500/10 border-sky-500/30 text-sky-400",
    badgeLabel: "Live Product",
    badgeDot: false,
  },
  routine: {
    previewBg: "from-violet-950 via-fuchsia-950/80 to-card",
    orb1: "bg-violet-500/40 h-52 w-52 -top-10 -right-10",
    orb2: "bg-fuchsia-400/25 h-36 w-36 bottom-2 left-6",
    glowShadow: "0 0 0 1.5px rgba(139,92,246,0.45), 0 0 70px rgba(139,92,246,0.2)",
    badge: "bg-violet-500/10 border-violet-500/30 text-violet-400",
    badgeLabel: "Telegram Bot",
    badgeDot: false,
  },
} as const;

// ─── 3D tilt wrapper ──────────────────────────────────────────────────────────

function TiltCard({
  children,
  glowShadow,
  className,
}: {
  children: ReactNode;
  glowShadow: string;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const shouldReduce = useReducedMotion();
  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const rotateY = useSpring(useTransform(rawX, [-0.5, 0.5], [-5, 5]), { stiffness: 280, damping: 28 });
  const rotateX = useSpring(useTransform(rawY, [-0.5, 0.5], [5, -5]), { stiffness: 280, damping: 28 });

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!ref.current || shouldReduce) return;
    const rect = ref.current.getBoundingClientRect();
    rawX.set((e.clientX - rect.left) / rect.width - 0.5);
    rawY.set((e.clientY - rect.top) / rect.height - 0.5);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => { rawX.set(0); rawY.set(0); }}
      style={{ rotateX: shouldReduce ? 0 : rotateX, rotateY: shouldReduce ? 0 : rotateY, transformPerspective: 1400 }}
      whileHover={{ boxShadow: glowShadow }}
      transition={{ boxShadow: { duration: 0.4 } }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// ─── Floating orb ─────────────────────────────────────────────────────────────

function Orb({ className, delay = 0 }: { className: string; delay?: number }) {
  const shouldReduce = useReducedMotion();
  return (
    <motion.div
      aria-hidden
      className={`pointer-events-none absolute rounded-full blur-3xl ${className}`}
      animate={shouldReduce ? {} : { y: [0, -20, 0], opacity: [0.5, 0.85, 0.5] }}
      transition={{ duration: 5 + delay, repeat: Infinity, ease: "easeInOut", delay }}
    />
  );
}

// ─── Product preview UIs ──────────────────────────────────────────────────────

function AppFrame({ title, accentColor, children }: { title: string; accentColor: string; children: ReactNode }) {
  return (
    <div className="w-full overflow-hidden rounded-2xl border border-white/10 bg-background/65 shadow-2xl backdrop-blur-md">
      <div className="flex items-center gap-1.5 border-b border-white/8 bg-white/4 px-3 py-2.5">
        <div className="flex gap-1">
          <span className="h-2.5 w-2.5 rounded-full bg-rose-500/60" />
          <span className="h-2.5 w-2.5 rounded-full bg-amber-400/60" />
          <span className={`h-2.5 w-2.5 rounded-full ${accentColor}`} />
        </div>
        <span className="ml-2 font-mono text-[10px] text-white/30">{title}</span>
      </div>
      <div className="p-4">{children}</div>
    </div>
  );
}

function TaskPreview() {
  const tasks = [
    { label: "Ship landing page", done: true, tag: "Done" },
    { label: "Review PR #248", done: false, urgent: true, tag: "Today" },
    { label: "Plan sprint demo", done: false, tag: "Tomorrow" },
    { label: "Update documentation", done: false, tag: "" },
  ];
  return (
    <AppFrame title="TaskManager" accentColor="bg-primary/70">
      <div className="mb-2.5 flex items-center justify-between">
        <span className="font-mono text-[10px] uppercase tracking-wider text-white/30">My tasks</span>
        <span className="inline-flex items-center gap-0.5 rounded-md border border-primary/30 bg-primary/15 px-2 py-0.5 font-mono text-[10px] text-primary">
          <Plus className="h-2.5 w-2.5" /> Add
        </span>
      </div>
      <div className="space-y-2">
        {tasks.map((t, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 + i * 0.09, type: "spring", stiffness: 180, damping: 20 }}
            className={`flex items-center gap-2.5 rounded-xl px-3 py-2 text-sm ${t.done ? "opacity-40" : "border border-white/10 bg-white/4"}`}
          >
            <div className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border ${t.done ? "border-primary/60 bg-primary/20" : "border-white/20"}`}>
              {t.done && <Check className="h-3 w-3 text-primary" strokeWidth={3} />}
            </div>
            <span className={`flex-1 truncate text-xs ${t.done ? "text-white/35 line-through" : "text-white/80"}`}>{t.label}</span>
            {t.urgent && <Zap className="h-3.5 w-3.5 shrink-0 text-amber-400" />}
            {t.tag && !t.urgent && <span className={`shrink-0 rounded-md px-1.5 py-0.5 font-mono text-[9px] ${t.tag === "Done" ? "bg-primary/10 text-primary/60" : "bg-white/8 text-white/30"}`}>{t.tag}</span>}
          </motion.div>
        ))}
      </div>
      <div className="mt-3 flex items-center justify-between border-t border-white/6 pt-2.5">
        <span className="font-mono text-[10px] text-white/25">2 / 4 done</span>
        <div className="h-1.5 w-28 overflow-hidden rounded-full bg-white/10">
          <motion.div className="h-full rounded-full bg-primary" initial={{ width: 0 }} animate={{ width: "50%" }} transition={{ delay: 0.7, duration: 1, ease: "easeOut" }} />
        </div>
      </div>
    </AppFrame>
  );
}

function FinancePreview() {
  return (
    <AppFrame title="CashPilot" accentColor="bg-lime-400/70">
      <div className="mb-3 rounded-xl border border-white/10 bg-white/4 p-3">
        <p className="font-mono text-[10px] uppercase tracking-wider text-white/30">Total balance</p>
        <div className="mt-1 flex items-end justify-between">
          <p className="font-display text-2xl font-bold tabular-nums text-white">€8,430</p>
          <div className="flex h-10 items-end gap-0.5">
            {[42, 58, 48, 72, 65, 80, 68].map((h, i) => (
              <motion.span key={i} className="w-2 rounded-sm bg-primary/60" style={{ height: `${h}%` }} initial={{ scaleY: 0 }} animate={{ scaleY: 1 }} transition={{ delay: 0.1 + i * 0.05, duration: 0.4, ease: "easeOut" }} />
            ))}
          </div>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-2">
        <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-2.5">
          <p className="font-mono text-[10px] text-emerald-400/60">Income</p>
          <p className="mt-0.5 text-base font-semibold tabular-nums text-emerald-400">€4,820</p>
          <div className="mt-1 flex items-center gap-1 text-[10px] text-emerald-400/50"><TrendingUp className="h-3 w-3" /> +12%</div>
        </div>
        <div className="rounded-xl border border-rose-500/20 bg-rose-500/10 p-2.5">
          <p className="font-mono text-[10px] text-rose-400/60">Expenses</p>
          <p className="mt-0.5 text-base font-semibold tabular-nums text-rose-400">€1,940</p>
          <div className="mt-1 flex items-center gap-1 text-[10px] text-rose-400/50"><TrendingDown className="h-3 w-3" /> -3%</div>
        </div>
      </div>
      <div className="mt-2 rounded-xl border border-white/8 bg-white/3 p-2.5">
        <div className="flex justify-between text-xs">
          <span className="text-white/35">Net saved</span>
          <span className="font-semibold text-primary">€2,880</span>
        </div>
        <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/10">
          <motion.div className="h-full rounded-full bg-primary" initial={{ width: 0 }} animate={{ width: "60%" }} transition={{ delay: 0.5, duration: 1, ease: "easeOut" }} />
        </div>
      </div>
    </AppFrame>
  );
}

function BotPreview() {
  const msgs = [
    { bot: true, text: "Good morning! Ready to plan your day?" },
    { bot: false, text: "Yes, let's go." },
    { bot: true, text: "3 habits due. Start with morning workout?" },
    { bot: false, text: "Sounds good!" },
  ];
  return (
    <AppFrame title="AI Routine Coach" accentColor="bg-violet-400/70">
      <div className="mb-2.5 flex items-center gap-2 border-b border-white/8 pb-2.5">
        <div className="flex h-7 w-7 items-center justify-center rounded-full bg-violet-500/25">
          <Bot className="h-4 w-4 text-violet-400" />
        </div>
        <div>
          <p className="text-xs font-medium text-white/70">AI Routine Coach</p>
          <p className="font-mono text-[9px] text-violet-400/60">● online</p>
        </div>
      </div>
      <div className="space-y-2.5">
        {msgs.map((m, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 + i * 0.18, type: "spring", stiffness: 200, damping: 22 }} className={`flex items-start gap-2 ${m.bot ? "" : "flex-row-reverse"}`}>
            {m.bot && <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-violet-500/20"><Bot className="h-3 w-3 text-violet-400" /></span>}
            <div className={`max-w-[75%] rounded-2xl px-3 py-1.5 text-xs leading-4 ${m.bot ? "border border-violet-500/25 bg-violet-500/15 text-violet-100" : "border border-white/10 bg-white/8 text-white/75"}`}>{m.text}</div>
          </motion.div>
        ))}
      </div>
    </AppFrame>
  );
}

const previewMap: Record<PortfolioProduct["preview"], ReactNode> = {
  tasks: <TaskPreview />,
  cash: <FinancePreview />,
  routine: <BotPreview />,
};

// ─── Status badge ─────────────────────────────────────────────────────────────

function StatusBadge({ product }: { product: PortfolioProduct }) {
  const t = theme[product.preview];
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold ${t.badge}`}>
      {t.badgeDot ? (
        <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-primary" />
      ) : product.preview === "routine" ? (
        <Bot className="h-3 w-3" />
      ) : (
        <ExternalLink className="h-3 w-3" />
      )}
      {t.badgeLabel}
    </span>
  );
}

// ─── Product link ─────────────────────────────────────────────────────────────

function ProductLink({ product, children, className }: { product: PortfolioProduct; children: ReactNode; className?: string }) {
  if (product.external) return <a href={product.href} target="_blank" rel="noreferrer" className={className}>{children}</a>;
  return <Link href={product.href} className={className}>{children}</Link>;
}

// ─── Product row card ─────────────────────────────────────────────────────────

function ProductRow({ product, index }: { product: PortfolioProduct; index: number }) {
  const t = theme[product.preview];
  const flip = index % 2 === 1;

  return (
    <motion.div
      initial={{ opacity: 0, y: 64 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ type: "spring", stiffness: 60, damping: 18, delay: 0 }}
    >
      <TiltCard
        glowShadow={t.glowShadow}
        className={`flex flex-col overflow-hidden rounded-3xl border border-white/10 bg-card/70 lg:min-h-[420px] lg:flex-row ${flip ? "lg:flex-row-reverse" : ""}`}
      >
        {/* Preview panel */}
        <div className={`relative overflow-hidden bg-gradient-to-br ${t.previewBg} lg:w-[42%] lg:shrink-0`}>
          <Orb className={t.orb1} delay={0} />
          <Orb className={t.orb2} delay={1.8} />
          <div className="absolute inset-0 bg-grid opacity-15 [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_80%)]" />
          <div className="relative flex min-h-72 items-center justify-center p-8 lg:h-full lg:min-h-0">
            <motion.div
              className="w-full max-w-md"
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
            >
              {previewMap[product.preview]}
            </motion.div>
          </div>
          {/* Edge gloss toward content */}
          <div className={`absolute inset-y-0 ${flip ? "left-0 bg-gradient-to-r" : "right-0 bg-gradient-to-l"} hidden w-24 from-card/40 to-transparent lg:block`} />
        </div>

        {/* Content panel */}
        <div className="flex flex-1 flex-col justify-center p-8 lg:p-12">
          {/* Index number + badges */}
          <div className="flex flex-wrap items-center gap-3">
            <span className="select-none font-mono text-6xl font-black leading-none text-primary/10">
              {String(index + 1).padStart(2, "0")}
            </span>
            <div className="flex flex-wrap items-center gap-2">
              <StatusBadge product={product} />
              <span className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground/45">{product.tag}</span>
            </div>
          </div>

          <h2 className="mt-4 font-display text-3xl font-bold tracking-tight sm:text-4xl">{product.name}</h2>
          <p className="mt-3 text-base leading-relaxed text-muted-foreground/85">{product.outcome}</p>

          <ul className="mt-6 grid gap-3 sm:grid-cols-2">
            {product.features.map((f) => (
              <li key={f} className="flex items-start gap-2.5 text-sm text-muted-foreground">
                <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" strokeWidth={2.5} />
                {f}
              </li>
            ))}
          </ul>

          <div className="mt-5 flex flex-wrap gap-2">
            {product.tech.map((tech) => (
              <span key={tech} className="rounded-lg border border-white/8 bg-white/5 px-2.5 py-1 font-mono text-xs text-muted-foreground/65">
                {tech}
              </span>
            ))}
          </div>

          <div className="mt-8">
            <ProductLink
              product={product}
              className="inline-flex min-h-12 cursor-pointer items-center gap-2.5 rounded-xl bg-primary px-7 text-sm font-semibold text-primary-foreground transition-all duration-200 hover:bg-primary/90 hover:gap-3.5"
            >
              {product.external ? "Visit product" : "Explore live"}
              {product.external ? <ExternalLink className="h-4 w-4" /> : <ArrowRight className="h-4 w-4" />}
            </ProductLink>
          </div>
        </div>
      </TiltCard>
    </motion.div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function ProductsIndex() {
  const { locale } = useI18n();
  const products = getProducts(locale);

  return (
    <SiteShell>
      <SeoHead
        title="My Products"
        description="Products by Mohi: TaskManager, CashPilot, and AI Routine Coach."
      />

      {/* Hero */}
      <section className="relative overflow-hidden border-b border-border/60">
        <motion.div
          aria-hidden
          className="absolute -right-32 -top-32 h-[500px] w-[500px] rounded-full bg-primary/8 blur-3xl"
          animate={{ scale: [1, 1.15, 1], opacity: [0.5, 0.8, 0.5] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          aria-hidden
          className="absolute -left-24 top-1/2 h-72 w-72 rounded-full bg-violet-500/5 blur-3xl"
          animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        />
        <div className="absolute inset-0 bg-grid opacity-20 [mask-image:radial-gradient(ellipse_at_60%_30%,black,transparent_70%)]" />

        <div className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-2.5">
            <span className="font-mono text-xs uppercase tracking-wider text-primary">// My Products</span>
            <span className="rounded-full border border-primary/30 bg-primary/10 px-2 py-0.5 font-mono text-[10px] text-primary">{products.length} active</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.06, type: "spring", stiffness: 80, damping: 18 }}
            className="mt-3 max-w-4xl font-display text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl"
          >
            Products I own, shape,{" "}
            <span className="bg-gradient-to-r from-primary to-teal-400 bg-clip-text text-transparent">and keep improving.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.13 }}
            className="mt-5 max-w-2xl text-lg leading-relaxed text-muted-foreground"
          >
            Real products in active use — a task dashboard, a personal finance tool, and an AI routine coach. Each built end-to-end.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.22 }}
            className="mt-8 flex flex-wrap gap-8"
          >
            {[
              { label: "Live products", value: "3" },
              { label: "Deployed on", value: "VPS + Subdomain" },
              { label: "Stack", value: "Laravel + React" },
            ].map((s) => (
              <div key={s.label} className="flex items-baseline gap-2">
                <span className="font-display text-2xl font-bold text-foreground">{s.value}</span>
                <span className="text-xs text-muted-foreground">{s.label}</span>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Products — one per row */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-6">
          {products.map((product, i) => (
            <ProductRow key={product.name} product={product} index={i} />
          ))}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ type: "spring", stiffness: 65, damping: 20 }}
          className="relative mt-8 overflow-hidden rounded-2xl border border-white/10 bg-card/60 p-8"
        >
          <motion.div aria-hidden className="absolute -right-16 -top-16 h-48 w-48 rounded-full bg-primary/10 blur-3xl" animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }} />
          <div className="relative flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="font-display text-2xl font-bold">Want to build something similar?</h2>
              <p className="mt-1.5 max-w-md text-sm leading-relaxed text-muted-foreground">I work best on practical backend-heavy products with clear business workflows. Let's talk.</p>
            </div>
            <Button asChild size="lg" className="shrink-0">
              <a href="/#contact">Get in touch <ArrowRight className="ml-2 h-4 w-4" /></a>
            </Button>
          </div>
        </motion.div>
      </section>
    </SiteShell>
  );
}
