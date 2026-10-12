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

#[Name('create_task')]
#[Title('Create task')]
#[Description('Create a task. Pass parent_id to create it as a subtask of an existing top-level task instead. Subtasks cannot have subtasks of their own.')]
class CreateTaskTool extends Tool
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
            'title' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'long_description' => ['nullable', 'string'],
            'deadline' => ['nullable', 'date_format:Y-m-d'],
            'status' => ['nullable', Rule::in(TaskManagerService::STATUSES)],
            'parent_id' => ['nullable', 'integer', 'min:1'],
        ], [
            'title.required' => 'title is required. Give the task a short title of up to 255 characters.',
            'title.max' => 'title can be at most 255 characters. Put longer text in long_description.',
            'deadline.date_format' => 'deadline must be a date formatted as YYYY-MM-DD, for example 2026-12-31.',
            'status.in' => 'status must be one of: '.implode(', ', TaskManagerService::STATUSES).'.',
        ]);

        $parent = null;

        if (! empty($validated['parent_id'])) {
            $parent = $this->tasks->findTopLevel($user, (int) $validated['parent_id']);

            if (! $parent) {
                return Response::error("Parent task {$validated['parent_id']} was not found, or it is itself a subtask. Subtasks can only be added to top-level tasks; use list_tasks to find a valid parent_id.");
            }
        }

        $task = $this->tasks->create($user, $validated, $parent);

        return Response::structured($this->tasks->presentWithParent($task->load('subtasks'), $user));
    }

    /**
     * @return array<string, \Illuminate\JsonSchema\Types\Type>
     */
    public function schema(JsonSchema $schema): array
    {
        return [
            'title' => $schema->string()
                ->max(255)
                ->description('Short title of the task.')
                ->required(),
            'description' => $schema->string()
                ->description('Optional one-line summary.'),
            'long_description' => $schema->string()
                ->description('Optional detailed notes for the task.'),
            'deadline' => $schema->string()
                ->description('Optional deadline as a date, formatted YYYY-MM-DD.'),
            'status' => $schema->string()->enum(TaskManagerService::STATUSES)
                ->description('Initial status. Defaults to open.'),
            'parent_id' => $schema->integer()
                ->description('Id of an existing top-level task to add this as a subtask of. Omit to create a top-level task.'),
        ];
    }
}
