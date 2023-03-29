<?php

namespace App\Http\Controllers;

use App\Beehive;
use App\Http\Requests\BeehiveRequest;
//use App\Node;
use Carbon\Carbon;
use Illuminate\Http\Request;

class BeehiveController extends Controller
{
  /**
   * @param Request $request
   * @param $id
   * @return Beehive[]|\Illuminate\Database\Eloquent\Collection
   */
    public function index(Request $request,$id){
        return Beehive::all()->where('owner_id',$id);
    }

  /**
   * @param Request $request
   * @param $id
   * @return array
   */
    public function history(Request $request , $id){
        $beehive = Beehive::find($id);
        $data = array();
        foreach ($beehive->apiaries as $history) {
            $data[] = $history;
        }
        return $data;
    }

  /**
   * @param Request $request
   * @param $id
   * @return Beehive[]|\Illuminate\Database\Eloquent\Collection
   *
   */
    public function apiaryBeehives(Request $request,$id)
    {
        return Beehive::all()->where('apiary_id',$id);
    }

  public function beehivesNode($id)
  {
    return Beehive::find($id)->node()->where('beehive_id','=',$id)->get(['id','description','serial_number','hw_version','fw_version']);
  }

  /**
   * @param $id
   * @return mixed
   */
    public function show($id) {
        return Beehive::find($id);
    }

  /**
   * @param $id
   * @return mixed
   */
  public function beehiveOperations($id){
    return Beehive::find($id)->operations()->where('template','=',0)->orderBy('planned_date','asc')->get();
  }

  /**
   * @param BeehiveRequest $request
   * @return Beehive
   */
    public function store(BeehiveRequest $request){
        $currentTime = Carbon::now();

        $beehive = new Beehive();
        $beehive->name = $request->name;
        $beehive->description = $request->description;
        $beehive->type = $request->type;
        $beehive->latitude = $request->latitude;
        $beehive->longitude = $request->longitude;
        $beehive->altitude = $request->altitude;
        $beehive->num_honey_frames = $request->num_honey_frames;
        $beehive->num_pollen_frames = $request->num_pollen_frames;
        $beehive->num_brood_frames = $request->num_brood_frames;
        $beehive->num_empty_frames = $request->num_empty_frames;
        $beehive->source_of_swarm = $request->source_of_swarm;
        $beehive->queen_color = $request->queen_color;
        $beehive->installation_date = $request->installation_date;
        $beehive->apiary_id = $request->apiary_id;
        $beehive->owner_id = $request->owner_id;
        $beehive->save();

        $beehive->apiaries()->attach($beehive->apiary_id, ['from'=> $currentTime->toDateTimeString(), 'until'=>NULL]);

        return $beehive;

    }

  /**
   * @param BeehiveRequest $request
   * @param $id
   * @return mixed
   */
    public function update(BeehiveRequest $request, $id){
        $mytime = Carbon::now();
        $beehive = Beehive::findOrFail($id);
        if(strtotime($beehive->updated_at) !== strtotime($request->updated_at)){
          return 404;
        }
        $currentApiary = $beehive->apiary_id;
        $beehive->latitude = $request->latitude;
        $beehive->longitude = $request->longitude;
        $beehive->altitude = $request->altitude;
        $beehive->update($request->all());
        if($currentApiary !== $request->apiary_id) {
            foreach ($beehive->apiaries as $history) {
                if (!$history->pivot->until) {
                    $beehive->apiaries()->updateExistingPivot($history->id, ['until' => $mytime->toDateTimeString()]);
                }
            }
            $beehive->apiaries()->attach($beehive->apiary_id, ['from' => $mytime->toDateTimeString(), 'until' => NULL]);
        }
        return $beehive;
    }

  /**
   * @param Request $request
   * @param $id
   * @return int
   */
    public function delete(Request $request, $id){
        $beehive = Beehive::findOrFail($id);
        $beehive->apiaries()->detach();
        $beehive->delete();

        return 204;
    }

}
