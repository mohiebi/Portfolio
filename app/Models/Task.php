<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Facades\Auth;

class Task extends Model
{
    use HasFactory;

    public const STATUS_OPEN = 'open';
    public const STATUS_IN_PROGRESS = 'in_progress';
    public const STATUS_DONE = 'done';

    protected $fillable = ['user_id', 'parent_id', 'title', 'description', 'long_description', 'complete', 'status'];

    protected $casts = [
        'complete' => 'boolean',
    ];

    public function toggleComplete(): void
    {
        $this->complete = ! $this->complete;
        $this->status = $this->complete ? self::STATUS_DONE : self::STATUS_OPEN;
        $this->save();
    }

    public function moveToStatus(string $status): void
    {
        $this->status = $status;
        $this->complete = $status === self::STATUS_DONE;
        $this->save();
    }

    public function syncStatusFromSubtasks(): void
    {
        $totalSubtasks = $this->subtasks()->count();
        $completedSubtasks = $this->subtasks()
            ->where('complete', true)
            ->count();

        if ($completedSubtasks === 0) {
            $this->moveToStatus(self::STATUS_OPEN);

            return;
        }

        if ($completedSubtasks === $totalSubtasks) {
            $this->moveToStatus(self::STATUS_DONE);

            return;
        }

        $this->moveToStatus(self::STATUS_IN_PROGRESS);
    }

    public function scopeTopLevel($query)
    {
        return $query->whereNull('parent_id');
    }

    public function parent(): BelongsTo
    {
        return $this->belongsTo(self::class, 'parent_id');
    }

    public function subtasks(): HasMany
    {
        return $this->hasMany(self::class, 'parent_id')->latest();
    }

    public static function boot()
    {
        parent::boot();

        static::creating(function ($task) {
            if (! $task->user_id && Auth::id()) {
                $task->user_id = Auth::id();
            }
        });
    }
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
