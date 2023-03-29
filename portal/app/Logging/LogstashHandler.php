<?php

namespace App\Logging;

// use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Log;
use Monolog\Handler\HandlerInterface;

class LogstashHandler implements HandlerInterface
{

  /**
   * Checks whether the given record will be handled by this handler.
   *
   * This is mostly done for performance reasons, to avoid calling processors for nothing.
   *
   * Handlers should still check the record levels within handle(), returning false in isHandling()
   * is no guarantee that handle() will not be called, and isHandling() might not be called
   * for a given record.
   *
   * @param array $record Partial log record containing only a level key
   *
   * @return bool
   */
  public function isHandling(array $record): bool
  {
    // For now we will simply return true.
    return true;
  }

  /**
   * This handle method will log record on logstash using curl.
   * It sends post request with basic authorization in the header.
   *
   * @param array $record
   * @return bool
   */
  public function handle(array $record): bool
  {
    // Initialize curl
    $curl = curl_init();

    // Add additional data
    $record['application'] = 'beez';
    $record['environment'] = env('APP_ENV');

    // Make curl request
    curl_setopt_array($curl, array(
      CURLOPT_URL => 'https://' . env('LOGSTASH_HOST'),
      CURLOPT_RETURNTRANSFER => true,
      CURLOPT_CUSTOMREQUEST => "POST",
      CURLOPT_POSTFIELDS => json_encode($record),
      CURLOPT_HTTPHEADER => array(
        // Set headers
        'Authorization: Basic ' . base64_encode(env('LOGSTASH_USERNAME') . ':' . env('LOGSTASH_PASSWORD')),
      ),
    ));

    // Execute curl request
    curl_exec($curl);

    /* In case you would like to see curl info, uncomment lines bellow.
    // Check if any error occurred
    if (!curl_errno($curl)) {
      $info = curl_getinfo($curl);
      Log::channel('stack')->error($info);
    }
    */

    /*
    In case you want to see whether there is server error,
    uncomment the following lines and check laravel.log file.
    // Server error
    $error = curl_error($curl);
    Log::channel('stack')->error($error);
    */

    // Close curl connection
    curl_close($curl);

    return true;
  }

  public function handleBatch(array $records): void
  {
    // TODO: Implement handleBatch() method.
  }

  public function close(): void
  {
    // TODO: Implement close() method.
  }
}
