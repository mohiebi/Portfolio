<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\DB;
use Inertia\Testing\AssertableInertia as Assert;
use Laravel\Passport\Client;
use Laravel\Passport\ClientRepository;
use Tests\TestCase;

class McpConnectionsTest extends TestCase
{
    use RefreshDatabase;

    public function test_profile_shows_the_mcp_server_url_and_no_connections_by_default(): void
    {
        $user = User::factory()->create();

        $this->actingAs($user)
            ->get('/profile')
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('Profile/Edit')
                ->where('mcp.server_url', url('/mcp/tasks'))
                ->where('mcp.connections', []));
    }

    public function test_profile_lists_only_active_connections_of_the_user(): void
    {
        $user = User::factory()->create();
        $other = User::factory()->create();

        $active = $this->client('Claude');
        $expiredButRefreshable = $this->client('Cursor');
        $revoked = $this->client('Old assistant');
        $foreign = $this->client('Someone else');
        $expiredForGood = $this->client('Expired assistant');

        $this->token($user, $active);
        $this->token($user, $expiredButRefreshable, expiresAt: now()->subDay(), refreshExpiresAt: now()->addDays(30), createdAt: now()->subMinute());
        $this->token($user, $revoked, revoked: true);
        $this->token($other, $foreign);
        $this->token($user, $expiredForGood, expiresAt: now()->subDay(), refreshExpiresAt: now()->subHour());

        $this->actingAs($user)
            ->get('/profile')
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->has('mcp.connections', 2)
                ->has('mcp.connections.0', fn (Assert $connection) => $connection
                    ->where('name', 'Claude')
                    ->where('client_id', $active->getKey())
                    ->has('connected_at'))
                ->where('mcp.connections.1.name', 'Cursor'));
    }

    public function test_disconnecting_revokes_the_clients_tokens_for_this_user_only(): void
    {
        $user = User::factory()->create();
        $other = User::factory()->create();
        $client = $this->client('Claude');

        $mine = $this->token($user, $client);
        $theirs = $this->token($other, $client);

        $this->actingAs($user)
            ->delete("/profile/mcp/{$client->getKey()}")
            ->assertRedirect('/profile');

        $this->assertTrue((bool) DB::table('oauth_access_tokens')->where('id', $mine)->value('revoked'));
        $this->assertTrue((bool) DB::table('oauth_refresh_tokens')->where('access_token_id', $mine)->value('revoked'));
        $this->assertFalse((bool) DB::table('oauth_access_tokens')->where('id', $theirs)->value('revoked'));
        $this->assertFalse((bool) DB::table('oauth_refresh_tokens')->where('access_token_id', $theirs)->value('revoked'));
    }

    public function test_guests_cannot_disconnect_clients(): void
    {
        $client = $this->client('Claude');

        $this->delete("/profile/mcp/{$client->getKey()}")
            ->assertRedirect('/login');
    }

    private function client(string $name): Client
    {
        return app(ClientRepository::class)->createAuthorizationCodeGrantClient(
            name: $name,
            redirectUris: ['https://claude.ai/api/mcp/auth_callback'],
            confidential: false,
        );
    }

    private function token(
        User $user,
        Client $client,
        bool $revoked = false,
        ?\DateTimeInterface $expiresAt = null,
        ?\DateTimeInterface $refreshExpiresAt = null,
        ?\DateTimeInterface $createdAt = null,
    ): string {
        $id = bin2hex(random_bytes(20));

        DB::table('oauth_access_tokens')->insert([
            'id' => $id,
            'user_id' => $user->id,
            'client_id' => $client->getKey(),
            'name' => null,
            'scopes' => json_encode(['mcp:use']),
            'revoked' => $revoked,
            'created_at' => $createdAt ?? now(),
            'updated_at' => $createdAt ?? now(),
            'expires_at' => $expiresAt ?? now()->addDays(7),
        ]);

        DB::table('oauth_refresh_tokens')->insert([
            'id' => bin2hex(random_bytes(20)),
            'access_token_id' => $id,
            'revoked' => $revoked,
            'expires_at' => $refreshExpiresAt ?? now()->addDays(60),
        ]);

        return $id;
    }
}
