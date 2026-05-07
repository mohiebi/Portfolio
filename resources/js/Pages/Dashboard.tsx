import { Head, Link, usePage } from "@inertiajs/react";
import { BookOpen, Briefcase, ListChecks, User } from "lucide-react";
import { SiteShell, PageHeader } from "@/components/site/SiteShell";
import type { PageProps } from "@/types";

export default function Dashboard() {
  const user = usePage<PageProps>().props.auth.user;

  return (
    <SiteShell>
      <Head title="Dashboard" />
      <PageHeader eyebrow="Admin" title={`Welcome, ${user?.name ?? "Mohi"}`} description="Jump into the Laravel project demos and account tools." />
      <section className="mx-auto grid max-w-5xl gap-4 px-4 py-8 sm:px-6 md:grid-cols-2 lg:px-8">
        <Tile href="/books" icon={BookOpen} title="BookReview" description="Browse books and reviews." />
        <Tile href="/taskmanager" icon={ListChecks} title="TaskManager" description="Manage authenticated tasks." />
        <Tile href="/jobs" icon={Briefcase} title="Job Board" description="Explore jobs and applications." />
        <Tile href="/profile" icon={User} title="Profile" description="Update account settings." />
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
