<?php
namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreFieldRequest;
use App\Http\Resources\FieldResource;
use App\Models\Field;
use Illuminate\Http\Request;

class FieldController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();
        $fields = $user->isAdmin()
            ? Field::with('agent')->get()
            : Field::where('assigned_agent_id', $user->id)->with('agent')->get();

        return FieldResource::collection($fields);
    }

    public function store(StoreFieldRequest $request)
    {
        $field = Field::create($request->validated());
        return new FieldResource($field->load('agent'));
    }

    public function show(Field $field)
    {
        return new FieldResource($field->load('agent', 'updates.agent'));
    }

    public function update(StoreFieldRequest $request, Field $field)
    {
        $field->update($request->validated());
        return new FieldResource($field->load('agent'));
    }

    public function destroy(Field $field)
    {
        $field->delete();
        return response()->json(['message' => 'Field deleted']);
    }
}
