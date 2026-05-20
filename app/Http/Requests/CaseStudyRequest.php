<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use Illuminate\Support\Str;

class CaseStudyRequest extends FormRequest
{
    public function authorize(): bool
    {
        return (int) $this->user()?->role === 7;
    }

    public function rules(): array
    {
        $caseStudyId = $this->route('caseStudy')?->id;

        return [
            'slug' => [
                'required',
                'string',
                'max:160',
                'alpha_dash:ascii',
                Rule::unique('case_studies', 'slug')->ignore($caseStudyId),
            ],
            'title' => ['required', 'string', 'max:180'],
            'company' => ['nullable', 'string', 'max:120'],
            'role' => ['nullable', 'string', 'max:140'],
            'period' => ['nullable', 'string', 'max:120'],
            'location' => ['nullable', 'string', 'max:120'],
            'tag' => ['nullable', 'string', 'max:140'],
            'summary' => ['required', 'string', 'max:1200'],
            'accent' => ['required', 'string', 'max:120'],
            'cover' => ['required', Rule::in(['web3', 'modernize', 'ai', 'web'])],
            'problem' => ['nullable', 'string', 'max:4000'],
            'approach' => ['nullable', 'array'],
            'approach.*' => ['string', 'max:700'],
            'impact' => ['nullable', 'array'],
            'impact.*.label' => ['required_with:impact', 'string', 'max:80'],
            'impact.*.value' => ['required_with:impact', 'string', 'max:80'],
            'stack' => ['nullable', 'array'],
            'stack.*' => ['string', 'max:80'],
            'highlights' => ['nullable', 'array'],
            'highlights.*' => ['string', 'max:700'],
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
            'sort_order' => $this->input('sort_order') === null ? 0 : $this->input('sort_order'),
        ]);
    }
}
