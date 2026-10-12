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
use Laravel\Mcp\Server\Tools\Annotations\IsReadOnly;

#[Name('get_task')]
#[Title('Get task')]
#[Description('Get one task, or subtask, by id, including its description, deadline, status and subtasks.')]
#[IsReadOnly]
class GetTaskTool extends Tool
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
            'id.required' => 'id is required. Use list_tasks to find the id of the task.',
        ]);

        $task = $this->tasks->find($user, (int) $validated['id']);

        if (! $task) {
            return Response::error("Task {$validated['id']} was not found. Use list_tasks to see the available task ids.");
        }

        return Response::structured($this->tasks->presentWithParent($task, $user));
    }

    /**
     * @return array<string, \Illuminate\JsonSchema\Types\Type>
     */
    public function schema(JsonSchema $schema): array
    {
        return [
            'id' => $schema->integer()
                ->description('The id of the task or subtask.')
                ->required(),
        ];
    }
}
