import { Link } from "@inertiajs/react";
import { Mail, Linkedin, FileDown, Github } from "lucide-react";
import { getProducts, type PortfolioProduct } from "@/lib/projects";
import { useI18n } from "@/i18n";

export function SiteFooter() {
  const { locale } = useI18n();
  const products = getProducts(locale);
  return (
    <footer className="mt-24 border-t border-border bg-surface/40">
      <div className="mx-auto grid max-w-7xl grid-cols-2 justify-items-center gap-x-8 gap-y-10 px-4 py-12 text-center sm:px-6 lg:grid-cols-4 lg:justify-items-stretch lg:px-8 lg:text-left">
        <div className="col-span-2 lg:col-span-2">
          <div className="font-display text-lg font-semibold">Mohi</div>
          <p className="mx-auto mt-2 max-w-sm text-sm text-muted-foreground lg:mx-0">
            Back-end / full-stack engineer specializing in Laravel, Symfony, and NestJS — with AI integration and Web3 experience. Available for freelance and full-time work.
          </p>
          <a
            href="/CV/mohi-cv.pdf"
            className="mt-4 inline-flex items-center gap-2 rounded-md border border-border px-3 py-2 text-sm text-foreground hover:bg-accent"
          >
            <FileDown className="h-4 w-4" /> Download CV
          </a>
        </div>

        <div className="w-full">
          <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">My Products</h4>
          <ul className="mt-3 space-y-2 text-sm">
            <li><Link href="/products" className="hover:text-foreground text-muted-foreground">All products</Link></li>
            {products.map((project) => (
              <li key={project.name}>
                <ProjectFooterLink project={project} />
              </li>
            ))}
          </ul>
        </div>

        <div className="w-full">
          <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Contact</h4>
          <ul className="mt-3 space-y-2 text-sm">
            <li><a href="mailto:e.mohamadhosein@gmail.com" className="inline-flex items-center justify-center gap-2 text-muted-foreground hover:text-foreground lg:justify-start"><Mail className="h-4 w-4" />Email</a></li>
            <li><a href="https://www.linkedin.com/in/mohiebi" target="_blank" rel="noreferrer" className="inline-flex items-center justify-center gap-2 text-muted-foreground hover:text-foreground lg:justify-start"><Linkedin className="h-4 w-4" />LinkedIn</a></li>
            <li><a href="https://github.com/mohiebi" target="_blank" rel="noreferrer" className="inline-flex items-center justify-center gap-2 text-muted-foreground hover:text-foreground lg:justify-start"><Github className="h-4 w-4" />GitHub</a></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-border">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-center gap-2 px-4 py-5 text-center text-xs text-muted-foreground sm:px-6 lg:flex-row lg:justify-between lg:px-8 lg:text-left">
          <p>&copy; {new Date().getFullYear()} Mohi. {locale === "de" ? "Alle Rechte vorbehalten." : "All rights reserved."}</p>
          <p className="font-mono">Laravel &middot; NestJS &middot; Vue &middot; Tailwind</p>
        </div>
      </div>
    </footer>
  );
}

function ProjectFooterLink({ project }: { project: PortfolioProduct }) {
  const className = "hover:text-foreground text-muted-foreground";

  if (project.external) {
    return (
      <a href={project.href} target="_blank" rel="noreferrer" className={className}>
        {project.name}
      </a>
    );
  }

  return (
    <Link href={project.href} className={className}>
      {project.name}
    </Link>
  );
}
