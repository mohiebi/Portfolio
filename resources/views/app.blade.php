<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Mohi - Backend / Full-Stack Engineer</title>
    <meta name="description" content="Backend-focused engineer building Laravel, Node.js, Web3, automation, and AI-powered systems for production teams.">
    <meta name="author" content="Mohi">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <link rel="canonical" href="{{ url()->current() }}">
    <link rel="icon" type="image/svg+xml" href="/img/mohi-logo.svg">
    <meta property="og:type" content="website">
    <meta property="og:site_name" content="Mohi">
    <meta property="og:url" content="{{ url()->current() }}">
    <meta property="og:title" content="Mohi - Backend / Full-Stack Engineer">
    <meta property="og:description" content="Backend-focused engineer building Laravel, Node.js, Web3, automation, and AI-powered systems for production teams.">
    <meta property="og:image" content="{{ asset('img/og-preview.jpg') }}">
    <meta property="og:image:secure_url" content="{{ secure_asset('img/og-preview.jpg') }}">
    <meta property="og:image:type" content="image/jpeg">
    <meta property="og:image:width" content="1200">
    <meta property="og:image:height" content="630">
    <meta property="og:image:alt" content="Mohi - Backend / Full-Stack Engineer">
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="Mohi - Backend / Full-Stack Engineer">
    <meta name="twitter:description" content="Backend-focused engineer building Laravel, Node.js, Web3, automation, and AI-powered systems for production teams.">
    <meta name="twitter:image" content="{{ asset('img/og-preview.jpg') }}">
    <meta name="twitter:image:alt" content="Mohi - Backend / Full-Stack Engineer">
    @routes
    @viteReactRefresh
    @vite(['resources/css/app.css', 'resources/js/app.tsx'])
    @inertiaHead
</head>
<body>
    @inertia
</body>
</html>
