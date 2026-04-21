<?php
namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Model;

class Field extends Model
{
    protected $fillable = ['name', 'crop_type', 'planting_date', 'stage', 'assigned_agent_id'];
    protected $appends = ['status'];

    public function agent()
    {
        return $this->belongsTo(User::class, 'assigned_agent_id');
    }

    public function updates()
    {
        return $this->hasMany(FieldUpdate::class);
    }

    // Computed status — explained in README
    public function getStatusAttribute(): string
    {
        if ($this->stage === 'Harvested') {
            return 'Completed';
        }

        $daysSincePlanting = Carbon::parse($this->planting_date)->diffInDays(now());

        if ($daysSincePlanting > 90 && !in_array($this->stage, ['Ready', 'Harvested'])) {
            return 'At Risk';
        }

        return 'Active';
    }
}
