@extends('auth.layout')

@section('title' , 'Login Panel')
  


@section('content')
<div id="app">
  <section class="section">
    <div class="container mt-5">
      <div class="row">
        <div class="col-12 col-sm-8 offset-sm-2 col-md-6 offset-md-3 col-lg-6 offset-lg-3 col-xl-4 offset-xl-4">
          <div class="login-brand">
            {{-- <img src="../assets/img/stisla-fill.svg" alt="logo" width="100" class="shadow-light rounded-circle"> --}}
            <img src="/img/M.H.Ebrahimi.webp" width="100" class="shadow-light rounded-circle" alt="M.H.Ebrahimi">
          </div>

          <div class="card card-primary">
            <div class="card-header"><h4>Login</h4></div>

            <div class="card-body">

              @if(session('status'))
                <p class="text-success" > {{session('status')}} </p>
              @endif

              <form method="POST" action="{{ route('login') }}" class="needs-validation" novalidate="">
                @csrf
                  <div class="form-group">
                  <label for="email">Email</label>
                  <input id="email" type="email" class="form-control" value="{{old('email')}}"" name="email" tabindex="1" required autofocus>

                  <x-input-error :messages="$errors->get('email')" class="mt-2" />

                </div>

                <div class="form-group">
                  <div class="d-block">
                    <label for="password" class="control-label">Password</label>
                    <div class="float-right">
                      <a href="{{ route('password.request') }}" class="text-small">
                        Forgot Password?
                      </a>
                    </div>
                  </div>
                  <input id="password" type="password" class="form-control" name="password" tabindex="2" required>
                  <x-input-error :messages="$errors->get('password')" class="mt-2" /> 
                  
                </div>

                <div class="form-group">
                  <div class="custom-control custom-checkbox">
                    <input type="checkbox" name="remember" class="custom-control-input" tabindex="3" id="remember-me">
                    <label class="custom-control-label" for="remember-me">Remember Me</label>
                  </div>
                </div>

                <div class="form-group">
                  <button type="submit" class="btn btn-primary btn-lg btn-block" tabindex="4">
                    Login
                  </button>
                </div>
              </form>
                <div class="form-group">
                  <a href="{{route('googleLogin')}}"  class="btn btn-danger  btn-lg btn-block" tabindex="4">
                    Google Login
                  </a>
                </div>


            </div>
          </div>
          <div class="mt-5 text-muted text-center">
            Don't have an account? <a href="{{route('register')}}">Create One</a>
          </div>
          <div class="simple-footer">
            Copyright &copy; Stisla 2018
          </div>
        </div>
      </div>
    </div>
  </section>
</div>
@endsection