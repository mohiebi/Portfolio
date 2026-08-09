<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

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
        'translations',
    ];

    protected $casts = [
        'recommended_at' => 'date:Y-m-d',
        'is_published' => 'boolean',
        'sort_order' => 'integer',
        'translations' => 'array',
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
        if (! $this->image_path) {
            return null;
        }

        if (Str::startsWith($this->image_path, 'uploads/')) {
            return Storage::disk('public')->url($this->image_path);
        }

        return '/'.ltrim($this->image_path, '/');
    }
}
