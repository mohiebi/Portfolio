import { Head, Link, useForm } from "@inertiajs/react";
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

  return (
    <SiteShell>
      <Head title="TaskManager" />
      <PageHeader eyebrow="Project / TaskManager" title="Your tasks" description="A focused dashboard for what's on your plate.">
        <Button asChild><Link href="/taskmanager/create"><Plus className="mr-2 h-4 w-4" /> New task</Link></Button>
      </PageHeader>
      <section className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
        <StatusMessage />
        {tasks.length === 0 ? (
          <div className="mt-8">
            <EmptyState icon={ListChecks} title="No tasks here" description="Create your first task to get started." action={<Button asChild><Link href="/taskmanager/create">Create task</Link></Button>} />
          </div>
        ) : (
          <ul className="mt-6 divide-y divide-border overflow-hidden rounded-2xl border border-border bg-card">
            {tasks.map((task) => (
              <li key={task.id} className="flex items-start gap-3 p-4 sm:p-5">
                <button
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
                    <Clock className="h-3 w-3" /> {task.created_at}
                    {task.complete && <span className="rounded-full bg-success/15 px-2 py-0.5 text-success">Completed</span>}
                  </div>
                </div>
                <Button asChild size="sm" variant="ghost"><Link href={`/taskmanager/${task.id}/edit`}>Edit</Link></Button>
              </li>
            ))}
          </ul>
        )}
      </section>
    </SiteShell>
  );
}
