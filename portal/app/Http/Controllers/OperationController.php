<?php

namespace App\Http\Controllers;

use App\Http\Requests\OperationRequest;
use App\Operation;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class OperationController extends Controller
{

  /**
   * All operations of current user
   * @param Request $request
   * @return Operation[]|\Illuminate\Database\Eloquent\Collection
   */
  public function index(Request $request){
    return Operation::where('user_id','=',Auth::id())->where('template', '=','0')->get();
  }

  /**
   * Returns ongoing operations
   * @param Request $request
   * @return mixed
   */
  public function ongoingOperations(Request $request){
    return Operation::started()->where('user_id','=',Auth::id())->get();
  }

  /**
   * Returns planed operations
   * @param Request $request
   * @return mixed
   */
  public function plannedOperations(Request $request){
    return Operation::planned()->where('user_id','=',Auth::id())->get();
  }

  /**
   * Returns finished operations
   * @param Request $request
   * @return mixed
   */
  public function finishedOperations(Request $request){
    return Operation::finished()->where('user_id','=',Auth::id())->get();
  }

  /**
   * Return all template operations
   * @param Request $request
   * @return mixed
   */
  public function templateOperations(Request $request){
    return Operation::template()->where('user_id','=',Auth::id())
      ->orWhere(function($query) {
        $query->template()->where('user_id',null);
      })->get();
  }

  /**
   * @param $id
   * @return \Illuminate\Http\JsonResponse
   */
  public function show($id) {
    $operation = Operation::find($id);
    if(!isset($operation)){
      return response()->json(["message" => "Operation does not exist"]);
    }
    if (!$operation->user_id == Auth::id() && $operation->user_id != null ){
      return response()->json(["message" => "U are not authorized"]);
    }
    return $operation;
  }

  /**
   * Store operation
   * @param OperationRequest $request
   * @return Operation
   */
  public function store(OperationRequest $request){
    $operation = new Operation();
    $operation->name = $request->name;
    $operation->description = $request->description;
    $operation->status = $request->status;
    $operation->planning_comments = $request->planning_comments;
    $operation->planned_date = $request->planned_date;
    $operation->executed_date = $request->executed_date;
    $operation->execution_comments = $request->execution_comments;
    $operation->type = $request->type;
    $operation->harvest_honey = $request->harvest_honey;
    $operation->harvest_weight = $request->harvest_weight;
    $operation->harvest_batch_id = $request->harvest_batch_id;
    $operation->template = $request->template;
    $operation->user_id = $request->user_id;
    $operation->plan_id = $request->plan_id;
    $operation->beehive_id = $request->beehive_id;
    $operation->apiary_id = $request->apiary_id;
    $operation->save();
    return $operation;
  }

  /**
   * Return updated operation or fails
   * @param OperationRequest $request
   * @param $id
   * @return mixed
   */
  public function update(OperationRequest $request, $id){
    $operation = Operation::findOrFail($id);
    if(strtotime($operation->updated_at) !== strtotime($request->updated_at)){
      return 404;
    }
    $operation->name = $request->name;
    $operation->description = $request->description;
    $operation->status = $request->status;
    $operation->planning_comments = $request->planning_comments;
    $operation->planned_date = $request->planned_date;
    $operation->executed_date = $request->executed_date;
    $operation->execution_comments = $request->execution_comments;
    $operation->type = $request->type;
    $operation->harvest_honey = $request->harvest_honey;
    $operation->harvest_weight = $request->harvest_weight;
    $operation->harvest_batch_id = $request->harvest_batch_id;
    $operation->template = $request->template;
    $operation->user_id = $request->user_id;
    $operation->plan_id = $request->plan_id;
    $operation->beehive_id = $request->beehive_id;
    $operation->apiary_id = $request->apiary_id;
    $operation->update($request->all());

    return $operation;
  }

  /**
   * Delete operation and return deleted operation
   * @param Request $request
   * @param $id
   * @return mixed
   */
  public function delete(Request $request, $id){
    $operation = Operation::findOrFail($id);
    $operation->delete();

    return $operation;
  }

  public function initializeOperation(Request $request){
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
    $operation->plan_id = $request->plan_id;
    $operation->beehive_id = $request->beehive_id;
    $operation->apiary_id = $request->apiary_id;
    $operation->save();
    return $operation;
  }
}
