<!DOCTYPE html>
@php($seo = \App\Support\Seo::page())
<html lang="{{ $seo['locale'] }}">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>{{ $seo['title'] }}</title>
    <meta name="description" content="{{ $seo['description'] }}">
    <meta name="robots" content="{{ $seo['robots'] }}">
    <meta name="author" content="Mohi">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <link rel="canonical" href="{{ $seo['canonical'] }}">
    <link rel="alternate" hreflang="en" href="{{ $seo['alternates']['en'] }}">
    <link rel="alternate" hreflang="de" href="{{ $seo['alternates']['de'] }}">
    <link rel="alternate" hreflang="x-default" href="{{ $seo['alternates']['x-default'] }}">
    <link rel="icon" type="image/svg+xml" href="/img/mohi-logo.svg">
    <meta property="og:type" content="{{ $seo['type'] }}">
    <meta property="og:site_name" content="{{ $seo['siteName'] }}">
    <meta property="og:locale" content="{{ $seo['ogLocale'] }}">
    <meta property="og:url" content="{{ $seo['canonical'] }}">
    <meta property="og:title" content="{{ $seo['title'] }}">
    <meta property="og:description" content="{{ $seo['description'] }}">
    <meta property="og:image" content="{{ $seo['image'] }}">
    <meta property="og:image:secure_url" content="{{ $seo['image'] }}">
    <meta property="og:image:type" content="image/webp">
    <meta property="og:image:width" content="1200">
    <meta property="og:image:height" content="630">
    <meta property="og:image:alt" content="{{ $seo['imageAlt'] }}">
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="{{ $seo['title'] }}">
    <meta name="twitter:description" content="{{ $seo['description'] }}">
    <meta name="twitter:image" content="{{ $seo['image'] }}">
    <meta name="twitter:image:alt" content="{{ $seo['imageAlt'] }}">
    <script type="application/ld+json">{!! json_encode($seo['schema'], JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE) !!}</script>
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
