import { Head, Link } from "@inertiajs/react";
import { Pencil, Plus, Users } from "lucide-react";
import { SiteShell, PageHeader, EmptyState } from "@/components/site/SiteShell";
import { Button } from "@/components/ui/button";
import type { Job } from "@/types";

type Props = {
  jobs: Job[];
};

export default function MyJobs({ jobs }: Props) {
  return (
    <SiteShell>
      <Head title="My jobs" />
      <PageHeader eyebrow="Employer" title="My jobs" description="Manage your listings, view applicants, and edit details.">
        <Button asChild><Link href="/my-jobs/create"><Plus className="mr-2 h-4 w-4" /> Post a job</Link></Button>
      </PageHeader>
      <section className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        {jobs.length === 0 ? (
          <EmptyState icon={Users} title="No listings yet" description="Post your first job to start receiving applications." action={<Button asChild><Link href="/my-jobs/create">Post a job</Link></Button>} />
        ) : (
          <div className="overflow-hidden rounded-2xl border border-border bg-card">
            <table className="w-full text-sm">
              <thead className="border-b border-border bg-background/40 text-left text-xs uppercase tracking-wider text-muted-foreground">
                <tr><th className="px-5 py-3">Title</th><th className="px-5 py-3">Category</th><th className="px-5 py-3">Salary</th><th className="px-5 py-3">Applicants</th><th className="px-5 py-3 text-right">Actions</th></tr>
              </thead>
              <tbody className="divide-y divide-border">
                {jobs.map((job) => (
                  <tr key={job.id} className="hover:bg-accent/30">
                    <td className="px-5 py-4"><Link href={`/jobs/${job.id}`} className="font-medium hover:text-primary">{job.title}</Link><p className="text-xs text-muted-foreground">{job.location}</p></td>
                    <td className="px-5 py-4">{job.category}</td>
                    <td className="px-5 py-4">${Number(job.salary).toLocaleString()}</td>
                    <td className="px-5 py-4"><span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2 py-0.5 text-xs text-primary"><Users className="h-3 w-3" />{job.job_applications_count ?? 0}</span></td>
                    <td className="px-5 py-4 text-right"><Button asChild size="sm" variant="ghost"><Link href={`/my-jobs/${job.id}/edit`}><Pencil className="h-4 w-4" /></Link></Button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </SiteShell>
  );
}
