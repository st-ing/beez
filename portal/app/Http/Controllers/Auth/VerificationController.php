<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\User;
use Illuminate\Auth\Access\AuthorizationException;
use Illuminate\Auth\Events\Verified;
use Illuminate\Foundation\Auth\VerifiesEmails;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;


class VerificationController extends Controller
{
    /*
    |--------------------------------------------------------------------------
    | Email Verification Controller
    |--------------------------------------------------------------------------
    |
    | This controller is responsible for handling email verification for any
    | user that recently registered with the application. Emails may also
    | be re-sent if the user didn't receive the original email message.
    |
    */

    use VerifiesEmails;

    /**
     * Where to redirect users after verification.
     *
     * @var string
     */
    protected $redirectTo = '/panel' ;

    /**
     * Create a new controller instance.
     *
     * @return void
     */
    public function __construct()
    {
//        $this->middleware('signed')->only('verify');
        $this->middleware('throttle:6,1')->only('verify', 'resend');
    }
    public function verify(Request $request)
    {
      Log::debug('Verification link clicked');

      $user = User::find($request->route('id'));
      if (! isset($user)) {
        Log::error('Provided user is not found in database');
        throw new AuthorizationException('Provided user is not found in database');
      }
      Log::info('Verifying user: ', [
          'id' => $user?->id,
          'email' => $user?->email,
          ]);
      $hash = (string)$request->route('hash');
      $user_hash = sha1($user->getEmailForVerification());
      if (! hash_equals($hash, $user_hash)) {
        Log::error('Provided hash does not correspond to the stored one');
        throw new AuthorizationException('Provided hash does not correspond to the stored one');
      }
      if ($user->hasVerifiedEmail()) {
        Log::notice('Email has already been verified');
        return $request->wantsJson()
          ? new JsonResponse([], 204)
          : redirect($this->redirectPath());
      }

      if ($user->markEmailAsVerified()) {
        Log::debug('User email marked as verified');
        event(new Verified($request->user()));
      }

      if ($response = $this->verified($request)) {
        Log::debug('User verified checked done');
        return $response;
      }

      return $request->wantsJson()
        ? new JsonResponse([], 204)
        : redirect($this->redirectPath())->with('verified', true);
    }
}
