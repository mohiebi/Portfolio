<?php

namespace App\Http\Controllers\Projects\RealEstate;

use App\Http\Controllers\Controller;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Notifications\DatabaseNotification;
use Illuminate\Support\Facades\Gate;
use Inertia\Response;

class NotificationController extends Controller
{
    public function index(Request $request): Response
    {
        return inertia('Notification/Index', [
            'notifications' => $request->user()->notifications()->paginate(10),
        ]);
    }

    public function markAsRead(Request $request, DatabaseNotification $notification): RedirectResponse
    {
        Gate::authorize('update', $notification);
        $notification->markAsRead();

        return redirect()->back();
    }
}
