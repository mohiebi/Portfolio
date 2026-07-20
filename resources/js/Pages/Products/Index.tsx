import { Link } from "@inertiajs/react";
import { motion } from "framer-motion";
import { ArrowRight, Bot, CheckCircle2, CircleDollarSign, ExternalLink, type LucideIcon } from "lucide-react";
import type { ReactNode } from "react";
import { SiteShell } from "@/components/site/SiteShell";
import { SeoHead } from "@/components/site/SeoHead";
import { Button } from "@/components/ui/button";
import { getProducts, type PortfolioProduct } from "@/lib/projects";
import { useI18n } from "@/i18n";

const previewIcons: Record<PortfolioProduct["preview"], LucideIcon> = {
  tasks: CheckCircle2,
  cash: CircleDollarSign,
  routine: Bot,
};

export default function ProductsIndex() {
  const { locale } = useI18n();
  const products = getProducts(locale);

  return (
    <SiteShell>
      <SeoHead
        title="My Products"
        description="Products by Mohi: TaskManager, CashPilot, and AI Routine Coach."
      />

      <section className="relative overflow-hidden border-b border-border/60">
        <div className="absolute inset-0 bg-grid opacity-30 [mask-image:radial-gradient(ellipse_at_center,black,transparent_70%)]" />
        <motion.div
          aria-hidden
          className="absolute -right-16 -top-24 h-72 w-72 rounded-full bg-primary/15 blur-3xl"
          animate={{ scale: [1, 1.12, 1], opacity: [0.45, 0.7, 0.45] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        <div className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <motion.p initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="font-mono text-xs uppercase tracking-wider text-primary">
            // My Products
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="mt-2 max-w-4xl font-display text-4xl font-semibold tracking-tight sm:text-5xl lg:text-6xl"
          >
            Products I own, shape, and keep improving.
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mt-5 max-w-2xl text-lg text-muted-foreground"
          >
            A focused shelf of active products: TaskManager, CashPilot, and AI Routine Coach.
          </motion.p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-6 lg:grid-cols-3">
          {products.map((product, index) => (
            <ProductCard key={product.name} product={product} index={index} />
          ))}
        </div>

        <div className="mt-16 flex flex-wrap items-center justify-between gap-4 border-t border-border pt-8">
          <div>
            <h2 className="font-display text-2xl font-semibold">Want to build something similar?</h2>
            <p className="mt-1 text-sm text-muted-foreground">I work best on practical backend-heavy products with clear business workflows.</p>
          </div>
          <Button asChild>
            <a href="/#contact">
              Get in touch
              <ArrowRight className="ml-2 h-4 w-4" />
            </a>
          </Button>
        </div>
      </section>
    </SiteShell>
  );
}

function ProductCard({ product, index }: { product: PortfolioProduct; index: number }) {
  const Icon = previewIcons[product.preview];

  return (
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.5, delay: index * 0.05 }}
      className="group flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-card/75 shadow-card transition-all duration-300 hover:-translate-y-1 hover:border-primary/50"
    >
      <ProductLink product={product} className="relative block overflow-hidden">
        <div className={`aspect-[16/10] bg-gradient-to-br ${product.accent}`} />
        <div className="absolute inset-0 bg-grid opacity-30" />
        <div className="absolute inset-0 grid place-items-center">
          <span className="grid h-20 w-20 place-items-center rounded-2xl border border-border bg-background/70 text-primary backdrop-blur">
            <Icon className="h-10 w-10" />
          </span>
        </div>
      </ProductLink>

      <div className="flex flex-1 flex-col p-6">
        <p className="font-mono text-xs uppercase tracking-wider text-primary">{product.tag}</p>
        <h2 className="mt-3 font-display text-2xl font-semibold">{product.name}</h2>
        <p className="mt-3 text-sm font-medium text-foreground/90">{product.outcome}</p>
        <p className="mt-3 text-sm leading-6 text-muted-foreground">{product.blurb}</p>

        <ul className="mt-6 grid gap-2">
          {product.features.map((feature) => (
            <li key={feature} className="flex items-start gap-2 text-sm">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
              {feature}
            </li>
          ))}
        </ul>

        <div className="mt-6 flex flex-wrap gap-1.5">
          {product.tech.map((item) => (
            <span key={item} className="rounded-md border border-border bg-background/40 px-2 py-0.5 font-mono text-xs text-muted-foreground">
              {item}
            </span>
          ))}
        </div>

        <div className="mt-auto pt-7">
          <ProductLink
            product={product}
            className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
          >
            View product
            {product.external ? <ExternalLink className="h-4 w-4" /> : <ArrowRight className="h-4 w-4" />}
          </ProductLink>
        </div>
      </div>
    </motion.article>
  );
}

function ProductLink({ product, children, className }: { product: PortfolioProduct; children: ReactNode; className: string }) {
  if (product.external) {
    return (
      <a href={product.href} target="_blank" rel="noreferrer" className={className}>
        {children}
      </a>
    );
  }

  return (
    <Link href={product.href} className={className}>
      {children}
    </Link>
  );
}
