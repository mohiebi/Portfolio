<?php

namespace Tests\Feature;

use App\Models\Task;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
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

    public function test_manual_parent_status_changes_do_not_rewrite_subtasks(): void
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
            'complete' => false,
            'status' => Task::STATUS_OPEN,
        ]);

        $this->actingAs($user)
            ->patchJson("/taskmanager/{$parent->id}/subtasks/{$subtask->id}", [
                'status' => Task::STATUS_OPEN,
            ])
            ->assertOk()
            ->assertJsonPath('task.status', Task::STATUS_OPEN);
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
}
