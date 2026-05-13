import { Head, Link, useForm } from "@inertiajs/react";
import { ArrowLeft, Upload } from "lucide-react";
import { SiteShell } from "@/components/site/SiteShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { Job } from "@/types";

type Props = {
  job: Job;
};

export default function ApplyForm({ job }: Props) {
  const form = useForm<{
    expected_salary: string;
    cv: File | null;
  }>({
    expected_salary: "",
    cv: null,
  });

  return (
    <SiteShell>
      <Head title={`Apply to ${job.title}`} />
      <section className="mx-auto max-w-2xl px-4 py-10 sm:px-6 lg:px-8">
        <Link href={`/jobs/${job.id}`} className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-4 w-4" /> Back to job
        </Link>

        <div className="mt-6 rounded-2xl border border-border bg-card p-6 sm:p-8">
          <p className="text-sm text-muted-foreground">Applying to</p>
          <h1 className="font-display text-2xl font-semibold">{job.title} / {job.employer?.company_name ?? "Company"}</h1>
          <form encType="multipart/form-data" className="mt-6 grid gap-5" onSubmit={(event) => { event.preventDefault(); form.post(`/jobs/${job.id}/apply`); }}>
            <div className="grid gap-1.5">
              <Label htmlFor="expected_salary">Expected salary</Label>
              <Input id="expected_salary" value={form.data.expected_salary} onChange={(event) => form.setData("expected_salary", event.target.value)} type="number" required />
              {form.errors.expected_salary && <p className="text-sm text-destructive">{form.errors.expected_salary}</p>}
            </div>
            <div className="grid gap-1.5">
              <Label htmlFor="cv">CV (PDF, max 2MB)</Label>
              <label htmlFor="cv" className="flex cursor-pointer flex-col items-center gap-2 rounded-xl border border-dashed border-border bg-background/40 p-8 text-center hover:border-primary/40">
                <Upload className="h-6 w-6 text-muted-foreground" />
                <p className="text-sm">{form.data.cv?.name ?? "Click to upload your CV"}</p>
                <p className="text-xs text-muted-foreground">PDF only / up to 2 MB</p>
                <Input id="cv" type="file" accept="application/pdf" className="sr-only" required onChange={(event) => form.setData("cv", event.target.files?.[0] ?? null)} />
              </label>
              {form.errors.cv && <p className="text-sm text-destructive">{form.errors.cv}</p>}
            </div>
            <div className="flex justify-end gap-2">
              <Button asChild variant="ghost"><Link href={`/jobs/${job.id}`}>Cancel</Link></Button>
              <Button disabled={form.processing}>Submit application</Button>
            </div>
          </form>
        </div>
      </section>
    </SiteShell>
  );
}
