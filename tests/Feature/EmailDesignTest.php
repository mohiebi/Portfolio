<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Auth\Notifications\ResetPassword;
use Tests\TestCase;

class EmailDesignTest extends TestCase
{
    public function test_laravel_password_reset_email_uses_the_mohi_theme(): void
    {
        $user = User::factory()->make();
        $message = (new ResetPassword('reset-token'))->toMail($user);
        $html = (string) $message->render();

        $this->assertStringContainsString('Mohi', $html);
        $this->assertStringContainsString('#1eaf6d', $html);
        $this->assertStringContainsString('Reset Password', $html);
    }

    public function test_resend_email_views_use_the_shared_mohi_layout(): void
    {
        $emails = [
            view('emails.verify-email', [
                'name' => 'Mohi',
                'verificationUrl' => 'https://example.com/verify',
            ])->render(),
            view('emails.task-deadline-reminder', [
                'deadlineDate' => 'July 18, 2026',
                'isSubtask' => false,
                'taskTitle' => 'Finish the email design',
                'taskUrl' => 'https://example.com/task',
            ])->render(),
            view('emails.offer-made', [
                'amount' => '8,430.00',
                'listingUrl' => 'https://example.com/listing',
            ])->render(),
        ];

        foreach ($emails as $email) {
            $this->assertStringContainsString('Mohi', $email);
            $this->assertStringContainsString('background-color:#0c1625', $email);
            $this->assertStringContainsString('border-radius:16px', $email);
        }
    }
}
