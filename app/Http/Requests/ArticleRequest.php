<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;

class ArticleRequest extends FormRequest
{
    public function authorize(): bool
    {
        return (int) $this->user()?->role === 7;
    }

    public function rules(): array
    {
        $articleId = $this->route('article')?->id;

        return [
            'slug' => [
                'required',
                'string',
                'max:160',
                'alpha_dash:ascii',
                Rule::unique('articles', 'slug')->ignore($articleId),
            ],
            'title' => ['required', 'string', 'max:180'],
            'excerpt' => ['required', 'string', 'max:900'],
            'body' => ['required', 'string', 'max:30000'],
            'category' => ['nullable', 'string', 'max:80'],
            'cover' => ['nullable', 'image', 'max:10240'],
            'cover_data' => ['nullable', 'string', $this->base64ImageRule()],
            'cover_filename' => ['nullable', 'string', 'max:180'],
            'published_at' => ['nullable', 'date'],
            'reading_time' => ['nullable', 'integer', 'min:1', 'max:120'],
            'is_published' => ['boolean'],
            'sort_order' => ['nullable', 'integer', 'min:0', 'max:9999'],
        ];
    }

    protected function prepareForValidation(): void
    {
        $title = (string) $this->input('title');
        $slug = (string) $this->input('slug');

        $this->merge([
            'slug' => Str::slug($slug ?: $title),
            'is_published' => $this->boolean('is_published'),
            'reading_time' => $this->input('reading_time') === null ? 5 : $this->input('reading_time'),
            'sort_order' => $this->input('sort_order') === null ? 0 : $this->input('sort_order'),
        ]);
    }

    private function base64ImageRule(): \Closure
    {
        return function (string $attribute, mixed $value, \Closure $fail): void {
            if (! is_string($value) || ! preg_match('/^data:image\/(jpe?g|png|webp);base64,/', $value)) {
                $fail('The cover must be a JPG, PNG, or WebP image.');

                return;
            }

            $encoded = substr($value, strpos($value, ',') + 1);
            $decoded = base64_decode($encoded, true);

            if ($decoded === false) {
                $fail('The cover image could not be decoded.');

                return;
            }

            if (strlen($decoded) > 10 * 1024 * 1024) {
                $fail('The cover image must not be larger than 10 MB.');
            }
        };
    }
}
