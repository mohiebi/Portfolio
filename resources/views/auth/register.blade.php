@extends('auth.layout')

@section('title' , 'Login Panel')
  


@section('content')
<div id="app">
  <section class="section">
    <div class="container mt-5">
      <div class="row">
        <div class="col-12 col-sm-8 offset-sm-2 col-md-6 offset-md-3 col-lg-6 offset-lg-3 col-xl-4 offset-xl-4">
          <div class="login-brand">
            <img src="/img/M.H.Ebrahimi.webp" width="100" class="shadow-light rounded-circle" alt="M.H.Ebrahimi">
          </div>

          <div class="card card-primary">
            <div class="card-header"><h4>Register</h4></div>

            <div class="card-body">

              @if(session('status'))
                <p class="text-success" > {{session('status')}} </p>
              @endif

              <form method="POST" action="{{ route('register') }}">
                @csrf

                <!-- Name -->
                <div class="form-group">
                  <label for="name">Name</label>
                  <input id="name" type="name" class="form-control"  name="name" tabindex="1" required autofocus>
                  <x-input-error :messages="$errors->get('name')" class="mt-2" />
                </div>

                <!-- Email Address -->
                <div class="form-group">
                  <label for="email">Email</label>
                  <input id="email" type="email" class="form-control" value="{{old('email')}}" name="email" tabindex="1" required autofocus>
                  <x-input-error :messages="$errors->get('email')" class="mt-2" />
                </div>

                <!-- Password -->
                <div class="form-group">
                  <div class="d-block">
                    <label for="password" class="control-label">Password</label>
                  </div>
                  <input id="password" type="password" class="form-control" name="password" tabindex="2" required autocomplete="new-password">
                  <x-input-error :messages="$errors->get('password')" class="mt-2" />
                </div>

                <!-- Confirm Password -->
                <div class="form-group">
                  <div class="d-block">
                    <label for="password_confirmation" class="control-label">Confirm Password</label>
                  </div>
                  <input id="password_confirmation" type="password" class="form-control" name="password_confirmation" tabindex="2" required autocomplete="new-password">
                  <x-input-error :messages="$errors->get('password_confirmation')" class="mt-2" />
                </div>

                <div class="flex items-center justify-end mt-4">
                    <a class="underline text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-gray-800" href="{{ route('login') }}">
                        {{ __('Already registered?') }}
                    </a>

                <div class="form-group">
                  <div class="custom-control custom-checkbox">
                    <input type="checkbox" name="remember" class="custom-control-input" tabindex="3" id="remember-me">
                    <label class="custom-control-label" for="remember-me">Remember Me</label>
                  </div>
                </div>

                <div class="form-group">
                  <button type="submit" class="btn btn-primary btn-lg btn-block" tabindex="4">
                    Register
                  </button>
                </div>
              </form>
                <div class="form-group">
                  <a href="{{route('googleLogin')}}"  class="btn btn-danger  btn-lg btn-block" tabindex="4">
                    Google Register
                  </a>
                </div>


            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</div>
@endsection

