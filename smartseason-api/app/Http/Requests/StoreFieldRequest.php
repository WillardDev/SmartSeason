<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class StoreFieldRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'name'              => 'required|string|max:255',
            'crop_type'         => 'required|string|max:255',
            'planting_date'     => 'required|date',
            'stage'             => 'sometimes|in:Planted,Growing,Ready,Harvested',
            'assigned_agent_id' => 'nullable|exists:users,id',
        ];
    }
}
