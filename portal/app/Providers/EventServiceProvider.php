<?php

namespace App\Providers;

use App\Events\GoogleAccountCreated;
use App\Events\UserMailChanged;
use App\Listeners\GoogleAccountListener;
use App\Listeners\VerifyNewMailListener;
use Illuminate\Auth\Events\Registered;
use Illuminate\Auth\Listeners\SendEmailVerificationNotification;
use Illuminate\Foundation\Support\Providers\EventServiceProvider as ServiceProvider;
use Illuminate\Support\Facades\Event;

class EventServiceProvider extends ServiceProvider
{
    /**
     * The event listener mappings for the application.
     *
     * @var array
     */
    protected $listen = [
        Registered::class => [
            SendEmailVerificationNotification::class,
        ],
        UserMailChanged::class => [
          VerifyNewMailListener::class,
        ],
        GoogleAccountCreated::class => [
          GoogleAccountListener::class
        ]
    ];

    /**
     * Register any events for your application.
     *
     * @return void
     */
    public function boot()
    {
        parent::boot();

        //
    }
}
