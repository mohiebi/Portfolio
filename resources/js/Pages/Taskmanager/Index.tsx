import { Head, Link, router } from "@inertiajs/react";
import { type FormEvent, useEffect, useMemo, useState } from "react";
import { Check, Circle, Clock, ListChecks, Plus, Trash2 } from "lucide-react";
import { SiteShell, PageHeader, EmptyState } from "@/components/site/SiteShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { StatusMessage } from "@/components/site/StatusMessage";
import type { Task } from "@/types";

type Props = {
  tasks: Task[];
  demoMode?: boolean;
};

export default function TasksIndex({ tasks, demoMode = false }: Props) {
  const [tab, setTab] = useState<"all" | "open" | "done">("all");
  const [savedTasks, setSavedTasks] = useState(tasks);
  const [demoTasks, setDemoTasks] = useState(tasks);
  const [quickTitle, setQuickTitle] = useState("");
  const [quickTitleError, setQuickTitleError] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const [quickAddProcessing, setQuickAddProcessing] = useState(false);
  const [workingTaskIds, setWorkingTaskIds] = useState<number[]>([]);
  const newTaskHref = demoMode ? "/login?redirect=/taskmanager/create" : "/taskmanager/create";

  useEffect(() => {
    setSavedTasks(tasks);
    setDemoTasks(tasks);
  }, [tasks]);

  const displayedTasks = demoMode ? demoTasks : savedTasks;

  const open = displayedTasks.filter((task) => !task.complete).length;
  const done = displayedTasks.filter((task) => task.complete).length;
  const filtered = useMemo(
    () =>
      displayedTasks.filter((task) => {
        if (tab === "open") return !task.complete;
        if (tab === "done") return task.complete;

        return true;
      }),
    [displayedTasks, tab],
  );

  const setTaskWorking = (taskId: number, working: boolean) => {
    setWorkingTaskIds((current) =>
      working
        ? Array.from(new Set([...current, taskId]))
        : current.filter((id) => id !== taskId),
    );
  };

  const handleToggle = async (task: Task) => {
    if (demoMode) {
      setDemoTasks((current) =>
        current.map((item) =>
          item.id === task.id ? { ...item, complete: !item.complete } : item,
        ),
      );

      return;
    }

    setActionError(null);
    setTaskWorking(task.id, true);
    setSavedTasks((current) =>
      current.map((item) =>
        item.id === task.id ? { ...item, complete: !item.complete } : item,
      ),
    );

    try {
      const { task: updatedTask } = await taskRequest<TaskResponse>(
        `/taskmanager/${task.id}/toggle-complete`,
        { method: "PUT" },
      );

      setSavedTasks((current) =>
        current.map((item) => (item.id === updatedTask.id ? updatedTask : item)),
      );
    } catch (error) {
      setSavedTasks((current) =>
        current.map((item) => (item.id === task.id ? task : item)),
      );
      setActionError(getMessage(error));
    } finally {
      setTaskWorking(task.id, false);
    }
  };

  const handleQuickAdd = async (event: FormEvent) => {
    event.preventDefault();
    const title = quickTitle.trim();

    if (!title) return;

    if (demoMode) {
      router.visit("/login?redirect=/taskmanager/create");

      return;
    }

    setActionError(null);
    setQuickTitleError(null);
    setQuickAddProcessing(true);

    try {
      const { task } = await taskRequest<TaskResponse>("/taskmanager", {
        method: "POST",
        body: {
          title,
          return_to_index: true,
        },
      });

      setSavedTasks((current) => [task, ...current]);
      setQuickTitle("");
    } catch (error) {
      if (error instanceof TaskRequestError && error.errors.title) {
        setQuickTitleError(firstError(error.errors.title));
      } else {
        setActionError(getMessage(error));
      }
    } finally {
      setQuickAddProcessing(false);
    }
  };

  const handleDelete = async (task: Task) => {
    setActionError(null);
    setTaskWorking(task.id, true);

    try {
      await taskRequest<DeleteResponse>(`/taskmanager/${task.id}`, {
        method: "DELETE",
      });

      setSavedTasks((current) => current.filter((item) => item.id !== task.id));
    } catch (error) {
      setActionError(getMessage(error));
    } finally {
      setTaskWorking(task.id, false);
    }
  };

  return (
    <SiteShell>
      <Head title="TaskManager" />
      <PageHeader eyebrow="Project / TaskManager" title="Your tasks" description="A focused dashboard for what's on your plate.">
        <Button asChild><Link href={newTaskHref}><Plus className="mr-2 h-4 w-4" /> New task</Link></Button>
      </PageHeader>
      <section className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
        <StatusMessage />
        {actionError && (
          <div className="mt-4 rounded-lg border border-destructive/40 bg-destructive/10 px-4 py-3 text-sm text-destructive">
            {actionError}
          </div>
        )}
        {demoMode && (
          <div className="mt-6 rounded-xl border border-primary/30 bg-primary/10 px-4 py-3 text-sm text-primary">
            You are viewing a demo. You can toggle these sample tasks here, but changes are not saved. Log in or register to create and manage your own tasks.
          </div>
        )}

        <div className="mt-6 grid gap-3 sm:grid-cols-3">
          <Stat label="Total" value={displayedTasks.length} />
          <Stat label="Open" value={open} accent="text-warning" />
          <Stat label="Completed" value={done} accent="text-success" />
        </div>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div className="inline-flex w-fit rounded-lg border border-border bg-card p-1 text-sm">
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

          <form className="w-full sm:max-w-sm" onSubmit={handleQuickAdd}>
            <div className="flex gap-2">
              <Input
                aria-label="New task title"
                value={quickTitle}
                onChange={(event) => {
                  setQuickTitle(event.target.value);
                  setQuickTitleError(null);
                }}
                placeholder={demoMode ? "Log in to add your own task" : "Add a task title"}
                disabled={quickAddProcessing}
              />
              <Button
                type="submit"
                className="shrink-0 px-3"
                disabled={!quickTitle.trim() || quickAddProcessing}
                aria-label={demoMode ? "Log in to add task" : "Add task"}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            {quickTitleError && <p className="mt-1 text-xs text-destructive">{quickTitleError}</p>}
          </form>
        </div>

        {filtered.length === 0 ? (
          <div className="mt-8">
            <EmptyState
              icon={ListChecks}
              title="No tasks here"
              description={displayedTasks.length === 0 ? "Create your first task to get started." : "No tasks match this view."}
              action={<Button asChild><Link href={newTaskHref}><Plus className="mr-2 h-4 w-4" />Create task</Link></Button>}
            />
          </div>
        ) : (
          <ul className="mt-6 divide-y divide-border overflow-hidden rounded-2xl border border-border bg-card">
            {filtered.map((task) => (
              <li key={task.id} className="flex items-start gap-3 p-4 sm:p-5">
                <button
                  type="button"
                  disabled={workingTaskIds.includes(task.id)}
                  onClick={() => handleToggle(task)}
                  className={`mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full border transition-colors ${task.complete ? "border-success bg-success text-success-foreground" : "border-border hover:border-primary"}`}
                  aria-label="Toggle complete"
                >
                  {task.complete ? <Check className="h-3.5 w-3.5" /> : <Circle className="h-3.5 w-3.5 opacity-0" />}
                </button>
                <div className="min-w-0 flex-1">
                  {demoMode ? (
                    <div>
                      <p className={`font-medium ${task.complete ? "text-muted-foreground line-through" : "text-foreground"}`}>{task.title}</p>
                    </div>
                  ) : (
                    <Link href={`/taskmanager/${task.id}`} className="block">
                      <p className={`font-medium ${task.complete ? "text-muted-foreground line-through" : "text-foreground"}`}>{task.title}</p>
                    </Link>
                  )}
                  <div className="mt-2 flex items-center gap-2 text-xs text-muted-foreground">
                    <Clock className="h-3 w-3" /> {formatTaskDate(task.created_at)}
                    {task.complete && <span className="rounded-full bg-success/15 px-2 py-0.5 text-success">Completed</span>}
                  </div>
                </div>
                <div className="hidden items-center gap-1 sm:flex">
                  <Button asChild size="sm" variant="ghost">
                    <Link href={demoMode ? "/login?redirect=/taskmanager/create" : `/taskmanager/${task.id}/edit`}>
                      Edit
                    </Link>
                  </Button>
                  {!demoMode && (
                    <Button
                      type="button"
                      size="icon"
                      variant="ghost"
                      className="h-8 w-8 text-destructive hover:bg-destructive/10 hover:text-destructive"
                      disabled={workingTaskIds.includes(task.id)}
                      onClick={() => handleDelete(task)}
                      aria-label={`Delete ${task.title}`}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
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

type RequestMethod = "POST" | "PUT" | "DELETE";

type RequestOptions = {
  method: RequestMethod;
  body?: Record<string, unknown>;
};

type TaskResponse = {
  task: Task;
  message?: string;
};

type DeleteResponse = {
  id: number;
  message?: string;
};

type ValidationValue = string | string[];

class TaskRequestError extends Error {
  errors: Record<string, ValidationValue>;

  constructor(message: string, errors: Record<string, ValidationValue> = {}) {
    super(message);
    this.name = "TaskRequestError";
    this.errors = errors;
  }
}

async function taskRequest<T>(url: string, options: RequestOptions): Promise<T> {
  const response = await fetch(url, {
    method: options.method,
    credentials: "same-origin",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      "X-CSRF-TOKEN": getCsrfToken(),
      "X-Requested-With": "XMLHttpRequest",
    },
    body: options.body ? JSON.stringify(options.body) : undefined,
  });

  const payload = await parseJson(response);

  if (!response.ok) {
    throw new TaskRequestError(
      payload.message ?? "The task could not be updated. Please try again.",
      payload.errors ?? {},
    );
  }

  return payload as T;
}

function getCsrfToken() {
  return document
    .querySelector<HTMLMetaElement>('meta[name="csrf-token"]')
    ?.content ?? "";
}

async function parseJson(response: Response): Promise<Record<string, any>> {
  try {
    return await response.json();
  } catch {
    return {};
  }
}

function firstError(value: ValidationValue) {
  return Array.isArray(value) ? value[0] : value;
}

function getMessage(error: unknown) {
  if (error instanceof Error && error.message) return error.message;

  return "The task could not be updated. Please try again.";
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
