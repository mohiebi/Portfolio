import { Link, usePage, router } from "@inertiajs/react";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import logoUrl from "@/assets/mohi-logo.svg";

type NavItem = { label: string; to?: string; href?: string; exact?: boolean; sectionId?: string };

const portfolioNav: NavItem[] = [
  { label: "Portfolio", to: "/", exact: true, sectionId: "top" },
  { label: "About", href: "/#about", sectionId: "about" },
  { label: "Recommendations", href: "/#recommendations", sectionId: "recommendations" },
  { label: "Case Studies", href: "/#case-studies", sectionId: "case-studies" },
  { label: "Projects", href: "/#projects", sectionId: "projects" },
  { label: "Contact", href: "/#contact", sectionId: "contact" },
];

const projectsNav: NavItem[] = [
  { label: "Portfolio", to: "/", exact: true },
  { label: "Tasks Manager", to: "/taskmanager" },
  { label: "Book Review", to: "/books" },
  { label: "Job Board", to: "/jobs" },
  { label: "Case Studies", to: "/case-studies" },
  { label: "Contact Me", href: "/#contact" },
];

function isProjectsRoute(pathname: string) {
  return (
    pathname.startsWith("/books") ||
    pathname.startsWith("/taskmanager") ||
    pathname.startsWith("/jobs") ||
    pathname.startsWith("/my-jobs") ||
    pathname.startsWith("/my-job-applications") ||
    pathname.startsWith("/employer") ||
    pathname.startsWith("/case-studies") ||
    pathname.startsWith("/dashboard/recommendations") ||
    pathname.startsWith("/dashboard/case-studies") ||
    pathname.startsWith("/dashboard") ||
    pathname.startsWith("/profile")
  );
}

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const page = usePage();
  const pathname = page.url.split("?")[0];
  const auth = (page.props as any).auth;
  const onProjects = isProjectsRoute(pathname);
  const hasRecommendations = Array.isArray((page.props as any).recommendations)
    && (page.props as any).recommendations.length > 0;
  const hasCaseStudies = Array.isArray((page.props as any).caseStudies)
    && (page.props as any).caseStudies.length > 0;
  const nav = onProjects
    ? projectsNav
    : portfolioNav.filter((item) => {
      if (item.sectionId === "recommendations") return hasRecommendations;
      if (item.sectionId === "case-studies") return hasCaseStudies;

      return true;
    });
  const onPortfolioHome = pathname === "/";
  const authUrl = (path: "/login" | "/register") => `${path}?redirect=${encodeURIComponent(page.url)}`;
  const [activeSection, setActiveSection] = useState<string>("top");

  useEffect(() => {
    if (!onPortfolioHome) return;
    const ids = ["about", "recommendations", "case-studies", "projects", "contact"];
    const handler = () => {
      const scrollY = window.scrollY;
      let current = "top";
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

    if (item.to === "/case-studies") {
      return pathname.startsWith("/case-studies");
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
    return (
      <a
        key={item.label}
        href={item.href ?? (item.to as string)}
        className={`${baseCls} ${isActive ? activeCls : ""}`}
        onClick={onClick}
      >
        {item.label}
      </a>
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

        {onProjects ? (
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
            {onProjects && (
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
    </header>
  );
}
