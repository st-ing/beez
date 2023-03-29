<?php

namespace App\Listeners;

use App\Notifications\CustomGoogleEmailNotification;
use Illuminate\Support\Facades\Log;

class GoogleAccountListener
{
  /**
   * Handle the event.
   *
   * @param  object  $event
   * @return void
   */
  public function handle($event)
  {
    try{
      $event->user->notify(new CustomGoogleEmailNotification());
    }
    catch(\Exception $e){
      Log::error('Welcome mail not sent '.$e);
    }
  }
}
