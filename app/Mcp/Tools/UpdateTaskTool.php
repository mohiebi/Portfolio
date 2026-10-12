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
use Laravel\Mcp\Server\Tools\Annotations\IsIdempotent;

#[Name('update_task')]
#[Title('Update task')]
#[Description('Change a task or subtask. Only the fields you pass are changed. Use status "done" to complete a task: finishing a top-level task also finishes its subtasks, and changing a subtask updates its parent\'s status automatically.')]
#[IsIdempotent]
class UpdateTaskTool extends Tool
{
    private const CHANGEABLE_FIELDS = ['title', 'description', 'long_description', 'deadline', 'clear_deadline', 'status'];

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
            'id' => ['required', 'integer', 'min:1'],
            'title' => ['sometimes', 'string', 'max:255'],
            'description' => ['sometimes', 'nullable', 'string'],
            'long_description' => ['sometimes', 'nullable', 'string'],
            'deadline' => ['sometimes', 'nullable', 'date_format:Y-m-d'],
            'clear_deadline' => ['sometimes', 'boolean'],
            'status' => ['sometimes', Rule::in(TaskManagerService::STATUSES)],
        ], [
            'id.required' => 'id is required. Use list_tasks to find the id of the task to update.',
            'title.max' => 'title can be at most 255 characters. Put longer text in long_description.',
            'deadline.date_format' => 'deadline must be a date formatted as YYYY-MM-DD, for example 2026-12-31.',
            'status.in' => 'status must be one of: '.implode(', ', TaskManagerService::STATUSES).'.',
        ]);

        $changes = array_intersect_key($validated, array_flip(self::CHANGEABLE_FIELDS));

        if ($changes === []) {
            return Response::error('Nothing to update. Pass at least one of: '.implode(', ', self::CHANGEABLE_FIELDS).'.');
        }

        if (($changes['clear_deadline'] ?? false) && ! empty($changes['deadline'])) {
            return Response::error('Pass either deadline or clear_deadline, not both.');
        }

        if ($changes['clear_deadline'] ?? false) {
            $changes['deadline'] = null;
        }

        unset($changes['clear_deadline']);

        $task = $this->tasks->find($user, (int) $validated['id']);

        if (! $task) {
            return Response::error("Task {$validated['id']} was not found. Use list_tasks to see the available task ids.");
        }

        $task = $this->tasks->update($user, $task, $changes);

        return Response::structured($this->tasks->presentWithParent($task, $user));
    }

    /**
     * @return array<string, \Illuminate\JsonSchema\Types\Type>
     */
    public function schema(JsonSchema $schema): array
    {
        return [
            'id' => $schema->integer()
                ->description('The id of the task or subtask to change.')
                ->required(),
            'title' => $schema->string()
                ->max(255)
                ->description('New title.'),
            'description' => $schema->string()
                ->description('New one-line summary. Pass an empty string to clear it.'),
            'long_description' => $schema->string()
                ->description('New detailed notes. Pass an empty string to clear them.'),
            'deadline' => $schema->string()
                ->description('New deadline as a date, formatted YYYY-MM-DD. Use clear_deadline to remove a deadline.'),
            'clear_deadline' => $schema->boolean()
                ->description('Set to true to remove the deadline.'),
            'status' => $schema->string()->enum(TaskManagerService::STATUSES)
                ->description('New status: open, in_progress or done.'),
        ];
    }
}
