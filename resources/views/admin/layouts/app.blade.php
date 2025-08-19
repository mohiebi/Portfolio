<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <meta name="csrf-token" content="{{ csrf_token() }}">

        <title>{{ config('app.name', 'Laravel') }}</title>
        <link rel="icon" type="image/x-icon" href="/img/M.H.Ebrahimi-white.webp">
        <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css" integrity="sha384-ggOyR0iXCbMQv3Xipma34MD+dH/1fQ784/j6cY/iJTQUOhcWr7x9JvoRxT2MZw1T" crossorigin="anonymous">
        <link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.7.2/css/all.css" integrity="sha384-fnmOCqbTlWIlj8LyTjo7mOUStjsKC4pOpQbqyi7RrhN7udi9RwhKkMHpvLbHG9Sr" crossorigin="anonymous">
      

        @vite([
            'resources/css/app.css',
            'resources/css/summernote-bs4.css',
            'resources/css/selectric.css',
            'resources/css/bootstrap-tagsinput.css',
            'resources/css/bootstrap-timepicker.min.css',
            'resources/css/daterangepicker.css',
            'resources/css/select2.min.css',
            'resources/css/style.css',
            'resources/css/components.css',

            'resources/js/app.js',
            'resources/js/stisla.js',
            'resources/js/summernote-bs4.js',
            'resources/js/jquery.selectric.min.js',
            'resources/js/jquery.uploadPreview.min.js',
            'resources/js/bootstrap-tagsinput.min.js',
            'resources/js/bootstrap-timepicker.min.js',
            'resources/js/daterangepicker.js',
            'resources/js/select2.full.min.js',
            'resources/js/scripts.js',
            'resources/js/custom.js',
            'resources/js/features-post-create.js',
            'resources/js/forms-advanced-forms.js'])
    </head>
    <body class="font-sans antialiased">
            @include('admin.layouts.sidebar')
            @yield('content')


            <script src="https://cdn.jsdelivr.net/npm/jquery@3.6.0/dist/jquery.min.js"></script>
            <script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.14.7/umd/popper.min.js" integrity="sha384-UO2eT0CpHqdSJQ6hJty5KVphtPhzWj9WO1clHTMGa3JDZwrnQq4sF86dIHNDz0W1" crossorigin="anonymous"></script>
            <script src="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/js/bootstrap.min.js" integrity="sha384-JjSmVgyd0p3pXB1rRibZUAYoIIy6OrQ6VrjIEaFf/nJGzIxFDsf4x0xIM+B07jRM" crossorigin="anonymous"></script>
            <script src="https://cdnjs.cloudflare.com/ajax/libs/jquery.nicescroll/3.7.6/jquery.nicescroll.min.js"></script>
            <script src="https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.24.0/moment.min.js"></script>

            

    </body>
</html>
