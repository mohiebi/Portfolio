import { Head, Link, router } from "@inertiajs/react";
import { type FormEvent, useMemo, useState } from "react";
import { Archive, ArrowLeft, CalendarDays, CheckCircle2, Search } from "lucide-react";
import { SiteShell, PageHeader } from "@/components/site/SiteShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { PaginatedData, Task } from "@/types";

type ArchiveFilters = {
  q: string;
  created_from: string;
  created_to: string;
  done_from: string;
  done_to: string;
  include_subtasks: boolean;
};

type Props = {
  tasks: PaginatedData<Task> & {
    from?: number | null;
    to?: number | null;
    next_page_url?: string | null;
  };
  filters: ArchiveFilters;
};

export default function TaskArchive({ tasks, filters }: Props) {
  const [form, setForm] = useState(filters);
  const resultLabel = tasks.total === 1 ? "1 completed task" : `${tasks.total} completed tasks`;

  const submit = (event: FormEvent) => {
    event.preventDefault();

    router.get("/taskmanager/archive", form, {
      preserveScroll: true,
      preserveState: true,
    });
  };

  return (
    <SiteShell>
      <Head title="TaskManager done archive" />
      <PageHeader
        eyebrow="Project / TaskManager"
        title="Done archive"
        description="Search completed work without removing old task history from your account."
      >
        <Button asChild variant="outline">
          <Link href="/taskmanager">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to board
          </Link>
        </Button>
      </PageHeader>

      <section className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        <form
          onSubmit={submit}
          className="overflow-hidden rounded-[1.75rem] border border-border/80 bg-card/80 shadow-[0_24px_80px_rgba(3,10,24,0.28)]"
        >
          <div className="border-b border-border/70 bg-surface/40 px-5 py-4 sm:px-6">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-3">
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-primary/12 text-primary">
                  <Search className="h-4 w-4" />
                </span>
                <div>
                  <p className="font-display text-lg font-semibold text-foreground">Search completed work</p>
                  <p className="text-sm text-muted-foreground">Filter by text, creation date, or completion date.</p>
                </div>
              </div>
              <p className="rounded-full border border-border bg-background/70 px-3 py-1 text-xs text-muted-foreground">
                {resultLabel}
              </p>
            </div>
          </div>

          <div className="grid gap-5 p-5 sm:p-6 lg:grid-cols-[minmax(0,1fr)_minmax(360px,0.85fr)]">
            <div className="grid content-start gap-4">
              <div className="grid gap-2">
                <Label htmlFor="q">Keyword</Label>
                <div className="relative">
                  <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="q"
                    value={form.q}
                    onChange={(event) => setForm((current) => ({ ...current, q: event.target.value }))}
                    placeholder="Search titles and descriptions"
                    className="h-12 rounded-2xl bg-background/70 pl-11 text-sm"
                  />
                </div>
              </div>

              <label className="group flex cursor-pointer items-start gap-3 rounded-2xl border border-border bg-background/50 px-4 py-3 text-sm transition-colors hover:border-primary/40 hover:bg-primary/5">
                <input
                  type="checkbox"
                  checked={form.include_subtasks}
                  onChange={(event) => setForm((current) => ({ ...current, include_subtasks: event.target.checked }))}
                  className="mt-0.5 h-4 w-4 rounded border-border bg-background text-primary"
                />
                <span>
                  <span className="block font-medium text-foreground">Include completed subtasks</span>
                  <span className="mt-0.5 block text-muted-foreground">
                    Matching subtasks will show inside their parent task card.
                  </span>
                </span>
              </label>
            </div>

            <div className="grid gap-3 rounded-3xl border border-border/70 bg-background/45 p-4">
              <DateRange
                title="Created date"
                fromId="created_from"
                fromLabel="From"
                fromValue={form.created_from}
                toId="created_to"
                toLabel="To"
                toValue={form.created_to}
                onFromChange={(created_from) => setForm((current) => ({ ...current, created_from }))}
                onToChange={(created_to) => setForm((current) => ({ ...current, created_to }))}
              />
              <DateRange
                title="Done date"
                fromId="done_from"
                fromLabel="From"
                fromValue={form.done_from}
                toId="done_to"
                toLabel="To"
                toValue={form.done_to}
                onFromChange={(done_from) => setForm((current) => ({ ...current, done_from }))}
                onToChange={(done_to) => setForm((current) => ({ ...current, done_to }))}
              />
            </div>
          </div>

          <div className="flex flex-col gap-3 border-t border-border/70 bg-surface/25 px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
            <p className="text-sm text-muted-foreground">
              Hidden done tasks stay here, searchable whenever you need the history.
            </p>
            <div className="flex flex-col gap-2 sm:flex-row">
              <Button asChild variant="ghost" className="rounded-xl">
                <Link href="/taskmanager/archive">Clear filters</Link>
              </Button>
              <Button type="submit" className="rounded-xl px-5">
                <Search className="mr-2 h-4 w-4" />
                Search archive
              </Button>
            </div>
          </div>
        </form>

        <div className="mt-6 flex flex-col gap-2 px-1 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <p className="font-medium text-foreground">{resultLabel}</p>
          {tasks.from && tasks.to && (
            <p>
              Showing {tasks.from}-{tasks.to}
            </p>
          )}
        </div>

        {tasks.data.length === 0 ? (
          <div className="mt-6">
            <ArchiveEmptyState />
          </div>
        ) : (
          <div className="mt-6 grid gap-4">
            {tasks.data.map((task) => (
              <ArchiveTaskCard key={task.id} task={task} filters={filters} />
            ))}
          </div>
        )}

        {tasks.links.length > 3 && (
          <nav className="mt-8 flex flex-wrap justify-center gap-2" aria-label="Archive pagination">
            {tasks.links.map((link, index) => (
              <PaginationLink key={`${link.label}-${index}`} link={link} />
            ))}
          </nav>
        )}
      </section>
    </SiteShell>
  );
}

