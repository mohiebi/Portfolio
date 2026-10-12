<?php

namespace App\Mcp\Tools;

use App\Services\TaskManagerService;
use Illuminate\Contracts\JsonSchema\JsonSchema;
use Illuminate\Validation\Rule;
use Laravel\Mcp\Request;
use Laravel\Mcp\Response;
use Laravel\Mcp\ResponseFactory;
use Laravel\Mcp\Server\Attributes\Description;
use Laravel\Mcp\Server\Attributes\Name;
use Laravel\Mcp\Server\Attributes\Title;
use Laravel\Mcp\Server\Tool;
use Laravel\Mcp\Server\Tools\Annotations\IsReadOnly;

#[Name('list_tasks')]
#[Title('List tasks')]
#[Description('List the user\'s tasks with their subtasks, soonest deadline first. By default only unfinished tasks (open and in_progress) are returned; pass status "done" to see finished ones. The response includes today\'s date so relative dates like "tomorrow" can be resolved.')]
#[IsReadOnly]
class ListTasksTool extends Tool
{
    public function __construct(private readonly TaskManagerService $tasks)
    {
    }

    public function handle(Request $request): Response|ResponseFactory
    {
        $user = $request->user();

        if (! $user) {
            return Response::error('Authentication is required.');
        }

        $validated = $request->validate([
            'status' => ['nullable', Rule::in(TaskManagerService::STATUSES)],
            'search' => ['nullable', 'string', 'max:255'],
            'overdue_only' => ['nullable', 'boolean'],
            'due_on_or_before' => ['nullable', 'date_format:Y-m-d'],
            'limit' => ['nullable', 'integer', 'min:1', 'max:'.TaskManagerService::MAX_LIST_LIMIT],
        ], [
            'status.in' => 'status must be one of: '.implode(', ', TaskManagerService::STATUSES).'.',
            'due_on_or_before.date_format' => 'due_on_or_before must be a date formatted as YYYY-MM-DD, for example 2026-12-31.',
        ]);

        $result = $this->tasks->list(
            $user,
            status: $validated['status'] ?? null,
            search: $validated['search'] ?? null,
            overdueOnly: (bool) ($validated['overdue_only'] ?? false),
            dueOnOrBefore: $validated['due_on_or_before'] ?? null,
            limit: (int) ($validated['limit'] ?? TaskManagerService::DEFAULT_LIST_LIMIT),
        );

        return Response::structured([
            'today' => $user->taskReminderDate()->format('Y-m-d'),
            'total' => $result['total'],
            'returned' => $result['tasks']->count(),
            'tasks' => $result['tasks']
                ->map(fn ($task): array => $this->tasks->present($task, $user))
                ->values()
                ->all(),
        ]);
    }

    /**
     * @return array<string, \Illuminate\JsonSchema\Types\Type>
     */
    public function schema(JsonSchema $schema): array
    {
        return [
            'status' => $schema->string()
                ->enum(TaskManagerService::STATUSES)
                ->description('Only return tasks with this status. Omit to return every unfinished task.'),
            'search' => $schema->string()
                ->description('Text to look for in task titles, descriptions and subtask titles.'),
            'overdue_only' => $schema->boolean()
                ->description('Only return unfinished tasks whose deadline has already passed.'),
            'due_on_or_before' => $schema->string()
                ->description('Only return tasks with a deadline on or before this date, formatted YYYY-MM-DD.'),
            'limit' => $schema->integer()
                ->min(1)
                ->max(TaskManagerService::MAX_LIST_LIMIT)
                ->description('Maximum number of tasks to return. Defaults to '.TaskManagerService::DEFAULT_LIST_LIMIT.'.'),
        ];
    }
}
