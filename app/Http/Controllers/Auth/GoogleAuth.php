<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Laravel\Socialite\Facades\Socialite;
use PhpParser\Node\Stmt\TryCatch;

class GoogleAuth extends Controller
{
    public function auth(Request $request)
    {
        // $userPath= request();
        // dd($userPath);
        return Socialite::driver('google')->redirect();
    }

    public function callback()
    {
        try {
            $googleUser = Socialite::driver('google')->user();
            $user= User::where('email' , $googleUser->email)->first();
            
            if($user)
            {
                Auth::login($user);
            }else{
                $newUser= User::create([
                    'name' => $user->name,
                    'email' => $user->email,
                    'password' => $user->name + $user->email
                ]);
                Auth::login($newUser);
            }
        } catch (\Throwable $th) {

            redirect()->route('login')->with('error' , 'loginfailed');
        };
        return redirect()->route('portfolio');
    } 
}
