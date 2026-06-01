<?php

namespace Tests\Feature;

use App\Models\Service;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class ServiceTest extends TestCase
{
    use RefreshDatabase;

    public function test_public_services_index_shows_published_services(): void
    {
        Service::create($this->servicePayload([
            'slug' => 'published-service',
            'name' => 'Published Service',
            'is_published' => true,
        ]));
        Service::create($this->servicePayload([
            'slug' => 'draft-service',
            'name' => 'Draft Service',
            'is_published' => false,
        ]));

        $this->get('/services')
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('Services/PublicIndex')
            )
            ->assertSee('Published Service')
            ->assertDontSee('Draft Service');
    }

    public function test_public_service_detail_resolves_by_slug(): void
    {
        $service = Service::create($this->servicePayload([
            'slug' => 'custom-service',
            'name' => 'Custom Service',
        ]));

        $this->get("/services/{$service->slug}")
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('Services/PublicShow')
                ->where('service.slug', 'custom-service')
                ->where('service.name', 'Custom Service')
            );
    }

    public function test_draft_service_detail_returns_not_found(): void
    {
        $service = Service::create($this->servicePayload([
            'slug' => 'draft-only',
            'is_published' => false,
        ]));

        $this->get("/services/{$service->slug}")
            ->assertNotFound();
    }

    public function test_admin_can_create_update_and_delete_services(): void
    {
        $admin = User::factory()->create(['role' => 7]);

        $this->actingAs($admin)
            ->post('/dashboard/services', $this->servicePayload([
                'slug' => 'admin-service',
                'name' => 'Admin Service',
                'is_published' => true,
            ]))
            ->assertSessionHasNoErrors()
            ->assertRedirect('/dashboard/services');

        $service = Service::where('slug', 'admin-service')->firstOrFail();
        $this->assertSame('Admin Service', $service->name);

        $this->actingAs($admin)
            ->put("/dashboard/services/{$service->id}", $this->servicePayload([
                'slug' => 'admin-service-updated',
                'name' => 'Admin Service Updated',
                'is_published' => false,
            ]))
            ->assertSessionHasNoErrors()
            ->assertRedirect('/dashboard/services');

        $service->refresh();
        $this->assertSame('admin-service-updated', $service->slug);
        $this->assertFalse($service->is_published);

        $this->actingAs($admin)
            ->delete("/dashboard/services/{$service->id}")
            ->assertRedirect('/dashboard/services');

        $this->assertNull($service->fresh());
    }

    public function test_non_admin_users_cannot_access_service_crud(): void
    {
        $user = User::factory()->create(['role' => 0]);
        $service = Service::firstOrFail();

        $this->actingAs($user)->get('/dashboard/services')->assertForbidden();
        $this->actingAs($user)->get('/dashboard/services/create')->assertForbidden();
        $this->actingAs($user)->post('/dashboard/services', $this->servicePayload())->assertForbidden();
        $this->actingAs($user)->get("/dashboard/services/{$service->id}/edit")->assertForbidden();
        $this->actingAs($user)->put("/dashboard/services/{$service->id}", $this->servicePayload())->assertForbidden();
        $this->actingAs($user)->delete("/dashboard/services/{$service->id}")->assertForbidden();
    }

    private function servicePayload(array $overrides = []): array
    {
        return [
            'slug' => 'test-service',
            'name' => 'Test Service',
            'badge' => null,
            'tagline' => 'Test offer',
            'promise' => 'Build the thing.',
            'investment' => '$1K - $2K',
            'timeline' => '1-2 weeks',
            'outcome' => 'A working result',
            'best_for' => 'Small teams testing the service model.',
            'benefit' => 'A practical service benefit for buyers.',
            'cover' => 'launch',
            'accent' => 'from-emerald-400/25 to-sky-500/10',
            'problem' => 'The problem this service solves.',
            'what_you_get' => 'The concrete deliverables and system outcome.',
            'why_it_matters' => 'Why this work is valuable to the business.',
            'before' => ['Manual process', 'Slow follow-up'],
            'after' => ['Automated process', 'Fast follow-up'],
            'deliverables' => ['Website', 'Analytics'],
            'ai_capabilities' => ['AI-assisted drafts'],
            'bonuses' => [
                ['name' => 'Bonus', 'value' => '$500', 'why' => 'Extra value.'],
            ],
            'guarantees' => [
                ['name' => 'Guarantee', 'detail' => 'A clear delivery promise.'],
            ],
            'is_published' => true,
            'sort_order' => 90,
            ...$overrides,
        ];
    }
}