function DateRange({
  title,
  fromId,
  fromLabel,
  fromValue,
  toId,
  toLabel,
  toValue,
  onFromChange,
  onToChange,
}: {
  title: string;
  fromId: string;
  fromLabel: string;
  fromValue: string;
  toId: string;
  toLabel: string;
  toValue: string;
  onFromChange: (value: string) => void;
  onToChange: (value: string) => void;
}) {
  return (
    <fieldset className="rounded-2xl border border-border/70 bg-card/60 p-3">
      <legend className="px-1 text-xs font-semibold text-muted-foreground">{title}</legend>
      <div className="mt-2 grid grid-cols-2 gap-3">
        <div className="grid gap-1.5">
          <Label htmlFor={fromId} className="text-xs text-muted-foreground">
            {fromLabel}
          </Label>
          <Input
            id={fromId}
            type="date"
            value={fromValue}
            onChange={(event) => onFromChange(event.target.value)}
            className="h-10 rounded-xl bg-background/70 text-sm [&::-webkit-calendar-picker-indicator]:invert [&::-webkit-calendar-picker-indicator]:brightness-0 [&::-webkit-calendar-picker-indicator]:opacity-80 [&::-webkit-calendar-picker-indicator]:filter"
          />
        </div>
        <div className="grid gap-1.5">
          <Label htmlFor={toId} className="text-xs text-muted-foreground">
            {toLabel}
          </Label>
          <Input
            id={toId}
            type="date"
            value={toValue}
            onChange={(event) => onToChange(event.target.value)}
            className="h-10 rounded-xl bg-background/70 text-sm [&::-webkit-calendar-picker-indicator]:invert [&::-webkit-calendar-picker-indicator]:brightness-0 [&::-webkit-calendar-picker-indicator]:opacity-80 [&::-webkit-calendar-picker-indicator]:filter"
          />
        </div>
      </div>
    </fieldset>
  );
}

function ArchiveEmptyState() {
  return (
    <div className="overflow-hidden rounded-[1.75rem] border border-dashed border-border bg-surface/30">
      <div className="mx-auto flex max-w-xl flex-col items-center px-6 py-14 text-center">
        <span className="grid h-14 w-14 place-items-center rounded-2xl bg-primary/12 text-primary shadow-inner">
          <Archive className="h-6 w-6" />
        </span>
        <h3 className="mt-5 font-display text-xl font-semibold text-foreground">No completed tasks found</h3>
        <p className="mt-2 max-w-md text-sm leading-6 text-muted-foreground">
          Try a wider date range, remove the keyword, or include subtasks if the work was completed inside a parent task.
        </p>
      </div>
    </div>
  );
}

