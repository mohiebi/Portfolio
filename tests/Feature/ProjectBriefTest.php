<?php

namespace Tests\Feature;

use App\Models\ProjectBrief;
use App\Models\User;
use App\Notifications\ProjectBriefSubmitted;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Exceptions;
use Illuminate\Support\Facades\Notification;
use Illuminate\Support\Facades\Storage;
use Inertia\Testing\AssertableInertia as Assert;
use Mockery;
use PHPUnit\Framework\Attributes\DataProvider;
use Resend\Laravel\Facades\Resend;
use RuntimeException;
use Tests\TestCase;

class ProjectBriefTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        Storage::fake('local');
    }

    public function test_guest_can_view_the_brief_page(): void
    {
        $this->get('/brief')
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page->component('Brief/Create'));
    }

    public function test_guest_can_submit_a_full_brief(): void
    {
        $this->post('/brief', $this->briefPayload())
            ->assertSessionHasNoErrors()
            ->assertRedirect()
            ->assertSessionHas('success');

        $brief = ProjectBrief::firstOrFail();

        $this->assertSame('Anna Müller', $brief->name);
        $this->assertSame('anna@studio-mueller.de', $brief->email);
        $this->assertSame('https://studio-mueller.de', $brief->website_url);
        $this->assertSame('redesign', $brief->project_type);
        $this->assertSame(['leads', 'credibility'], $brief->goals);
        $this->assertSame(['home', 'about', 'contact'], $brief->pages);
        $this->assertSame(['en', 'fa'], $brief->languages);
        $this->assertSame(['minimal', 'warm'], $brief->styles);
        $this->assertSame([['url' => 'https://linear.app', 'note' => 'Clean layout']], $brief->liked_sites);
        $this->assertSame('6k_10k', $brief->budget);
        $this->assertSame('1_2_months', $brief->timeline);
        $this->assertSame('phone', $brief->preferred_contact);
        $this->assertSame('+49 151 2345 6789', $brief->phone);
        $this->assertSame('en', $brief->locale);
        $this->assertNotNull($brief->consented_at);
        $this->assertFalse($brief->isReviewed());
    }

    public function test_a_brief_with_only_the_required_answers_is_accepted(): void
    {
        $this->post('/brief', $this->requiredOnlyPayload())
            ->assertSessionHasNoErrors()
            ->assertSessionHas('success');

        $brief = ProjectBrief::firstOrFail();

        $this->assertSame([], $brief->pages);
        $this->assertSame([], $brief->features);
        $this->assertSame([], $brief->languages);
        $this->assertSame([], $brief->brand_assets);
        $this->assertSame([], $brief->liked_sites);
        $this->assertSame([], $brief->attachments);
        $this->assertNull($brief->company);
        $this->assertNull($brief->phone);
    }

    public function test_empty_reference_site_rows_are_dropped(): void
    {
        $this->post('/brief', $this->briefPayload([
            'liked_sites' => [
                ['url' => 'linear.app', 'note' => 'Smooth'],
                ['url' => '', 'note' => ''],
            ],
        ]))->assertSessionHasNoErrors();

        $this->assertSame(
            [['url' => 'https://linear.app', 'note' => 'Smooth']],
            ProjectBrief::firstOrFail()->liked_sites,
        );
    }

    public function test_brand_files_are_stored_privately_under_the_brief_folder(): void
    {
        $this->post('/brief', $this->briefPayload([
            'attachments' => [
                UploadedFile::fake()->image('logo.png', 400, 400),
                UploadedFile::fake()->create('brand-guide.pdf', 200, 'application/pdf'),
                UploadedFile::fake()->createWithContent('mark.svg', '<svg xmlns="http://www.w3.org/2000/svg" width="10" height="10"></svg>'),
            ],
        ]))->assertSessionHasNoErrors();

        $brief = ProjectBrief::firstOrFail();

        $this->assertCount(3, $brief->attachments);
        $this->assertSame('logo.png', $brief->attachments[0]['name']);

        foreach ($brief->attachments as $file) {
            $this->assertStringStartsWith("briefs/{$brief->id}/", $file['path']);
            Storage::disk('local')->assertExists($file['path']);
        }
    }

    public function test_admins_are_notified_and_regular_users_are_not(): void
    {
        Notification::fake();
        $admin = User::factory()->create(['role' => 7]);
        $member = User::factory()->create(['role' => 0]);

        $this->post('/brief', $this->briefPayload())->assertSessionHasNoErrors();

        Notification::assertSentTo(
            $admin,
            ProjectBriefSubmitted::class,
            fn (ProjectBriefSubmitted $notification, array $channels) => in_array('database', $channels, true),
        );
        Notification::assertNotSentTo($member, ProjectBriefSubmitted::class);
    }

    public function test_a_failing_owner_email_does_not_break_the_submission(): void
    {
        $admin = User::factory()->create(['role' => 7]);
        $emails = Mockery::mock();
        $emails->shouldReceive('send')->andThrow(new RuntimeException('Resend is down'));
        Resend::shouldReceive('emails')->andReturn($emails);
        Exceptions::fake();

        $this->post('/brief', $this->briefPayload())
            ->assertSessionHasNoErrors()
            ->assertSessionHas('success');

        $this->assertSame(1, ProjectBrief::count());
        $this->assertSame(1, $admin->notifications()->count());
        Exceptions::assertReported(RuntimeException::class);
    }

    public function test_a_filled_honeypot_stores_nothing_and_notifies_nobody(): void
    {
        Notification::fake();
        User::factory()->create(['role' => 7]);

        $this->post('/brief', $this->briefPayload(['nickname' => 'I am a bot']))
            ->assertSessionHasNoErrors()
            ->assertSessionHas('success');

        $this->assertSame(0, ProjectBrief::count());
        Notification::assertNothingSent();
    }

    public function test_submissions_are_rate_limited_per_ip(): void
    {
        for ($attempt = 0; $attempt < 10; $attempt++) {
            $this->post('/brief', [])->assertSessionHasErrors();
        }

        $this->post('/brief', $this->briefPayload())->assertStatus(429);

        $this->assertSame(0, ProjectBrief::count());
    }

    public function test_every_required_answer_is_validated(): void
    {
        $this->post('/brief', [])
            ->assertSessionHasErrors([
                'name',
                'email',
                'business_description',
                'project_type',
                'goals',
                'audience',
                'styles',
                'budget',
                'timeline',
                'preferred_contact',
                'consent',
            ]);

        $this->assertSame(0, ProjectBrief::count());
    }

    /**
     * @param  array<string, mixed>  $overrides
     */
    #[DataProvider('invalidAnswers')]
    public function test_invalid_answers_are_rejected(array $overrides, string $errorKey): void
    {
        Notification::fake();
        User::factory()->create(['role' => 7]);

        $this->post('/brief', $this->briefPayload($overrides))
            ->assertSessionHasErrors($errorKey);

        $this->assertSame(0, ProjectBrief::count());
        Notification::assertNothingSent();
    }

    /**
     * @return array<string, array{array<string, mixed>, string}>
     */
    public static function invalidAnswers(): array
    {
        $fourGoals = ['leads', 'sell_online', 'bookings', 'credibility'];
        $fourStyles = ['minimal', 'bold', 'premium', 'friendly'];

        return [
            'missing name' => [['name' => ''], 'name'],
            'invalid email' => [['email' => 'not-an-email'], 'email'],
            'too short business description' => [['business_description' => 'short'], 'business_description'],
            'unknown project type' => [['project_type' => 'moon_base'], 'project_type'],
            'no goals' => [['goals' => []], 'goals'],
            'too many goals' => [['goals' => $fourGoals], 'goals'],
            'unknown goal' => [['goals' => ['leads', 'teleport']], 'goals.1'],
            'duplicate goals' => [['goals' => ['leads', 'leads']], 'goals.0'],
            'unknown page' => [['pages' => ['home', 'secret-page']], 'pages.1'],
            'unknown feature' => [['features' => ['time-travel']], 'features.0'],
            'unknown language' => [['languages' => ['klingon']], 'languages.0'],
            'no styles' => [['styles' => []], 'styles'],
            'too many styles' => [['styles' => $fourStyles], 'styles'],
            'unknown colour mode' => [['colour_mode' => 'neon'], 'colour_mode'],
            'unknown budget' => [['budget' => 'a_million'], 'budget'],
            'unknown timeline' => [['timeline' => 'yesterday'], 'timeline'],
            'unknown contact method' => [['preferred_contact' => 'pigeon'], 'preferred_contact'],
            'invalid website' => [['website_url' => 'not a url'], 'website_url'],
            'script scheme as reference site' => [
                ['liked_sites' => [['url' => 'javascript:alert(1)', 'note' => 'x']]],
                'liked_sites.0.url',
            ],
            'reference note without url' => [
                ['liked_sites' => [['url' => '', 'note' => 'Nice colours']]],
                'liked_sites.0.url',
            ],
            'too many reference sites' => [
                ['liked_sites' => [
                    ['url' => 'https://a.example', 'note' => ''],
                    ['url' => 'https://b.example', 'note' => ''],
                    ['url' => 'https://c.example', 'note' => ''],
                    ['url' => 'https://d.example', 'note' => ''],
                ]],
                'liked_sites',
            ],
            'phone missing when phone is preferred' => [
                ['preferred_contact' => 'phone', 'phone' => null],
                'phone',
            ],
            'phone with letters' => [['phone' => 'call-me-maybe'], 'phone'],
            'consent declined' => [['consent' => '0'], 'consent'],
        ];
    }

    public function test_disallowed_file_types_are_rejected(): void
    {
        $this->post('/brief', $this->briefPayload([
            'attachments' => [UploadedFile::fake()->create('malware.exe', 10)],
        ]))->assertSessionHasErrors('attachments.0');

        $this->assertSame(0, ProjectBrief::count());
    }

    public function test_oversized_files_are_rejected(): void
    {
        $this->post('/brief', $this->briefPayload([
            'attachments' => [UploadedFile::fake()->create('huge.pdf', 10241, 'application/pdf')],
        ]))->assertSessionHasErrors('attachments.0');

        $this->assertSame(0, ProjectBrief::count());
    }

    public function test_more_than_five_files_are_rejected(): void
    {
        $files = collect(range(1, 6))
            ->map(fn (int $number) => UploadedFile::fake()->image("logo-{$number}.png"))
            ->all();

        $this->post('/brief', $this->briefPayload(['attachments' => $files]))
            ->assertSessionHasErrors('attachments');

        $this->assertSame(0, ProjectBrief::count());
    }

    public function test_admin_can_list_briefs_newest_first(): void
    {
        $admin = User::factory()->create(['role' => 7]);
        ProjectBrief::factory()->create(['name' => 'Older Client', 'created_at' => now()->subDay()]);
        ProjectBrief::factory()->create(['name' => 'Newer Client']);
        ProjectBrief::factory()->reviewed()->create(['name' => 'Reviewed Client', 'created_at' => now()->subDays(2)]);

        $this->actingAs($admin)
            ->get('/dashboard/briefs')
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('Brief/Index')
                ->has('briefs.data', 3)
                ->where('unreviewedCount', 2)
                ->where('briefs.data.0.name', 'Newer Client')
                ->where('briefs.data.1.name', 'Older Client')
                ->where('briefs.data.2.name', 'Reviewed Client')
            );
    }

    public function test_admin_can_view_a_brief_with_attachment_links(): void
    {
        $admin = User::factory()->create(['role' => 7]);
        $brief = ProjectBrief::factory()->withAttachments([
            ['path' => 'briefs/1/logo.pdf', 'name' => 'brand-guide.pdf', 'size' => 2048, 'mime' => 'application/pdf'],
        ])->create(['name' => 'Anna Müller']);

        $this->actingAs($admin)
            ->get("/dashboard/briefs/{$brief->id}")
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('Brief/Show')
                ->where('brief.name', 'Anna Müller')
                ->where('brief.attachments.0.name', 'brand-guide.pdf')
                ->where('brief.attachments.0.url', route('dashboard.briefs.attachments.show', [$brief->id, 0]))
                ->missing('brief.attachments.0.path')
            );
    }

    public function test_admin_can_toggle_a_brief_as_reviewed(): void
    {
        $admin = User::factory()->create(['role' => 7]);
        $brief = ProjectBrief::factory()->create();

        $this->actingAs($admin)->patch("/dashboard/briefs/{$brief->id}/reviewed")->assertRedirect();
        $this->assertTrue($brief->fresh()->isReviewed());

        $this->actingAs($admin)->patch("/dashboard/briefs/{$brief->id}/reviewed")->assertRedirect();
        $this->assertFalse($brief->fresh()->isReviewed());
    }

    public function test_admin_can_download_an_attachment_but_only_as_a_download(): void
    {
        $admin = User::factory()->create(['role' => 7]);
        $brief = ProjectBrief::factory()->create();
        $path = "briefs/{$brief->id}/stored-name.svg";
        Storage::disk('local')->put($path, '<svg xmlns="http://www.w3.org/2000/svg"></svg>');
        $brief->update(['attachments' => [
            ['path' => $path, 'name' => 'mark.svg', 'size' => 50, 'mime' => 'image/svg+xml'],
        ]]);

        $this->actingAs($admin)
            ->get(route('dashboard.briefs.attachments.show', [$brief->id, 0]))
            ->assertOk()
            ->assertDownload('mark.svg');

        $this->actingAs($admin)
            ->get(route('dashboard.briefs.attachments.show', [$brief->id, 5]))
            ->assertNotFound();
    }

    public function test_admin_can_delete_a_brief_and_its_files(): void
    {
        $admin = User::factory()->create(['role' => 7]);
        $brief = ProjectBrief::factory()->create();
        $path = "briefs/{$brief->id}/stored-name.pdf";
        Storage::disk('local')->put($path, 'pdf');

        $this->actingAs($admin)
            ->delete("/dashboard/briefs/{$brief->id}")
            ->assertRedirect('/dashboard/briefs');

        $this->assertModelMissing($brief);
        Storage::disk('local')->assertMissing($path);
    }

    public function test_guests_are_sent_to_login_for_every_admin_brief_route(): void
    {
        $brief = ProjectBrief::factory()->create();

        $this->get('/dashboard/briefs')->assertRedirectContains('login');
        $this->get("/dashboard/briefs/{$brief->id}")->assertRedirectContains('login');
        $this->patch("/dashboard/briefs/{$brief->id}/reviewed")->assertRedirectContains('login');
        $this->get("/dashboard/briefs/{$brief->id}/attachments/0")->assertRedirectContains('login');
        $this->delete("/dashboard/briefs/{$brief->id}")->assertRedirectContains('login');

        $this->assertModelExists($brief);
    }

    public function test_regular_users_cannot_use_the_admin_brief_routes(): void
    {
        $member = User::factory()->create(['role' => 0]);
        $brief = ProjectBrief::factory()->create();

        $this->actingAs($member)->get('/dashboard/briefs')->assertForbidden();
        $this->actingAs($member)->get("/dashboard/briefs/{$brief->id}")->assertForbidden();
        $this->actingAs($member)->patch("/dashboard/briefs/{$brief->id}/reviewed")->assertForbidden();
        $this->actingAs($member)->get("/dashboard/briefs/{$brief->id}/attachments/0")->assertForbidden();
        $this->actingAs($member)->delete("/dashboard/briefs/{$brief->id}")->assertForbidden();

        $this->assertModelExists($brief);
        $this->assertFalse($brief->fresh()->isReviewed());
    }

    public function test_notification_payloads_point_to_the_brief(): void
    {
        $admin = User::factory()->create(['role' => 7, 'email' => 'owner@example.com']);
        $brief = ProjectBrief::factory()->create([
            'name' => 'Anna Müller',
            'email' => 'anna@studio-mueller.de',
            'project_type' => 'redesign',
            'budget' => '6k_10k',
        ]);

        $notification = new ProjectBriefSubmitted($brief);

        $this->assertSame([
            'brief_id' => $brief->id,
            'name' => 'Anna Müller',
            'company' => $brief->company,
            'project_type' => 'redesign',
            'budget' => '6k_10k',
            'url' => "/dashboard/briefs/{$brief->id}",
            'message' => 'New project brief from Anna Müller',
        ], $notification->toArray($admin));

        $email = $notification->toResend($admin);

        $this->assertSame(['owner@example.com'], $email['to']);
        $this->assertSame(['anna@studio-mueller.de'], $email['reply_to']);
        $this->assertSame('New project brief: Anna Müller', $email['subject']);
        $this->assertStringContainsString('Anna Müller', $email['html']);
        $this->assertStringContainsString('Redesign of an existing site', $email['html']);
        $this->assertStringContainsString(url("/dashboard/briefs/{$brief->id}"), $email['html']);
    }

    /**
     * @param  array<string, mixed>  $overrides
     * @return array<string, mixed>
     */
    private function briefPayload(array $overrides = []): array
    {
        return [
            'name' => 'Anna Müller',
            'email' => 'anna@studio-mueller.de',
            'company' => 'Studio Müller Interiors',
            'website_url' => 'studio-mueller.de',
            'business_description' => 'We design and furnish interiors for small cafes and boutiques in Berlin.',
            'project_type' => 'redesign',
            'goals' => ['leads', 'credibility'],
            'audience' => 'Cafe owners aged 30 to 50 opening their first or second location.',
            'primary_action' => 'Book a free 20-minute consultation call',
            'competitors' => 'interior-berlin.de looks premium but is hard to navigate',
            'pages' => ['home', 'about', 'contact'],
            'features' => ['forms', 'analytics_seo'],
            'extra_requirements' => 'Sync bookings with Google Calendar.',
            'languages' => ['en', 'fa'],
            'content_readiness' => 'partial',
            'domain_status' => 'both',
            'brand_assets' => ['logo', 'palette'],
            'styles' => ['minimal', 'warm'],
            'brand_words' => 'calm, crafted, trustworthy',
            'colour_preferences' => 'Deep green and warm sand',
            'colour_mode' => 'dark',
            'typography' => 'sans',
            'liked_sites' => [['url' => 'https://linear.app', 'note' => 'Clean layout']],
            'disliked_sites' => 'Cluttered pages with lots of pop-ups',
            'budget' => '6k_10k',
            'timeline' => '1_2_months',
            'deadline_note' => 'Grand opening on 15 March',
            'support' => 'yes',
            'preferred_contact' => 'phone',
            'phone' => '+49 151 2345 6789',
            'notes' => 'We would love to see a first concept.',
            'consent' => '1',
            ...$overrides,
        ];
    }

    /**
     * @return array<string, mixed>
     */
    private function requiredOnlyPayload(): array
    {
        return [
            'name' => 'Anna Müller',
            'email' => 'anna@studio-mueller.de',
            'business_description' => 'We design and furnish interiors for small cafes.',
            'project_type' => 'new_site',
            'goals' => ['leads'],
            'audience' => 'Cafe owners opening their first location.',
            'styles' => ['minimal'],
            'budget' => 'unsure',
            'timeline' => 'flexible',
            'preferred_contact' => 'email',
            'consent' => '1',
        ];
    }
}
