<?php

namespace App\Http\Requests;

use App\Support\BriefOptions;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Rules\File;

class StoreProjectBriefRequest extends FormRequest
{
    /**
     * Fields that hold a list of selected option keys.
     *
     * @var list<string>
     */
    private const LIST_FIELDS = [
        'goals',
        'pages',
        'features',
        'languages',
        'brand_assets',
        'styles',
    ];

    public function authorize(): bool
    {
        return true;
    }

    /**
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return [
            // Step 1: about you
            'name' => ['required', 'string', 'max:120'],
            'email' => ['required', 'email', 'max:255'],
            'company' => ['nullable', 'string', 'max:160'],
            'website_url' => ['nullable', 'url:http,https', 'max:255'],
            'business_description' => ['required', 'string', 'min:10', 'max:3000'],

            // Step 2: project and goals
            'project_type' => ['required', Rule::in(BriefOptions::projectTypes())],
            'goals' => ['required', 'array', 'min:1', 'max:'.BriefOptions::MAX_GOALS],
            'goals.*' => ['distinct', Rule::in(BriefOptions::GOALS)],
            'audience' => ['required', 'string', 'min:10', 'max:2000'],
            'primary_action' => ['nullable', 'string', 'max:255'],
            'competitors' => ['nullable', 'string', 'max:2000'],

            // Step 3: scope and content
            'pages' => ['array'],
            'pages.*' => ['distinct', Rule::in(BriefOptions::PAGES)],
            'features' => ['array'],
            'features.*' => ['distinct', Rule::in(BriefOptions::FEATURES)],
            'extra_requirements' => ['nullable', 'string', 'max:2000'],
            'languages' => ['array'],
            'languages.*' => ['distinct', Rule::in(BriefOptions::LANGUAGES)],
            'other_language' => ['nullable', 'string', 'max:120'],
            'content_readiness' => ['nullable', Rule::in(BriefOptions::CONTENT_READINESS)],
            'domain_status' => ['nullable', Rule::in(BriefOptions::DOMAIN_STATUS)],

            // Step 4: brand and design direction
            'brand_assets' => ['array'],
            'brand_assets.*' => ['distinct', Rule::in(BriefOptions::BRAND_ASSETS)],
            'attachments' => ['nullable', 'array', 'max:'.BriefOptions::MAX_ATTACHMENTS],
            'attachments.*' => [
                'file',
                File::types(BriefOptions::ATTACHMENT_TYPES)->max(BriefOptions::MAX_ATTACHMENT_KB),
            ],
            'styles' => ['required', 'array', 'min:1', 'max:'.BriefOptions::MAX_STYLES],
            'styles.*' => ['distinct', Rule::in(BriefOptions::STYLES)],
            'brand_words' => ['nullable', 'string', 'max:255'],
            'colour_preferences' => ['nullable', 'string', 'max:500'],
            'colour_mode' => ['nullable', Rule::in(BriefOptions::COLOUR_MODES)],
            'typography' => ['nullable', Rule::in(BriefOptions::TYPOGRAPHY)],
            'liked_sites' => ['array', 'max:'.BriefOptions::MAX_LIKED_SITES],
            'liked_sites.*.url' => ['required', 'url:http,https', 'max:255'],
            'liked_sites.*.note' => ['nullable', 'string', 'max:500'],
            'disliked_sites' => ['nullable', 'string', 'max:2000'],

            // Step 5: budget, timeline and contact
            'budget' => ['required', Rule::in(BriefOptions::budgets())],
            'timeline' => ['required', Rule::in(BriefOptions::TIMELINES)],
            'deadline_note' => ['nullable', 'string', 'max:255'],
            'support' => ['nullable', Rule::in(BriefOptions::SUPPORT)],
            'preferred_contact' => ['required', Rule::in(BriefOptions::CONTACT_METHODS)],
            'phone' => [
                'nullable',
                'required_if:preferred_contact,phone',
                'string',
                'max:40',
                'regex:/^[0-9+().\-\s]{6,40}$/',
            ],
            'notes' => ['nullable', 'string', 'max:3000'],
            'consent' => ['accepted'],

            // Honeypot: real visitors never see or fill this field.
            BriefOptions::SPAM_FIELD => ['nullable', 'string'],
        ];
    }

    /**
     * @return array<string, string>
     */
    public function attributes(): array
    {
        return [
            'business_description' => 'business description',
            'project_type' => 'project type',
            'website_url' => 'website',
            'audience' => 'ideal customers',
            'primary_action' => 'main visitor action',
            'liked_sites.*.url' => 'reference site URL',
            'liked_sites.*.note' => 'reference site note',
            'preferred_contact' => 'preferred contact method',
            'consent' => 'privacy consent',
            'attachments.*' => 'brand file',
        ];
    }

    /**
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'goals.required' => 'Pick at least one goal.',
            'goals.min' => 'Pick at least one goal.',
            'goals.max' => 'Pick up to '.BriefOptions::MAX_GOALS.' goals.',
            'styles.required' => 'Pick at least one style.',
            'styles.min' => 'Pick at least one style.',
            'styles.max' => 'Pick up to '.BriefOptions::MAX_STYLES.' styles.',
            'phone.required_if' => 'Add a phone number so I can reach you.',
            'consent.accepted' => 'Please confirm that I may store your answers to reply to you.',
        ];
    }

    protected function prepareForValidation(): void
    {
        $lists = [];

        foreach (self::LIST_FIELDS as $field) {
            $lists[$field] = $this->input($field) ?? [];
        }

        $this->merge([
            ...$lists,
            'website_url' => $this->withScheme($this->input('website_url')),
            'liked_sites' => $this->normalisedLikedSites(),
        ]);
    }

    /**
     * Drop empty rows and add https:// to addresses typed without a scheme.
     *
     * @return list<array{url: mixed, note: mixed}>
     */
    private function normalisedLikedSites(): array
    {
        $rows = $this->input('liked_sites');

        if (! is_array($rows)) {
            return [];
        }

        return collect($rows)
            ->filter(fn (mixed $row): bool => is_array($row))
            ->map(fn (array $row): array => [
                'url' => $this->withScheme($row['url'] ?? null),
                'note' => $row['note'] ?? null,
            ])
            ->reject(fn (array $row): bool => blank($row['url']) && blank($row['note']))
            ->values()
            ->all();
    }

    private function withScheme(mixed $url): mixed
    {
        if (! is_string($url) || trim($url) === '') {
            return null;
        }

        $url = trim($url);

        return preg_match('#^https?://#i', $url) === 1 ? $url : 'https://'.$url;
    }
}