function ArchiveTaskCard({ task, filters }: { task: Task; filters: ArchiveFilters }) {
  const matchingSubtasks = useMemo(
    () => (task.subtasks ?? []).filter((subtask) => taskMatchesFilters(subtask, filters)),
    [filters, task.subtasks],
  );
  const visibleSubtasks = filters.include_subtasks ? matchingSubtasks : [];
  const summary = task.description?.trim();

  return (
    <article className="rounded-2xl border border-border bg-card p-5 transition-colors hover:border-primary/40">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2 text-xs uppercase tracking-[0.2em] text-success">
            <CheckCircle2 className="h-4 w-4" />
            <span>{isDone(task) ? "Completed task" : "Parent card"}</span>
          </div>
          <Link href={`/taskmanager/${task.id}`} className="mt-2 block font-display text-xl font-semibold text-foreground hover:text-primary">
            {task.title}
          </Link>
          {summary && <p className="mt-2 text-sm leading-6 text-muted-foreground">{summary}</p>}
        </div>
        <div className="grid shrink-0 gap-2 text-xs text-muted-foreground sm:text-right">
          <DateMeta label="Created" value={task.created_at} />
          <DateMeta label="Done" value={task.done_at} />
        </div>
      </div>

      {visibleSubtasks.length > 0 && (
        <div className="mt-5 space-y-2 border-t border-border pt-4">
          <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Matching subtasks</p>
          {visibleSubtasks.map((subtask) => (
            <div key={subtask.id} className="rounded-xl border border-success/30 bg-success/5 px-4 py-3">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <p className="text-sm font-semibold text-foreground">{subtask.title}</p>
                  {subtask.description && <p className="mt-1 text-sm text-muted-foreground">{subtask.description}</p>}
                </div>
                <div className="flex shrink-0 items-center gap-1 text-xs text-success">
                  <CalendarDays className="h-3.5 w-3.5" />
                  {formatDate(subtask.done_at)}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </article>
  );
}

function DateMeta({ label, value }: { label: string; value?: string | null }) {
  return (
    <div>
      <span className="block uppercase tracking-[0.2em]">{label}</span>
      <span className="mt-0.5 block text-foreground">{formatDate(value)}</span>
    </div>
  );
}

function PaginationLink({ link }: { link: { url: string | null; label: string; active: boolean } }) {
  const label = decodePaginationLabel(link.label);

  if (!link.url) {
    return (
      <span className="rounded-lg border border-border px-3 py-2 text-sm text-muted-foreground opacity-50">
        {label}
      </span>
    );
  }

  return (
    <Link
      href={link.url}
      preserveScroll
      className={`rounded-lg border px-3 py-2 text-sm transition-colors ${
        link.active
          ? "border-primary bg-primary text-primary-foreground"
          : "border-border bg-card text-muted-foreground hover:border-primary/50 hover:text-foreground"
      }`}
    >
      {label}
    </Link>
  );
}

function taskMatchesFilters(task: Task, filters: ArchiveFilters): boolean {
  if (!isDone(task)) return false;

  const keyword = filters.q.trim().toLowerCase();
  const textMatches = keyword === ""
    || task.title.toLowerCase().includes(keyword)
    || (task.description ?? "").toLowerCase().includes(keyword);

  return textMatches
    && dateIsWithinRange(task.created_at, filters.created_from, filters.created_to)
    && dateIsWithinRange(task.done_at, filters.done_from, filters.done_to);
}

function dateIsWithinRange(value: string | null | undefined, from: string, to: string): boolean {
  if (!from && !to) return true;
  if (!value) return false;

  const date = value.slice(0, 10);

  if (from && date < from) return false;
  if (to && date > to) return false;

  return true;
}

function isDone(task: Task): boolean {
  return task.complete || task.status === "done";
}

function formatDate(value: string | null | undefined): string {
  if (!value) return "Not set";

  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(value));
}

function decodePaginationLabel(label: string): string {
  return label
    .replace("&laquo;", "Previous")
    .replace("&raquo;", "Next")
    .replace(/&amp;/g, "&");
}
