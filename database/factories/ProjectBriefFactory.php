<?php

namespace Database\Factories;

use App\Models\ProjectBrief;
use App\Support\BriefOptions;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<ProjectBrief>
 */
class ProjectBriefFactory extends Factory
{
    /**
     * Define the default attributes for a project brief.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'name' => fake()->name(),
            'email' => fake()->unique()->safeEmail(),
            'company' => fake()->company(),
            'website_url' => fake()->optional()->url(),
            'business_description' => fake()->paragraph(),
            'project_type' => fake()->randomElement(BriefOptions::projectTypes()),
            'goals' => fake()->randomElements(BriefOptions::GOALS, 2),
            'audience' => fake()->paragraph(),
            'primary_action' => fake()->sentence(6),
            'competitors' => fake()->optional()->sentence(),
            'pages' => fake()->randomElements(BriefOptions::PAGES, 4),
            'features' => fake()->randomElements(BriefOptions::FEATURES, 3),
            'extra_requirements' => fake()->optional()->sentence(),
            'languages' => ['en'],
            'other_language' => null,
            'content_readiness' => fake()->randomElement(BriefOptions::CONTENT_READINESS),
            'domain_status' => fake()->randomElement(BriefOptions::DOMAIN_STATUS),
            'brand_assets' => fake()->randomElements(BriefOptions::BRAND_ASSETS, 2),
            'attachments' => [],
            'styles' => fake()->randomElements(BriefOptions::STYLES, 2),
            'brand_words' => 'calm, crafted, trustworthy',
            'colour_preferences' => 'Deep green and warm sand',
            'colour_mode' => fake()->randomElement(BriefOptions::COLOUR_MODES),
            'typography' => fake()->randomElement(BriefOptions::TYPOGRAPHY),
            'liked_sites' => [
                ['url' => 'https://linear.app', 'note' => 'Clean layout, smooth animations'],
            ],
            'disliked_sites' => fake()->optional()->sentence(),
            'budget' => fake()->randomElement(BriefOptions::budgets()),
            'timeline' => fake()->randomElement(BriefOptions::TIMELINES),
            'deadline_note' => fake()->optional()->sentence(4),
            'support' => fake()->randomElement(BriefOptions::SUPPORT),
            'preferred_contact' => 'email',
            'phone' => null,
            'notes' => fake()->optional()->sentence(),
            'locale' => 'en',
            'consented_at' => now(),
            'reviewed_at' => null,
        ];
    }

    public function reviewed(): static
    {
        return $this->state(fn () => ['reviewed_at' => now()]);
    }

    /**
     * @param  list<array{path: string, name: string, size: int, mime: string}>  $attachments
     */
    public function withAttachments(array $attachments): static
    {
        return $this->state(fn () => ['attachments' => $attachments]);
    }
}
