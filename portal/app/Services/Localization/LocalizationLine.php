<?php

namespace App\Services\Localization;

use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Log;
use Monolog\Formatter\LogglyFormatter;
use Spatie\TranslationLoader\LanguageLine;

class LocalizationLine extends LanguageLine
{
  /** @var array */
  public $translatable = ['translation'];

  /** @var array */
  public $guarded = ['id'];

  protected $table = 'localizations';

  private static $translations = [];

  public $timestamps = true;

  /**
   * @param string $locale
   * @param string $group
   * @return array
   */
  public static function getTranslationsForGroup(string $locale='en', string $group='email'): array
  {
    $key = 'beez-translations-'.$locale;

    if (Cache::has($key)){
      $content = Cache::get($key);
      LocalizationLine::$translations = $content;
      return $content;
    }

    // load translations for corresponding logic_group and language
    $lines = static::query()
      ->where('language',$locale)
      ->get();

    $content = [];
    foreach ($lines as $l){
      $content[$l->key_path]=$l->translation;
    }

    LocalizationLine::$translations = $content;

    Cache::put($key, $content);

    return $content;
  }
}
