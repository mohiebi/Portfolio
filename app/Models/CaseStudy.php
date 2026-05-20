<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CaseStudy extends Model
{
    use HasFactory;

    protected $fillable = [
        'slug',
        'title',
        'company',
        'role',
        'period',
        'location',
        'tag',
        'summary',
        'accent',
        'cover',
        'problem',
        'approach',
        'impact',
        'stack',
        'highlights',
        'is_published',
        'sort_order',
    ];

    protected $casts = [
        'approach' => 'array',
        'impact' => 'array',
        'stack' => 'array',
        'highlights' => 'array',
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
