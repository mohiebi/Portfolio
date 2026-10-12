<?php

namespace Tests\Feature;

use App\Mcp\Servers\TaskManagerServer;
use App\Mcp\Tools\CreateTaskTool;
use App\Mcp\Tools\DeleteTaskTool;
use App\Mcp\Tools\GetTaskTool;
use App\Mcp\Tools\ListTasksTool;
use App\Mcp\Tools\UpdateTaskTool;
use App\Models\Task;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class McpTaskServerTest extends TestCase
{
    use RefreshDatabase;

    public function test_tools_are_named_for_ai_clients(): void
    {
        foreach ([
            ListTasksTool::class => 'list_tasks',
            GetTaskTool::class => 'get_task',
            CreateTaskTool::class => 'create_task',
            UpdateTaskTool::class => 'update_task',
            DeleteTaskTool::class => 'delete_task',
        ] as $tool => $name) {
            $this->assertSame($name, app($tool)->name());
        }
    }

    public function test_list_tasks_returns_only_the_users_unfinished_tasks_by_default(): void
    {
        $user = User::factory()->create();
        $other = User::factory()->create();

        $this->task($user, ['title' => 'Open task']);
        $this->task($user, ['title' => 'In progress task', 'status' => Task::STATUS_IN_PROGRESS]);
        $this->task($user, ['title' => 'Finished task', 'status' => Task::STATUS_DONE, 'complete' => true]);
        $this->task($other, ['title' => 'Someone else task']);

        TaskManagerServer::actingAs($user)
            ->tool(ListTasksTool::class)
            ->assertOk()
            ->assertSee(['Open task', 'In progress task'])
            ->assertDontSee(['Finished task', 'Someone else task']);
    }

    public function test_list_tasks_can_return_finished_tasks(): void
    {
        $user = User::factory()->create();

        $this->task($user, ['title' => 'Open task']);
        $this->task($user, ['title' => 'Finished task', 'status' => Task::STATUS_DONE, 'complete' => true]);

        TaskManagerServer::actingAs($user)
            ->tool(ListTasksTool::class, ['status' => Task::STATUS_DONE])
            ->assertOk()
            ->assertSee('Finished task')
            ->assertDontSee('Open task');
    }

    public function test_list_tasks_can_filter_overdue_and_due_dates(): void
    {
        $user = User::factory()->create();

        $this->task($user, ['title' => 'Late task', 'deadline' => now()->subDays(3)]);
        $this->task($user, ['title' => 'Late but finished', 'deadline' => now()->subDays(3), 'status' => Task::STATUS_DONE, 'complete' => true]);
        $this->task($user, ['title' => 'Future task', 'deadline' => now()->addDays(10)]);
        $this->task($user, ['title' => 'Undated task', 'deadline' => null]);

        TaskManagerServer::actingAs($user)
            ->tool(ListTasksTool::class, ['overdue_only' => true])
            ->assertOk()
            ->assertSee('Late task')
            ->assertDontSee(['Late but finished', 'Future task', 'Undated task']);

        TaskManagerServer::actingAs($user)
            ->tool(ListTasksTool::class, ['due_on_or_before' => now()->addDays(1)->format('Y-m-d')])
            ->assertOk()
            ->assertSee('Late task')
            ->assertDontSee(['Future task', 'Undated task']);
    }

    public function test_list_tasks_search_matches_subtask_titles(): void
    {
        $user = User::factory()->create();

        $parent = $this->task($user, ['title' => 'Quarterly planning']);
        $this->task($user, ['title' => 'Book the venue', 'parent_id' => $parent->id]);
        $this->task($user, ['title' => 'Unrelated chore']);

        TaskManagerServer::actingAs($user)
            ->tool(ListTasksTool::class, ['search' => 'venue'])
            ->assertOk()
            ->assertSee(['Quarterly planning', 'Book the venue'])
            ->assertDontSee('Unrelated chore');
    }

    public function test_list_tasks_rejects_invalid_arguments(): void
    {
        $user = User::factory()->create();

        TaskManagerServer::actingAs($user)
            ->tool(ListTasksTool::class, ['status' => 'archived'])
            ->assertHasErrors(['status must be one of: open, in_progress, done']);

        TaskManagerServer::actingAs($user)
            ->tool(ListTasksTool::class, ['due_on_or_before' => 'next friday'])
            ->assertHasErrors(['YYYY-MM-DD']);
    }

    public function test_get_task_returns_the_task_with_its_subtasks(): void
    {
        $user = User::factory()->create();

        $parent = $this->task($user, ['title' => 'Launch website', 'long_description' => 'Everything for launch day']);
        $this->task($user, ['title' => 'Write copy', 'parent_id' => $parent->id]);

        TaskManagerServer::actingAs($user)
            ->tool(GetTaskTool::class, ['id' => $parent->id])
            ->assertOk()
            ->assertSee(['Launch website', 'Everything for launch day', 'Write copy']);
    }

    public function test_get_task_does_not_expose_other_users_tasks(): void
    {
        $user = User::factory()->create();
        $foreign = $this->task(User::factory()->create(), ['title' => 'Private plans']);

        TaskManagerServer::actingAs($user)
            ->tool(GetTaskTool::class, ['id' => $foreign->id])
            ->assertHasErrors(["Task {$foreign->id} was not found"])
            ->assertDontSee('Private plans');
    }

    public function test_create_task_creates_an_open_task_for_the_user(): void
    {
        $user = User::factory()->create();

        TaskManagerServer::actingAs($user)
            ->tool(CreateTaskTool::class, [
                'title' => 'Renew passport',
                'description' => 'Before the trip',
                'long_description' => 'Take two photos.',
                'deadline' => '2026-12-31',
            ])
            ->assertOk()
            ->assertSee('Renew passport');

        $task = Task::query()->where('title', 'Renew passport')->firstOrFail();

        $this->assertSame($user->id, $task->user_id);
        $this->assertNull($task->parent_id);
        $this->assertSame(Task::STATUS_OPEN, $task->status);
        $this->assertFalse($task->complete);
        $this->assertSame('Before the trip', $task->description);
        $this->assertSame('Take two photos.', $task->long_description);
        $this->assertSame('2026-12-31', $task->deadline->format('Y-m-d'));
    }

    public function test_create_task_can_start_as_done(): void
    {
        $user = User::factory()->create();

        TaskManagerServer::actingAs($user)
            ->tool(CreateTaskTool::class, ['title' => 'Already finished', 'status' => Task::STATUS_DONE])
            ->assertOk();

        $task = Task::query()->where('title', 'Already finished')->firstOrFail();

        $this->assertSame(Task::STATUS_DONE, $task->status);
        $this->assertTrue($task->complete);
        $this->assertNotNull($task->done_at);
    }

    public function test_create_task_requires_a_valid_title_and_deadline(): void
    {
        $user = User::factory()->create();

        TaskManagerServer::actingAs($user)
            ->tool(CreateTaskTool::class, ['description' => 'No title here'])
            ->assertHasErrors(['title is required']);

        TaskManagerServer::actingAs($user)
            ->tool(CreateTaskTool::class, ['title' => 'Bad date', 'deadline' => '31/12/2026'])
            ->assertHasErrors(['deadline must be a date formatted as YYYY-MM-DD']);

        $this->assertDatabaseCount('tasks', 0);
    }

    public function test_create_task_adds_a_subtask_and_syncs_the_parent(): void
    {
        $user = User::factory()->create();
        $parent = $this->task($user, ['title' => 'Parent', 'status' => Task::STATUS_DONE, 'complete' => true]);

        TaskManagerServer::actingAs($user)
            ->tool(CreateTaskTool::class, ['title' => 'New subtask', 'parent_id' => $parent->id])
            ->assertOk();

        $subtask = Task::query()->where('title', 'New subtask')->firstOrFail();

        $this->assertSame($parent->id, $subtask->parent_id);
        $this->assertSame($user->id, $subtask->user_id);
        $this->assertSame(Task::STATUS_OPEN, $parent->fresh()->status);
        $this->assertFalse($parent->fresh()->complete);
    }

    public function test_create_task_refuses_invalid_parents(): void
    {
        $user = User::factory()->create();
        $parent = $this->task($user, ['title' => 'Parent']);
        $subtask = $this->task($user, ['title' => 'Child', 'parent_id' => $parent->id]);
        $foreign = $this->task(User::factory()->create(), ['title' => 'Foreign parent']);

        TaskManagerServer::actingAs($user)
            ->tool(CreateTaskTool::class, ['title' => 'Nested', 'parent_id' => $subtask->id])
            ->assertHasErrors(['Parent task']);

        TaskManagerServer::actingAs($user)
            ->tool(CreateTaskTool::class, ['title' => 'Hijack', 'parent_id' => $foreign->id])
            ->assertHasErrors(['Parent task']);

        $this->assertDatabaseMissing('tasks', ['title' => 'Nested']);
        $this->assertDatabaseMissing('tasks', ['title' => 'Hijack']);
    }

    public function test_update_task_changes_only_the_given_fields(): void
    {
        $user = User::factory()->create();
        $task = $this->task($user, [
            'title' => 'Old title',
            'description' => 'Keep me',
            'deadline' => '2026-11-01',
        ]);

        TaskManagerServer::actingAs($user)
            ->tool(UpdateTaskTool::class, [
                'id' => $task->id,
                'title' => 'New title',
                'deadline' => '2026-11-15',
                'status' => Task::STATUS_IN_PROGRESS,
            ])
            ->assertOk()
            ->assertSee('New title');

        $task->refresh();

        $this->assertSame('New title', $task->title);
        $this->assertSame('Keep me', $task->description);
        $this->assertSame('2026-11-15', $task->deadline->format('Y-m-d'));
        $this->assertSame(Task::STATUS_IN_PROGRESS, $task->status);
        $this->assertFalse($task->complete);
    }

    public function test_update_task_can_clear_the_deadline(): void
    {
        $user = User::factory()->create();
        $task = $this->task($user, ['deadline' => '2026-11-01']);

        TaskManagerServer::actingAs($user)
            ->tool(UpdateTaskTool::class, ['id' => $task->id, 'clear_deadline' => true])
            ->assertOk();

        $this->assertNull($task->fresh()->deadline);
    }

    public function test_completing_a_task_completes_its_subtasks(): void
    {
        $user = User::factory()->create();
        $parent = $this->task($user, ['title' => 'Parent']);
        $first = $this->task($user, ['title' => 'First', 'parent_id' => $parent->id]);
        $second = $this->task($user, ['title' => 'Second', 'parent_id' => $parent->id]);

        TaskManagerServer::actingAs($user)
            ->tool(UpdateTaskTool::class, ['id' => $parent->id, 'status' => Task::STATUS_DONE])
            ->assertOk();

        $this->assertSame(Task::STATUS_DONE, $parent->fresh()->status);
        $this->assertTrue($first->fresh()->complete);
        $this->assertTrue($second->fresh()->complete);
        $this->assertNotNull($first->fresh()->done_at);
    }

    public function test_updating_a_subtask_status_rolls_up_to_the_parent(): void
    {
        $user = User::factory()->create();
        $parent = $this->task($user, ['title' => 'Parent']);
        $first = $this->task($user, ['title' => 'First', 'parent_id' => $parent->id]);
        $second = $this->task($user, ['title' => 'Second', 'parent_id' => $parent->id]);

        TaskManagerServer::actingAs($user)
            ->tool(UpdateTaskTool::class, ['id' => $first->id, 'status' => Task::STATUS_DONE])
            ->assertOk();

        $this->assertSame(Task::STATUS_IN_PROGRESS, $parent->fresh()->status);

        TaskManagerServer::actingAs($user)
            ->tool(UpdateTaskTool::class, ['id' => $second->id, 'status' => Task::STATUS_DONE])
            ->assertOk();

        $this->assertSame(Task::STATUS_DONE, $parent->fresh()->status);
        $this->assertTrue($parent->fresh()->complete);
    }

    public function test_update_task_requires_a_change_and_an_owned_task(): void
    {
        $user = User::factory()->create();
        $task = $this->task($user, ['title' => 'Mine']);
        $foreign = $this->task(User::factory()->create(), ['title' => 'Not mine']);

        TaskManagerServer::actingAs($user)
            ->tool(UpdateTaskTool::class, ['id' => $task->id])
            ->assertHasErrors(['Nothing to update']);

        TaskManagerServer::actingAs($user)
            ->tool(UpdateTaskTool::class, ['id' => $foreign->id, 'title' => 'Hacked'])
            ->assertHasErrors(["Task {$foreign->id} was not found"]);

        $this->assertSame('Not mine', $foreign->fresh()->title);

        TaskManagerServer::actingAs($user)
            ->tool(UpdateTaskTool::class, ['id' => $task->id, 'status' => 'archived'])
            ->assertHasErrors(['status must be one of']);
    }

    public function test_delete_task_removes_the_task_and_its_subtasks(): void
    {
        $user = User::factory()->create();
        $parent = $this->task($user, ['title' => 'Parent']);
        $child = $this->task($user, ['title' => 'Child', 'parent_id' => $parent->id]);

        TaskManagerServer::actingAs($user)
            ->tool(DeleteTaskTool::class, ['id' => $parent->id])
            ->assertOk()
            ->assertSee('Parent');

        $this->assertDatabaseMissing('tasks', ['id' => $parent->id]);
        $this->assertDatabaseMissing('tasks', ['id' => $child->id]);
    }

    public function test_deleting_the_last_open_subtask_updates_the_parent(): void
    {
        $user = User::factory()->create();
        $parent = $this->task($user, ['title' => 'Parent', 'status' => Task::STATUS_IN_PROGRESS]);
        $done = $this->task($user, ['title' => 'Done child', 'parent_id' => $parent->id, 'status' => Task::STATUS_DONE, 'complete' => true]);
        $open = $this->task($user, ['title' => 'Open child', 'parent_id' => $parent->id]);

        TaskManagerServer::actingAs($user)
            ->tool(DeleteTaskTool::class, ['id' => $open->id])
            ->assertOk();

        $this->assertDatabaseMissing('tasks', ['id' => $open->id]);
        $this->assertDatabaseHas('tasks', ['id' => $done->id]);
        $this->assertSame(Task::STATUS_DONE, $parent->fresh()->status);
    }

    public function test_delete_task_cannot_remove_other_users_tasks(): void
    {
        $user = User::factory()->create();
        $foreign = $this->task(User::factory()->create(), ['title' => 'Not mine']);

        TaskManagerServer::actingAs($user)
            ->tool(DeleteTaskTool::class, ['id' => $foreign->id])
            ->assertHasErrors(["Task {$foreign->id} was not found"]);

        $this->assertDatabaseHas('tasks', ['id' => $foreign->id]);
    }

    /**
     * @param  array<string, mixed>  $attributes
     */
    private function task(User $user, array $attributes = []): Task
    {
        return Task::factory()->for($user)->create([
            'description' => '',
            'long_description' => null,
            'deadline' => null,
            'complete' => false,
            'status' => Task::STATUS_OPEN,
            'done_at' => null,
            ...$attributes,
        ]);
    }
}
