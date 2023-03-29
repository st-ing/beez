<?php

namespace App\Http\Controllers;
use InfluxDB2\Client;
use App\Beehive;

class DataController extends Controller
{
  /**
   * getData function returns array with data for air,telemetry and battery for current node
   *
   * @param $id is a beehive id
   */

  public function getData($id)
  {
    $state=0;
    $measurementData=[];
    $url = env('INFLUX_URL');
    $token = env('INFLUX_TOKEN');
    $bucket = env('INFLUX_BUCKET');
    $org = env('INFLUX_ORG');

    $client = new Client([
      "url" => $url,
      "token" => $token,
      "bucket" => $bucket,
      "org" => $org
    ]);
    $node = Beehive::find($id)->node()->where('beehive_id','=',$id)->first(array('id'));
    $queryApi = $client->createQueryApi();
    $setting = (new SettingsController)->settingsByKey('ui.graphs.number_of_days');

    $query = "from(bucket: \"$bucket\")
	|> range(start: -$setting->value)
	|> filter(fn: (r) => r._measurement == \"air\" or r._measurement == \"telemetry\")
	|> filter(fn: (r) => r._field == \"temperature\" or r._field == \"humidity\" or r._field == \"battery\")
	|> filter(fn: (r) => r.node == \"$node->id\")
	|> last()";

    $tables = $queryApi->query($query, $org);
    foreach ($tables as $table) {
      foreach ($table->records as $record) {
        $measurementData[$state] = $record->values;
     }
      $state++;
    }
    return $measurementData;
  }
}
