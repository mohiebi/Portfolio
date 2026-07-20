<?php

namespace Tests\Feature;

use App\Models\Task;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class TaskSubtaskTest extends TestCase
{
    use RefreshDatabase;

    public function test_users_can_create_subtasks_for_their_own_top_level_tasks(): void
    {
        $user = User::factory()->create();
        $parent = Task::factory()->for($user)->create([
            'complete' => false,
            'status' => Task::STATUS_OPEN,
        ]);

        $this->actingAs($user)
            ->postJson("/taskmanager/{$parent->id}/subtasks", [
                'title' => 'Write acceptance criteria',
                'long_description' => 'Capture the expected states before implementation.',
            ])
            ->assertCreated()
            ->assertJsonPath('task.status', Task::STATUS_OPEN)
            ->assertJsonPath('task.complete', false)
            ->assertJsonPath('subtask.title', 'Write acceptance criteria');

        $this->assertDatabaseHas('tasks', [
            'parent_id' => $parent->id,
            'title' => 'Write acceptance criteria',
            'complete' => false,
            'status' => Task::STATUS_OPEN,
        ]);
    }

    public function test_subtask_completion_syncs_the_parent_status(): void
    {
        $user = User::factory()->create();
        $parent = Task::factory()->for($user)->create([
            'complete' => false,
            'status' => Task::STATUS_OPEN,
        ]);

        $this->actingAs($user)->postJson("/taskmanager/{$parent->id}/subtasks", [
            'title' => 'First subtask',
        ]);
        $this->actingAs($user)->postJson("/taskmanager/{$parent->id}/subtasks", [
            'title' => 'Second subtask',
        ]);

        $firstSubtask = $parent->subtasks()->where('title', 'First subtask')->firstOrFail();
        $secondSubtask = $parent->subtasks()->where('title', 'Second subtask')->firstOrFail();

        $this->actingAs($user)
            ->patchJson("/taskmanager/{$parent->id}/subtasks/{$firstSubtask->id}", [
                'status' => Task::STATUS_DONE,
            ])
            ->assertOk()
            ->assertJsonPath('task.status', Task::STATUS_IN_PROGRESS)
            ->assertJsonPath('task.complete', false);

        $this->actingAs($user)
            ->patchJson("/taskmanager/{$parent->id}/subtasks/{$secondSubtask->id}", [
                'status' => Task::STATUS_DONE,
            ])
            ->assertOk()
            ->assertJsonPath('task.status', Task::STATUS_DONE)
            ->assertJsonPath('task.complete', true);

        $this->actingAs($user)
            ->patchJson("/taskmanager/{$parent->id}/subtasks/{$firstSubtask->id}", [
                'status' => Task::STATUS_OPEN,
            ])
            ->assertOk()
            ->assertJsonPath('task.status', Task::STATUS_IN_PROGRESS)
            ->assertJsonPath('task.complete', false);

        $this->actingAs($user)
            ->patchJson("/taskmanager/{$parent->id}/subtasks/{$secondSubtask->id}", [
                'status' => Task::STATUS_OPEN,
            ])
            ->assertOk()
            ->assertJsonPath('task.status', Task::STATUS_OPEN)
            ->assertJsonPath('task.complete', false);
    }

    public function test_marking_parent_done_marks_subtasks_done(): void
    {
        $user = User::factory()->create();
        $parent = Task::factory()->for($user)->create([
            'complete' => false,
            'status' => Task::STATUS_OPEN,
        ]);
        $subtask = Task::factory()->for($user)->create([
            'parent_id' => $parent->id,
            'complete' => false,
            'status' => Task::STATUS_OPEN,
        ]);

        $this->actingAs($user)
            ->patchJson("/taskmanager/{$parent->id}/status", [
                'status' => Task::STATUS_DONE,
            ])
            ->assertOk()
            ->assertJsonPath('task.status', Task::STATUS_DONE);

        $this->assertDatabaseHas('tasks', [
            'id' => $subtask->id,
            'complete' => true,
            'status' => Task::STATUS_DONE,
        ]);
        $this->assertNotNull($subtask->fresh()->done_at);
    }

    public function test_marking_parent_open_marks_subtasks_open(): void
    {
        $user = User::factory()->create();
        $parent = Task::factory()->for($user)->create([
            'complete' => true,
            'status' => Task::STATUS_DONE,
        ]);
        $subtask = Task::factory()->for($user)->create([
            'parent_id' => $parent->id,
            'complete' => true,
            'status' => Task::STATUS_DONE,
        ]);

        $this->actingAs($user)
            ->patchJson("/taskmanager/{$parent->id}/status", [
                'status' => Task::STATUS_OPEN,
            ])
            ->assertOk()
            ->assertJsonPath('task.status', Task::STATUS_OPEN);

        $this->assertDatabaseHas('tasks', [
            'id' => $subtask->id,
            'complete' => false,
            'status' => Task::STATUS_OPEN,
        ]);
        $this->assertNull($subtask->fresh()->done_at);
    }

    public function test_subtasks_are_limited_to_one_level(): void
    {
        $user = User::factory()->create();
        $parent = Task::factory()->for($user)->create();

        $this->actingAs($user)->postJson("/taskmanager/{$parent->id}/subtasks", [
            'title' => 'First level only',
        ]);

        $subtask = $parent->subtasks()->firstOrFail();

        $this->actingAs($user)
            ->postJson("/taskmanager/{$subtask->id}/subtasks", [
                'title' => 'Nested task',
            ])
            ->assertNotFound();
    }

    public function test_users_cannot_manage_another_users_subtasks(): void
    {
        $user = User::factory()->create();
        $otherUser = User::factory()->create();
        $parent = Task::factory()->for($user)->create();
        $otherParent = Task::factory()->for($otherUser)->create();
        $otherSubtask = Task::factory()->for($otherUser)->create([
            'parent_id' => $otherParent->id,
        ]);

        $this->actingAs($user)
            ->postJson("/taskmanager/{$otherParent->id}/subtasks", [
                'title' => 'Not mine',
            ])
            ->assertNotFound();

        $this->actingAs($user)
            ->patchJson("/taskmanager/{$parent->id}/subtasks/{$otherSubtask->id}", [
                'title' => 'Still not mine',
            ])
            ->assertNotFound();
    }

    public function test_normal_task_status_route_does_not_update_subtasks_directly(): void
    {
        $user = User::factory()->create();
        $parent = Task::factory()->for($user)->create();
        $subtask = Task::factory()->for($user)->create([
            'parent_id' => $parent->id,
            'complete' => false,
            'status' => Task::STATUS_OPEN,
        ]);

        $this->actingAs($user)
            ->patchJson("/taskmanager/{$subtask->id}/status", [
                'status' => Task::STATUS_DONE,
            ])
            ->assertNotFound();

        $this->assertDatabaseHas('tasks', [
            'id' => $subtask->id,
            'complete' => false,
            'status' => Task::STATUS_OPEN,
        ]);
    }

    public function test_deleting_a_parent_task_deletes_its_subtasks(): void
    {
        $user = User::factory()->create();
        $parent = Task::factory()->for($user)->create();
        $subtask = Task::factory()->for($user)->create([
            'parent_id' => $parent->id,
        ]);

        $this->actingAs($user)
            ->deleteJson("/taskmanager/{$parent->id}")
            ->assertOk();

        $this->assertDatabaseMissing('tasks', ['id' => $parent->id]);
        $this->assertDatabaseMissing('tasks', ['id' => $subtask->id]);
    }

    public function test_done_tasks_inactive_for_a_week_are_hidden_from_the_board(): void
    {
        $user = User::factory()->create([
            'task_done_cleanup_enabled' => true,
        ]);

        $openTask = Task::factory()->for($user)->create([
            'title' => 'Visible open task',
            'complete' => false,
            'status' => Task::STATUS_OPEN,
            'created_at' => now()->subDays(10),
            'updated_at' => now()->subDays(10),
        ]);
        $recentDoneTask = Task::factory()->for($user)->create([
            'title' => 'Recently completed task',
            'complete' => true,
            'status' => Task::STATUS_DONE,
            'created_at' => now()->subDays(6),
            'done_at' => now()->subDays(6),
            'updated_at' => now()->subDays(6),
        ]);
        $oldDoneTask = Task::factory()->for($user)->create([
            'title' => 'Hidden completed task',
            'complete' => true,
            'status' => Task::STATUS_DONE,
            'created_at' => now()->subDays(8),
            'done_at' => now()->subDays(8),
            'updated_at' => now()->subDays(8),
        ]);

        $this->actingAs($user)
            ->get('/taskmanager')
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('Taskmanager/Index')
                ->has('tasks', 2)
                ->where('tasks.0.id', $recentDoneTask->id)
                ->where('tasks.1.id', $openTask->id)
            );

        $this->assertDatabaseHas('tasks', ['id' => $oldDoneTask->id]);
    }

    public function test_done_cleanup_is_off_by_default(): void
    {
        $user = User::factory()->create();
        $oldDoneTask = Task::factory()->for($user)->create([
            'title' => 'Still visible completed task',
            'complete' => true,
            'status' => Task::STATUS_DONE,
            'created_at' => now()->subDays(8),
            'done_at' => now()->subDays(8),
            'updated_at' => now()->subDays(8),
        ]);

        $this->actingAs($user)
            ->get('/taskmanager')
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('Taskmanager/Index')
                ->has('tasks', 1)
                ->where('tasks.0.id', $oldDoneTask->id)
                ->where('doneCleanup.enabled', false)
                ->where('doneCleanup.available', false)
            );
    }

    public function test_recent_subtask_activity_keeps_done_parent_visible_on_the_board(): void
    {
        $user = User::factory()->create([
            'task_done_cleanup_enabled' => true,
        ]);

        $parent = Task::factory()->for($user)->create([
            'title' => 'Fresh subtask parent',
            'complete' => true,
            'status' => Task::STATUS_DONE,
            'created_at' => now()->subDays(8),
            'done_at' => now()->subDays(8),
            'updated_at' => now()->subDays(8),
        ]);
        $subtask = Task::factory()->for($user)->create([
            'parent_id' => $parent->id,
            'title' => 'Edited today',
            'complete' => true,
            'status' => Task::STATUS_DONE,
            'created_at' => now()->subDays(8),
            'done_at' => now()->subDay(),
            'updated_at' => now()->subDay(),
        ]);

        $this->actingAs($user)
            ->get('/taskmanager')
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('Taskmanager/Index')
                ->has('tasks', 1)
                ->where('tasks.0.id', $parent->id)
                ->where('tasks.0.subtasks.0.id', $subtask->id)
            );
    }

    public function test_done_cleanup_control_is_available_after_ten_done_tasks(): void
    {
        $user = User::factory()->create();

        Task::factory()->count(9)->for($user)->create([
            'complete' => true,
            'status' => Task::STATUS_DONE,
        ]);

        $this->actingAs($user)
            ->get('/taskmanager')
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->where('doneCleanup.enabled', false)
                ->where('doneCleanup.available', false)
                ->where('doneCleanup.doneTaskCount', 9)
            );

        Task::factory()->for($user)->create([
            'complete' => true,
            'status' => Task::STATUS_DONE,
        ]);

        $this->actingAs($user)
            ->get('/taskmanager')
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->where('doneCleanup.enabled', false)
                ->where('doneCleanup.available', true)
                ->where('doneCleanup.doneTaskCount', 10)
            );
    }

    public function test_users_can_enable_done_cleanup_when_they_have_ten_done_tasks(): void
    {
        $user = User::factory()->create();

        Task::factory()->count(9)->for($user)->create([
            'complete' => true,
            'status' => Task::STATUS_DONE,
            'done_at' => now()->subDay(),
            'updated_at' => now()->subDay(),
        ]);
        $oldDoneTask = Task::factory()->for($user)->create([
            'complete' => true,
            'status' => Task::STATUS_DONE,
            'done_at' => now()->subDays(31),
            'updated_at' => now()->subDays(31),
        ]);

        $this->actingAs($user)
            ->patch('/taskmanager/done-cleanup', [
                'enabled' => true,
            ])
            ->assertRedirect();

        $this->assertTrue($user->fresh()->task_done_cleanup_enabled);
        $this->assertDatabaseHas('tasks', ['id' => $oldDoneTask->id]);

        $this->actingAs($user)
            ->get('/taskmanager')
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('Taskmanager/Index')
                ->has('tasks', 9)
            );
    }

    public function test_month_old_done_tasks_are_kept_for_archive_when_hide_preference_is_enabled(): void
    {
        $user = User::factory()->create([
            'task_done_cleanup_enabled' => true,
        ]);

        $oldDoneTask = Task::factory()->for($user)->create([
            'title' => 'Archived done task',
            'complete' => true,
            'status' => Task::STATUS_DONE,
            'done_at' => now()->subDays(31),
            'updated_at' => now()->subDays(31),
        ]);
        $oldDoneSubtask = Task::factory()->for($user)->create([
            'parent_id' => $oldDoneTask->id,
            'complete' => true,
            'status' => Task::STATUS_DONE,
            'done_at' => now()->subDays(31),
            'updated_at' => now()->subDays(31),
        ]);

        $this->actingAs($user)
            ->get('/taskmanager')
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('Taskmanager/Index')
                ->has('tasks', 0)
            );

        $this->assertDatabaseHas('tasks', ['id' => $oldDoneTask->id]);
        $this->assertDatabaseHas('tasks', ['id' => $oldDoneSubtask->id]);

        $this->actingAs($user)
            ->get('/taskmanager/archive?q=Archived')
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('Taskmanager/Archive')
                ->where('tasks.data.0.id', $oldDoneTask->id)
            );
    }

    public function test_done_at_tracks_status_changes_without_changing_on_done_edits(): void
    {
        $user = User::factory()->create();
        $task = Task::factory()->for($user)->create([
            'complete' => false,
            'status' => Task::STATUS_OPEN,
            'done_at' => null,
        ]);

        Carbon::setTestNow(Carbon::parse('2026-07-01 09:00:00'));

        $this->actingAs($user)
            ->patchJson("/taskmanager/{$task->id}/status", [
                'status' => Task::STATUS_DONE,
            ])
            ->assertOk();

        $doneAt = $task->fresh()->done_at;

        $this->assertNotNull($doneAt);
        $this->assertSame('2026-07-01 09:00:00', $doneAt->toDateTimeString());

        Carbon::setTestNow(Carbon::parse('2026-07-03 09:00:00'));

        $this->actingAs($user)
            ->put("/taskmanager/{$task->id}", [
                'title' => 'Edited completed task',
                'complete' => true,
            ])
            ->assertRedirect();

        $this->assertSame('2026-07-01 09:00:00', $task->fresh()->done_at->toDateTimeString());

        $this->actingAs($user)
            ->patchJson("/taskmanager/{$task->id}/status", [
                'status' => Task::STATUS_OPEN,
            ])
            ->assertOk();

        $this->assertNull($task->fresh()->done_at);

        Carbon::setTestNow();
    }
}
