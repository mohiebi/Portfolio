<?php

namespace App\Services;

use App\Models\Task;
use App\Models\User;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Support\Arr;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;

/**
 * Task operations used by the MCP server. The status and subtask roll-up rules
 * mirror the task board (TaskmanagerController) and the Telegram bot.
 */
class TaskManagerService
{
    public const STATUSES = [
        Task::STATUS_OPEN,
        Task::STATUS_IN_PROGRESS,
        Task::STATUS_DONE,
    ];

    public const DEFAULT_LIST_LIMIT = 50;

    public const MAX_LIST_LIMIT = 100;

    /**
     * Find any task (top-level or subtask) that belongs to the user.
     */
    public function find(User $user, int $taskId): ?Task
    {
        return $user->tasks()
            ->with('subtasks')
            ->whereKey($taskId)
            ->first();
    }

    public function findTopLevel(User $user, int $taskId): ?Task
    {
        return $user->tasks()
            ->topLevel()
            ->whereKey($taskId)
            ->first();
    }

    /**
     * List the user's top-level tasks, each with its subtasks.
     *
     * Without a status filter only unfinished tasks are returned.
     *
     * @return array{tasks: Collection<int, Task>, total: int}
     */
    public function list(
        User $user,
        ?string $status = null,
        ?string $search = null,
        bool $overdueOnly = false,
        ?string $dueOnOrBefore = null,
        int $limit = self::DEFAULT_LIST_LIMIT,
    ): array {
        $query = $user->tasks()->topLevel();

        if ($status === Task::STATUS_DONE && ! $overdueOnly) {
            $query->done();
        } elseif ($status !== null && $status !== Task::STATUS_DONE) {
            $query->where('status', $status)->where('complete', false);
        } else {
            $query->where('status', '!=', Task::STATUS_DONE)->where('complete', false);
        }

        if ($overdueOnly) {
            $query->whereNotNull('deadline')
                ->whereDate('deadline', '<', $user->taskReminderDate()->format('Y-m-d'));
        }

        if ($dueOnOrBefore !== null) {
            $query->whereNotNull('deadline')
                ->whereDate('deadline', '<=', $dueOnOrBefore);
        }

        if ($search !== null && $search !== '') {
            $term = '%'.$search.'%';

            $query->where(function ($query) use ($term): void {
                $query->where('title', 'like', $term)
                    ->orWhere('description', 'like', $term)
                    ->orWhere('long_description', 'like', $term)
                    ->orWhereHas('subtasks', fn ($subtasks) => $subtasks->where('title', 'like', $term));
            });
        }

        $total = (clone $query)->count();

        $tasks = $query
            ->with('subtasks')
            ->orderByRaw('deadline is null')
            ->orderBy('deadline')
            ->orderByDesc('id')
            ->limit(min(max($limit, 1), self::MAX_LIST_LIMIT))
            ->get();

        return ['tasks' => $tasks, 'total' => $total];
    }

    /**
     * Create a task, or a subtask when a parent is given.
     *
     * @param  array{title: string, description?: ?string, long_description?: ?string, deadline?: ?string, status?: ?string}  $data
     */
    public function create(User $user, array $data, ?Task $parent = null): Task
    {
        $status = $data['status'] ?? Task::STATUS_OPEN;

        $attributes = [
            'title' => $data['title'],
            'description' => $data['description'] ?? '',
            'long_description' => $data['long_description'] ?? null,
            'deadline' => $this->parseDeadline($data['deadline'] ?? null),
            'status' => $status,
            'complete' => $status === Task::STATUS_DONE,
        ];

        return DB::transaction(function () use ($user, $attributes, $parent): Task {
            if ($parent === null) {
                return $user->tasks()->create($attributes);
            }

            $subtask = $parent->subtasks()->create([...$attributes, 'user_id' => $user->id]);
            $parent->syncStatusFromSubtasks();

            return $subtask;
        });
    }

    /**
     * Update the given fields. A deadline of null clears it.
     *
     * @param  array{title?: string, description?: ?string, long_description?: ?string, deadline?: ?string, status?: string}  $changes
     */
    public function update(User $user, Task $task, array $changes): Task
    {
        DB::transaction(function () use ($task, $changes): void {
            $attributes = Arr::only($changes, ['title', 'description', 'long_description']);

            if (array_key_exists('description', $attributes) && $attributes['description'] === null) {
                $attributes['description'] = '';
            }

            if (array_key_exists('deadline', $changes)) {
                $attributes['deadline'] = $this->parseDeadline($changes['deadline']);
            }

            if ($attributes !== []) {
                $task->fill($attributes)->save();
            }

            $status = $changes['status'] ?? null;

            if ($status !== null && $status !== $task->status) {
                $task->moveToStatus($status);

                if ($task->parent_id) {
                    $task->parent()->first()?->syncStatusFromSubtasks();
                }
            }
        });

        return $this->find($user, $task->id) ?? $task;
    }

    public function delete(Task $task): void
    {
        DB::transaction(function () use ($task): void {
            $parentId = $task->parent_id;

            $task->delete();

            if ($parentId) {
                Task::query()->find($parentId)?->syncStatusFromSubtasks();
            }
        });
    }

    /**
     * @return array<string, mixed>
     */
    public function present(Task $task, User $user): array
    {
        $deadline = $task->deadline?->format('Y-m-d');
        $isDone = $task->complete || $task->status === Task::STATUS_DONE;

        $data = [
            'id' => $task->id,
            'title' => $task->title,
            'description' => $task->description,
            'long_description' => $task->long_description,
            'status' => $task->status,
            'complete' => (bool) $task->complete,
            'deadline' => $deadline,
            'overdue' => $deadline !== null
                && ! $isDone
                && $deadline < $user->taskReminderDate()->format('Y-m-d'),
            'parent_id' => $task->parent_id,
            'created_at' => $task->created_at?->toIso8601String(),
            'updated_at' => $task->updated_at?->toIso8601String(),
            'done_at' => $task->done_at?->toIso8601String(),
        ];

        if ($task->parent_id === null && $task->relationLoaded('subtasks')) {
            $data['subtasks'] = $task->subtasks
                ->map(fn (Task $subtask): array => $this->present($subtask, $user))
                ->values()
                ->all();
        }

        return $data;
    }

    /**
     * Present a task together with a compact view of its parent, whose status
     * can change when a subtask is created, updated or removed.
     *
     * @return array{task: array<string, mixed>, parent: array<string, mixed>|null}
     */
    public function presentWithParent(Task $task, User $user): array
    {
        $parent = $task->parent_id
            ? Task::query()->find($task->parent_id, ['id', 'title', 'status', 'complete'])
            : null;

        return [
            'task' => $this->present($task, $user),
            'parent' => $parent?->only(['id', 'title', 'status', 'complete']),
        ];
    }

    private function parseDeadline(?string $value): ?Carbon
    {
        if ($value === null || $value === '') {
            return null;
        }

        return Carbon::createFromFormat('!Y-m-d', $value);
    }
}
