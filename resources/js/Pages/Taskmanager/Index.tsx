import { Head, Link, router } from "@inertiajs/react";
import { type DragEvent, type FormEvent, useEffect, useMemo, useState } from "react";
import { AlertTriangle, CalendarClock, Check, Circle, Clock, ListChecks, Plus, Trash2 } from "lucide-react";
import { SiteShell, PageHeader, EmptyState } from "@/components/site/SiteShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { StatusMessage } from "@/components/site/StatusMessage";
import { formatDeadlineDate, getDeadlineState, sortByDeadline } from "@/lib/taskDeadline";
import type { Task } from "@/types";

type Props = {
  tasks: Task[];
  demoMode?: boolean;
  doneCleanup?: DoneCleanupSettings;
};

type TaskStatus = "open" | "in_progress" | "done";

type DoneCleanupSettings = {
  enabled: boolean;
  available: boolean;
  doneTaskCount: number;
  hideAfterDays: number;
  removeAfterDays: number;
};

type DoneCleanupControl = {
  enabled: boolean;
  processing: boolean;
  hideAfterDays: number;
  removeAfterDays: number;
  onChange: (enabled: boolean) => void;
};

type StatusColumn = {
  status: TaskStatus;
  title: string;
  accent: string;
};

const STATUS_COLUMNS: StatusColumn[] = [
  {
    status: "open",
    title: "Open",
    accent: "text-warning",
  },
  {
    status: "in_progress",
    title: "In progress",
    accent: "text-primary",
  },
  {
    status: "done",
    title: "Done",
    accent: "text-success",
  },
];

