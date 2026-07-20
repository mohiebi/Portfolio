<?php

namespace Tests\Feature;

use App\Models\CaseStudy;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Schema;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class PortfolioRefocusTest extends TestCase
{
    use RefreshDatabase;

    public function test_case_studies_include_new_entries_in_the_requested_order(): void
    {
        $caseStudies = CaseStudy::published()->ordered()->get();

        $this->assertCount(6, $caseStudies);
        $this->assertSame('mahdieh-design-portfolio-cms', $caseStudies->first()->slug);
        $this->assertSame('real-estate-marketplace', $caseStudies->last()->slug);

        $mahdieh = $caseStudies->firstWhere('slug', 'mahdieh-design-portfolio-cms');
        $realEstate = $caseStudies->firstWhere('slug', 'real-estate-marketplace');

        $this->assertSame('/img/case-studies/mahdieh-design-dashboard.png', $mahdieh->featured_image_url);
        $this->assertSame('https://mahdiehdesign.com', $mahdieh->project_url);
        $this->assertSame('3', $mahdieh->translations['de']['impact'][0]['value']);
        $this->assertSame('/img/case-studies/real-estate-marketplace.svg', $realEstate->featured_image_url);
        $this->assertSame('https://github.com/mohiebi/Laravel-Vue-RealEstate', $realEstate->repository_url);
        $this->assertSame('Offentlich', $realEstate->translations['de']['impact'][3]['value']);
    }

    public function test_homepage_receives_only_the_first_four_case_studies(): void
    {
        $this->get('/')
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('Portfolio/Home')
                ->has('caseStudies', 4)
                ->where('caseStudies.0.slug', 'mahdieh-design-portfolio-cms')
                ->where('caseStudies.3.slug', 'proace-ai-crm')
            );
    }

    public function test_products_page_replaces_projects_page(): void
    {
        $this->get('/products')
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('Products/Index')
            )
            ->assertSee('TaskManager')
            ->assertSee('CashPilot')
            ->assertSee('AI Routine Coach')
            ->assertDontSee('BookReview')
            ->assertDontSee('Job Board')
            ->assertDontSee('Mahdieh Design');

        $this->get('/projects')
            ->assertRedirect('/products');
    }

    public function test_removed_demo_routes_are_not_available(): void
    {
        $this->get('/books')->assertNotFound();
        $this->get('/jobs')->assertNotFound();
        $this->get('/listing')->assertNotFound();
        $this->get('/realtor/listing')->assertNotFound();
    }

    public function test_removed_demo_tables_are_dropped_but_notifications_remain(): void
    {
        foreach (['reviews', 'books', 'job_applications', 'jobs', 'employers', 'offers', 'listing_images', 'listings'] as $table) {
            $this->assertFalse(Schema::hasTable($table), "{$table} should be dropped.");
        }

        $this->assertTrue(Schema::hasTable('notifications'));
    }

    public function test_admin_can_upload_replace_and_remove_a_case_study_featured_image(): void
    {
        $admin = User::factory()->create(['role' => 7]);

        $this->actingAs($admin)
            ->post('/dashboard/case-studies', [
                ...$this->caseStudyPayload([
                    'slug' => 'media-case-study',
                    'title' => 'Media Case Study',
                ]),
                'featured_image' => UploadedFile::fake()->image('cover.jpg', 1200, 800),
            ])
            ->assertSessionHasNoErrors()
            ->assertRedirect('/dashboard/case-studies');

        $caseStudy = CaseStudy::where('slug', 'media-case-study')->firstOrFail();
        $firstPath = public_path($caseStudy->featured_image_path);
        $this->assertFileExists($firstPath);

        $this->actingAs($admin)
            ->post("/dashboard/case-studies/{$caseStudy->id}", [
                ...$this->caseStudyPayload([
                    'slug' => 'media-case-study',
                    'title' => 'Media Case Study',
                ]),
                '_method' => 'put',
                'featured_image' => UploadedFile::fake()->image('replacement.webp', 1200, 800),
            ])
            ->assertSessionHasNoErrors()
            ->assertRedirect('/dashboard/case-studies');

        $caseStudy->refresh();
        $replacementPath = public_path($caseStudy->featured_image_path);
        $this->assertFileDoesNotExist($firstPath);
        $this->assertFileExists($replacementPath);

        $this->actingAs($admin)
            ->post("/dashboard/case-studies/{$caseStudy->id}", [
                ...$this->caseStudyPayload([
                    'slug' => 'media-case-study',
                    'title' => 'Media Case Study',
                ]),
                '_method' => 'put',
                'remove_featured_image' => '1',
            ])
            ->assertSessionHasNoErrors()
            ->assertRedirect('/dashboard/case-studies');

        $caseStudy->refresh();
        $this->assertNull($caseStudy->featured_image_path);
        $this->assertFileDoesNotExist($replacementPath);
    }

    private function caseStudyPayload(array $overrides = []): array
    {
        return [
            'slug' => 'test-case-study',
            'title' => 'Test Case Study',
            'company' => 'Test Company',
            'role' => 'Full-Stack Developer',
            'period' => '2026',
            'location' => 'Remote',
            'tag' => 'Laravel / React',
            'summary' => 'A test case study summary.',
            'accent' => 'from-emerald-400/30 to-teal-500/10',
            'cover' => 'web',
            'project_url' => 'https://example.com',
            'repository_url' => 'https://github.com/mohiebi/example',
            'problem' => 'A test problem.',
            'approach' => ['Build the system'],
            'impact' => [
                ['label' => 'Result', 'value' => '1'],
            ],
            'stack' => ['Laravel', 'React'],
            'highlights' => ['A useful highlight'],
            'is_published' => true,
            'sort_order' => 99,
            ...$overrides,
        ];
    }
}
