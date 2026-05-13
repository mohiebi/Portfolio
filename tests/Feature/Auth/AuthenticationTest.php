<?php

namespace Tests\Feature\Auth;

use App\Models\Employer;
use App\Models\Job;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AuthenticationTest extends TestCase
{
    use RefreshDatabase;

    public function test_login_screen_can_be_rendered(): void
    {
        $response = $this->get('/login');

        $response->assertStatus(200);
    }

    public function test_users_can_authenticate_using_the_login_screen(): void
    {
        $user = User::factory()->create();

        $response = $this->post('/login', [
            'email' => $user->email,
            'password' => 'password',
        ]);

        $this->assertAuthenticated();
        $response->assertRedirect(route('dashboard', absolute: false));
    }

    public function test_users_return_to_job_apply_page_after_authenticating(): void
    {
        $user = User::factory()->create();
        $employer = Employer::factory()->for(User::factory())->create();
        $job = Job::factory()->for($employer)->create();

        $this->get("/jobs/{$job->id}/apply")
            ->assertRedirect(route('login', absolute: false));

        $response = $this->post('/login', [
            'email' => $user->email,
            'password' => 'password',
        ]);

        $this->assertAuthenticatedAs($user);
        $response->assertRedirect("/jobs/{$job->id}/apply");
    }

    public function test_login_redirect_parameter_returns_user_to_previous_page(): void
    {
        $user = User::factory()->create();

        $this->get('/login?redirect=/jobs?category=IT')
            ->assertOk();

        $response = $this->post('/login?redirect=/jobs?category=IT', [
            'email' => $user->email,
            'password' => 'password',
        ]);

        $this->assertAuthenticatedAs($user);
        $response->assertRedirect('/jobs?category=IT');
    }

    public function test_users_can_not_authenticate_with_invalid_password(): void
    {
        $user = User::factory()->create();

        $this->post('/login', [
            'email' => $user->email,
            'password' => 'wrong-password',
        ]);

        $this->assertGuest();
    }

    public function test_users_can_logout(): void
    {
        $user = User::factory()->create();

        $response = $this->actingAs($user)->post('/logout');

        $this->assertGuest();
        $response->assertRedirect('/');
    }
}
