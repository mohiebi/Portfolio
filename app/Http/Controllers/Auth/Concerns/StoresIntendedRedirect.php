<?php

namespace App\Http\Controllers\Auth\Concerns;

use Illuminate\Http\Request;

trait StoresIntendedRedirect
{
    protected function storeIntendedRedirect(Request $request): void
    {
        $redirect = $request->query('redirect', $request->input('redirect'));

        if (! is_string($redirect) || ! $this->isSafeIntendedRedirect($redirect)) {
            return;
        }

        $request->session()->put('url.intended', $redirect);
    }

    protected function intendedFallback(Request $request): string
    {
        return route('dashboard', absolute: false);
    }

    private function isSafeIntendedRedirect(string $redirect): bool
    {
        if ($redirect === '' || ! str_starts_with($redirect, '/') || str_starts_with($redirect, '//')) {
            return false;
        }

        if (preg_match('/^[a-z][a-z0-9+.-]*:/i', $redirect) === 1) {
            return false;
        }

        $path = parse_url($redirect, PHP_URL_PATH);

        return is_string($path) && ! in_array($path, [
            '/login',
            '/register',
            '/forgot-password',
            '/reset-password',
        ], true);
    }
}
