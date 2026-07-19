<?php

namespace App\Models;

use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Config;
use Illuminate\Support\Facades\URL;
use Resend\Laravel\Facades\Resend;

class User extends Authenticatable implements MustVerifyEmail
{
    use HasFactory, Notifiable;

    public const DEFAULT_TASK_REMINDER_TIME = '08:00';

    public const DEFAULT_TASK_REMINDER_TIMEZONE = '+00:00';

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'task_done_cleanup_enabled' => 'boolean',
        ];
    }

    public function taskReminderTime(): string
    {
        return $this->task_reminder_time ?: self::DEFAULT_TASK_REMINDER_TIME;
    }

    public function taskReminderTimezone(): string
    {
        return $this->task_reminder_timezone ?: self::DEFAULT_TASK_REMINDER_TIMEZONE;
    }

    public function isTaskReminderDueAt(?Carbon $now = null): bool
    {
        $localNow = ($now ?? now())->copy()->setTimezone($this->taskReminderTimezone());
        [$hour, $minute] = array_map('intval', explode(':', $this->taskReminderTime()));
        $scheduledAt = $localNow->copy()->setTime($hour, $minute);

        return $scheduledAt->format('Y-m-d H') === $localNow->format('Y-m-d H');
    }

    public function taskReminderDate(?Carbon $now = null): Carbon
    {
        return ($now ?? now())->copy()->setTimezone($this->taskReminderTimezone())->startOfDay();
    }

    public function sendEmailVerificationNotification(): void
    {
        $verificationUrl = URL::temporarySignedRoute(
            'verification.verify',
            Carbon::now()->addMinutes(Config::get('auth.verification.expire', 60)),
            ['id' => $this->getKey(), 'hash' => sha1($this->getEmailForVerification())],
        );

        $name = e($this->name);

        Resend::emails()->send([
            'from' => 'Mohi Portfolio <info@mohiebi.com>',
            'to' => [$this->email],
            'subject' => 'Verify your email address',
            'html' => view('emails.verify-email', [
                'name' => $name,
                'verificationUrl' => $verificationUrl,
            ])->render(),
        ]);
    }

    public function tasks(): HasMany
    {
        return $this->hasMany(Task::class);
    }

    public function telegramConnection(): HasOne
    {
        return $this->hasOne(TelegramConnection::class);
    }
}
