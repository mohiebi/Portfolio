@extends('admin.layouts.app')

@section('title' , 'Profile Information')

@section('content')
<div class="main-content">
    <section class="section">
      <div class="section-header">
        <h1>Profile</h1>
        <div class="section-header-breadcrumb">
          <div class="breadcrumb-item active"><a href="{{route('dashboard')}}">Dashboard</a></div>
          <div class="breadcrumb-item">Profile</div>
        </div>
      </div>
      <div class="section-body">
        <h2 class="section-title">Hi, {{$user->name}}</h2>
        <p class="section-lead">
          Change information about yourself on this page.
        </p>

        <div class="row mt-sm-4">
          <div class="col-12 col-md-12 col-lg-12 flex justify-between">
            <div class="card mr-1 col-md-6">
              
              <div class="card-header">
                <h4>Edit Profile</h4>
              </div>
              <div class="card-body ">
                  <form method="post" action="{{ route('profile.update') }}" class="mt-6 mr-1 space-y-6 ">
                    @csrf
                    @method('patch')
                    <div class="row">
                      <div class="form-group col-md-12 col-12">
                        <label for="name" >Name</label>
                        <input type="text" class="form-control" name="name" id="name" value="{{old('name', $user->name)}}" required="">
                        <x-input-error class="mt-2" :messages="$errors->get('name')" />

                      </div>
                      <div class="form-group col-md-12 col-12">
                        <label for="email" >Email</label>
                        <input type="email" name="email" id="email" class="form-control" value="{{old('email', $user->email)}}" required="">
                        <x-input-error class="mt-2" :messages="$errors->get('email')" />
                      </div>
                    </div>
                  </div>
                  <div class="card-footer text-center ">
                      <button class="btn btn-primary">Save Changes</button>
                  </div>
                </form>
            </div>

            <div class="card ml-1 col-md-6">
              <div class="card-header">
                <h4>Edit Password</h4>
              </div>
              <div class="card-body">
                  <form method="post" action="{{ route('password.update') }}" class="mt-6 space-y-6">
                    @csrf
                    @method('put')
                    <div class="row">
                      <div class="form-group col-md-12 col-12">
                        <label for="update_password_current_password" :value="__('Current Password')">Current Password</label>
                        <input id="update_password_current_password" name="current_password" type="password" class="form-control" autocomplete="current-password">
                        <x-input-error :messages="$errors->updatePassword->get('current_password')" class="mt-2" />
                      </div>

                      <div class="form-group col-md-12 col-12">
                        <label for="update_password_password" >New Password</label>
                        <input id="update_password_password" name="password" type="password" class="form-control" autocomplete="new-password">
                        <x-input-error :messages="$errors->updatePassword->get('password')" class="mt-2" />
                      </div>

                      <div class="form-group col-md-12 col-12">
                        <label for="update_password_password_confirmation" > RepeatPassword</label>
                        <input id="update_password_password_confirmation" name="password_confirmation" type="password" class="form-control" autocomplete="new-password" >
                        <x-input-error :messages="$errors->updatePassword->get('password_confirmation')" class="mt-2" />
                      </div>
                    </div>
                </div>
                <div class="card-footer text-center">
                  <button class="btn btn-primary">Save Changes</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
  <footer class="main-footer">
    <div class="footer-left">
      Copyright &copy; 2018 <div class="bullet"></div> Design By <a href="https://nauval.in/">Muhamad Nauval Azhar</a>
    </div>
    <div class="footer-right">
      2.3.0
    </div>
  </footer>
@endsection