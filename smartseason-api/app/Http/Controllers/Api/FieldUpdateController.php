<?php
namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreFieldUpdateRequest;
use App\Http\Resources\FieldUpdateResource;
use App\Models\Field;
use Illuminate\Http\Request;

class FieldUpdateController extends Controller
{
    public function index(Field $field)
    {
        return FieldUpdateResource::collection($field->updates()->with('agent')->latest()->get());
    }

    public function store(StoreFieldUpdateRequest $request, Field $field)
    {
        $update = $field->updates()->create([
            'agent_id' => $request->user()->id,
            'stage'    => $request->validated('stage'),
            'notes'    => $request->validated('notes'),
        ]);

        // Also update the field's current stage
        $field->update(['stage' => $request->validated('stage')]);

        return new FieldUpdateResource($update->load('agent'));
    }
}
