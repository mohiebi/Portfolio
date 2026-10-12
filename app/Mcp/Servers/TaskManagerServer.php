<?php

namespace App\Mcp\Servers;

use App\Mcp\Tools\CreateTaskTool;
use App\Mcp\Tools\DeleteTaskTool;
use App\Mcp\Tools\GetTaskTool;
use App\Mcp\Tools\ListTasksTool;
use App\Mcp\Tools\UpdateTaskTool;
use Laravel\Mcp\Server;
use Laravel\Mcp\Server\Attributes\Instructions;
use Laravel\Mcp\Server\Attributes\Name;
use Laravel\Mcp\Server\Attributes\Version;

#[Name('Task Manager')]
#[Version('1.0.0')]
#[Instructions('Manage the signed-in user\'s personal task board. A task has a title, an optional description and long_description, an optional deadline (a date, YYYY-MM-DD) and a status of open, in_progress or done. Tasks can have subtasks, one level deep; create them with create_task and parent_id. When all subtasks of a task are done the task is done automatically. Call list_tasks first to find task ids before updating or deleting. Only call delete_task when the user explicitly asks to delete something.')]
class TaskManagerServer extends Server
{
    protected array $tools = [
        ListTasksTool::class,
        GetTaskTool::class,
        CreateTaskTool::class,
        UpdateTaskTool::class,
        DeleteTaskTool::class,
    ];
}
