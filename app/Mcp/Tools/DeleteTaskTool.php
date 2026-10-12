<?php

namespace App\Mcp\Tools;

use App\Services\TaskManagerService;
use Illuminate\Contracts\JsonSchema\JsonSchema;
use Laravel\Mcp\Request;
use Laravel\Mcp\Response;
use Laravel\Mcp\ResponseFactory;
use Laravel\Mcp\Server\Attributes\Description;
use Laravel\Mcp\Server\Attributes\Name;
use Laravel\Mcp\Server\Attributes\Title;
use Laravel\Mcp\Server\Tool;
use Laravel\Mcp\Server\Tools\Annotations\IsDestructive;

#[Name('delete_task')]
#[Title('Delete task')]
#[Description('Permanently delete a task or subtask. Deleting a top-level task also deletes all of its subtasks. This cannot be undone, so only use it when the user explicitly asks for something to be deleted.')]
#[IsDestructive]
class DeleteTaskTool extends Tool
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
            'id' => ['required', 'integer', 'min:1'],
        ], [
            'id.required' => 'id is required. Use list_tasks to find the id of the task to delete.',
        ]);

        $task = $this->tasks->find($user, (int) $validated['id']);

        if (! $task) {
            return Response::error("Task {$validated['id']} was not found. Use list_tasks to see the available task ids.");
        }

        $deleted = [
            'id' => $task->id,
            'title' => $task->title,
            'parent_id' => $task->parent_id,
            'deleted_subtasks' => $task->parent_id ? 0 : $task->subtasks->count(),
        ];

        $this->tasks->delete($task);

        return Response::structured(['deleted' => $deleted]);
    }

    /**
     * @return array<string, \Illuminate\JsonSchema\Types\Type>
     */
    public function schema(JsonSchema $schema): array
    {
        return [
            'id' => $schema->integer()
                ->description('The id of the task or subtask to delete.')
                ->required(),
        ];
    }
}
