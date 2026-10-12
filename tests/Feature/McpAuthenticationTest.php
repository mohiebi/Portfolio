<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\File;
use Inertia\Testing\AssertableInertia as Assert;
use Laravel\Passport\Client;
use Laravel\Passport\ClientRepository;
use Laravel\Passport\Passport;
use Tests\TestCase;

class McpAuthenticationTest extends TestCase
{
    use RefreshDatabase;

    private const REDIRECT_URI = 'https://claude.ai/api/mcp/auth_callback';

    private ?string $passportKeyPath = null;

    protected function tearDown(): void
    {
        if ($this->passportKeyPath !== null) {
            File::deleteDirectory($this->passportKeyPath);
            Passport::loadKeysFrom(storage_path());
        }

        parent::tearDown();
    }

    public function test_mcp_endpoint_requires_authentication(): void
    {
        $response = $this->postJson('/mcp/tasks', $this->rpc('tools/list'));

        $response->assertUnauthorized();

        $this->assertStringContainsString(
            '/.well-known/oauth-protected-resource/mcp/tasks',
            (string) $response->headers->get('WWW-Authenticate'),
        );
    }

    public function test_unauthenticated_clients_get_a_401_even_without_a_json_accept_header(): void
    {
        $response = $this->call(
            'POST',
            '/mcp/tasks',
            server: ['CONTENT_TYPE' => 'application/json', 'HTTP_ACCEPT' => '*/*'],
            content: json_encode($this->rpc('tools/list')),
        );

        $response->assertUnauthorized();

        $this->assertStringContainsString(
            'resource_metadata',
            (string) $response->headers->get('WWW-Authenticate'),
        );
    }

    public function test_oauth_discovery_documents_are_published(): void
    {
        $this->getJson('/.well-known/oauth-protected-resource/mcp/tasks')
            ->assertOk()
            ->assertJsonPath('resource', url('/mcp/tasks'))
            ->assertJsonPath('scopes_supported.0', 'mcp:use');

        $this->getJson('/.well-known/oauth-authorization-server')
            ->assertOk()
            ->assertJsonPath('authorization_endpoint', url('/oauth/authorize'))
            ->assertJsonPath('token_endpoint', url('/oauth/token'))
            ->assertJsonPath('registration_endpoint', url('/oauth/register'))
            ->assertJsonPath('code_challenge_methods_supported.0', 'S256');
    }

    public function test_authenticated_clients_can_list_tools(): void
    {
        Passport::actingAs(User::factory()->create(), ['mcp:use']);

        $this->postJson('/mcp/tasks', $this->rpc('tools/list'))
            ->assertOk()
            ->assertJsonCount(5, 'result.tools')
            ->assertJsonPath('result.tools.0.name', 'list_tasks');
    }

    public function test_authenticated_clients_manage_tasks_for_the_token_owner(): void
    {
        $user = User::factory()->create();
        Passport::actingAs($user, ['mcp:use']);

        $this->postJson('/mcp/tasks', $this->rpc('tools/call', [
            'name' => 'create_task',
            'arguments' => ['title' => 'Created over MCP', 'deadline' => '2026-12-31'],
        ]))->assertOk();

        $this->assertDatabaseHas('tasks', [
            'user_id' => $user->id,
            'title' => 'Created over MCP',
            'status' => 'open',
        ]);
    }

    public function test_trusted_ai_clients_can_register_themselves(): void
    {
        $redirects = [
            self::REDIRECT_URI,
            'http://localhost:8123/callback',
            'http://127.0.0.1:3000/callback',
            'cursor://anysphere.cursor-retrieval/oauth/callback',
        ];

        foreach ($redirects as $redirect) {
            $this->postJson('/oauth/register', [
                'client_name' => 'Assistant',
                'redirect_uris' => [$redirect],
            ])
                ->assertCreated()
                ->assertJsonPath('token_endpoint_auth_method', 'none')
                ->assertJsonPath('scope', 'mcp:use');
        }

        $this->assertDatabaseCount('oauth_clients', count($redirects));
    }

