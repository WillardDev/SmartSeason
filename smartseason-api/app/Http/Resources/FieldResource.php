<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class FieldResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id'           => $this->id,
            'name'         => $this->name,
            'crop_type'    => $this->crop_type,
            'planting_date'=> $this->planting_date,
            'stage'        => $this->stage,
            'status'       => $this->status,  // computed accessor
            'agent'        => $this->whenLoaded('agent', fn() => [
                'id'   => $this->agent->id,
                'name' => $this->agent->name,
            ]),
            'updates'      => FieldUpdateResource::collection($this->whenLoaded('updates')),
            'created_at'   => $this->created_at,
        ];
    }
}
