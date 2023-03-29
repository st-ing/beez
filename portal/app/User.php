<?php

namespace App;

use App\Notifications\CustomResetPasswordNotification;
use App\Notifications\CustomWelcomeEmailNotification;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Support\Facades\Log;

class User extends Authenticatable implements MustVerifyEmail
{
    use Notifiable;
    use SoftDeletes;
    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'name', 'email', 'password','address','role'
    ];

    /**
     * The attributes that should be hidden for arrays.
     *
     * @var array
     */
    protected $hidden = [
        'password', 'remember_token',
    ];

    /**
     * The attributes that should be cast to native types.
     *
     * @var array
     */
    protected $casts = [
        'email_verified_at' => 'datetime',
    ];


    public function operations()
    {
        return $this->hasMany('App\Operation');
    }

    public function apiaries()
    {
        return $this->hasMany('App\Apiary','owner_id');
    }

    public function beehives()
    {
        return $this->hasMany('App\Beehive','owner_id');
    }

    public function sendPasswordResetNotification($token)
    {
      try{
        $this->notify(new CustomResetPasswordNotification($token));
      }
      catch(\Exception $e){
        Log::error('Reset password mail not sent '.$e);
      }
    }
    /**
     * Send the email verification notification.
     *
     * @return void
     */
    public function sendEmailVerificationNotification()
    {
      try{
        $this->notify(new CustomWelcomeEmailNotification());
      }
      catch(\Exception $e){
        Log::error('Welcome user mail not sent '.$e);
      }
    }
}
