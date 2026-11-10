<?php

namespace App\Models;

use App\Support\BriefOptions;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ProjectBrief extends Model
{
    /** @use HasFactory<\Database\Factories\ProjectBriefFactory> */
    use HasFactory;

    protected $fillable = [
        'name',
        'email',
        'company',
        'website_url',
        'business_description',
        'project_type',
        'goals',
        'audience',
        'primary_action',
        'competitors',
        'pages',
        'features',
        'extra_requirements',
        'languages',
        'other_language',
        'content_readiness',
        'domain_status',
        'brand_assets',
        'attachments',
        'styles',
        'brand_words',
        'colour_preferences',
        'colour_mode',
        'typography',
        'liked_sites',
        'disliked_sites',
        'budget',
        'timeline',
        'deadline_note',
        'support',
        'preferred_contact',
        'phone',
        'notes',
        'locale',
        'consented_at',
        'reviewed_at',
    ];

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'goals' => 'array',
            'pages' => 'array',
            'features' => 'array',
            'languages' => 'array',
            'brand_assets' => 'array',
            'attachments' => 'array',
            'styles' => 'array',
            'liked_sites' => 'array',
            'consented_at' => 'datetime',
            'reviewed_at' => 'datetime',
        ];
    }

    public function isReviewed(): bool
    {
        return $this->reviewed_at !== null;
    }

    public function projectTypeLabel(): string
    {
        return BriefOptions::PROJECT_TYPES[$this->project_type] ?? $this->project_type;
    }

    public function localeLabel(): string
    {
        return BriefOptions::LOCALES[$this->locale] ?? $this->locale;
    }

    public function budgetLabel(): string
    {
        return BriefOptions::BUDGETS[$this->budget] ?? $this->budget;
    }
}
