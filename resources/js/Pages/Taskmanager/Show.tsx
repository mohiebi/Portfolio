import { Head, Link, useForm } from "@inertiajs/react";
import { ArrowLeft, Trash2 } from "lucide-react";
import { SiteShell } from "@/components/site/SiteShell";
import { Button } from "@/components/ui/button";
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
        <article className="mt-6 rounded-2xl border border-border bg-card p-6 sm:p-8">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="font-mono text-xs uppercase tracking-wider text-muted-foreground">{task.complete ? "Completed" : "Open"}</p>
              <h1 className="mt-2 font-display text-3xl font-semibold">{task.title}</h1>
              <p className="mt-3 text-muted-foreground">{task.description}</p>
            </div>
            <Button asChild variant="outline"><Link href={`/taskmanager/${task.id}/edit`}>Edit</Link></Button>
          </div>
          {task.long_description && <p className="mt-8 whitespace-pre-line text-sm text-foreground/90">{task.long_description}</p>}
          <div className="mt-8 flex justify-end">
            <Button variant="ghost" className="text-destructive hover:bg-destructive/10 hover:text-destructive" onClick={() => form.delete(`/taskmanager/${task.id}`)}>
              <Trash2 className="mr-2 h-4 w-4" /> Delete
            </Button>
          </div>
        </article>
      </section>
    </SiteShell>
  );
}
