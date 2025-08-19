<!DOCTYPE html>
<html lang="en">
<head>
  <title>{{ config('app.name', 'M.H.Developer') }}</title>
  <link rel="icon" type="image/x-icon" href="/img/M.H.Ebrahimi-white.webp">
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="description" content="Personal Portfolio">
  <meta name="keywords" content="php, laravel, portfolio">
  <meta name="author" content="M.H.Developer">
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/iconoir-icons/iconoir@main/css/iconoir.css">

  
  @vite(['resources/css/app.css', 'resources/js/app.js'])

</head>
<body>

  <!-- notification for small viewports and landscape oriented smartphones -->
  <div class="device-notification">
    <a class="device-notification--logo" href="#0">
      <img src="assets/img/logo.png" alt="Global">
      <p>Global</p>
    </a>
    <p class="device-notification--message">Global has so much to offer that we must request you orient your device to portrait or find a larger screen. You won't be disappointed.</p>
  </div>
  
  <div class="perspective effect-rotate-left">
    <div class="container"><div class="outer-nav--return"></div>
      <div id="viewport" class="l-viewport">
        <div class="l-wrapper">
          
          @include('front.layouts.header')


          @include('front.layouts.nav')

          @include('front.layouts.content')
        </div>
      </div>
    </div>
    <ul class="outer-nav">
      <li class="is-active">Home</li>
      <li>Works</li>
      <li>About</li>
      <li>Contact</li>
      <li>Hire me</li>
    </ul>
  </div>
  
  <script src="https://ajax.googleapis.com/ajax/libs/jquery/2.2.4/jquery.min.js"></script>
  {{-- <script data-cfasync="false" src="/cdn-cgi/scripts/5c5dd728/cloudflare-static/email-decode.min.js"></script> --}}

  </body>
</html>
