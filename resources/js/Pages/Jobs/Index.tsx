import { Head, Link, router } from "@inertiajs/react";
import { Banknote, Briefcase, Building2, Filter, MapPin, Search } from "lucide-react";
import { SiteShell, PageHeader, EmptyState } from "@/components/site/SiteShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { Job } from "@/types";

type Props = {
  jobs: Job[];
  filters: Record<string, string | undefined>;
  options: {
    categories: string[];
    experiences: string[];
  };
};

export default function JobsIndex({ jobs, filters, options }: Props) {
  const visit = (next: Record<string, string>) => {
    router.get("/jobs", { ...filters, ...next }, { preserveScroll: true, preserveState: true, replace: true });
  };

  return (
    <SiteShell>
      <Head title="Job Board" />
      <PageHeader eyebrow="Project / Job Board" title="Find your next role" description="Filter by salary, experience and category." />
      <section className="mx-auto grid max-w-7xl gap-6 px-4 py-8 sm:px-6 lg:grid-cols-[280px_1fr] lg:px-8">
        <aside className="h-fit rounded-2xl border border-border bg-card p-5">
          <div className="flex items-center gap-2 text-sm font-medium"><Filter className="h-4 w-4" /> Filters</div>
          <div className="mt-4 grid gap-4">
            <div className="grid gap-1.5">
              <Label htmlFor="search">Search</Label>
              <div className="relative">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input id="search" defaultValue={filters.search ?? ""} onChange={(event) => visit({ search: event.target.value })} placeholder="Title or company" className="pl-9" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="grid gap-1.5">
                <Label htmlFor="min_salary">Min salary</Label>
                <Input id="min_salary" type="number" defaultValue={filters.min_salary ?? ""} onChange={(event) => visit({ min_salary: event.target.value })} />
              </div>
              <div className="grid gap-1.5">
                <Label htmlFor="max_salary">Max salary</Label>
                <Input id="max_salary" type="number" defaultValue={filters.max_salary ?? ""} onChange={(event) => visit({ max_salary: event.target.value })} />
              </div>
            </div>
            <ChipGroup label="Experience" value={filters.experience ?? ""} options={options.experiences} onChange={(value) => visit({ experience: value })} />
            <ChipGroup label="Category" value={filters.category ?? ""} options={options.categories} onChange={(value) => visit({ category: value })} />
            <Button variant="ghost" onClick={() => router.get("/jobs")}>Clear filters</Button>
          </div>
        </aside>

        <div>
          <p className="mb-4 text-sm text-muted-foreground">{jobs.length} {jobs.length === 1 ? "result" : "results"}</p>
          {jobs.length === 0 ? (
            <EmptyState icon={Briefcase} title="No matching jobs" description="Try widening your filters or clearing them." />
          ) : (
            <div className="grid gap-4">
              {jobs.map((job) => <JobCard key={job.id} job={job} />)}
            </div>
          )}
        </div>
      </section>
    </SiteShell>
  );
}

function ChipGroup({ label, value, options, onChange }: { label: string; value: string; options: string[]; onChange: (value: string) => void }) {
  return (
    <div className="grid gap-1.5">
      <Label>{label}</Label>
      <div className="flex flex-wrap gap-1.5">
        <Chip active={!value} onClick={() => onChange("")}>Any</Chip>
        {options.map((option) => <Chip key={option} active={value === option} onClick={() => onChange(option)}>{option}</Chip>)}
      </div>
    </div>
  );
}

function Chip({ active, children, onClick }: { active?: boolean; children: React.ReactNode; onClick?: () => void }) {
  return (
    <button onClick={onClick} className={`rounded-full border px-3 py-1 text-xs capitalize transition-colors ${active ? "border-primary bg-primary/10 text-primary" : "border-border text-muted-foreground hover:bg-accent"}`}>
      {children}
    </button>
  );
}

export function JobCard({ job }: { job: Job }) {
  return (
    <Link href={`/jobs/${job.id}`} className="group flex flex-col gap-3 rounded-2xl border border-border bg-card p-5 shadow-card transition-all hover:-translate-y-0.5 hover:border-primary/40 sm:flex-row sm:items-center sm:justify-between">
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Building2 className="h-3.5 w-3.5" /> {job.employer?.company_name ?? "Company"} <span>/</span> <span>{job.created_at}</span>
        </div>
        <h3 className="mt-1 font-display text-lg font-semibold group-hover:text-primary">{job.title}</h3>
        <p className="mt-1 line-clamp-1 text-sm text-muted-foreground">{job.description}</p>
        <div className="mt-3 flex flex-wrap gap-1.5 text-xs">
          <span className="inline-flex items-center gap-1 rounded-full border border-border bg-background/40 px-2 py-0.5"><MapPin className="h-3 w-3" />{job.location}</span>
          <span className="inline-flex items-center gap-1 rounded-full border border-border bg-background/40 px-2 py-0.5"><Banknote className="h-3 w-3" />${Number(job.salary).toLocaleString()}</span>
          <span className="rounded-full border border-primary/40 bg-primary/10 px-2 py-0.5 capitalize text-primary">{job.experience}</span>
          <span className="rounded-full border border-border bg-background/40 px-2 py-0.5">{job.category}</span>
        </div>
      </div>
      <span className="inline-flex shrink-0 items-center rounded-md border border-border px-3 py-1.5 text-sm group-hover:border-primary group-hover:text-primary">View</span>
    </Link>
  );
}
