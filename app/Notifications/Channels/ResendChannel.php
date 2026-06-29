<?php

namespace App\Notifications\Channels;

use Illuminate\Notifications\Notification;
use Resend\Laravel\Facades\Resend;

class ResendChannel
{
    public function send(object $notifiable, Notification $notification): void
    {
        $payload = $notification->toResend($notifiable);

        Resend::emails()->send($payload);
    }
}
