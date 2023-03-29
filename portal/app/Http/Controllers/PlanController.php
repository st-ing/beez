<?php

namespace App\Http\Controllers;

use App\Apiary;
use App\Http\Requests\PlanRequest;
use App\Operation;
use App\Plan;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;

class PlanController extends Controller
{

  /**
   * Return all plans
   * @param Request $request
   * @return Plan[]|\Illuminate\Database\Eloquent\Collection
   */
  public function index(Request $request){
    return Plan::where('template', '=','0')->where('user_id','=',Auth::id())
      ->orWhere(function($query) {
        $query->where('template', '=','0')->where('user_id',null);
      })->get();
  }

  /**
   * @param Request $request
   * @return mixed
   */
  public function plansTemplates(Request $request){
    return Plan::template()->where('user_id','=',Auth::id())
      ->orWhere(function($query) {
        $query->template()->where('user_id',null);
      })->get();
  }

  /**
   * @param $id
   * @return mixed
   */
  public function planOperations($id){
    $operations = Plan::find($id)->operations;
    return $operations;
  }


  /**
   * return specific plan
   * @param $id
   * @return mixed
   */
  public function show($id) {
    $plan = Plan::find($id);
    if(!isset($plan)){
      return response()->json(["message" => "Plan does not exist"]);
    }
    if (!$plan->user_id == Auth::id() && $plan->user_id != null ){
      return response()->json(["message" => "U are not authorized"]);
    }
    return $plan;
  }

  /**
   * Save new plan and returns it
   * @param PlanRequest $request
   * @return Plan
   */
  public function store(PlanRequest $request){
    $plan = new Plan();
    $plan->title = $request->title;
    $plan->description = $request->description;
    $plan->start_date = $request->start_date;
    $plan->stop_date = $request->stop_date;
    $plan->user_id = $request->user_id;
    $plan->template = $request->template;
    $plan->save();
    return $plan;
  }

  /**
   * Return updated plan or fails
   * @param PlanRequest $request
   * @param $id
   * @return mixed
   */
  public function update(PlanRequest $request, $id){
    $plan = Plan::findOrFail($id);
    if(strtotime($plan->updated_at) !== strtotime($request->updated_at)){
      return 404;
    }
    $plan->title = $request->title;
    $plan->description = $request->description;
    $plan->start_date = $request->start_date;
    $plan->stop_date = $request->stop_date;
    $plan->user_id = $request->user_id;
    $plan->template = $request->template;
    $plan->update($request->all());
    return $plan;
  }

  /**
   * Delete plan with given id
   * @param Request $request
   * @param $id
   * @return mixed
   */
  public function delete(Request $request, $id){
    $plan = Plan::findOrFail($id);

    $operations = Plan::find($id)->operations;
    foreach ($operations as $operation) {
      $operation->delete();
    }

    $plan->delete();
    return $plan;
  }

  public function initializePlan(Request $request,$id){

    $plan = new Plan();
    $plan->title = $request->title;
    $plan->description = $request->description;
    $plan->start_date = $request->start_date;
    $plan->stop_date = $request->stop_date;
    $plan->user_id = Auth::id();
    $plan->template = false;
    $plan->save();

    $operations = Plan::findOrFail($id)->operations;
    $operationsObjects = [];
    $operationsSelected = $request->operations;
    $keyData = 0;

    foreach ($operations as $key => $request) {
      foreach ($operationsSelected as $operationKey => $requestOp) {
        if($requestOp['id'] === $request->id){
          if(empty($requestOp['apiaries']) && empty($requestOp['beehives'])){
              $operation = new Operation();
              $operation->name = $request->name;
              $operation->description = $request->description;
              $operation->status = 'planned';
              $operation->planning_comments = $request->planning_comments;
              $operation->planned_date = Carbon::now()->format('Y-m-d');
              $operation->executed_date = $request->executed_date;
              $operation->execution_comments = $request->execution_comments;
              $operation->type = $request->type;
              $operation->harvest_honey = $request->harvest_honey;
              $operation->harvest_weight = $request->harvest_weight;
              $operation->harvest_batch_id = $request->harvest_batch_id;
              $operation->template = false;
              $operation->user_id = Auth::id();
              $operation->plan_id = $plan->id;
              $operation->beehive_id = null;
              $operation->apiary_id =  null;
              $operation->save();
              $operationsObjects[$keyData] = $operation;
              $keyData=$keyData+1;
          }else {
            foreach ($requestOp['apiaries'] as $apairyKey => $apiary) {
              $operation = new Operation();
              $operation->name = $request->name;
              $operation->description = $request->description;
              $operation->status = 'planned';
              $operation->planning_comments = $request->planning_comments;
              $operation->planned_date = Carbon::now()->format('Y-m-d');
              $operation->executed_date = $request->executed_date;
              $operation->execution_comments = $request->execution_comments;
              $operation->type = $request->type;
              $operation->harvest_honey = $request->harvest_honey;
              $operation->harvest_weight = $request->harvest_weight;
              $operation->harvest_batch_id = $request->harvest_batch_id;
              $operation->template = false;
              $operation->user_id = Auth::id();
              $operation->plan_id = $plan->id;
              $operation->beehive_id = null;
              $operation->apiary_id = (int)$apiary;
              $operation->save();
              $operationsObjects[$keyData] = $operation;
              $keyData=$keyData+1;
            }
            foreach ($requestOp['beehives'] as $beehiveKey => $beehive) {
              $operation = new Operation();
              $operation->name = $request->name;
              $operation->description = $request->description;
              $operation->status = 'planned';
              $operation->planning_comments = $request->planning_comments;
              $operation->planned_date = Carbon::now()->format('Y-m-d');
              $operation->executed_date = $request->executed_date;
              $operation->execution_comments = $request->execution_comments;
              $operation->type = $request->type;
              $operation->harvest_honey = $request->harvest_honey;
              $operation->harvest_weight = $request->harvest_weight;
              $operation->harvest_batch_id = $request->harvest_batch_id;
              $operation->template = false;
              $operation->user_id = Auth::id();
              $operation->plan_id = $plan->id;
              $operation->beehive_id = (int)$beehive;
              $operation->apiary_id = null;
              $operation->save();
              $operationsObjects[$keyData] = $operation;
              $keyData=$keyData+1;
            }
          }
        }
      }
    }

    return response()->json([
      'plan' => $plan,
      'operations' => $operationsObjects,
    ]);

  }
}
