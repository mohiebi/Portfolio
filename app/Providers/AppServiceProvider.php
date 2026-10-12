<?php

namespace App\Providers;

use App\Policies\NotificationPolicy;
use Illuminate\Cache\RateLimiting\Limit;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Http\Request;
use Illuminate\Notifications\DatabaseNotification;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\ServiceProvider;
use Inertia\Inertia;
use Laravel\Passport\Passport;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        Model::preventLazyLoading(! app()->isProduction());

        Gate::policy(DatabaseNotification::class, NotificationPolicy::class);

        $this->configureMcpAuthentication();
    }

    /**
     * AI clients authenticate to the MCP server with OAuth (Passport).
     */
    private function configureMcpAuthentication(): void
    {
        Passport::authorizationView(fn (array $parameters) => Inertia::render('Mcp/Authorize', [
            'client' => [
                'id' => $parameters['client']->getKey(),
                'name' => $parameters['client']->name,
            ],
            'authToken' => $parameters['authToken'],
            'csrfToken' => csrf_token(),
        ]));

        Passport::tokensExpireIn(now()->addDays(7));
        Passport::refreshTokensExpireIn(now()->addDays(60));

        RateLimiter::for('mcp', fn (Request $request) => Limit::perMinute(120)
            ->by($request->user()?->getAuthIdentifier() ?: $request->ip()));
    }
}
