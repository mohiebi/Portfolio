<?php

namespace Tests\Feature;

use App\Models\Task;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class TaskArchiveTest extends TestCase
{
    use RefreshDatabase;

    public function test_archive_requires_authentication(): void
    {
        $this->get('/taskmanager/archive')
            ->assertRedirect('/login');
    }

    public function test_users_only_see_their_own_done_tasks(): void
    {
        $user = User::factory()->create();
        $otherUser = User::factory()->create();

        $ownTask = Task::factory()->for($user)->create([
            'title' => 'Own finished task',
            'complete' => true,
            'status' => Task::STATUS_DONE,
            'done_at' => now()->subDay(),
        ]);
        Task::factory()->for($user)->create([
            'title' => 'Open own task',
            'complete' => false,
            'status' => Task::STATUS_OPEN,
            'done_at' => null,
        ]);
        Task::factory()->for($otherUser)->create([
            'title' => 'Other finished task',
            'complete' => true,
            'status' => Task::STATUS_DONE,
            'done_at' => now()->subDay(),
        ]);

        $this->actingAs($user)
            ->get('/taskmanager/archive')
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('Taskmanager/Archive')
                ->has('tasks.data', 1)
                ->where('tasks.data.0.id', $ownTask->id)
            );
    }

    public function test_keyword_search_matches_title_and_description_only(): void
    {
        $user = User::factory()->create();

        $titleMatch = Task::factory()->for($user)->create([
            'title' => 'Launch needle checklist',
            'description' => 'Plain body',
            'long_description' => 'No match here',
            'complete' => true,
            'status' => Task::STATUS_DONE,
            'done_at' => now()->subDays(3),
        ]);
        $descriptionMatch = Task::factory()->for($user)->create([
            'title' => 'Ordinary title',
            'description' => 'Contains needle in the short description',
            'long_description' => 'No match here',
            'complete' => true,
            'status' => Task::STATUS_DONE,
            'done_at' => now()->subDays(2),
        ]);
        Task::factory()->for($user)->create([
            'title' => 'No short match',
            'description' => 'Plain body',
            'long_description' => 'needle only appears in long details',
            'complete' => true,
            'status' => Task::STATUS_DONE,
            'done_at' => now()->subDay(),
        ]);

        $this->actingAs($user)
            ->get('/taskmanager/archive?q=needle')
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->has('tasks.data', 2)
                ->where('tasks.data.0.id', $descriptionMatch->id)
                ->where('tasks.data.1.id', $titleMatch->id)
            );
    }

    public function test_created_range_filter_works(): void
    {
        $user = User::factory()->create();

        $inside = Task::factory()->for($user)->create([
            'title' => 'Inside created range',
            'complete' => true,
            'status' => Task::STATUS_DONE,
            'created_at' => '2026-07-10 12:00:00',
            'done_at' => '2026-07-15 12:00:00',
        ]);
        Task::factory()->for($user)->create([
            'title' => 'Outside created range',
            'complete' => true,
            'status' => Task::STATUS_DONE,
            'created_at' => '2026-06-30 12:00:00',
            'done_at' => '2026-07-15 12:00:00',
        ]);

        $this->actingAs($user)
            ->get('/taskmanager/archive?created_from=2026-07-01&created_to=2026-07-31')
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->has('tasks.data', 1)
                ->where('tasks.data.0.id', $inside->id)
            );
    }

    public function test_done_range_filter_uses_done_at(): void
    {
        $user = User::factory()->create();

        $inside = Task::factory()->for($user)->create([
            'title' => 'Done in July',
            'complete' => true,
            'status' => Task::STATUS_DONE,
            'done_at' => '2026-07-12 12:00:00',
            'updated_at' => '2026-05-12 12:00:00',
        ]);
        Task::factory()->for($user)->create([
            'title' => 'Updated in July but done earlier',
            'complete' => true,
            'status' => Task::STATUS_DONE,
            'done_at' => '2026-06-12 12:00:00',
            'updated_at' => '2026-07-12 12:00:00',
        ]);

        $this->actingAs($user)
            ->get('/taskmanager/archive?done_from=2026-07-01&done_to=2026-07-31')
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->has('tasks.data', 1)
                ->where('tasks.data.0.id', $inside->id)
            );
    }

    public function test_subtasks_are_excluded_by_default(): void
    {
        $user = User::factory()->create();
        $parent = Task::factory()->for($user)->create([
            'title' => 'Parent task',
            'complete' => false,
            'status' => Task::STATUS_OPEN,
            'done_at' => null,
        ]);
        Task::factory()->for($user)->create([
            'parent_id' => $parent->id,
            'title' => 'Needle child task',
            'complete' => true,
            'status' => Task::STATUS_DONE,
            'done_at' => now()->subDay(),
        ]);

        $this->actingAs($user)
            ->get('/taskmanager/archive?q=Needle')
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->has('tasks.data', 0)
            );
    }

    public function test_include_subtasks_returns_matching_done_subtasks_by_parent_card(): void
    {
        $user = User::factory()->create();
        $parent = Task::factory()->for($user)->create([
            'title' => 'Parent card',
            'complete' => false,
            'status' => Task::STATUS_OPEN,
            'done_at' => null,
        ]);
        $matchingSubtask = Task::factory()->for($user)->create([
            'parent_id' => $parent->id,
            'title' => 'Needle child task',
            'complete' => true,
            'status' => Task::STATUS_DONE,
            'done_at' => now()->subDay(),
        ]);

        $this->actingAs($user)
            ->get('/taskmanager/archive?q=Needle&include_subtasks=1')
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->where('tasks.data.0.id', $parent->id)
                ->where('tasks.data.0.subtasks.0.id', $matchingSubtask->id)
                ->where('filters.include_subtasks', true)
            );
    }

    public function test_pagination_preserves_filters(): void
    {
        $user = User::factory()->create();

        Task::factory()->count(11)->for($user)->create([
            'title' => 'Archive keep item',
            'complete' => true,
            'status' => Task::STATUS_DONE,
            'done_at' => now()->subDay(),
        ]);

        $this->actingAs($user)
            ->get('/taskmanager/archive?q=Archive&include_subtasks=1')
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->where('tasks.total', 11)
                ->where('tasks.next_page_url', fn ($url) => is_string($url)
                    && str_contains($url, 'q=Archive')
                    && str_contains($url, 'include_subtasks=1'))
            );
    }
}
