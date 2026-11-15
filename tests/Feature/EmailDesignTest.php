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
                'tasks' => [
                    ['title' => 'Finish the email design', 'url' => 'https://example.com/task', 'isSubtask' => false, 'parentTitle' => null],
                ],
                'indexUrl' => 'https://example.com/taskmanager',
            ])->render(),
            view('emails.task-deadline-reminder', [
                'deadlineDate' => 'July 18, 2026',
                'tasks' => [
                    ['title' => 'Finish the email design', 'url' => 'https://example.com/task', 'isSubtask' => false, 'parentTitle' => null],
                    ['title' => 'Review the copy', 'url' => 'https://example.com/task/2', 'isSubtask' => true, 'parentTitle' => 'Launch'],
                ],
                'indexUrl' => 'https://example.com/taskmanager',
            ])->render(),
        ];

        foreach ($emails as $email) {
            $this->assertStringContainsString('Mohi', $email);
            $this->assertStringContainsString('background-color:#0c1625', $email);
            $this->assertStringContainsString('border-radius:16px', $email);
        }
    }
}
