<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Service extends Model
{
    use HasFactory;

    protected $fillable = [
        'slug',
        'name',
        'badge',
        'tagline',
        'promise',
        'investment',
        'timeline',
        'outcome',
        'best_for',
        'benefit',
        'cover',
        'accent',
        'problem',
        'what_you_get',
        'why_it_matters',
        'before',
        'after',
        'deliverables',
        'ai_capabilities',
        'bonuses',
        'guarantees',
        'is_published',
        'sort_order',
    ];

    protected $casts = [
        'before' => 'array',
        'after' => 'array',
        'deliverables' => 'array',
        'ai_capabilities' => 'array',
        'bonuses' => 'array',
        'guarantees' => 'array',
        'is_published' => 'boolean',
        'sort_order' => 'integer',
    ];

    public function scopePublished(Builder $query): Builder
    {
        return $query->where('is_published', true);
    }

    public function scopeOrdered(Builder $query): Builder
    {
        return $query
            ->orderBy('sort_order')
            ->orderByDesc('created_at');
    }
}
