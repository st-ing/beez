<?php

namespace App\Http\Controllers;

use App\Localization;

use Illuminate\Database\Eloquent\Collection;
use Illuminate\Http\Request;

class LocalizationController extends Controller
{
  /**
     * This function will get all translations based on language
     * @param Request $request
     * @param $language
     * @return Localization[]|Collection
     */
    public function fetchTranslations(Request $request,$language){
      return Localization::all()->where('language',$language);
    }
}
