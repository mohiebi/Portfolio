<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    @php
        $path = trim(request()->path(), '/');
        $locale = request()->query('lang') === 'de' ? 'de' : 'en';
        $titles = [
            '' => ['en' => 'Back-End / Full-Stack Engineer', 'de' => 'Back-End-/Full-Stack-Entwickler'],
            'projects' => ['en' => 'Portfolio Projects', 'de' => 'Portfolio-Projekte'],
            'articles' => ['en' => 'Technical Articles', 'de' => 'Technische Artikel'],
            'case-studies' => ['en' => 'Case Studies', 'de' => 'Fallstudien'],
            'recommendations' => ['en' => 'LinkedIn Recommendations', 'de' => 'LinkedIn-Empfehlungen'],
            'services' => ['en' => 'Service Packages', 'de' => 'Leistungspakete'],
            'taskmanager' => ['en' => 'Task Manager', 'de' => 'Aufgaben-Manager'],
            'books' => ['en' => 'BookReview Project', 'de' => 'BookReview-Projekt'],
            'jobs' => ['en' => 'Job Board Project', 'de' => 'Jobbörsen-Projekt'],
            'listing' => ['en' => 'Real Estate Listings', 'de' => 'Immobilienangebote'],
            'dashboard' => ['en' => 'Account Dashboard', 'de' => 'Konto-Dashboard'],
            'profile' => ['en' => 'User Profile', 'de' => 'Benutzerprofil'],
            'notifications' => ['en' => 'Notifications', 'de' => 'Benachrichtigungen'],
            'my-jobs' => ['en' => 'My Job Posts', 'de' => 'Meine Stellenanzeigen'],
            'my-applications' => ['en' => 'My Job Applications', 'de' => 'Meine Bewerbungen'],
            'realtor' => ['en' => 'My Real Estate Listings', 'de' => 'Meine Immobilienangebote'],
            'login' => ['en' => 'Log in', 'de' => 'Anmelden'],
            'register' => ['en' => 'Create account', 'de' => 'Konto erstellen'],
            'forgot-password' => ['en' => 'Forgot password', 'de' => 'Passwort vergessen'],
            'reset-password' => ['en' => 'Reset password', 'de' => 'Passwort zurücksetzen'],
            'verify-email' => ['en' => 'Verify email', 'de' => 'E-Mail bestätigen'],
            'confirm-password' => ['en' => 'Confirm password', 'de' => 'Passwort bestätigen'],
        ];
        $firstSegment = $path === '' ? '' : explode('/', $path)[0];
        $pageTitle = $titles[$firstSegment][$locale] ?? ($locale === 'de' ? 'Portfolio' : 'Portfolio');
        $fullTitle = 'Mohi - ' . $pageTitle;
    @endphp
    <title>{{ $fullTitle }}</title>
    <meta name="description" content="I build backend systems, automate workflows and integrate AI — using Laravel, Node.js, Symfony, NestJS and Web3. Available for freelance and remote work.">
    <meta name="author" content="Mohi">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <link rel="canonical" href="{{ url()->current() }}">
    <link rel="icon" type="image/svg+xml" href="/img/mohi-logo.svg">
    <meta property="og:type" content="website">
    <meta property="og:site_name" content="Mohi">
    <meta property="og:url" content="{{ url()->current() }}">
    <meta property="og:title" content="{{ $fullTitle }}">
    <meta property="og:description" content="I build backend systems, automate workflows and integrate AI — using Laravel, Node.js, Symfony, NestJS and Web3. Available for freelance and remote work.">
    <meta property="og:image" content="{{ asset('img/og-preview.webp') }}">
    <meta property="og:image:secure_url" content="{{ secure_asset('img/og-preview.webp') }}">
    <meta property="og:image:type" content="image/webp">
    <meta property="og:image:width" content="1200">
    <meta property="og:image:height" content="630">
    <meta property="og:image:alt" content="{{ $fullTitle }}">
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="{{ $fullTitle }}">
    <meta name="twitter:description" content="I build backend systems, automate workflows and integrate AI — using Laravel, Node.js, Symfony, NestJS and Web3.">
    <meta name="twitter:image" content="{{ asset('img/og-preview.webp') }}">
    <meta name="twitter:image:alt" content="{{ $fullTitle }}">
    @routes
    {{-- Required for the Inertia app shell to load the compiled React assets. --}}
    @viteReactRefresh
    @vite(['resources/css/app.css', 'resources/js/app.tsx'])
    @inertiaHead
</head>
<body>
    @inertia
</body>
</html>
