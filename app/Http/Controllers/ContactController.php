<?php

namespace App\Http\Controllers;

use App\Models\contact;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;

class ContactController extends Controller
{
    public function contact(Request $request)
    {   
        // dd($request->options);
        $validatedData = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255',
            'options' => 'required|array',
            'options.*' => 'string',
        ]);

        Contact::create([
            'name' => $validatedData['name'],
            'email' => $validatedData['email'],
            'services' => json_encode($validatedData['options']) ,
        ]);
        flash()->success('Your request has been sent!');
        //mail('e.mohamadhosein@gmail.com' , 'contact' , implode(',' ,$validatedData['options']));
        return redirect()->back();
        }
}
