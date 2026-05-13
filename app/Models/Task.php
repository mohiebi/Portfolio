<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Facades\Auth;

class Task extends Model
{
    use HasFactory;
    protected $fillable = ['title', 'description', 'long_description', 'complete'];

    protected $casts = [
        'complete' => 'boolean',
    ];

    public function toggleComplete(): void
    {
        $this->complete = ! $this->complete;
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