export default function TasksIndex({ tasks, demoMode = false, doneCleanup }: Props) {
  const [savedTasks, setSavedTasks] = useState(tasks);
  const [demoTasks, setDemoTasks] = useState(tasks);
  const [quickTitle, setQuickTitle] = useState("");
  const [quickTitleError, setQuickTitleError] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const [quickAddProcessing, setQuickAddProcessing] = useState(false);
  const [cleanupEnabled, setCleanupEnabled] = useState(doneCleanup?.enabled ?? false);
  const [cleanupProcessing, setCleanupProcessing] = useState(false);
  const [workingTaskIds, setWorkingTaskIds] = useState<number[]>([]);
  const [workingSubtaskIds, setWorkingSubtaskIds] = useState<number[]>([]);
  const [draggingTaskId, setDraggingTaskId] = useState<number | null>(null);
  const [dragOverStatus, setDragOverStatus] = useState<TaskStatus | null>(null);
  const newTaskHref = demoMode ? "/login?redirect=/taskmanager/create" : "/taskmanager/create";

  useEffect(() => {
    setSavedTasks(tasks);
    setDemoTasks(tasks);
  }, [tasks]);

  useEffect(() => {
    setCleanupEnabled(doneCleanup?.enabled ?? false);
  }, [doneCleanup?.enabled]);

  const displayedTasks = demoMode ? demoTasks : savedTasks;
  const groupedTasks = useMemo(() => groupTasks(displayedTasks), [displayedTasks]);
  const done = groupedTasks.done.length;
  const active = groupedTasks.open.length + groupedTasks.in_progress.length;
  const doneCleanupControl = !demoMode && doneCleanup?.available
    ? {
        enabled: cleanupEnabled,
        processing: cleanupProcessing,
        hideAfterDays: doneCleanup.hideAfterDays,
        removeAfterDays: doneCleanup.removeAfterDays,
        onChange: handleDoneCleanupChange,
      }
    : undefined;

  const setTaskWorking = (taskId: number, working: boolean) => {
    setWorkingTaskIds((current) =>
      working
        ? Array.from(new Set([...current, taskId]))
        : current.filter((id) => id !== taskId),
    );
  };

  const setSubtaskWorking = (subtaskId: number, working: boolean) => {
    setWorkingSubtaskIds((current) =>
      working
        ? Array.from(new Set([...current, subtaskId]))
        : current.filter((id) => id !== subtaskId),
    );
  };

  const updateLocalTask = (taskId: number, update: (task: Task) => Task) => {
    if (demoMode) {
      setDemoTasks((current) => current.map((task) => (task.id === taskId ? update(task) : task)));

      return;
    }

    setSavedTasks((current) => current.map((task) => (task.id === taskId ? update(task) : task)));
  };

  const moveTaskToStatus = async (task: Task, status: TaskStatus) => {
    const currentStatus = getTaskStatus(task);

    if (currentStatus === status) return;

    if (demoMode) {
      updateLocalTask(task.id, (current) => withStatus(current, status));

      return;
    }

    setActionError(null);
    setTaskWorking(task.id, true);
    updateLocalTask(task.id, (current) => withStatus(current, status));

    try {
      const { task: updatedTask } = await taskRequest<TaskResponse>(
        `/taskmanager/${task.id}/status`,
        {
          method: "PATCH",
          body: { status },
        },
      );

      setSavedTasks((current) =>
        current.map((item) => (item.id === updatedTask.id ? updatedTask : item)),
      );
    } catch (error) {
      setSavedTasks((current) => current.map((item) => (item.id === task.id ? task : item)));
      setActionError(getMessage(error));
    } finally {
      setTaskWorking(task.id, false);
    }
  };

  const handleToggle = (task: Task) => {
    const targetStatus = getTaskStatus(task) === "done" ? "open" : "done";

    void moveTaskToStatus(task, targetStatus);
  };

  const handleToggleSubtask = async (task: Task, subtask: Task) => {
    const nextStatus = getTaskStatus(subtask) === "done" ? "open" : "done";

    if (demoMode) {
      updateLocalTask(task.id, (current) => withToggledSubtask(current, subtask.id, nextStatus));

      return;
    }

    setActionError(null);
    setSubtaskWorking(subtask.id, true);

    try {
      const { task: updatedTask } = await taskRequest<TaskResponse>(
        `/taskmanager/${task.id}/subtasks/${subtask.id}`,
        {
          method: "PATCH",
          body: { status: nextStatus },
        },
      );

      setSavedTasks((current) =>
        current.map((item) => (item.id === updatedTask.id ? updatedTask : item)),
      );
    } catch (error) {
      setActionError(getMessage(error));
    } finally {
      setSubtaskWorking(subtask.id, false);
    }
  };

  const handleDragStart = (event: DragEvent<HTMLDivElement>, task: Task) => {
    event.dataTransfer.effectAllowed = "move";
    event.dataTransfer.setData("text/plain", String(task.id));
    setDraggingTaskId(task.id);
  };

  const handleDragOver = (event: DragEvent, status: TaskStatus) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
    setDragOverStatus(status);
  };

  const handleDrop = (event: DragEvent, status: TaskStatus) => {
    event.preventDefault();
    const droppedTaskId = Number(event.dataTransfer.getData("text/plain") || draggingTaskId);
    const task = displayedTasks.find((item) => item.id === droppedTaskId);

    setDragOverStatus(null);
    setDraggingTaskId(null);

    if (!task) return;

    void moveTaskToStatus(task, status);
  };

  const handleDragEnd = () => {
    setDragOverStatus(null);
    setDraggingTaskId(null);
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
          status: "open",
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

  function handleDoneCleanupChange(enabled: boolean) {
    const previousValue = cleanupEnabled;

    setActionError(null);
    setCleanupEnabled(enabled);
    setCleanupProcessing(true);

    router.patch(
      "/taskmanager/done-cleanup",
      { enabled },
      {
        preserveScroll: true,
        onError: (errors) => {
          setCleanupEnabled(previousValue);
          setActionError(errors.done_cleanup ?? "The cleanup preference could not be updated. Please try again.");
        },
        onFinish: () => {
          setCleanupProcessing(false);
        },
      },
    );
  }

  return (
    <SiteShell>
      <Head title="taskmanager" />
      <PageHeader eyebrow="Project / TaskManager" title="Your tasks" description="A focused dashboard for what's on your plate.">
        <Button asChild><Link href={newTaskHref}><Plus className="mr-2 h-4 w-4" /> New task</Link></Button>
      </PageHeader>
      <section className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <StatusMessage />
        {actionError && (
          <div className="mt-4 rounded-lg border border-destructive/40 bg-destructive/10 px-4 py-3 text-sm text-destructive">
            {actionError}
          </div>
        )}
        {demoMode && (
          <div className="mt-6 rounded-xl border border-primary/30 bg-primary/10 px-4 py-3 text-sm text-primary">
            You are viewing a demo. You can move these sample tasks here, but changes are not saved. Log in or register to create and manage your own tasks.
          </div>
        )}

        <div className="mt-6 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="grid grid-cols-3 gap-3 sm:w-fit">
            <Stat label="Total" value={displayedTasks.length} />
            <Stat label="Active" value={active} accent="text-warning" />
            <Stat label="Completed" value={done} accent="text-success" />
          </div>

          <form className="w-full lg:max-w-xl" onSubmit={handleQuickAdd}>
            <div className="flex items-center gap-2">
              <Input
                aria-label="New task title"
                value={quickTitle}
                onChange={(event) => {
                  setQuickTitle(event.target.value);
                  setQuickTitleError(null);
                }}
                placeholder={demoMode ? "Log in to add your own task" : "Add an open task"}
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

        {displayedTasks.length === 0 ? (
          <div className="mt-8">
            <EmptyState
              icon={ListChecks}
              title="No tasks here"
              description="Create your first task to get started."
              action={<Button asChild><Link href={newTaskHref}><Plus className="mr-2 h-4 w-4" />Create task</Link></Button>}
            />
          </div>
        ) : (
          <TaskBoard
            demoMode={demoMode}
            dragOverStatus={dragOverStatus}
            groupedTasks={groupedTasks}
            doneCleanupControl={doneCleanupControl}
            workingSubtaskIds={workingSubtaskIds}
            workingTaskIds={workingTaskIds}
            onDelete={handleDelete}
            onDragEnd={handleDragEnd}
            onDragOver={handleDragOver}
            onDragStart={handleDragStart}
            onDrop={handleDrop}
            onToggle={handleToggle}
            onToggleSubtask={handleToggleSubtask}
          />
        )}
      </section>
    </SiteShell>
  );
}

