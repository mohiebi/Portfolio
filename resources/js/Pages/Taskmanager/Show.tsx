import { Head, Link, useForm } from "@inertiajs/react";
import { ArrowLeft, Check, Pencil, Trash2 } from "lucide-react";
import { SiteShell } from "@/components/site/SiteShell";
import { Button } from "@/components/ui/button";
import { StatusMessage } from "@/components/site/StatusMessage";
import type { Task } from "@/types";

type Props = {
  task: Task;
};

export default function TaskShow({ task }: Props) {
  const form = useForm({});

  return (
    <SiteShell>
      <Head title={task.title} />
      <section className="mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:px-8">
        <Link href="/taskmanager" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-4 w-4" /> Back to tasks
        </Link>
        <div className="mt-6">
          <StatusMessage />
        </div>
        <article className="mt-6 rounded-2xl border border-border bg-card p-6 sm:p-8">
          <div className="flex items-start justify-between gap-4">
            <div>
              <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs ${task.complete ? "bg-success/15 text-success" : "bg-warning/15 text-warning"}`}>
                {task.complete ? <Check className="h-3 w-3" /> : null}
                {task.complete ? "Completed" : "In progress"}
              </span>
              <h1 className="mt-3 font-display text-3xl font-semibold">{task.title}</h1>
            </div>
          </div>

          {task.long_description && (
            <div className="mt-6 whitespace-pre-line rounded-xl border border-border bg-background/40 p-5 text-sm leading-relaxed text-foreground/90">
              {task.long_description}
            </div>
          )}

          <div className="mt-8 flex flex-wrap gap-2">
            <Button asChild variant="outline">
              <Link href={`/taskmanager/${task.id}/edit`}><Pencil className="mr-2 h-4 w-4" /> Edit</Link>
            </Button>
            <Button variant="ghost" className="text-destructive hover:bg-destructive/10 hover:text-destructive" onClick={() => form.delete(`/taskmanager/${task.id}`)}>
              <Trash2 className="mr-2 h-4 w-4" /> Delete
            </Button>
          </div>
        </article>
      </section>
    </SiteShell>
  );
}
