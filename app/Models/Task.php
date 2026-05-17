<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Facades\Auth;

class Task extends Model
{
    use HasFactory;

    public const STATUS_OPEN = 'open';
    public const STATUS_IN_PROGRESS = 'in_progress';
    public const STATUS_DONE = 'done';

    protected $fillable = ['title', 'description', 'long_description', 'complete', 'status'];

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

    public static function boot()
    {
        parent::boot();

        static::creating(function ($task) {
            $task->user_id = Auth::id();
        });
    }
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
