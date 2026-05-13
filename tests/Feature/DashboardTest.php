<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class DashboardTest extends TestCase
{
    use RefreshDatabase;

    public function test_authenticated_non_admin_users_can_access_dashboard(): void
    {
        $user = User::factory()->create(['role' => '0']);

        $this->actingAs($user)
            ->get('/dashboard')
            ->assertOk();
    }
}
