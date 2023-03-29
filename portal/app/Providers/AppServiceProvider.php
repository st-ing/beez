<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use Illuminate\Support\Facades\URL;
use App\Helpers\ProxyHelper;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     *
     * @return void
     */
    public function register()
    {
      $this->app->bind('ProxyHelper', function($app) {
        return new ProxyHelper();
      });
    }

    /**
     * Bootstrap any application services.
     *
     * @return void
     */
  public function boot()
  {
    if($this->app->environment(['testing', 'production'])) {
      URL::forceScheme('https');
    }
  }
}