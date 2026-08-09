<?php

namespace Tests\Feature;

use App\Models\Article;
use App\Models\Recommendation;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class PersistentImageStorageTest extends TestCase
{
    use RefreshDatabase;

    public function test_article_covers_are_stored_replaced_and_deleted_on_the_public_disk(): void
    {
        Storage::fake('public');

        $admin = User::factory()->create(['role' => 7]);

        $this->actingAs($admin)
            ->post('/dashboard/articles', [
                ...$this->articlePayload(),
                'cover' => UploadedFile::fake()->image('cover.jpg', 1200, 800),
            ])
            ->assertSessionHasNoErrors()
            ->assertRedirect('/dashboard/articles');

        $article = Article::where('slug', 'persistent-article')->firstOrFail();
        $firstPath = $article->cover_path;

        $this->assertNotNull($firstPath);
        $this->assertStringStartsWith('uploads/articles/', $firstPath);
        Storage::disk('public')->assertExists($firstPath);
        $this->assertSame(Storage::disk('public')->url($firstPath), $article->cover_url);

        $this->actingAs($admin)
            ->post("/dashboard/articles/{$article->id}", [
                ...$this->articlePayload(),
                '_method' => 'put',
                'cover_data' => $this->base64ImageData(),
                'cover_filename' => 'replacement.png',
            ])
            ->assertSessionHasNoErrors()
            ->assertRedirect('/dashboard/articles');

        $article->refresh();
        $replacementPath = $article->cover_path;

        $this->assertNotNull($replacementPath);
        $this->assertNotSame($firstPath, $replacementPath);
        Storage::disk('public')->assertMissing($firstPath);
        Storage::disk('public')->assertExists($replacementPath);

        $this->actingAs($admin)
            ->delete("/dashboard/articles/{$article->id}")
            ->assertRedirect('/dashboard/articles');

        Storage::disk('public')->assertMissing($replacementPath);
    }

    public function test_recommendation_images_are_stored_replaced_and_deleted_on_the_public_disk(): void
    {
        Storage::fake('public');

        $admin = User::factory()->create(['role' => 7]);

        $this->actingAs($admin)
            ->post('/dashboard/recommendations', [
                ...$this->recommendationPayload(),
                'image' => UploadedFile::fake()->image('person.jpg', 600, 600),
            ])
            ->assertSessionHasNoErrors()
            ->assertRedirect('/dashboard/recommendations');

        $recommendation = Recommendation::where('name', 'Persistent Person')->firstOrFail();
        $firstPath = $recommendation->image_path;

        $this->assertNotNull($firstPath);
        $this->assertStringStartsWith('uploads/recommendations/', $firstPath);
        Storage::disk('public')->assertExists($firstPath);
        $this->assertSame(Storage::disk('public')->url($firstPath), $recommendation->image_url);

        $this->actingAs($admin)
            ->post("/dashboard/recommendations/{$recommendation->id}", [
                ...$this->recommendationPayload(),
                '_method' => 'put',
                'image_data' => $this->base64ImageData(),
                'image_filename' => 'replacement.png',
            ])
            ->assertSessionHasNoErrors()
            ->assertRedirect('/dashboard/recommendations');

        $recommendation->refresh();
        $replacementPath = $recommendation->image_path;

        $this->assertNotNull($replacementPath);
        $this->assertNotSame($firstPath, $replacementPath);
        Storage::disk('public')->assertMissing($firstPath);
        Storage::disk('public')->assertExists($replacementPath);

        $this->actingAs($admin)
            ->delete("/dashboard/recommendations/{$recommendation->id}")
            ->assertRedirect('/dashboard/recommendations');

        Storage::disk('public')->assertMissing($replacementPath);
    }

    /**
     * @return array<string, mixed>
     */
    private function articlePayload(): array
    {
        return [
            'slug' => 'persistent-article',
            'title' => 'Persistent Article',
            'excerpt' => 'An article used to verify persistent cover storage.',
            'body' => 'The article body.',
            'category' => 'Engineering',
            'published_at' => '2026-08-09',
            'reading_time' => 5,
            'is_published' => true,
            'sort_order' => 10,
        ];
    }

    /**
     * @return array<string, mixed>
     */
    private function recommendationPayload(): array
    {
        return [
            'name' => 'Persistent Person',
            'role' => 'Engineering Manager',
            'company' => 'Example Company',
            'body' => 'A recommendation used to verify persistent image storage.',
            'recommended_at' => '2026-08-09',
            'is_published' => true,
            'sort_order' => 10,
        ];
    }

    private function base64ImageData(): string
    {
        return 'data:image/png;base64,'.base64_encode('test image contents');
    }
}
