<?php

namespace App\Listeners;

use App\Notifications\CustomVerifyChangedEmailNotification;
use Illuminate\Support\Facades\Log;

class VerifyNewMailListener
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
        $event->user->notify(new CustomVerifyChangedEmailNotification());
      }
      catch(\Exception $e){
        Log::error('Verify mail not sent '.$e);
      }
    }
}
