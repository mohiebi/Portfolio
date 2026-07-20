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

    public const DONE_BOARD_TTL_DAYS = 7;

    protected $fillable = ['user_id', 'parent_id', 'title', 'description', 'long_description', 'complete', 'status', 'done_at', 'deadline'];

    protected $casts = [
        'complete' => 'boolean',
        'done_at' => 'datetime',
        'deadline' => 'datetime',
        'deadline_warning_reminded_at' => 'datetime',
        'deadline_due_reminded_at' => 'datetime',
        'deadline_overdue_reminded_at' => 'datetime',
        'telegram_warning_reminded_at' => 'datetime',
        'telegram_due_reminded_at' => 'datetime',
        'telegram_overdue_reminded_at' => 'datetime',
    ];

    public function toggleComplete(): void
    {
        $this->complete = ! $this->complete;
        $this->status = $this->complete ? self::STATUS_DONE : self::STATUS_OPEN;
        $this->save();

        if ($this->complete) {
            $this->markSubtasksDone();

            return;
        }

        $this->markSubtasksOpen();
    }

    public function moveToStatus(string $status): void
    {
        $this->status = $status;
        $this->complete = $status === self::STATUS_DONE;
        $this->save();

        if ($status === self::STATUS_DONE) {
            $this->markSubtasksDone();

            return;
        }

        if ($status === self::STATUS_OPEN) {
            $this->markSubtasksOpen();
        }
    }

    public function markSubtasksDone(): void
    {
        $this->subtasks()
            ->where('complete', false)
            ->update([
                'complete' => true,
                'status' => self::STATUS_DONE,
                'done_at' => now(),
            ]);
    }

    public function markSubtasksOpen(): void
    {
        $this->subtasks()
            ->where('complete', true)
            ->update([
                'complete' => false,
                'status' => self::STATUS_OPEN,
                'done_at' => null,
            ]);
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

    public function scopeDone($query)
    {
        return $query->where(function ($query) {
            $query->where('status', self::STATUS_DONE)
                ->orWhere('complete', true);
        });
    }

    public function scopeVisibleOnTaskBoard($query)
    {
        $cutoff = now()->subDays(self::DONE_BOARD_TTL_DAYS);

        return $query->where(function ($query) use ($cutoff) {
            $query->where(function ($query) {
                $query->where('status', '!=', self::STATUS_DONE)
                    ->where('complete', false);
            })
                ->orWhere(function ($query) use ($cutoff) {
                    $query->done()
                        ->where(function ($query) use ($cutoff) {
                            $query->where('done_at', '>', $cutoff)
                                ->orWhere(function ($query) use ($cutoff) {
                                    $query->whereNull('done_at')
                                        ->where('updated_at', '>', $cutoff);
                                });
                        });
                })
                ->orWhereHas('subtasks', function ($query) use ($cutoff) {
                    $query->done()
                        ->where(function ($query) use ($cutoff) {
                            $query->where('done_at', '>', $cutoff)
                                ->orWhere(function ($query) use ($cutoff) {
                                    $query->whereNull('done_at')
                                        ->where('updated_at', '>', $cutoff);
                                });
                        });
                });
        });
    }

    public function reminderTargetTask(): self
    {
        if (! $this->parent_id) {
            return $this;
        }

        return $this->relationLoaded('parent') && $this->parent
            ? $this->parent
            : $this->parent()->firstOrFail();
    }

    public function resetDeadlineReminderTracking(): void
    {
        $this->deadline_warning_reminded_at = null;
        $this->deadline_due_reminded_at = null;
        $this->deadline_overdue_reminded_at = null;
        $this->telegram_warning_reminded_at = null;
        $this->telegram_due_reminded_at = null;
        $this->telegram_overdue_reminded_at = null;
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

        static::saving(function ($task) {
            $isDone = $task->status === self::STATUS_DONE || $task->complete;

            if ($isDone && ! $task->done_at) {
                $task->done_at = now();
            }

            if (! $isDone) {
                $task->done_at = null;
            }
        });

        static::updating(function ($task) {
            if ($task->isDirty('deadline')) {
                $task->resetDeadlineReminderTracking();
            }
        });

        static::updated(function ($task) {
            if ($task->wasChanged('deadline')) {
                $task->newQueryWithoutScopes()
                    ->whereKey($task->getKey())
                    ->update([
                        'deadline_warning_reminded_at' => null,
                        'deadline_due_reminded_at' => null,
                        'deadline_overdue_reminded_at' => null,
                        'telegram_warning_reminded_at' => null,
                        'telegram_due_reminded_at' => null,
                        'telegram_overdue_reminded_at' => null,
                    ]);
            }
        });
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
