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

            'locale' => ['required', Rule::in(BriefOptions::locales())],

            // Honeypot: real visitors never see or fill this field.
            BriefOptions::SPAM_FIELD => ['nullable', 'string'],
        ];
    }

    /**
     * Field names used in error messages, in the language of the form being filled out.
     *
     * @return array<string, string>
     */
    public function attributes(): array
    {
        return (array) trans('brief.attributes');
    }

    /**
     * @return array<string, string>
     */
    public function messages(): array
    {
        $limits = [
            ':max_goals' => (string) BriefOptions::MAX_GOALS,
            ':max_styles' => (string) BriefOptions::MAX_STYLES,
        ];

        return array_map(
            fn (string $message): string => strtr($message, $limits),
            (array) trans('brief.messages'),
        );
    }

    protected function prepareForValidation(): void
    {
        $locale = $this->input('locale');
        $locale = is_string($locale) && in_array($locale, BriefOptions::locales(), true)
            ? $locale
            : BriefOptions::DEFAULT_LOCALE;

        // Validation errors come back in the language the visitor is reading.
        app()->setLocale($locale);

        $lists = [];

        foreach (self::LIST_FIELDS as $field) {
            $lists[$field] = $this->input($field) ?? [];
        }

        $this->merge([
            ...$lists,
            'locale' => $locale,
            'phone' => $this->withAsciiDigits($this->input('phone')),
            'website_url' => $this->withScheme($this->input('website_url')),
            'liked_sites' => $this->normalisedLikedSites(),
        ]);
    }

    /**
     * Persian keyboards type Persian and Arabic-Indic digits, which the phone rule would reject.
     */
    private function withAsciiDigits(mixed $value): mixed
    {
        if (! is_string($value)) {
            return $value;
        }

        return strtr($value, [
            '۰' => '0', '۱' => '1', '۲' => '2', '۳' => '3', '۴' => '4',
            '۵' => '5', '۶' => '6', '۷' => '7', '۸' => '8', '۹' => '9',
            '٠' => '0', '١' => '1', '٢' => '2', '٣' => '3', '٤' => '4',
            '٥' => '5', '٦' => '6', '٧' => '7', '٨' => '8', '٩' => '9',
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