function TaskBoard({
  demoMode,
  dragOverStatus,
  groupedTasks,
  doneCleanupControl,
  workingSubtaskIds,
  workingTaskIds,
  onDelete,
  onDragEnd,
  onDragOver,
  onDragStart,
  onDrop,
  onToggle,
  onToggleSubtask,
}: {
  demoMode: boolean;
  dragOverStatus: TaskStatus | null;
  groupedTasks: Record<TaskStatus, Task[]>;
  doneCleanupControl?: DoneCleanupControl;
  workingSubtaskIds: number[];
  workingTaskIds: number[];
  onDelete: (task: Task) => void;
  onDragEnd: () => void;
  onDragOver: (event: DragEvent, status: TaskStatus) => void;
  onDragStart: (event: DragEvent<HTMLDivElement>, task: Task) => void;
  onDrop: (event: DragEvent, status: TaskStatus) => void;
  onToggle: (task: Task) => void;
  onToggleSubtask: (task: Task, subtask: Task) => void;
}) {
  return (
    <>
      <div className="mt-6 overflow-hidden rounded-[1.4rem] border border-[#243551] bg-[#111a2f]/95 shadow-card md:hidden">
        {STATUS_COLUMNS.map((column) => (
          <MobileTaskLane
            key={column.status}
            column={column}
            doneCleanupControl={column.status === "done" ? doneCleanupControl : undefined}
            demoMode={demoMode}
            dragging={dragOverStatus === column.status}
            tasks={groupedTasks[column.status]}
            workingSubtaskIds={workingSubtaskIds}
            workingTaskIds={workingTaskIds}
            onDelete={onDelete}
            onDragEnd={onDragEnd}
            onDragOver={onDragOver}
            onDragStart={onDragStart}
            onDrop={onDrop}
            onToggle={onToggle}
            onToggleSubtask={onToggleSubtask}
          />
        ))}
      </div>

      <div className="mt-6 hidden w-full overflow-x-auto md:block">
        <table className="w-full min-w-[960px] table-fixed overflow-hidden rounded-[1.4rem] border border-[#243551] bg-[#111a2f]/95 shadow-card">
        <thead>
          <tr className="border-b border-[#243551]">
            {STATUS_COLUMNS.map((column, index) => (
              <th
                key={column.status}
                scope="col"
                className={`h-11 px-4 text-left align-middle ${
                  index < STATUS_COLUMNS.length - 1 ? "border-r border-[#243551]" : ""
                }`}
              >
                <div className="flex items-center justify-between gap-3">
                  <span className={`font-sans text-xs font-bold uppercase tracking-normal ${column.accent}`}>
                    {column.title}
                  </span>
                  <span className="grid h-6 min-w-6 place-items-center rounded-full bg-[#233250]/85 px-2 text-xs font-semibold text-[#9fb3d9]">
                    {groupedTasks[column.status].length}
                  </span>
                </div>
                {column.status === "done" && doneCleanupControl && (
                  <DoneCleanupCheckbox {...doneCleanupControl} className="mt-2" />
                )}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          <tr>
            {STATUS_COLUMNS.map((column, index) => (
              <TaskLaneCell
                key={column.status}
                column={column}
                demoMode={demoMode}
                dragging={dragOverStatus === column.status}
                hasDivider={index < STATUS_COLUMNS.length - 1}
                tasks={groupedTasks[column.status]}
                workingSubtaskIds={workingSubtaskIds}
                workingTaskIds={workingTaskIds}
                onDelete={onDelete}
                onDragEnd={onDragEnd}
                onDragOver={onDragOver}
                onDragStart={onDragStart}
                onDrop={onDrop}
                onToggle={onToggle}
                onToggleSubtask={onToggleSubtask}
              />
            ))}
          </tr>
        </tbody>
        </table>
      </div>
    </>
  );
}

function MobileTaskLane({
  column,
  doneCleanupControl,
  demoMode,
  dragging,
  tasks,
  workingSubtaskIds,
  workingTaskIds,
  onDelete,
  onDragEnd,
  onDragOver,
  onDragStart,
  onDrop,
  onToggle,
  onToggleSubtask,
}: {
  column: StatusColumn;
  doneCleanupControl?: DoneCleanupControl;
  demoMode: boolean;
  dragging: boolean;
  tasks: Task[];
  workingSubtaskIds: number[];
  workingTaskIds: number[];
  onDelete: (task: Task) => void;
  onDragEnd: () => void;
  onDragOver: (event: DragEvent, status: TaskStatus) => void;
  onDragStart: (event: DragEvent<HTMLDivElement>, task: Task) => void;
  onDrop: (event: DragEvent, status: TaskStatus) => void;
  onToggle: (task: Task) => void;
  onToggleSubtask: (task: Task, subtask: Task) => void;
}) {
  return (
    <section
      onDragOver={(event) => onDragOver(event, column.status)}
      onDrop={(event) => onDrop(event, column.status)}
      className={`border-b border-[#243551] p-3 transition-colors last:border-b-0 ${
        dragging ? "bg-primary/10" : ""
      }`}
    >
      <div className="mb-3 border-b border-[#243551] px-1 pb-3">
        <div className="flex items-center justify-between gap-3">
          <h2 className={`font-sans text-xs font-bold uppercase tracking-normal ${column.accent}`}>
            {column.title}
          </h2>
          <span className="grid h-6 min-w-6 place-items-center rounded-full bg-[#233250]/85 px-2 text-xs font-semibold text-[#9fb3d9]">
            {tasks.length}
          </span>
        </div>
        {doneCleanupControl && (
          <DoneCleanupCheckbox {...doneCleanupControl} className="mt-2" />
        )}
      </div>

      <div className="grid gap-2">
        {tasks.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-[#263855] px-4 py-8 text-center text-sm text-[#7f94bc]">
            Drop tasks here
          </div>
        ) : (
          tasks.map((task) => (
            <TaskCard
              key={task.id}
              demoMode={demoMode}
              task={task}
              workingSubtaskIds={workingSubtaskIds}
              working={workingTaskIds.includes(task.id)}
              onDelete={onDelete}
              onDragEnd={onDragEnd}
              onDragStart={onDragStart}
              onToggle={onToggle}
              onToggleSubtask={onToggleSubtask}
            />
          ))
        )}
      </div>
    </section>
  );
}

function TaskLaneCell({
  column,
  demoMode,
  dragging,
  hasDivider,
  tasks,
  workingSubtaskIds,
  workingTaskIds,
  onDelete,
  onDragEnd,
  onDragOver,
  onDragStart,
  onDrop,
  onToggle,
  onToggleSubtask,
}: {
  column: StatusColumn;
  demoMode: boolean;
  dragging: boolean;
  hasDivider: boolean;
  tasks: Task[];
  workingSubtaskIds: number[];
  workingTaskIds: number[];
  onDelete: (task: Task) => void;
  onDragEnd: () => void;
  onDragOver: (event: DragEvent, status: TaskStatus) => void;
  onDragStart: (event: DragEvent<HTMLDivElement>, task: Task) => void;
  onDrop: (event: DragEvent, status: TaskStatus) => void;
  onToggle: (task: Task) => void;
  onToggleSubtask: (task: Task, subtask: Task) => void;
}) {
  return (
    <td
      onDragOver={(event) => onDragOver(event, column.status)}
      onDrop={(event) => onDrop(event, column.status)}
      className={`h-52 px-3 pb-3 pt-3 align-top transition-colors ${
        hasDivider ? "border-r border-[#243551]" : ""
      } ${dragging ? "bg-primary/10" : ""}`}
    >
      <div className="grid gap-2">
        {tasks.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-[#263855] px-4 py-10 text-center text-sm text-[#7f94bc]">
            Drop tasks here
          </div>
        ) : (
          tasks.map((task) => (
            <TaskCard
              key={task.id}
              demoMode={demoMode}
              task={task}
              workingSubtaskIds={workingSubtaskIds}
              working={workingTaskIds.includes(task.id)}
              onDelete={onDelete}
              onDragEnd={onDragEnd}
              onDragStart={onDragStart}
              onToggle={onToggle}
              onToggleSubtask={onToggleSubtask}
            />
          ))
        )}
      </div>
    </td>
  );
}

function DoneCleanupCheckbox({
  enabled,
  processing,
  hideAfterDays,
  removeAfterDays,
  onChange,
  className = "",
}: DoneCleanupControl & { className?: string }) {
  return (
    <label
      className={`flex cursor-pointer items-start gap-2 rounded-xl border border-[#263855] bg-[#071224]/70 px-2.5 py-2 text-left transition-colors hover:border-primary/60 hover:bg-primary/5 ${
        processing ? "cursor-wait opacity-75" : ""
      } ${className}`}
    >
      <input
        type="checkbox"
        checked={enabled}
        disabled={processing}
        onChange={(event) => onChange(event.target.checked)}
        className="mt-0.5 h-3.5 w-3.5 shrink-0 cursor-pointer accent-primary disabled:cursor-wait"
        aria-label="Hide and remove old done tasks"
      />
      <span className="min-w-0 text-[11px] leading-4 text-[#9fb3d9]">
        <span className="block font-semibold text-[#d8e7ff]">
          Hide/remove old done tasks
        </span>
        <span>
          Hide after {hideAfterDays} days · remove after {removeAfterDays} days
        </span>
      </span>
    </label>
  );
}

function TaskCard({
  demoMode,
  task,
  workingSubtaskIds,
  working,
  onDelete,
  onDragEnd,
  onDragStart,
  onToggle,
  onToggleSubtask,
}: {
  demoMode: boolean;
  task: Task;
  workingSubtaskIds: number[];
  working: boolean;
  onDelete: (task: Task) => void;
  onDragEnd: () => void;
  onDragStart: (event: DragEvent<HTMLDivElement>, task: Task) => void;
  onToggle: (task: Task) => void;
  onToggleSubtask: (task: Task, subtask: Task) => void;
}) {
  const status = getTaskStatus(task);
  const focusing = status === "in_progress";
  const subtasks = useMemo(() => sortByDeadline(task.subtasks ?? []), [task.subtasks]);
  const deadlineState = getDeadlineState(task);

  const cardStateClass =
    deadlineState === "overdue"
      ? "border-destructive/70 bg-destructive/10 shadow-[0_0_0_1px_oklch(0.62_0.21_25_/_0.2),0_16px_38px_-24px_oklch(0.62_0.21_25_/_0.85)] animate-pulse-glow-danger"
      : deadlineState === "due-soon"
        ? "border-warning/70 bg-warning/10 shadow-[0_0_0_1px_oklch(0.82_0.14_85_/_0.2),0_16px_38px_-24px_oklch(0.82_0.14_85_/_0.85)] animate-pulse-glow-warning"
        : focusing
          ? "border-primary/70 bg-primary/10 shadow-[0_0_0_1px_oklch(0.72_0.16_158_/_0.18),0_16px_38px_-24px_oklch(0.72_0.16_158_/_0.85)]"
          : "border-[#1e2b45] bg-[#071224]";

  return (
    <div
      draggable={!working}
      onDragStart={(event) => onDragStart(event, task)}
      onDragEnd={onDragEnd}
      className={`group relative grid grid-cols-[1rem_1.5rem_minmax(0,1fr)_3.5rem] items-center gap-2 overflow-hidden rounded-2xl border px-3 py-3 transition-[border-color,background-color,box-shadow] duration-300 ${cardStateClass}`}
    >
      <div className={`grid h-7 w-3 cursor-grab grid-cols-2 place-content-center gap-x-0.5 gap-y-0.5 self-center opacity-65 transition-opacity group-hover:opacity-100 ${focusing ? "text-primary" : "text-[#7c8eaa]"}`}>
        {Array.from({ length: 8 }).map((_, index) => (
          <span key={index} className="h-0.5 w-0.5 rounded-full bg-current" />
        ))}
      </div>
      <button
        type="button"
        disabled={working}
        onClick={() => onToggle(task)}
        className={`grid h-6 w-6 place-items-center self-start rounded-full border transition-colors ${
          status === "done"
            ? "border-success bg-success text-success-foreground"
            : focusing
              ? "border-primary/70 bg-primary/10 hover:border-primary"
              : "border-[#21304a] bg-[#071224] hover:border-primary"
        }`}
        aria-label={status === "done" ? "Move task to open" : "Move task to done"}
      >
        {status === "done" ? <Check className="h-3.5 w-3.5" /> : <Circle className="h-3.5 w-3.5 opacity-0" />}
      </button>
      <div className="min-w-0">
        {demoMode ? (
          <p className={`truncate text-sm font-semibold leading-5 ${status === "done" ? "text-[#8090ad] line-through" : focusing ? "text-primary" : "text-white"}`}>{task.title}</p>
        ) : (
          <Link href={`/taskmanager/${task.id}`} className="block">
            <p className={`truncate text-sm font-semibold leading-5 ${status === "done" ? "text-[#8090ad] line-through" : focusing ? "text-primary" : "text-white"}`}>{task.title}</p>
          </Link>
        )}
        {getTaskSummary(task) && (
          <p className={`line-clamp-2 text-[13px] leading-5 ${focusing ? "text-[#b8f3dc]" : "text-[#9bc4dc]"}`}>
            {getTaskSummary(task)}
          </p>
        )}
        {subtasks.length > 0 && (
          <div className="mt-2">
            <p className="text-xs font-semibold leading-none text-[#9bb1ce]">Sub tasks</p>
            <div className="mt-1.5 grid gap-1">
              {subtasks.map((subtask) => {
                const subtaskStatus = getTaskStatus(subtask);
                const subtaskWorking = workingSubtaskIds.includes(subtask.id);
                const subtaskDeadlineState = getDeadlineState(subtask);

                return (
                  <button
                    key={subtask.id}
                    type="button"
                    disabled={working || subtaskWorking}
                    onPointerDown={(event) => event.stopPropagation()}
                    onClick={(event) => {
                      event.stopPropagation();
                      onToggleSubtask(task, subtask);
                    }}
                    title={subtask.deadline ? `Due ${formatDeadlineDate(subtask.deadline)}` : undefined}
                    className={`group -mx-1 grid grid-cols-[0.875rem_minmax(0,1fr)] items-center gap-2 rounded-md border-l-2 px-1 py-0.5 text-left transition-colors hover:bg-white/5 disabled:cursor-not-allowed disabled:opacity-70 ${
                      subtaskDeadlineState === "overdue"
                        ? "border-l-destructive/70 bg-destructive/5"
                        : subtaskDeadlineState === "due-soon"
                          ? "border-l-warning/70 bg-warning/5"
                          : "border-l-transparent"
                    }`}
                    aria-label={subtaskStatus === "done" ? `Mark ${subtask.title} open` : `Mark ${subtask.title} done`}
                  >
                    <span
                      className={`grid h-3.5 w-3.5 place-items-center rounded-full border transition-colors ${
                        subtaskStatus === "done"
                          ? "border-success bg-success text-success-foreground"
                          : "border-[#2a3b5a] bg-[#071224] group-hover:border-primary"
                      }`}
                    >
                      {subtaskStatus === "done" ? <Check className="h-2.5 w-2.5" /> : null}
                    </span>
                    <span className="flex min-w-0 items-center gap-1.5">
                      <span
                        className={`truncate text-xs leading-4 transition-colors ${
                          subtaskStatus === "done" ? "text-[#8090ad] line-through" : "text-[#d8e7ff] group-hover:text-primary"
                        }`}
                      >
                        {subtask.title}
                      </span>
                      {subtaskDeadlineState === "overdue" && <AlertTriangle className="h-2.5 w-2.5 shrink-0 text-destructive" />}
                      {subtaskDeadlineState === "due-soon" && <CalendarClock className="h-2.5 w-2.5 shrink-0 text-warning" />}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        )}
        <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs leading-none text-[#9bb1ce]">
          <span className="flex items-center gap-1.5">
            <Clock className="h-3 w-3" /> {formatTaskDate(task.created_at)}
          </span>
          {task.deadline && (
            <span
              className={`flex items-center gap-1.5 font-medium ${
                deadlineState === "overdue"
                  ? "text-destructive"
                  : deadlineState === "due-soon"
                    ? "text-warning"
                    : "text-[#9bb1ce]"
              }`}
            >
              {deadlineState === "overdue" ? (
                <AlertTriangle className="h-3 w-3" />
              ) : (
                <CalendarClock className="h-3 w-3" />
              )}
              {formatDeadlineDate(task.deadline)}
            </span>
          )}
        </div>
      </div>
      {!demoMode && (
        <div className="flex items-center justify-end gap-1">
          <Link
            href={`/taskmanager/${task.id}/edit`}
            className="text-xs font-medium text-foreground transition-colors hover:text-primary"
          >
            Edit
          </Link>
          <Button
            type="button"
            size="icon"
            variant="ghost"
            className="h-8 w-8 cursor-pointer text-destructive transition-colors hover:bg-destructive/10 hover:text-destructive"
            disabled={working}
            onClick={() => onDelete(task)}
            aria-label={`Delete ${task.title}`}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
}

function Stat({ label, value, accent }: { label: string; value: number; accent?: string }) {
  return (
    <div className="min-w-28 rounded-xl border border-border bg-card px-4 py-3 sm:min-w-36">
      <p className="text-xs uppercase tracking-wider text-muted-foreground">{label}</p>
      <p className={`mt-1 text-center font-display text-xl ${accent ?? ""}`}>{value}</p>
    </div>
  );
}

function groupTasks(tasks: Task[]): Record<TaskStatus, Task[]> {
  const groups = tasks.reduce<Record<TaskStatus, Task[]>>(
    (groups, task) => {
      groups[getTaskStatus(task)].push(task);

      return groups;
    },
    {
      open: [],
      in_progress: [],
      done: [],
    },
  );

  return {
    open: sortByDeadline(groups.open),
    in_progress: sortByDeadline(groups.in_progress),
    done: sortByDeadline(groups.done),
  };
}

function getTaskStatus(task: Task): TaskStatus {
  if (task.complete) return "done";
  if (task.status === "in_progress") return "in_progress";

  return "open";
}

function withStatus(task: Task, status: TaskStatus): Task {
  return {
    ...task,
    subtasks: status === "done" || status === "open"
      ? task.subtasks?.map((subtask) => withStatus(subtask, status))
      : task.subtasks,
    status,
    complete: status === "done",
  };
}

function withToggledSubtask(task: Task, subtaskId: number, status: TaskStatus): Task {
  const subtasks = (task.subtasks ?? []).map((subtask) =>
    subtask.id === subtaskId ? withStatus(subtask, status) : subtask,
  );

  return withStatus(
    {
      ...task,
      subtasks,
    },
    getParentStatusFromSubtasks(subtasks),
  );
}

function getParentStatusFromSubtasks(subtasks: Task[]): TaskStatus {
  const completed = subtasks.filter((subtask) => getTaskStatus(subtask) === "done").length;

  if (completed === 0) return "open";
  if (completed === subtasks.length) return "done";

  return "in_progress";
}

function getTaskSummary(task: Task) {
  return task.description || task.long_description || "";
}

type RequestMethod = "POST" | "PUT" | "PATCH" | "DELETE";

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
