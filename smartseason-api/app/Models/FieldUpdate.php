<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class FieldUpdate extends Model
{
    protected $fillable = ['field_id', 'agent_id', 'stage', 'notes'];

    public function field() { return $this->belongsTo(Field::class); }
    public function agent() { return $this->belongsTo(User::class, 'agent_id'); }
}
