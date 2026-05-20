<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class RecommendationRequest extends FormRequest
{
    public function authorize(): bool
    {
        return (int) $this->user()?->role === 7;
    }

    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:120'],
            'role' => ['nullable', 'string', 'max:180'],
            'company' => ['nullable', 'string', 'max:120'],
            'relationship' => ['nullable', 'string', 'max:180'],
            'project' => ['nullable', 'string', 'max:120'],
            'image' => ['nullable', 'image', 'max:10240'],
            'image_data' => ['nullable', 'string', $this->base64ImageRule()],
            'image_filename' => ['nullable', 'string', 'max:180'],
            'linkedin_url' => ['nullable', 'url', 'max:255'],
            'body' => ['required', 'string', 'max:4000'],
            'recommended_at' => ['nullable', 'date'],
            'is_published' => ['boolean'],
            'sort_order' => ['nullable', 'integer', 'min:0', 'max:9999'],
        ];
    }

    protected function prepareForValidation(): void
    {
        $this->merge([
            'is_published' => $this->boolean('is_published'),
            'sort_order' => $this->input('sort_order') === null ? 0 : $this->input('sort_order'),
        ]);
    }

    private function base64ImageRule(): \Closure
    {
        return function (string $attribute, mixed $value, \Closure $fail): void {
            if (! is_string($value) || ! preg_match('/^data:image\/(jpe?g|png|webp);base64,/', $value)) {
                $fail('The image must be a JPG, PNG, or WebP image.');

                return;
            }

            $encoded = substr($value, strpos($value, ',') + 1);
            $decoded = base64_decode($encoded, true);

            if ($decoded === false) {
                $fail('The image could not be decoded.');

                return;
            }

            if (strlen($decoded) > 10 * 1024 * 1024) {
                $fail('The image must not be larger than 10 MB.');
            }
        };
    }
}
