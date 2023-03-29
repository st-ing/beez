<?php

namespace App\Http\Controllers;

use App\Events\GoogleAccountCreated;
use App\User;
use Illuminate\Support\Facades\App;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Laravel\Socialite\Facades\Socialite;

class GoogleLoginController extends Controller
{
    public function googleLogin(){
      return Socialite::driver('google')->stateless()->redirect()->getTargetUrl();
    }

    public function googleRedirect(){
      $user = Socialite::driver('google')->stateless()->user();
      $userCreated = User::where('email', $user->email)->first();
      if(!$userCreated)
      {
        $languages = array('de','sr','en','sr-Cyrl');
        if (in_array($user->user['locale'], $languages)) {
          App::setLocale($user->user['locale']);
        }else{
          App::setLocale( 'en');
        }
        $userCreated = new User;
        $userCreated->name = $user->name;
        $userCreated->email = $user->email;
        $userCreated->password = Hash::make(Str::random(24));
        $logo = file_get_contents($user->avatar);
        $base64 = base64_encode($logo);
        $userCreated->image = $base64;
        $userCreated->save();
        $userCreated->markEmailAsVerified();
        event(new GoogleAccountCreated($userCreated));
      }
      Auth::login($userCreated,true);
      return redirect('/');
    }
}
