<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;

class realtor
{
    public function handle(Request $request, Closure $next): Response
    {
        $user = Auth::user();

        abort_if(! $user || (int) $user->role < 1, 403);

        return $next($request);
    }
}
