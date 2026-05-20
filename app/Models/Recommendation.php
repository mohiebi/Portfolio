<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Recommendation extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'role',
        'company',
        'relationship',
        'project',
        'image_path',
        'linkedin_url',
        'body',
        'recommended_at',
        'is_published',
        'sort_order',
    ];

    protected $casts = [
        'recommended_at' => 'date:Y-m-d',
        'is_published' => 'boolean',
        'sort_order' => 'integer',
    ];

    protected $appends = [
        'image_url',
    ];

    public function scopePublished(Builder $query): Builder
    {
        return $query->where('is_published', true);
    }

    public function scopeOrdered(Builder $query): Builder
    {
        return $query
            ->orderBy('sort_order')
            ->orderByDesc('recommended_at')
            ->orderByDesc('created_at');
    }

    public function getImageUrlAttribute(): ?string
    {
        return $this->image_path ? '/'.ltrim($this->image_path, '/') : null;
    }
}
