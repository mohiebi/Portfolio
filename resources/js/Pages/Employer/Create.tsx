import { Head, Link, useForm } from "@inertiajs/react";
import { ArrowLeft } from "lucide-react";
import { SiteShell } from "@/components/site/SiteShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function EmployerCreate() {
  const form = useForm({ company_name: "" });

  return (
    <SiteShell>
      <Head title="Create employer account" />
      <section className="mx-auto max-w-2xl px-4 py-10 sm:px-6 lg:px-8">
        <Link href="/jobs" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"><ArrowLeft className="h-4 w-4" /> Back to jobs</Link>
        <div className="mt-6 rounded-2xl border border-border bg-card p-6 sm:p-8">
          <h1 className="font-display text-2xl font-semibold">Create employer account</h1>
          <form className="mt-6 grid gap-5" onSubmit={(event) => { event.preventDefault(); form.post("/employer"); }}>
            <div className="grid gap-1.5">
              <Label htmlFor="company_name">Company name</Label>
              <Input id="company_name" value={form.data.company_name} onChange={(event) => form.setData("company_name", event.target.value)} required />
              {form.errors.company_name && <p className="text-sm text-destructive">{form.errors.company_name}</p>}
            </div>
            <div className="flex justify-end gap-2">
              <Button asChild variant="ghost"><Link href="/jobs">Cancel</Link></Button>
              <Button disabled={form.processing}>Create employer</Button>
            </div>
          </form>
        </div>
      </section>
    </SiteShell>
  );
}
