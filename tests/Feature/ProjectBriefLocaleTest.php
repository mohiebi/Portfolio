<?php

namespace Tests\Feature;

use App\Http\Requests\StoreProjectBriefRequest;
use App\Models\ProjectBrief;
use App\Models\User;
use App\Notifications\ProjectBriefSubmitted;
use App\Support\BriefOptions;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Lang;
use Illuminate\Support\Facades\Notification;
use Illuminate\Support\Facades\Storage;
use Inertia\Testing\AssertableInertia as Assert;
use PHPUnit\Framework\Attributes\DataProvider;
use Tests\TestCase;

class ProjectBriefLocaleTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        Storage::fake('local');
        Notification::fake();
    }

    /**
     * @return array<string, array{string}>
     */
    public static function translatedLocales(): array
    {
        return [
            'Persian' => ['fa'],
            'Turkish' => ['tr'],
            'German' => ['de'],
        ];
    }

    #[DataProvider('translatedLocales')]
    public function test_each_language_has_its_own_brief_page(string $locale): void
    {
        $this->get("/brief/{$locale}")
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('Brief/Create')
                ->where('locale', $locale)
            );
    }

    public function test_the_plain_brief_page_is_english(): void
    {
        $this->get('/brief')
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('Brief/Create')
                ->where('locale', 'en')
            );
    }

    public function test_unknown_languages_are_not_found(): void
    {
        $this->get('/brief/nl')->assertNotFound();
        $this->get('/brief/xx')->assertNotFound();
        $this->get('/brief/fa/extra')->assertNotFound();
    }

    public function test_the_english_alias_redirects_to_the_plain_page(): void
    {
        $this->get('/brief/en')->assertRedirect('/brief')->assertStatus(301);
    }

    public function test_the_persian_page_declares_its_language_title_and_alternates(): void
    {
        $base = rtrim((string) config('app.url'), '/');

        $this->get('/brief/fa')
            ->assertOk()
            ->assertSee('<html lang="fa">', false)
            ->assertSee('<title>Mohi - فرم بریف پروژه</title>', false)
            ->assertSee('<link rel="canonical" href="'.$base.'/brief/fa">', false)
            ->assertSee('<meta property="og:locale" content="fa_IR">', false)
            ->assertSee('hreflang="en" href="'.$base.'/brief"', false)
            ->assertSee('hreflang="fa" href="'.$base.'/brief/fa"', false)
            ->assertSee('hreflang="tr" href="'.$base.'/brief/tr"', false)
            ->assertSee('hreflang="de" href="'.$base.'/brief/de"', false)
            ->assertSee('hreflang="x-default" href="'.$base.'/brief"', false);
    }

    public function test_the_german_page_is_not_canonicalised_to_the_site_wide_german_switch(): void
    {
        $base = rtrim((string) config('app.url'), '/');

        $this->get('/brief/de')
            ->assertOk()
            ->assertSee('<html lang="de">', false)
            ->assertSee('<title>Mohi - Projekt-Briefing</title>', false)
            ->assertSee('<link rel="canonical" href="'.$base.'/brief/de">', false)
            ->assertSee('<meta property="og:locale" content="de_DE">', false);
    }

    public function test_the_plain_page_ignores_the_site_wide_language_query(): void
    {
        $base = rtrim((string) config('app.url'), '/');

        $this->get('/brief?lang=de')
            ->assertOk()
            ->assertSee('<html lang="en">', false)
            ->assertSee('<title>Mohi - Project Brief</title>', false)
            ->assertSee('<link rel="canonical" href="'.$base.'/brief">', false);
    }

    public function test_the_sitemap_lists_every_language_version(): void
    {
        $this->get('/sitemap.xml')
            ->assertOk()
            ->assertSee('/brief</loc>', false)
            ->assertSee('/brief/fa</loc>', false)
            ->assertSee('/brief/tr</loc>', false)
            ->assertSee('/brief/de</loc>', false);
    }

    /**
     * @return array<string, array{string, string}>
     */
    public static function storedLocales(): array
    {
        return [
            'Persian' => ['fa', 'fa'],
            'Turkish' => ['tr', 'tr'],
            'German' => ['de', 'de'],
            'English' => ['en', 'en'],
            'unsupported language falls back to English' => ['nl', 'en'],
            'garbage falls back to English' => ['<script>', 'en'],
        ];
    }

    #[DataProvider('storedLocales')]
    public function test_the_language_of_the_form_is_stored_with_the_brief(string $sent, string $expected): void
    {
        $this->post('/brief', [...$this->requiredPayload(), 'locale' => $sent])
            ->assertSessionHasNoErrors();

        $this->assertSame($expected, ProjectBrief::firstOrFail()->locale);
    }

    public function test_a_brief_sent_without_a_language_is_english(): void
    {
        $this->post('/brief', $this->requiredPayload())->assertSessionHasNoErrors();

        $this->assertSame('en', ProjectBrief::firstOrFail()->locale);
    }

    #[DataProvider('translatedLocales')]
    public function test_validation_messages_come_back_in_the_form_language(string $locale): void
    {
        $response = $this->post('/brief', ['locale' => $locale]);

        $expectedRequired = trans('validation.required', [
            'attribute' => trans('brief.attributes', [], $locale)['name'],
        ], $locale);
        $englishRequired = trans('validation.required', ['attribute' => 'name'], 'en');

        $response->assertSessionHasErrors([
            'name' => $expectedRequired,
            'consent' => trans('brief.messages', [], $locale)['consent.accepted'],
        ]);
        $this->assertNotSame($englishRequired, $expectedRequired);
    }

    #[DataProvider('translatedLocales')]
    public function test_the_limit_messages_mention_the_real_limit(string $locale): void
    {
        $this->post('/brief', [
            ...$this->requiredPayload(),
            'locale' => $locale,
            'goals' => ['leads', 'sell_online', 'bookings', 'credibility'],
        ])->assertSessionHasErrors(['goals']);

        $message = session('errors')->first('goals');

        $this->assertStringContainsString((string) BriefOptions::MAX_GOALS, $message);
        $this->assertStringNotContainsString(':max_goals', $message);
    }

    #[DataProvider('translatedLocales')]
    public function test_the_thank_you_message_follows_the_form_language(string $locale): void
    {
        $this->post('/brief', [...$this->requiredPayload(), 'locale' => $locale])
            ->assertSessionHas('success', trans('brief.thank_you', [], $locale));
    }

    public function test_the_default_validation_language_is_english(): void
    {
        $this->post('/brief', [])
            ->assertSessionHasErrors([
                'consent' => 'Please confirm that I may store your answers to reply to you.',
            ]);
    }

    public function test_persian_digits_in_a_phone_number_are_accepted_and_stored_as_plain_digits(): void
    {
        $this->post('/brief', [
            ...$this->requiredPayload(),
            'locale' => 'fa',
            'preferred_contact' => 'phone',
            'phone' => '۰۹۱۲ ۳۴۵ ۶۷۸۹',
        ])->assertSessionHasNoErrors();

        $this->assertSame('0912 345 6789', ProjectBrief::firstOrFail()->phone);
    }

    public function test_arabic_indic_digits_in_a_phone_number_are_accepted_too(): void
    {
        $this->post('/brief', [
            ...$this->requiredPayload(),
            'preferred_contact' => 'phone',
            'phone' => '+٩٨ ٩١٢ ٣٤٥ ٦٧٨٩',
        ])->assertSessionHasNoErrors();

        $this->assertSame('+98 912 345 6789', ProjectBrief::firstOrFail()->phone);
    }

    public function test_a_phone_number_with_letters_is_still_rejected_in_persian(): void
    {
        $this->post('/brief', [
            ...$this->requiredPayload(),
            'locale' => 'fa',
            'preferred_contact' => 'phone',
            'phone' => 'زنگ بزن',
        ])->assertSessionHasErrors('phone');

        $this->assertSame(0, ProjectBrief::count());
    }

    public function test_the_owner_notification_names_the_language_the_client_used(): void
    {
        $brief = ProjectBrief::factory()->create(['locale' => 'fa']);
        $admin = User::factory()->create(['role' => 7]);

        $html = (new ProjectBriefSubmitted($brief))->toResend($admin)['html'];

        $this->assertSame('Persian', $brief->localeLabel());
        $this->assertStringContainsString('Language', $html);
        $this->assertStringContainsString('Persian', $html);
    }

    public function test_the_admin_list_exposes_the_language_of_each_brief(): void
    {
        $admin = User::factory()->create(['role' => 7]);
        ProjectBrief::factory()->create(['locale' => 'tr']);

        $this->actingAs($admin)
            ->get('/dashboard/briefs')
            ->assertInertia(fn (Assert $page) => $page
                ->component('Brief/Index')
                ->where('briefs.data.0.locale', 'tr')
            );
    }

    public function test_every_language_translates_every_field_name_and_message(): void
    {
        $fields = collect(array_keys((new StoreProjectBriefRequest)->rules()))
            ->reject(fn (string $key) => $key === BriefOptions::SPAM_FIELD)
            ->sort()
            ->values()
            ->all();
        $messageKeys = collect(array_keys(trans('brief.messages', [], 'en')))->sort()->values()->all();

        foreach (BriefOptions::locales() as $locale) {
            $attributes = trans('brief.attributes', [], $locale);
            $messages = trans('brief.messages', [], $locale);

            $this->assertSame($fields, collect(array_keys($attributes))->sort()->values()->all(), "Attributes differ for {$locale}");
            $this->assertSame($messageKeys, collect(array_keys($messages))->sort()->values()->all(), "Messages differ for {$locale}");

            foreach ([...$attributes, ...$messages, trans('brief.thank_you', [], $locale)] as $line) {
                $this->assertNotSame('', trim($line), "Empty translation for {$locale}");
            }

            foreach (['goals.max' => ':max_goals', 'styles.max' => ':max_styles'] as $key => $placeholder) {
                $this->assertStringContainsString($placeholder, $messages[$key], "{$key} lost its placeholder for {$locale}");
            }
        }
    }

    #[DataProvider('translatedLocales')]
    public function test_every_validation_rule_the_brief_uses_is_translated(string $locale): void
    {
        foreach (['accepted', 'array', 'distinct', 'email', 'file', 'in', 'max', 'mimes', 'min', 'regex', 'required', 'required_if', 'string', 'url'] as $rule) {
            $this->assertTrue(Lang::hasForLocale("validation.{$rule}", $locale), "validation.{$rule} is missing for {$locale}");
        }
    }

    /**
     * @return array<string, mixed>
     */
    private function requiredPayload(): array
    {
        return [
            'name' => 'Sara Ahmadi',
            'email' => 'sara@example.test',
            'business_description' => 'We design interiors for small cafes in Tehran.',
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
