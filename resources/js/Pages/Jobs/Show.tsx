import { Head, Link, usePage } from "@inertiajs/react";
import { ArrowLeft, Banknote, Building2, MapPin } from "lucide-react";
import { SiteShell } from "@/components/site/SiteShell";
import { Button } from "@/components/ui/button";
import { StatusMessage } from "@/components/site/StatusMessage";
import type { Job, PageProps } from "@/types";

type Props = {
  job: Job;
};

export default function JobShow({ job }: Props) {
  const user = usePage<PageProps>().props.auth.user;

  return (
    <SiteShell>
      <Head title={job.title} />
      <section className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
        <Link href="/jobs" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-4 w-4" /> Back to jobs
        </Link>
        <div className="mt-6 space-y-4">
          <StatusMessage />
          <article className="rounded-2xl border border-border bg-card p-6 shadow-card sm:p-8">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <p className="inline-flex items-center gap-2 text-sm text-muted-foreground"><Building2 className="h-4 w-4" /> {job.employer?.company_name ?? "Company"}</p>
                <h1 className="mt-2 font-display text-3xl font-semibold">{job.title}</h1>
                <div className="mt-4 flex flex-wrap gap-2 text-sm">
                  <span className="inline-flex items-center gap-1 rounded-full border border-border px-3 py-1"><MapPin className="h-4 w-4" />{job.location}</span>
                  <span className="inline-flex items-center gap-1 rounded-full border border-border px-3 py-1"><Banknote className="h-4 w-4" />${Number(job.salary).toLocaleString()}</span>
                  <span className="rounded-full border border-primary/40 bg-primary/10 px-3 py-1 capitalize text-primary">{job.experience}</span>
                  <span className="rounded-full border border-border px-3 py-1">{job.category}</span>
                </div>
              </div>
              {user ? (
                job.has_applied ? (
                  <Button disabled>Already applied</Button>
                ) : (
                  <Button asChild><Link href={`/jobs/${job.id}/apply`}>Apply now</Link></Button>
                )
              ) : (
                <Button asChild><Link href="/login">Log in to apply</Link></Button>
              )}
            </div>
            <div className="prose prose-invert mt-8 max-w-none text-foreground/90">
              <p>{job.description}</p>
            </div>
          </article>
        </div>
      </section>
    </SiteShell>
  );
}
