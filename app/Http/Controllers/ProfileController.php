<?php

namespace App\Http\Controllers;

use App\Http\Requests\ProfileUpdateRequest;
use App\Models\TelegramConnection;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Redirect;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;
use Symfony\Component\HttpFoundation\Response as SymfonyResponse;

class ProfileController extends Controller
{
    /**
     * Display the user's profile form.
     */
    public function edit(Request $request): Response
    {
        $connection = $request->user()->telegramConnection;

        return Inertia::render('Profile/Edit', [
            'telegram' => [
                'bot_username' => config('services.telegram.bot_username'),
                'connected' => (bool) $connection?->isConnected(),
                'username' => $connection?->telegram_username,
                'connected_at' => $connection?->connected_at?->toJSON(),
                'reminders_enabled' => $connection?->reminders_enabled ?? true,
            ],
            'taskReminderSchedule' => [
                'time' => $request->user()->taskReminderTime(),
                'timezone' => $request->user()->taskReminderTimezone(),
                'timezone_options' => $this->taskReminderTimezoneOptions(),
            ],
        ]);
    }

    /**
     * Update the user's profile information.
     */
    public function update(ProfileUpdateRequest $request): RedirectResponse
    {
        $request->user()->fill($request->validated());

        if ($request->user()->isDirty('email')) {
            $request->user()->email_verified_at = null;
        }

        $request->user()->save();

        return Redirect::route('profile.edit')
            ->with('status', 'profile-updated')
            ->with('success', 'Your profile has been updated.');
    }

    /**
     * Delete the user's account.
     */
    public function destroy(Request $request): RedirectResponse
    {
        $request->validateWithBag('userDeletion', [
            'password' => ['required', 'current_password'],
        ]);

        $user = $request->user();

        Auth::logout();

        $user->delete();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return Redirect::to('/');
    }

    public function connectTelegram(Request $request): SymfonyResponse|RedirectResponse
    {
        $botUsername = config('services.telegram.bot_username');

        if (! $botUsername) {
            return Redirect::route('profile.edit')
                ->with('error', 'Telegram bot username is not configured.');
        }

        $token = Str::random(40);

        $request->user()->telegramConnection()->updateOrCreate(
            ['user_id' => $request->user()->id],
            [
                'link_token_hash' => hash('sha256', $token),
                'link_token_expires_at' => now()->addMinutes(15),
                'reminders_enabled' => $request->user()->telegramConnection?->reminders_enabled ?? true,
            ],
        );

        return Inertia::location('https://t.me/'.ltrim($botUsername, '@').'?start='.$token);
    }

    public function disconnectTelegram(Request $request): RedirectResponse
    {
        $request->user()->telegramConnection()->delete();

        return Redirect::route('profile.edit')
            ->with('success', 'Telegram has been disconnected.');
    }

    public function updateTelegramReminders(Request $request): RedirectResponse
    {
        $data = $request->validate([
            'reminders_enabled' => ['required', 'boolean'],
        ]);

        TelegramConnection::query()->updateOrCreate(
            ['user_id' => $request->user()->id],
            ['reminders_enabled' => (bool) $data['reminders_enabled']],
        );

        return Redirect::route('profile.edit')
            ->with('success', 'Telegram reminder preference updated.');
    }

    public function updateTaskReminderSchedule(Request $request): RedirectResponse
    {
        $data = $request->validate([
            'time' => ['required', 'date_format:H:i'],
            'timezone' => ['required', Rule::in(array_column($this->taskReminderTimezoneOptions(), 'value'))],
        ]);

        $request->user()->forceFill([
            'task_reminder_time' => $data['time'],
            'task_reminder_timezone' => $data['timezone'],
        ])->save();

        return Redirect::route('profile.edit')
            ->with('success', 'Task reminder schedule updated.');
    }

    private function taskReminderTimezoneOptions(): array
    {
        return collect(range(-12, 14))
            ->flatMap(function (int $hour): array {
                $offsets = [0];

                if (in_array($hour, [-9, -3, 3, 4, 5, 6, 8, 9, 10], true)) {
                    $offsets[] = 30;
                }

                if (in_array($hour, [5, 8, 12], true)) {
                    $offsets[] = 45;
                }

                return collect($offsets)
                    ->map(function (int $minute) use ($hour): array {
                        $sign = $hour < 0 ? '-' : '+';
                        $value = sprintf('%s%02d:%02d', $sign, abs($hour), $minute);

                        return [
                            'value' => $value,
                            'label' => 'UTC'.($value === '+00:00' ? '' : $value),
                        ];
                    })
                    ->all();
            })
            ->unique('value')
            ->values()
            ->all();
    }
}
