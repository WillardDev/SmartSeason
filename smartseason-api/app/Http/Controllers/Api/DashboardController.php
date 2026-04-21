<?php
namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Field;
use Illuminate\Http\Request;

class DashboardController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();

        $fields = $user->isAdmin()
            ? Field::with('agent')->get()
            : Field::where('assigned_agent_id', $user->id)->get();

        $statusBreakdown = $fields->groupBy(fn($f) => $f->status)
            ->map->count();

        $stageBreakdown = $fields->groupBy('stage')->map->count();

        return response()->json([
            'total_fields'     => $fields->count(),
            'status_breakdown' => $statusBreakdown,
            'stage_breakdown'  => $stageBreakdown,
            'at_risk_fields'   => $fields->where('status', 'At Risk')->values(),
        ]);
    }
}
