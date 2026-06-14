<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;

class ServiceRequest extends FormRequest
{
    public function authorize(): bool
    {
        return (int) $this->user()?->role === 7;
    }

    public function rules(): array
    {
        $serviceId = $this->route('service')?->id;

        return [
            'slug' => [
                'required',
                'string',
                'max:160',
                'alpha_dash:ascii',
                Rule::unique('services', 'slug')->ignore($serviceId),
            ],
            'name' => ['required', 'string', 'max:180'],
            'badge' => ['nullable', 'string', 'max:80'],
            'tagline' => ['required', 'string', 'max:120'],
            'promise' => ['required', 'string', 'max:240'],
            'investment' => ['required', 'string', 'max:80'],
            'timeline' => ['required', 'string', 'max:80'],
            'outcome' => ['required', 'string', 'max:180'],
            'best_for' => ['required', 'string', 'max:1000'],
            'benefit' => ['required', 'string', 'max:1200'],
            'cover' => ['required', Rule::in(['launch', 'operations', 'ai'])],
            'accent' => ['required', 'string', 'max:120'],
            'problem' => ['required', 'string', 'max:4000'],
            'what_you_get' => ['required', 'string', 'max:4000'],
            'why_it_matters' => ['required', 'string', 'max:4000'],
            'before' => ['nullable', 'array'],
            'before.*' => ['string', 'max:180'],
            'after' => ['nullable', 'array'],
            'after.*' => ['string', 'max:180'],
            'deliverables' => ['nullable', 'array'],
            'deliverables.*' => ['string', 'max:220'],
            'ai_capabilities' => ['nullable', 'array'],
            'ai_capabilities.*' => ['string', 'max:220'],
            'bonuses' => ['nullable', 'array'],
            'bonuses.*.name' => ['required_with:bonuses', 'string', 'max:180'],
            'bonuses.*.value' => ['required_with:bonuses', 'string', 'max:80'],
            'bonuses.*.why' => ['required_with:bonuses', 'string', 'max:700'],
            'guarantees' => ['nullable', 'array'],
            'guarantees.*.name' => ['required_with:guarantees', 'string', 'max:180'],
            'guarantees.*.detail' => ['required_with:guarantees', 'string', 'max:700'],
            'sample_projects' => ['nullable', 'array'],
            'sample_projects.*.name' => ['required_with:sample_projects', 'string', 'max:180'],
            'sample_projects.*.slug' => ['nullable', 'string', 'max:180', 'alpha_dash:ascii'],
            'sample_projects.*.url' => ['required_with:sample_projects', 'url', 'max:255'],
            'sample_projects.*.tag' => ['nullable', 'string', 'max:120'],
            'sample_projects.*.summary' => ['required_with:sample_projects', 'string', 'max:1200'],
            'sample_projects.*.outcome' => ['nullable', 'string', 'max:220'],
            'sample_projects.*.preview' => ['nullable', Rule::in(['web', 'design', 'cash', 'tasks', 'routine', 'jobs', 'books', 'realestate'])],
            'sample_projects.*.accent' => ['nullable', 'string', 'max:120'],
            'sample_projects.*.is_published' => ['boolean'],
            'sample_projects.*.sort_order' => ['nullable', 'integer', 'min:0', 'max:9999'],
            'is_published' => ['boolean'],
            'sort_order' => ['nullable', 'integer', 'min:0', 'max:9999'],
        ];
    }

    protected function prepareForValidation(): void
    {
        $name = (string) $this->input('name');
        $slug = (string) $this->input('slug');

        $this->merge([
            'slug' => Str::slug($slug ?: $name),
            'is_published' => $this->boolean('is_published'),
            'sort_order' => $this->input('sort_order') === null ? 0 : $this->input('sort_order'),
        ]);
    }
}
