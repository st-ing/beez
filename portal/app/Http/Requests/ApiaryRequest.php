<?php
namespace App\Http\Requests;
use Illuminate\Foundation\Http\FormRequest;

class ApiaryRequest extends FormRequest
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
            'address' => 'nullable|max:45',
            'owner_id' => 'integer|required',
            'altitude' => 'numeric|nullable',
            'description' => 'nullable|max:255',
            'type_of_env' => 'in:natural,urban,agriculture,other',
            'flora_type' => 'nullable|max:255',
            'sun_exposure' => 'in:low,medium,high',
            'migrate' => 'boolean|required',
            'db_shape' => 'nullable',
        ];
    }
}
