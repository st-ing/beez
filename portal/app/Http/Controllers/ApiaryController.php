<?php

namespace App\Http\Controllers;
use MatanYadaev\EloquentSpatial\Objects\Geometry;
use App\Beehive;
use App\Http\Requests\ApiaryRequest;
use Illuminate\Http\Request;
use App\Apiary;

class ApiaryController extends Controller
{
  /**
   * @param Request $request
   * @param $id
   * @return Apiary[]|\Illuminate\Database\Eloquent\Collection
   */
    public function index(Request $request,$id){
        return Apiary::all()->where('owner_id',$id);
    }

  /**
   * @param $id
   * @return mixed
   */
    public function apiaryOperations($id){
      $apiary = Apiary::find($id);
      $operations = $apiary->operations()->where('template','=',0)->orderBy('planned_date','asc')->get();
      $beehives = $apiary->beehives()->get();
      foreach ($beehives as $beehive) {
        $beehiveOperations = $beehive->operations()->where('template','=',0)->orderBy('planned_date','asc')->get();
        foreach ($beehiveOperations as $op){
          if(!$operations->contains($op)) {
            $operations->push($op);
          }
        }
      }
      return $operations;
    }

  /**
   * @param $id
   * @return mixed
   */
    public function show($id) {
        return Apiary::find($id);
    }

  /**
   * @param Request $request
   * @param $id
   * @return array
   */
    public function allApiaries(Request $request,$id){
        $apiaries =  Apiary::all()->where('owner_id',$id);
        $beehives = Beehive::all()->where('owner_id',$id);
        $allApiaries= array();
        $apiary_ids= array();
        foreach ($apiaries as $apiary) {
            $apiary_ids[] = $apiary->id;
        }
        foreach ($beehives as $beehive) {
            if(!in_array($beehive->apiary_id,$apiary_ids)){
                $apiary_ids[] = $beehive->apiary_id;
            }
        }
        foreach ($apiary_ids as $data) {
            $allApiaries[] = Apiary::find($data);
        }
        return $allApiaries;
    }

  /**
   * @param ApiaryRequest $request
   * @return Apiary
   */
    public function store(ApiaryRequest $request){
        $apiary = new Apiary();
        if($request->db_shape) {
            $apiary->area = Geometry::fromJson($request->db_shape);
        }
        $apiary->name = $request->name;
        $apiary->description = $request->description;
        $apiary->address = $request->address;
        $apiary->altitude = $request->altitude;
        $apiary->type_of_env = $request->type_of_env;
        $apiary->flora_type = $request->flora_type;
        $apiary->sun_exposure = $request->sun_exposure;
        $apiary->migrate = $request->migrate;
        $apiary->owner_id = $request->owner_id;
        $apiary->save();
        return $apiary;
    }

  /**
   * @param ApiaryRequest $request
   * @param $id
   * @return mixed
   */
    public function update(ApiaryRequest $request, $id ){
        $apiary = Apiary::findOrFail($id);
        if(strtotime($apiary->updated_at) !== strtotime($request->updated_at)){
          return 404;
        }
        if($request->db_shape) {
            $apiary->area = Geometry::fromJson($request->db_shape);
        }
        $apiary->update($request->all());

        return $apiary;
    }

  /**
   * @param Request $request
   * @param $id
   * @return int
   */
    public function delete(Request $request, $id){
        $apiary = Apiary::findOrFail($id);

        $beehives = Apiary::find($id)->beehives;
        foreach ($beehives as $beehive) {
            $beehive->delete();
        }

        $apiary->delete();

        return 204;
    }
}
