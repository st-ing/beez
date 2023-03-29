<?php
namespace App\Http\Requests;
use Illuminate\Foundation\Http\FormRequest;

class PlanRequest extends FormRequest
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
      'title' => 'required|max:255',
      'description' => 'nullable|max:1024',
      'start_date' => 'date',
      'stop_date' => 'date',
      'user_id' => 'nullable|integer',
    ];
  }
}
