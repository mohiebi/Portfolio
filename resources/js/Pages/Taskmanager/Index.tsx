import { Head, Link, useForm } from "@inertiajs/react";
import { useMemo, useState } from "react";
import { Check, Circle, Clock, ListChecks, Plus } from "lucide-react";
import { SiteShell, PageHeader, EmptyState } from "@/components/site/SiteShell";
import { Button } from "@/components/ui/button";
import { StatusMessage } from "@/components/site/StatusMessage";
import type { Task } from "@/types";

type Props = {
  tasks: Task[];
};

export default function TasksIndex({ tasks }: Props) {
  const toggle = useForm({});
  const [tab, setTab] = useState<"all" | "open" | "done">("all");

  const open = tasks.filter((task) => !task.complete).length;
  const done = tasks.filter((task) => task.complete).length;
  const filtered = useMemo(
    () =>
      tasks.filter((task) => {
        if (tab === "open") return !task.complete;
        if (tab === "done") return task.complete;

        return true;
      }),
    [tasks, tab],
  );

  return (
    <SiteShell>
      <Head title="TaskManager" />
      <PageHeader eyebrow="Project · TaskManager" title="Your tasks" description="A focused dashboard for what's on your plate.">
        <Button asChild><Link href="/taskmanager/create"><Plus className="mr-2 h-4 w-4" /> New task</Link></Button>
      </PageHeader>
      <section className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
        <StatusMessage />

        <div className="mt-6 grid gap-3 sm:grid-cols-3">
          <Stat label="Total" value={tasks.length} />
          <Stat label="Open" value={open} accent="text-warning" />
          <Stat label="Completed" value={done} accent="text-success" />
        </div>

        <div className="mt-6 inline-flex rounded-lg border border-border bg-card p-1 text-sm">
          {(["all", "open", "done"] as const).map((filter) => (
            <button
              key={filter}
              type="button"
              onClick={() => setTab(filter)}
              className={`rounded-md px-3 py-1.5 capitalize transition-colors ${
                tab === filter
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {filter}
            </button>
          ))}
        </div>

        {filtered.length === 0 ? (
          <div className="mt-8">
            <EmptyState
              icon={ListChecks}
              title="No tasks here"
              description={tasks.length === 0 ? "Create your first task to get started." : "No tasks match this view."}
              action={<Button asChild><Link href="/taskmanager/create"><Plus className="mr-2 h-4 w-4" />Create task</Link></Button>}
            />
          </div>
        ) : (
          <ul className="mt-6 divide-y divide-border overflow-hidden rounded-2xl border border-border bg-card">
            {filtered.map((task) => (
              <li key={task.id} className="flex items-start gap-3 p-4 sm:p-5">
                <button
                  type="button"
                  disabled={toggle.processing}
                  onClick={() => toggle.put(`/taskmanager/${task.id}/toggle-complete`, { preserveScroll: true })}
                  className={`mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full border transition-colors ${task.complete ? "border-success bg-success text-success-foreground" : "border-border hover:border-primary"}`}
                  aria-label="Toggle complete"
                >
                  {task.complete ? <Check className="h-3.5 w-3.5" /> : <Circle className="h-3.5 w-3.5 opacity-0" />}
                </button>
                <div className="min-w-0 flex-1">
                  <Link href={`/taskmanager/${task.id}`} className="block">
                    <p className={`font-medium ${task.complete ? "text-muted-foreground line-through" : "text-foreground"}`}>{task.title}</p>
                    <p className="mt-0.5 line-clamp-1 text-sm text-muted-foreground">{task.description}</p>
                  </Link>
                  <div className="mt-2 flex items-center gap-2 text-xs text-muted-foreground">
                    <Clock className="h-3 w-3" /> {formatTaskDate(task.created_at)}
                    {task.complete && <span className="rounded-full bg-success/15 px-2 py-0.5 text-success">Completed</span>}
                  </div>
                </div>
                <div className="hidden gap-1 sm:flex">
                  <Button asChild size="sm" variant="ghost"><Link href={`/taskmanager/${task.id}/edit`}>Edit</Link></Button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </SiteShell>
  );
}

function Stat({ label, value, accent }: { label: string; value: number; accent?: string }) {
  return (
    <div className="rounded-xl border border-border bg-card p-4">
      <p className="text-xs uppercase tracking-wider text-muted-foreground">{label}</p>
      <p className={`mt-1 font-display text-2xl ${accent ?? ""}`}>{value}</p>
    </div>
  );
}

function formatTaskDate(value?: string) {
  if (!value) return "Recently";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;

  const seconds = Math.max(0, Math.floor((Date.now() - date.getTime()) / 1000));
  const units: Array<[Intl.RelativeTimeFormatUnit, number]> = [
    ["year", 31536000],
    ["month", 2592000],
    ["week", 604800],
    ["day", 86400],
    ["hour", 3600],
    ["minute", 60],
  ];

  for (const [unit, unitSeconds] of units) {
    const amount = Math.floor(seconds / unitSeconds);
    if (amount >= 1) {
      return new Intl.RelativeTimeFormat("en", { numeric: "auto" }).format(-amount, unit);
    }
  }

  return "Just now";
}
