<?php
namespace App\Http\Requests;
use Illuminate\Foundation\Http\FormRequest;

class BeehiveRequest extends FormRequest
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
            'description' => 'nullable|max:255',
            'type' => 'nullable|max:100',
            'latitude' => 'required|numeric|between:-90,90',
            'longitude' => 'required|numeric|between:-180,180',
            'altitude' => 'numeric|nullable',
            'num_honey_frames' => 'nullable|integer',
            'num_pollen_frames' => 'nullable|integer',
            'num_brood_frames' => 'nullable|integer',
            'num_empty_frames' => 'nullable|integer',
            'source_of_swarm' => 'nullable|max:45',
            'queen_color' => 'nullable|max:45',
            'installation_date' => 'date',
            'apiary_id' => 'nullable',
            'owner_id' => 'required',
        ];
    }
}
