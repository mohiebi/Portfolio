import { Head, Link, useForm } from "@inertiajs/react";
import { ArrowLeft } from "lucide-react";
import { SiteShell } from "@/components/site/SiteShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { Job } from "@/types";

type Props = {
  job?: Job;
  options: {
    categories: string[];
    experiences: string[];
  };
};

export default function MyJobForm({ job, options }: Props) {
  const editing = Boolean(job);
  const form = useForm({
    title: job?.title ?? "",
    location: job?.location ?? "",
    salary: String(job?.salary ?? ""),
    description: job?.description ?? "",
    experience: job?.experience ?? options.experiences[0] ?? "entry",
    category: job?.category ?? options.categories[0] ?? "IT",
  });

  const submit = (event: React.FormEvent) => {
    event.preventDefault();
    if (job) {
      form.put(`/my-jobs/${job.id}`);
    } else {
      form.post("/my-jobs");
    }
  };

  return (
    <SiteShell>
      <Head title={editing ? "Edit job" : "Post a job"} />
      <section className="mx-auto max-w-2xl px-4 py-10 sm:px-6 lg:px-8">
        <Link href="/my-jobs" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"><ArrowLeft className="h-4 w-4" /> Back to my jobs</Link>
        <div className="mt-6 rounded-2xl border border-border bg-card p-6 sm:p-8">
          <h1 className="font-display text-2xl font-semibold">{editing ? "Edit job" : "Post a job"}</h1>
          <form className="mt-6 grid gap-5" onSubmit={submit}>
            <Field label="Title" error={form.errors.title}><Input value={form.data.title} onChange={(event) => form.setData("title", event.target.value)} /></Field>
            <Field label="Location" error={form.errors.location}><Input value={form.data.location} onChange={(event) => form.setData("location", event.target.value)} /></Field>
            <Field label="Salary" error={form.errors.salary}><Input type="number" value={form.data.salary} onChange={(event) => form.setData("salary", event.target.value)} /></Field>
            <Field label="Experience" error={form.errors.experience}><select className="rounded-md border border-input bg-background px-3 py-2 text-sm" value={form.data.experience} onChange={(event) => form.setData("experience", event.target.value)}>{options.experiences.map((item) => <option key={item} value={item}>{item}</option>)}</select></Field>
            <Field label="Category" error={form.errors.category}><select className="rounded-md border border-input bg-background px-3 py-2 text-sm" value={form.data.category} onChange={(event) => form.setData("category", event.target.value)}>{options.categories.map((item) => <option key={item} value={item}>{item}</option>)}</select></Field>
            <Field label="Description" error={form.errors.description}><Textarea rows={7} value={form.data.description} onChange={(event) => form.setData("description", event.target.value)} /></Field>
            <div className="flex justify-end gap-2"><Button asChild variant="ghost"><Link href="/my-jobs">Cancel</Link></Button><Button disabled={form.processing}>{editing ? "Save job" : "Create job"}</Button></div>
          </form>
        </div>
      </section>
    </SiteShell>
  );
}

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return <div className="grid gap-1.5"><Label>{label}</Label>{children}{error && <p className="text-sm text-destructive">{error}</p>}</div>;
}
