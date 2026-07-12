<?php

namespace App\Http\Controllers;

use App\Http\Requests\ProfileUpdateRequest;
use App\Models\TelegramConnection;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Redirect;
use Illuminate\Support\Str;
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
}
