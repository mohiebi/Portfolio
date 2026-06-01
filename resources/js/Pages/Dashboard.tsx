import { Head, Link, usePage } from "@inertiajs/react";
import { BookOpen, Briefcase, FileText, ListChecks, MessageSquareQuote, Newspaper, Settings2, User } from "lucide-react";
import { SiteShell, PageHeader } from "@/components/site/SiteShell";
import type { PageProps } from "@/types";

export default function Dashboard() {
  const user = usePage<PageProps>().props.auth.user;

  return (
    <SiteShell>
      <Head title="Dashboard" />
      <PageHeader eyebrow="Dashboard" title={`Welcome, ${user?.name ?? "Mohi"}`} description="Jump into the Laravel project demos and account tools." />
      <section className="mx-auto grid max-w-5xl gap-4 px-4 py-8 sm:px-6 md:grid-cols-2 lg:px-8">
        <Tile href="/books" icon={BookOpen} title="BookReview" description="Browse books and reviews." />
        <Tile href="/taskmanager" icon={ListChecks} title="TaskManager" description="Manage authenticated tasks." />
        <Tile href="/jobs" icon={Briefcase} title="Job Board" description="Explore jobs and applications." />
        <Tile href="/profile" icon={User} title="Profile" description="Update account settings." />
        {user?.is_admin && (
          <>
            <Tile href="/dashboard/recommendations" icon={MessageSquareQuote} title="Recommendations" description="Manage public LinkedIn recommendations." />
            <Tile href="/dashboard/case-studies" icon={FileText} title="Case Studies" description="Create, edit, publish, and order case studies." />
            <Tile href="/dashboard/articles" icon={Newspaper} title="Articles" description="Write, publish, and order portfolio articles." />
            <Tile href="/dashboard/services" icon={Settings2} title="Services" description="Manage service packages, detail pages, bonuses, and guarantees." />
          </>
        )}
      </section>
    </SiteShell>
  );
}

function Tile({ href, icon: Icon, title, description }: { href: string; icon: React.ComponentType<{ className?: string }>; title: string; description: string }) {
  return (
    <Link href={href} className="rounded-2xl border border-border bg-card p-6 shadow-card transition-all hover:-translate-y-0.5 hover:border-primary/40">
      <Icon className="h-6 w-6 text-primary" />
      <h2 className="mt-4 font-display text-xl font-semibold">{title}</h2>
      <p className="mt-1 text-sm text-muted-foreground">{description}</p>
    </Link>
  );
}
