<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Article extends Model
{
    use HasFactory;

    protected $fillable = [
        'slug',
        'title',
        'excerpt',
        'body',
        'category',
        'cover_path',
        'published_at',
        'reading_time',
        'is_published',
        'sort_order',
        'translations',
    ];

    protected $casts = [
        'published_at' => 'date:Y-m-d',
        'reading_time' => 'integer',
        'is_published' => 'boolean',
        'sort_order' => 'integer',
        'translations' => 'array',
    ];

    protected $appends = [
        'cover_url',
    ];

    public function scopePublished(Builder $query): Builder
    {
        return $query
            ->where('is_published', true)
            ->where(function (Builder $query) {
                $query
                    ->whereNull('published_at')
                    ->orWhere('published_at', '<=', now());
            });
    }

    public function scopeOrdered(Builder $query): Builder
    {
        return $query
            ->orderBy('sort_order')
            ->orderByDesc('published_at')
            ->orderByDesc('created_at');
    }

    public function getCoverUrlAttribute(): ?string
    {
        return $this->cover_path ? '/'.ltrim($this->cover_path, '/') : null;
    }
}