    public function test_unknown_redirect_domains_cannot_register(): void
    {
        $this->postJson('/oauth/register', [
            'client_name' => 'Claude',
            'redirect_uris' => ['https://claude.ai.evil.example/callback'],
        ])
            ->assertStatus(400)
            ->assertJsonPath('error', 'invalid_redirect_uri');

        $this->postJson('/oauth/register', [
            'client_name' => 'Claude',
            'redirect_uris' => ['myapp://callback'],
        ])
            ->assertStatus(400)
            ->assertJsonPath('error', 'invalid_redirect_uri');

        $this->assertDatabaseCount('oauth_clients', 0);
    }

    public function test_guests_are_sent_to_login_before_authorizing(): void
    {
        $this->useTemporaryPassportKeys();
        $client = $this->registerClient();

        $this->get('/oauth/authorize?'.http_build_query($this->authorizationParameters($client)))
            ->assertRedirect(route('login'));
    }

    public function test_signed_in_users_see_the_consent_screen(): void
    {
        $this->useTemporaryPassportKeys();
        $client = $this->registerClient();

        $this->actingAs(User::factory()->create())
            ->get('/oauth/authorize?'.http_build_query($this->authorizationParameters($client)))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('Mcp/Authorize')
                ->where('client.id', $client->getKey())
                ->where('client.name', 'Claude')
                ->has('authToken')
                ->has('csrfToken'));
    }

    public function test_approving_redirects_back_to_the_client_with_a_code(): void
    {
        $this->useTemporaryPassportKeys();
        $client = $this->registerClient();
        $user = User::factory()->create();

        $page = $this->actingAs($user)
            ->get('/oauth/authorize?'.http_build_query($this->authorizationParameters($client)))
            ->assertOk();

        $authToken = $page->viewData('page')['props']['authToken'];

        $response = $this->actingAs($user)->post('/oauth/authorize', [
            'state' => '',
            'client_id' => $client->getKey(),
            'auth_token' => $authToken,
        ]);

        $response->assertRedirectContains(self::REDIRECT_URI.'?code=');
        $this->assertStringContainsString('state=xyz', $response->headers->get('Location'));
    }

    public function test_denying_redirects_back_to_the_client_with_an_error(): void
    {
        $this->useTemporaryPassportKeys();
        $client = $this->registerClient();
        $user = User::factory()->create();

        $page = $this->actingAs($user)
            ->get('/oauth/authorize?'.http_build_query($this->authorizationParameters($client)))
            ->assertOk();

        $authToken = $page->viewData('page')['props']['authToken'];

        $response = $this->actingAs($user)->delete('/oauth/authorize', [
            'state' => '',
            'client_id' => $client->getKey(),
            'auth_token' => $authToken,
        ]);

        $response->assertRedirectContains('error=access_denied');
        $this->assertStringNotContainsString('code=', $response->headers->get('Location'));
    }

    /**
     * @param  array<string, mixed>  $params
     * @return array<string, mixed>
     */
    private function rpc(string $method, array $params = []): array
    {
        return [
            'jsonrpc' => '2.0',
            'id' => 1,
            'method' => $method,
            'params' => (object) $params,
        ];
    }

    private function registerClient(): Client
    {
        return app(ClientRepository::class)->createAuthorizationCodeGrantClient(
            name: 'Claude',
            redirectUris: [self::REDIRECT_URI],
            confidential: false,
        );
    }

    /**
     * @return array<string, string>
     */
    private function authorizationParameters(Client $client): array
    {
        return [
            'client_id' => (string) $client->getKey(),
            'redirect_uri' => self::REDIRECT_URI,
            'response_type' => 'code',
            'scope' => 'mcp:use',
            'state' => 'xyz',
            'code_challenge' => rtrim(strtr(base64_encode(hash('sha256', 'verifier', true)), '+/', '-_'), '='),
            'code_challenge_method' => 'S256',
        ];
    }

    /**
     * Keep the developer's real Passport keys out of the test run.
     */
    private function useTemporaryPassportKeys(): void
    {
        $this->passportKeyPath = storage_path('framework/testing/passport-'.uniqid());
        File::ensureDirectoryExists($this->passportKeyPath);

        Passport::loadKeysFrom($this->passportKeyPath);
        Artisan::call('passport:keys', ['--force' => true]);
    }
}
