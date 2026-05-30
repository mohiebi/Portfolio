<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class Listing extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'beds', 'baths', 'area', 'city', 'code', 'street', 'price',
    ];

    protected array $sortable = ['price', 'beds', 'baths', 'created_at'];

    public function owner(): BelongsTo
    {
        return $this->belongsTo(User::class, 'by_user_id');
    }

    public function images(): HasMany
    {
        return $this->hasMany(ListingImage::class);
    }

    public function offers(): HasMany
    {
        return $this->hasMany(Offer::class, 'listing_id');
    }

    public function scopeMostRecent(Builder $query): Builder
    {
        return $query->orderByDesc('created_at');
    }

    public function scopeWithoutSold(Builder $query): Builder
    {
        return $query->whereNull('sold_at');
    }

    public function scopeFilter(Builder $query, array $filters): Builder
    {
        return $query
            ->when($filters['priceFrom'] ?? false, fn (Builder $q, mixed $v) => $q->where('price', '>=', $v))
            ->when($filters['priceTo'] ?? false, fn (Builder $q, mixed $v) => $q->where('price', '<=', $v))
            ->when($filters['beds'] ?? false, fn (Builder $q, mixed $v) => $q->where('beds', (int) $v < 6 ? '=' : '>=', $v))
            ->when($filters['baths'] ?? false, fn (Builder $q, mixed $v) => $q->where('baths', (int) $v < 6 ? '=' : '>=', $v))
            ->when($filters['areaFrom'] ?? false, fn (Builder $q, mixed $v) => $q->where('area', '>=', $v))
            ->when($filters['areaTo'] ?? false, fn (Builder $q, mixed $v) => $q->where('area', '<=', $v))
            ->when($filters['deleted'] ?? false, fn (Builder $q) => $q->withTrashed())
            ->when(
                $filters['by'] ?? false,
                fn (Builder $q, mixed $v) => in_array($v, $this->sortable)
                    ? $q->orderBy($v, $filters['order'] ?? 'desc')
                    : $q
            );
    }
}
