import { Link, usePage, router } from "@inertiajs/react";
import { useEffect, useState } from "react";
import { ExternalLink, Menu, Sparkles, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { projects, type PortfolioProject } from "@/lib/projects";
import logoUrl from "@/assets/mohi-logo.svg";

type NavItem = { label: string; to?: string; href?: string; exact?: boolean; sectionId?: string };

const portfolioNav: NavItem[] = [
  { label: "Portfolio", to: "/", exact: true, sectionId: "top" },
  { label: "Services", href: "/#services", sectionId: "services" },
  { label: "Recommendations", href: "/#recommendations", sectionId: "recommendations" },
  { label: "Projects", to: "/projects", href: "/#projects", sectionId: "projects" },
  { label: "Case Studies", href: "/#case-studies", sectionId: "case-studies" },
  { label: "About", href: "/#about", sectionId: "about" },
  { label: "Articles", href: "/#articles", sectionId: "articles" },
  { label: "Contact", href: "/#contact", sectionId: "contact" },
];

function isProjectContext(pathname: string) {
  return (
    pathname.startsWith("/books") ||
    pathname.startsWith("/projects") ||
    pathname.startsWith("/taskmanager") ||
    pathname.startsWith("/jobs") ||
    pathname.startsWith("/my-jobs") ||
    pathname.startsWith("/my-job-applications") ||
    pathname.startsWith("/employer") ||
    pathname.startsWith("/listing") ||
    pathname.startsWith("/realtor") ||
    pathname.startsWith("/notification")
  );
}

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const page = usePage();
  const pathname = page.url.split("?")[0];
  const auth = (page.props as any).auth;
  const onPortfolioHome = pathname === "/";
  const onProjectContext = isProjectContext(pathname);
  const hasRecommendations = Array.isArray((page.props as any).recommendations)
    && (page.props as any).recommendations.length > 0;
  const hasCaseStudies = Array.isArray((page.props as any).caseStudies)
    && (page.props as any).caseStudies.length > 0;
  const nav = portfolioNav.filter((item) => {
    if (!onPortfolioHome) return true;
    if (item.sectionId === "recommendations") return hasRecommendations;
    if (item.sectionId === "case-studies") return hasCaseStudies;
    if (item.sectionId === "articles") {
      return Array.isArray((page.props as any).articles)
        && (page.props as any).articles.length > 0;
    }

    return true;
  });
  const authUrl = (path: "/login" | "/register") => `${path}?redirect=${encodeURIComponent(page.url)}`;
  const [activeSection, setActiveSection] = useState<string>("top");

  useEffect(() => {
    if (!onPortfolioHome) return;
    const ids = ["services", "recommendations", "projects", "case-studies", "about", "articles", "contact"];
    const handler = () => {
      const scrollY = window.scrollY;
      let current = "top";

      if (window.innerHeight + scrollY >= document.documentElement.scrollHeight - 12) {
        setActiveSection("contact");
        return;
      }

      for (const id of ids) {
        const el = document.getElementById(id);
        if (el && el.getBoundingClientRect().top + window.scrollY - 100 <= scrollY) {
          current = id;
        }
      }
      setActiveSection(current);
    };
    handler();
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, [onPortfolioHome]);

  const isRouteActive = (item: NavItem) => {
    if (!item.to) return false;
    if (item.exact) return pathname === item.to;

    if (item.to === "/projects") {
      return onProjectContext;
    }

    if (item.to === "/case-studies") {
      return pathname.startsWith("/case-studies");
    }

    if (item.to === "/articles") {
      return pathname.startsWith("/articles");
    }

    if (item.to === "/services") {
      return pathname.startsWith("/services");
    }

    if (item.to === "/jobs") {
      return (
        pathname.startsWith("/jobs") ||
        pathname.startsWith("/job/") ||
        pathname.startsWith("/my-jobs") ||
        pathname.startsWith("/my-job-applications") ||
        pathname.startsWith("/employer")
      );
    }

    return pathname === item.to || pathname.startsWith(`${item.to}/`);
  };

  const renderItem = (item: NavItem, onClick?: () => void) => {
    const baseCls =
      "rounded-md px-3 py-2 text-sm text-muted-foreground transition-all hover:bg-accent hover:text-foreground";
    const activeCls = "bg-accent text-foreground shadow-card";
    if (item.to && !(onPortfolioHome && item.sectionId)) {
      const isActive = isRouteActive(item);
      return (
          <Link
            key={item.label}
          href={item.to}
          className={`${baseCls} ${isActive ? activeCls : ""}`}
          onClick={onClick}
        >
          {item.label}
        </Link>
      );
    }
    const isActive = onPortfolioHome && item.sectionId === activeSection;
    const href = item.href ?? (item.to as string);
    const isExternal = href.startsWith("http");

    return (
      <a
        key={item.label}
        href={href}
        target={isExternal ? "_blank" : undefined}
        rel={isExternal ? "noreferrer" : undefined}
        className={`${baseCls} ${isActive ? activeCls : ""}`}
        onClick={onClick}
      >
        {item.label}
      </a>
    );
  };

  const isProjectActive = (project: PortfolioProject) => {
    if (project.preview === "tasks") return pathname.startsWith("/taskmanager");
    if (project.preview === "books") return pathname.startsWith("/books");
    if (project.preview === "jobs") {
      return (
        pathname.startsWith("/jobs") ||
        pathname.startsWith("/my-jobs") ||
        pathname.startsWith("/my-job-applications") ||
        pathname.startsWith("/employer")
      );
    }
    if (project.preview === "realestate") {
      return (
        pathname.startsWith("/listing") ||
        pathname.startsWith("/realtor") ||
        pathname.startsWith("/notification")
      );
    }

    return false;
  };

  const renderProjectPill = (project: PortfolioProject) => {
    const isActive = isProjectActive(project);
    const baseCls =
      "group inline-flex h-10 shrink-0 items-center gap-2 rounded-full border px-3 text-xs font-medium transition-all";
    const toneCls = isActive
      ? "border-primary/60 bg-primary/15 text-primary shadow-card"
      : "border-border bg-background/45 text-muted-foreground hover:border-primary/45 hover:bg-accent/70 hover:text-foreground";
    const content = (
      <>
        <span className={`h-2.5 w-2.5 rounded-full bg-gradient-to-br ${project.accent}`} />
        <span>{projectNavLabel(project)}</span>
        {project.external && <ExternalLink className="h-3 w-3 opacity-60 transition-opacity group-hover:opacity-100" />}
      </>
    );

    if (project.external) {
      return (
        <a key={project.name} href={project.href} target="_blank" rel="noreferrer" className={`${baseCls} ${toneCls}`}>
          {content}
        </a>
      );
    }

    return (
      <Link key={project.name} href={project.href} className={`${baseCls} ${toneCls}`}>
        {content}
      </Link>
    );
  };

  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/70 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" aria-label="Mohi home" className="flex items-center">
          <img src={logoUrl} alt="Mohi logo" className="h-8 w-auto object-contain" />
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {nav.map((item) => renderItem(item))}
        </nav>

        {onProjectContext ? (
          <div className="hidden items-center gap-2 md:flex">
            {auth?.user ? (
              <div className="flex items-center gap-3">
                <span className="text-sm text-foreground">Hi {auth.user.name}</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => router.post("/logout")}
                  className="cursor-pointer"
                >
                  Logout
                </Button>
              </div>
            ) : (
              <>
                <Button asChild variant="ghost" size="sm">
                  <Link href={authUrl("/login")}>Log in</Link>
                </Button>
                <Button asChild size="sm">
                  <Link href={authUrl("/register")}>Sign up</Link>
                </Button>
              </>
            )}
          </div>
        ) : (
          <div className="hidden md:block w-[1px]" />
        )}

        <button
          aria-label="Toggle menu"
          onClick={() => setOpen((v) => !v)}
          className="grid h-10 w-10 place-items-center rounded-md border border-border md:hidden"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {open && (
        <div className="border-t border-border bg-background md:hidden">
          <div className="mx-auto flex max-w-7xl flex-col gap-1 px-4 py-3">
            {nav.map((item) => renderItem(item, () => setOpen(false)))}
            {onProjectContext && (
              <div className="mt-2">
                {auth?.user ? (
                  <div className="flex flex-col gap-2">
                    <span className="text-sm text-foreground px-3 py-2">Hi {auth.user.name}</span>
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full cursor-pointer"
                      onClick={() => router.post("/logout")}
                    >
                      Logout
                    </Button>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-2">
                    <Button asChild variant="outline" size="sm"><Link href={authUrl("/login")}>Log in</Link></Button>
                    <Button asChild size="sm"><Link href={authUrl("/register")}>Sign up</Link></Button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {onProjectContext && (
        <div className="border-t border-border/60 bg-surface/55">
          <div className="mx-auto flex max-w-7xl items-center gap-3 overflow-x-auto overscroll-x-contain px-4 py-2.5 [scrollbar-width:none] sm:px-6 lg:px-8 [&::-webkit-scrollbar]:hidden">
            <div className="sticky left-0 z-10 hidden shrink-0 items-center gap-2 rounded-full border border-primary/30 bg-background/90 px-3 py-2 text-[10px] font-mono uppercase tracking-wider text-primary shadow-card backdrop-blur sm:inline-flex">
              <Sparkles className="h-3.5 w-3.5" />
              Project shelf
            </div>
            <Link
              href="/projects"
              className={`inline-flex h-10 shrink-0 items-center gap-2 rounded-full border px-3 text-xs font-medium transition-all ${
                pathname.startsWith("/projects")
                  ? "border-primary/60 bg-primary/15 text-primary shadow-card"
                  : "border-border bg-background/45 text-muted-foreground hover:border-primary/45 hover:bg-accent/70 hover:text-foreground"
              }`}
            >
              All Projects
            </Link>
            {projects.map((project) => renderProjectPill(project))}
          </div>
        </div>
      )}
    </header>
  );
}

function projectNavLabel(project: PortfolioProject) {
  if (project.name === "AI Routine Coach") return "AI Coach";
  if (project.name === "Mahdieh Design") return "Mahdieh";

  return project.name;
}
