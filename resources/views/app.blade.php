<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Mohi — Backend Systems, AI & Web3 Engineer | Laravel · Node.js</title>
    <meta name="description" content="I build backend systems, automate workflows and integrate AI — using Laravel, Node.js, Symfony, NestJS and Web3. Available for freelance and remote work.">
    <meta name="author" content="MohammadHosein Ebrahimi">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <link rel="canonical" href="{{ url()->current() }}">
    <link rel="icon" type="image/svg+xml" href="/img/mohi-logo.svg">
    <meta property="og:type" content="website">
    <meta property="og:site_name" content="Mohi">
    <meta property="og:url" content="{{ url()->current() }}">
    <meta property="og:title" content="Mohi — Backend Systems, AI & Web3 Engineer">
    <meta property="og:description" content="I build backend systems, automate workflows and integrate AI — using Laravel, Node.js, Symfony, NestJS and Web3. Available for freelance and remote work.">
    <meta property="og:image" content="{{ asset('img/og-preview.webp') }}">
    <meta property="og:image:secure_url" content="{{ secure_asset('img/og-preview.webp') }}">
    <meta property="og:image:type" content="image/webp">
    <meta property="og:image:width" content="1200">
    <meta property="og:image:height" content="630">
    <meta property="og:image:alt" content="Mohi — Backend Systems, AI & Web3 Engineer">
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="Mohi — Backend Systems, AI & Web3 Engineer">
    <meta name="twitter:description" content="I build backend systems, automate workflows and integrate AI — using Laravel, Node.js, Symfony, NestJS and Web3.">
    <meta name="twitter:image" content="{{ asset('img/og-preview.webp') }}">
    <meta name="twitter:image:alt" content="Mohi — Backend Systems, AI & Web3 Engineer">
    @routes
    @viteReactRefresh
    @vite(['resources/css/app.css', 'resources/js/app.tsx'])
    @inertiaHead
</head>
<body>
    @inertia
</body>
</html>
