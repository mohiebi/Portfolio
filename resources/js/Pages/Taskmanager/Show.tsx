import { Head, Link, useForm } from "@inertiajs/react";
import { type FormEvent, useState } from "react";
import { AlertTriangle, ArrowLeft, CalendarClock, Check, Circle, Pencil, Plus, Save, Trash2, X } from "lucide-react";
import { SiteShell } from "@/components/site/SiteShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { StatusMessage } from "@/components/site/StatusMessage";
import { type DeadlineState, formatDeadlineDate, getDeadlineState, sortByDeadline, toDateInputValue } from "@/lib/taskDeadline";
import type { Task } from "@/types";

type Props = {
  task: Task;
};

type TaskStatus = "open" | "in_progress" | "done";

type SubtaskResponse = {
  task: Task;
  subtask?: Task;
  id?: number;
  message?: string;
};

type ValidationValue = string | string[];

export default function TaskShow({ task }: Props) {
  const form = useForm({});
  const [currentTask, setCurrentTask] = useState(task);
  const [newTitle, setNewTitle] = useState("");
  const [newDetails, setNewDetails] = useState("");
  const [newDeadline, setNewDeadline] = useState("");
  const [editingSubtaskId, setEditingSubtaskId] = useState<number | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editDetails, setEditDetails] = useState("");
  const [editDeadline, setEditDeadline] = useState("");
  const [workingSubtaskIds, setWorkingSubtaskIds] = useState<number[]>([]);
  const [creating, setCreating] = useState(false);
  const [subtaskError, setSubtaskError] = useState<string | null>(null);
  const subtasks = sortByDeadline(currentTask.subtasks ?? []);
  const completedSubtasks = subtasks.filter((subtask) => getTaskStatus(subtask) === "done").length;
  const status = getTaskStatus(currentTask);
  const deadlineState = getDeadlineState(currentTask);

  const setSubtaskWorking = (subtaskId: number, working: boolean) => {
    setWorkingSubtaskIds((current) =>
      working
        ? Array.from(new Set([...current, subtaskId]))
        : current.filter((id) => id !== subtaskId),
    );
  };

  const handleCreateSubtask = async (event: FormEvent) => {
    event.preventDefault();
    const title = newTitle.trim();

    if (!title) return;

    setCreating(true);
    setSubtaskError(null);

    try {
      const { task: updatedTask } = await subtaskRequest<SubtaskResponse>(
        `/taskmanager/${currentTask.id}/subtasks`,
        {
          method: "POST",
          body: {
            title,
            long_description: newDetails.trim(),
            deadline: newDeadline || null,
          },
        },
      );

      setCurrentTask(updatedTask);
      setNewTitle("");
      setNewDetails("");
      setNewDeadline("");
    } catch (error) {
      setSubtaskError(getMessage(error));
    } finally {
      setCreating(false);
    }
  };

  const startEditing = (subtask: Task) => {
    setEditingSubtaskId(subtask.id);
    setEditTitle(subtask.title);
    setEditDetails(subtask.long_description ?? "");
    setEditDeadline(toDateInputValue(subtask.deadline));
    setSubtaskError(null);
  };

  const cancelEditing = () => {
    setEditingSubtaskId(null);
    setEditTitle("");
    setEditDetails("");
    setEditDeadline("");
  };

  const handleSaveSubtask = async (subtask: Task) => {
    const title = editTitle.trim();

    if (!title) return;

    setSubtaskWorking(subtask.id, true);
    setSubtaskError(null);

    try {
      const { task: updatedTask } = await subtaskRequest<SubtaskResponse>(
        `/taskmanager/${currentTask.id}/subtasks/${subtask.id}`,
        {
          method: "PATCH",
          body: {
            title,
            long_description: editDetails.trim(),
            deadline: editDeadline || null,
          },
        },
      );

      setCurrentTask(updatedTask);
      cancelEditing();
    } catch (error) {
      setSubtaskError(getMessage(error));
    } finally {
      setSubtaskWorking(subtask.id, false);
    }
  };

  const handleToggleSubtask = async (subtask: Task) => {
    setSubtaskWorking(subtask.id, true);
    setSubtaskError(null);

    try {
      const { task: updatedTask } = await subtaskRequest<SubtaskResponse>(
        `/taskmanager/${currentTask.id}/subtasks/${subtask.id}`,
        {
          method: "PATCH",
          body: {
            status: getTaskStatus(subtask) === "done" ? "open" : "done",
          },
        },
      );

      setCurrentTask(updatedTask);
    } catch (error) {
      setSubtaskError(getMessage(error));
    } finally {
      setSubtaskWorking(subtask.id, false);
    }
  };

  const handleDeleteSubtask = async (subtask: Task) => {
    setSubtaskWorking(subtask.id, true);
    setSubtaskError(null);

    try {
      const { task: updatedTask } = await subtaskRequest<SubtaskResponse>(
        `/taskmanager/${currentTask.id}/subtasks/${subtask.id}`,
        {
          method: "DELETE",
        },
      );

      setCurrentTask(updatedTask);
    } catch (error) {
      setSubtaskError(getMessage(error));
    } finally {
      setSubtaskWorking(subtask.id, false);
    }
  };

  return (
    <SiteShell>
      <Head title={currentTask.title} />
      <section className="mx-auto w-full max-w-3xl px-3 py-6 sm:px-6 sm:py-10 lg:px-8">
        <Link href="/taskmanager" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-4 w-4" /> Back to tasks
        </Link>
        <div className="mt-6">
          <StatusMessage />
        </div>
        <article className="mt-5 rounded-2xl border border-border bg-card p-4 sm:mt-6 sm:p-8">
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <StatusBadge status={status} />
                <DeadlineBadge deadline={currentTask.deadline} state={deadlineState} />
              </div>
              <h1 className="mt-3 break-words font-display text-2xl font-semibold sm:text-3xl">{currentTask.title}</h1>
            </div>
          </div>

          {currentTask.long_description && (
            <div className="mt-5 whitespace-pre-line break-words rounded-xl border border-border bg-background/40 p-4 text-sm leading-relaxed text-foreground/90 sm:mt-6 sm:p-5">
              {currentTask.long_description}
            </div>
          )}

          <div className="mt-6 grid grid-cols-2 gap-2 sm:mt-8 sm:flex sm:flex-wrap">
            <Button asChild variant="outline" className="w-full sm:w-auto">
              <Link href={`/taskmanager/${currentTask.id}/edit`}><Pencil className="h-4 w-4" /> Edit</Link>
            </Button>
            <Button variant="ghost" className="w-full text-destructive hover:bg-destructive/10 hover:text-destructive sm:w-auto" onClick={() => form.delete(`/taskmanager/${currentTask.id}`)}>
              <Trash2 className="h-4 w-4" /> Delete
            </Button>
          </div>
        </article>

        <section className="mt-5 rounded-2xl border border-border bg-card p-4 sm:mt-6 sm:p-8">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="font-display text-xl font-semibold">Subtasks</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                {subtasks.length > 0 ? `${completedSubtasks} of ${subtasks.length} completed` : "Break this task into smaller pieces."}
              </p>
            </div>
            {subtasks.length > 0 && (
              <div className="h-2 w-full overflow-hidden rounded-full bg-background sm:w-40">
                <div
                  className="h-full rounded-full bg-primary transition-all"
                  style={{ width: `${Math.round((completedSubtasks / subtasks.length) * 100)}%` }}
                />
              </div>
            )}
          </div>

          {subtaskError && (
            <div className="mt-4 rounded-lg border border-destructive/40 bg-destructive/10 px-4 py-3 text-sm text-destructive">
              {subtaskError}
            </div>
          )}

          <form className="mt-5 grid gap-3" onSubmit={handleCreateSubtask}>
            <div className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_auto]">
              <Input
                aria-label="New subtask title"
                value={newTitle}
                onChange={(event) => setNewTitle(event.target.value)}
                placeholder="Add a subtask"
                disabled={creating}
              />
              <Button type="submit" className="w-full sm:w-auto" disabled={!newTitle.trim() || creating}>
                <Plus className="h-4 w-4" /> Add
              </Button>
            </div>
            <Textarea
              aria-label="New subtask details"
              rows={3}
              value={newDetails}
              onChange={(event) => setNewDetails(event.target.value)}
              placeholder="Details, context, or notes..."
              disabled={creating}
            />
            <div className="grid gap-1.5 sm:w-52">
              <Label htmlFor="new-subtask-deadline" className="text-xs text-muted-foreground">Deadline (optional)</Label>
              <Input
                id="new-subtask-deadline"
                type="date"
                aria-label="New subtask deadline"
                value={newDeadline}
                onChange={(event) => setNewDeadline(event.target.value)}
                disabled={creating}
                className="[&::-webkit-calendar-picker-indicator]:invert [&::-webkit-calendar-picker-indicator]:brightness-0 [&::-webkit-calendar-picker-indicator]:opacity-100 [&::-webkit-calendar-picker-indicator]:filter"
              />
            </div>
          </form>

          <div className="mt-6 grid gap-3">
            {subtasks.length === 0 ? (
              <div className="rounded-xl border border-dashed border-border px-4 py-8 text-center text-sm text-muted-foreground">
                No subtasks yet.
              </div>
            ) : (
              subtasks.map((subtask) => {
                const subtaskStatus = getTaskStatus(subtask);
                const editing = editingSubtaskId === subtask.id;
                const working = workingSubtaskIds.includes(subtask.id);
                const subtaskDeadlineState = getDeadlineState(subtask);

                const cardStateClass =
                  subtaskDeadlineState === "overdue"
                    ? "border-destructive/60 bg-destructive/5"
                    : subtaskDeadlineState === "due-soon"
                      ? "border-warning/60 bg-warning/5"
                      : "border-border bg-background/35";

                return (
                  <div key={subtask.id} className={`rounded-xl border p-3 transition-colors duration-300 sm:p-4 ${cardStateClass}`}>
                    {editing ? (
                      <div className="grid gap-3">
                        <Input
                          aria-label="Subtask title"
                          value={editTitle}
                          onChange={(event) => setEditTitle(event.target.value)}
                          disabled={working}
                        />
                        <Textarea
                          aria-label="Subtask details"
                          rows={3}
                          value={editDetails}
                          onChange={(event) => setEditDetails(event.target.value)}
                          disabled={working}
                        />
                        <div className="grid gap-1.5 sm:w-52">
                          <Label htmlFor={`edit-subtask-deadline-${subtask.id}`} className="text-xs text-muted-foreground">Deadline (optional)</Label>
                          <Input
                            id={`edit-subtask-deadline-${subtask.id}`}
                            type="date"
                            aria-label="Subtask deadline"
                            value={editDeadline}
                            onChange={(event) => setEditDeadline(event.target.value)}
                            disabled={working}
                            className="[&::-webkit-calendar-picker-indicator]:invert [&::-webkit-calendar-picker-indicator]:brightness-0 [&::-webkit-calendar-picker-indicator]:opacity-100 [&::-webkit-calendar-picker-indicator]:filter"
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-2 sm:flex sm:justify-end">
                          <Button type="button" variant="ghost" className="w-full sm:w-auto" onClick={cancelEditing} disabled={working}>
                            <X className="h-4 w-4" /> Cancel
                          </Button>
                          <Button type="button" className="w-full sm:w-auto" onClick={() => void handleSaveSubtask(subtask)} disabled={!editTitle.trim() || working}>
                            <Save className="h-4 w-4" /> Save
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center justify-between gap-3">
                        <div className="flex min-w-0 flex-1 items-center gap-3">
                          <button
                            type="button"
                            disabled={working}
                            onClick={() => void handleToggleSubtask(subtask)}
                            className={`grid h-7 w-7 shrink-0 place-items-center rounded-full border transition-colors ${
                              subtaskStatus === "done"
                                ? "border-success bg-success text-success-foreground"
                                : "border-border bg-background hover:border-primary hover:bg-primary/10"
                            }`}
                            aria-label={subtaskStatus === "done" ? "Mark subtask open" : "Mark subtask done"}
                          >
                            {subtaskStatus === "done" ? <Check className="h-4 w-4" /> : <Circle className="h-4 w-4 opacity-0" />}
                          </button>
                          <div className="min-w-0 flex-1">
                            <p className={`break-words font-semibold leading-5 ${subtaskStatus === "done" ? "text-muted-foreground line-through" : "text-foreground"}`}>
                              {subtask.title}
                            </p>
                            {subtask.long_description && (
                              <p className="mt-1 whitespace-pre-line break-words text-sm leading-6 text-muted-foreground">
                                {subtask.long_description}
                              </p>
                            )}
                            {subtask.deadline && (
                              <p
                                className={`mt-2 flex min-w-0 items-center gap-1.5 text-xs font-medium ${
                                  subtaskDeadlineState === "overdue"
                                    ? "text-destructive"
                                    : subtaskDeadlineState === "due-soon"
                                      ? "text-warning"
                                      : "text-muted-foreground"
                                }`}
                              >
                                {subtaskDeadlineState === "overdue" ? (
                                  <AlertTriangle className="h-3 w-3 shrink-0" />
                                ) : (
                                  <CalendarClock className="h-3 w-3 shrink-0" />
                                )}
                                <span className="truncate">{formatDeadlineDate(subtask.deadline)}</span>
                              </p>
                            )}
                          </div>
                        </div>
                        <div className="flex shrink-0 items-center justify-end gap-1">
                          <Button type="button" variant="ghost" size="sm" onClick={() => startEditing(subtask)} disabled={working}>
                            <Pencil className="h-4 w-4" /> Edit
                          </Button>
                          <Button
                            type="button"
                            size="icon"
                            variant="ghost"
                            className="h-8 w-8 text-destructive hover:bg-destructive/10 hover:text-destructive"
                            onClick={() => void handleDeleteSubtask(subtask)}
                            disabled={working}
                            aria-label={`Delete ${subtask.title}`}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </section>
      </section>
    </SiteShell>
  );
}

function StatusBadge({ status }: { status: TaskStatus }) {
  const label = status === "done" ? "Completed" : status === "in_progress" ? "In progress" : "Open";
  const className = status === "done"
    ? "bg-success/15 text-success"
    : status === "in_progress"
      ? "bg-primary/15 text-primary"
      : "bg-warning/15 text-warning";

  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs ${className}`}>
      {status === "done" ? <Check className="h-3 w-3" /> : null}
      {label}
    </span>
  );
}

function DeadlineBadge({ deadline, state }: { deadline?: string | null; state: DeadlineState }) {
  if (!deadline) return null;

  const className = state === "overdue"
    ? "bg-destructive/15 text-destructive animate-pulse-glow-danger"
    : state === "due-soon"
      ? "bg-warning/15 text-warning animate-pulse-glow-warning"
      : "bg-muted text-muted-foreground";

  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${className}`}>
      {state === "overdue" ? <AlertTriangle className="h-3 w-3" /> : <CalendarClock className="h-3 w-3" />}
      {state === "overdue" ? "Overdue " : "Due "}
      {formatDeadlineDate(deadline)}
    </span>
  );
}

function getTaskStatus(task: Task): TaskStatus {
  if (task.complete) return "done";
  if (task.status === "in_progress") return "in_progress";

  return "open";
}

type RequestMethod = "POST" | "PATCH" | "DELETE";

type RequestOptions = {
  method: RequestMethod;
  body?: Record<string, unknown>;
};

class TaskRequestError extends Error {
  errors: Record<string, ValidationValue>;

  constructor(message: string, errors: Record<string, ValidationValue> = {}) {
    super(message);
    this.name = "TaskRequestError";
    this.errors = errors;
  }
}

async function subtaskRequest<T>(url: string, options: RequestOptions): Promise<T> {
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
      payload.message ?? "The subtask could not be updated. Please try again.",
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

function getMessage(error: unknown) {
  if (error instanceof TaskRequestError && error.errors.title) {
    return firstError(error.errors.title);
  }

  if (error instanceof Error && error.message) return error.message;

  return "The subtask could not be updated. Please try again.";
}

function firstError(value: ValidationValue) {
  return Array.isArray(value) ? value[0] : value;
}
