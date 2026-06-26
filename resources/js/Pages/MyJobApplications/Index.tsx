import { Head, Link, useForm } from "@inertiajs/react";
import { Briefcase, Trash2 } from "lucide-react";
import { SiteShell, PageHeader, EmptyState } from "@/components/site/SiteShell";
import { Button } from "@/components/ui/button";
import type { JobApplication } from "@/types";

type Props = {
  applications: JobApplication[];
};

export default function MyJobApplications({ applications }: Props) {
  const form = useForm({});

  return (
    <SiteShell>
      <Head title="My Job Applications" />
      <PageHeader eyebrow="Job Board" title="My applications" description="Track the jobs you have applied to." />
      <section className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
        {applications.length === 0 ? (
          <EmptyState icon={Briefcase} title="No applications yet" description="Browse jobs and submit your first application." action={<Button asChild><Link href="/jobs">Browse jobs</Link></Button>} />
        ) : (
          <div className="grid gap-4">
            {applications.map((application) => (
              <article key={application.id} className="flex flex-col gap-4 rounded-2xl border border-border bg-card p-5 shadow-card sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <Link href={`/jobs/${application.job.id}`} className="font-display text-lg font-semibold hover:text-primary">{application.job.title}</Link>
                  <p className="mt-1 text-sm text-muted-foreground">{application.job.employer?.company_name ?? "Company"} / expected ${Number(application.expected_salary).toLocaleString()}</p>
                </div>
                <Button variant="ghost" className="text-destructive hover:bg-destructive/10 hover:text-destructive" onClick={() => form.delete(`/my-job-applications/${application.id}`)}>
                  <Trash2 className="mr-2 h-4 w-4" /> Remove
                </Button>
              </article>
            ))}
          </div>
        )}
      </section>
    </SiteShell>
  );
}
