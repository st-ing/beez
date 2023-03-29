<?php
namespace App\Http\Requests;
use Illuminate\Foundation\Http\FormRequest;

class OperationRequest extends FormRequest
{
  /**
   * Determine if the user is authorized to make this request.
   *
   * @return bool
   */
  public function authorize()
  {
    return true;
  }
  /**
   * Get the validation rules that apply to the request.
   *
   * @return array
   */
  public function rules()
  {
    return [
      'name' => 'required|max:255',
      'description' => 'nullable|max:1024',
      'status' => 'nullable|in:planned,started,done,canceled',
      'planned_comments' => 'nullable|max:4096',
      'planned_date' => 'nullable|date',
      'executed_date' => 'nullable|date',
      'execution_comments' => 'nullable|max:4096',
      'type' => 'required|in:harvest,interventions,analysis,custom',
      'harvest_honey' => 'nullable|max:45',
      'harvest_weight' => 'nullable|numeric',
      'harvest_batch_id' => 'nullable|numeric',
      'template' => 'boolean|required',
      'user_id' => 'nullable|integer',
      'plan_id' =>'nullable|integer',
      'beehive_id' =>'nullable|integer',
      'apiary_id' => 'nullable|integer'
    ];
  }
}
