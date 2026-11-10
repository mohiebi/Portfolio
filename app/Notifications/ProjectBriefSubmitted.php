<?php

namespace App\Notifications;

use App\Models\ProjectBrief;
use App\Notifications\Channels\ResendChannel;
use Illuminate\Notifications\Notification;

class ProjectBriefSubmitted extends Notification
{
    public function __construct(private ProjectBrief $brief)
    {
    }

    /**
     * @return list<string>
     */
    public function via(object $notifiable): array
    {
        return ['database', ResendChannel::class];
    }

    /**
     * @return array<string, mixed>
     */
    public function toResend(object $notifiable): array
    {
        return [
            'from' => 'Mohi Portfolio <info@mohiebi.com>',
            'to' => [$notifiable->email],
            'reply_to' => [$this->brief->email],
            'subject' => "New project brief: {$this->brief->name}",
            'html' => view('emails.project-brief-submitted', [
                'brief' => $this->brief,
                'briefUrl' => url($this->briefPath()),
            ])->render(),
        ];
    }

    /**
     * @return array<string, mixed>
     */
    public function toArray(object $notifiable): array
    {
        return [
            'brief_id' => $this->brief->id,
            'name' => $this->brief->name,
            'company' => $this->brief->company,
            'project_type' => $this->brief->project_type,
            'budget' => $this->brief->budget,
            'url' => $this->briefPath(),
            'message' => "New project brief from {$this->brief->name}",
        ];
    }

    private function briefPath(): string
    {
        return route('dashboard.briefs.show', ['projectBrief' => $this->brief->id], false);
    }
}
