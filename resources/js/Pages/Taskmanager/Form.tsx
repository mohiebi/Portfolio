import { Head, Link, useForm } from "@inertiajs/react";
import { ArrowLeft } from "lucide-react";
import { SiteShell } from "@/components/site/SiteShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { Task } from "@/types";

type Props = {
  task?: Task;
};

export default function TaskForm({ task }: Props) {
  const editing = Boolean(task);
  const form = useForm({
    title: task?.title ?? "",
    description: task?.description ?? "",
    long_description: task?.long_description ?? "",
  });

  const submit = (event: React.FormEvent) => {
    event.preventDefault();
    if (task) {
      form.put(`/taskmanager/${task.id}`);
    } else {
      form.post("/taskmanager");
    }
  };

  return (
    <SiteShell>
      <Head title={editing ? "Edit task" : "New task"} />
      <section className="mx-auto max-w-2xl px-4 py-10 sm:px-6 lg:px-8">
        <Link href="/taskmanager" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-4 w-4" /> Back to tasks
        </Link>
        <div className="mt-6 rounded-2xl border border-border bg-card p-6 sm:p-8">
          <h1 className="font-display text-2xl font-semibold">{editing ? "Edit task" : "New task"}</h1>
          <form className="mt-6 grid gap-5" onSubmit={submit}>
            <div className="grid gap-1.5">
              <Label htmlFor="title">Title</Label>
              <Input id="title" value={form.data.title} onChange={(event) => form.setData("title", event.target.value)} required />
              {form.errors.title && <p className="text-sm text-destructive">{form.errors.title}</p>}
            </div>
            <div className="grid gap-1.5">
              <Label htmlFor="description">Short description</Label>
              <Input id="description" value={form.data.description} onChange={(event) => form.setData("description", event.target.value)} required />
              {form.errors.description && <p className="text-sm text-destructive">{form.errors.description}</p>}
            </div>
            <div className="grid gap-1.5">
              <Label htmlFor="long_description">Details</Label>
              <Textarea id="long_description" rows={6} value={form.data.long_description} onChange={(event) => form.setData("long_description", event.target.value)} />
              {form.errors.long_description && <p className="text-sm text-destructive">{form.errors.long_description}</p>}
            </div>
            <div className="flex justify-end gap-2">
              <Button asChild variant="ghost"><Link href="/taskmanager">Cancel</Link></Button>
              <Button disabled={form.processing}>{editing ? "Save task" : "Create task"}</Button>
            </div>
          </form>
        </div>
      </section>
    </SiteShell>
  );
}
