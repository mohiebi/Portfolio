import { Link } from "@inertiajs/react";
import { motion } from "framer-motion";
import { ArrowRight, Briefcase, Calendar, Cpu, Globe, Layers, MapPin, Sparkles } from "lucide-react";
import { SiteShell } from "@/components/site/SiteShell";
import { SeoHead } from "@/components/site/SeoHead";
import { Button } from "@/components/ui/button";
import type { CaseStudy } from "@/types";
import { localizedRecords, useI18n } from "@/i18n";

type Props = {
  caseStudies: CaseStudy[];
};

const coverIcon = {
  web3: Cpu,
  modernize: Layers,
  ai: Sparkles,
  web: Globe,
} as const;

export default function PublicCaseStudiesIndex({ caseStudies }: Props) {
  const { locale } = useI18n();
  caseStudies = localizedRecords(caseStudies, locale);
  return (
    <SiteShell>
      <SeoHead
        title="Case Study Library"
        description="Selected engineering case studies across backend architecture, Laravel, Symfony, Vue, Node.js, Web3, AI integrations, and production modernization."
      />

      <section className="relative overflow-hidden border-b border-border/60">
        <div className="absolute inset-0 bg-grid opacity-30 [mask-image:radial-gradient(ellipse_at_center,black,transparent_70%)]" />
        <motion.div
          aria-hidden
          className="absolute -top-24 right-0 h-72 w-72 rounded-full bg-primary/15 blur-3xl"
          animate={{ scale: [1, 1.15, 1] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        <div className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <motion.p initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="font-mono text-xs uppercase tracking-wider text-primary">
            // Case Studies
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="mt-2 font-display text-4xl font-semibold tracking-tight sm:text-5xl lg:text-6xl"
          >
            Real engineering work, <span className="text-primary">end-to-end</span>.
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mt-5 max-w-2xl text-lg text-muted-foreground"
          >
            Selected work across backend architecture, Laravel, Symfony, Vue, Node.js, Web3, AI integrations, and production modernization.
          </motion.p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-8">
          {caseStudies.map((caseStudy, index) => (
            <CaseCard key={caseStudy.id} caseStudy={caseStudy} index={index} />
          ))}
        </div>

        <div className="mt-16 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-border bg-card/60 p-6">
          <div>
            <h3 className="font-display text-xl">Have something similar in mind?</h3>
            <p className="mt-1 text-sm text-muted-foreground">I'm open to fullstack roles, freelance projects, and Web3 work.</p>
          </div>
          <Button asChild>
            <a href="/#contact">Get in touch <ArrowRight className="ml-2 h-4 w-4" /></a>
          </Button>
        </div>
      </section>
    </SiteShell>
  );
}

function CaseCard({ caseStudy, index }: { caseStudy: CaseStudy; index: number }) {
  const Icon = coverIcon[caseStudy.cover] ?? Globe;

  return (
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.5, delay: index * 0.05 }}
      className="group relative flex flex-col overflow-hidden rounded-3xl border border-border bg-card/70 shadow-card backdrop-blur transition-colors hover:border-primary/60"
    >
      <div className={`relative h-48 overflow-hidden bg-gradient-to-br ${caseStudy.accent}`}>
        {caseStudy.featured_image_url ? (
          <img src={caseStudy.featured_image_url} alt="" className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
        ) : (
          <div className="absolute inset-0 bg-grid opacity-30" />
        )}
        <div className="absolute inset-0 bg-gradient-to-br from-background/85 via-background/35 to-background/75" />
        <motion.div
          aria-hidden
          className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-primary/20 blur-3xl"
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
        />
        <div className="relative flex h-full items-center justify-between p-6">
          <div>
            <p className="font-mono text-[11px] uppercase tracking-wider text-primary">{caseStudy.tag}</p>
            <p className="mt-1 font-display text-lg font-semibold">{caseStudy.company}</p>
          </div>
          <div className="grid h-14 w-14 place-items-center rounded-2xl border border-border bg-background/70 text-primary backdrop-blur">
            <Icon className="h-6 w-6" />
          </div>
        </div>
      </div>

      <div className="flex flex-1 flex-col p-7">
        <h2 className="font-display text-2xl font-semibold leading-tight">{caseStudy.title}</h2>
        <p className="mt-3 text-sm text-muted-foreground">{caseStudy.summary}</p>

        <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
          {caseStudy.role && <span className="inline-flex items-center gap-1"><Briefcase className="h-3.5 w-3.5" /> {caseStudy.role}</span>}
          {caseStudy.period && <span className="inline-flex items-center gap-1"><Calendar className="h-3.5 w-3.5" /> {caseStudy.period}</span>}
          {caseStudy.location && <span className="inline-flex items-center gap-1"><MapPin className="h-3.5 w-3.5" /> {caseStudy.location}</span>}
        </div>

        <div className="mt-5 flex flex-wrap gap-1.5">
          {(caseStudy.stack ?? []).slice(0, 6).map((item) => (
            <span key={item} className="rounded-md border border-border bg-background/40 px-2 py-0.5 text-xs font-mono text-muted-foreground">
              {item}
            </span>
          ))}
        </div>

        <div className="mt-auto pt-7">
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
