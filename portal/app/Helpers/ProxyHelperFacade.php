<?php
namespace App\Helpers;

use Illuminate\Support\Facades\Facade;

/**
 *  This class is found on https://github.com/jespanag/Laravel-Proxy-Helper
 */

class ProxyHelperFacade extends Facade {

  protected static function getFacadeAccessor(){
    return "ProxyHelper";
  }
}
