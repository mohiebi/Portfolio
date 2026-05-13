<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Controllers\Auth\Concerns\StoresIntendedRedirect;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Laravel\Socialite\Facades\Socialite;
use Illuminate\Support\Str;

class GoogleAuth extends Controller
{
    use StoresIntendedRedirect;

    public function auth(Request $request)
    {
        $this->storeIntendedRedirect($request);

        return Socialite::driver('google')->redirect();
    }

    public function callback(Request $request)
    {
        try {
            $googleUser = Socialite::driver('google')->user();
            $user= User::where('email' , $googleUser->email)->first();
            
            if($user)
            {
                Auth::login($user);
            }else{
                $newUser= User::create([
                    'name' => $googleUser->name,
                    'email' => $googleUser->email,
                    'password' => Str::random(32),
                ]);
                Auth::login($newUser);
            }

            $request->session()->regenerate();
        } catch (\Throwable $th) {

            return redirect()->route('login')->with('error' , 'loginfailed');
        };

        return redirect()->intended($this->intendedFallback($request));
    } 
}
