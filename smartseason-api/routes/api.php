<?php
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\FieldController;
use App\Http\Controllers\Api\FieldUpdateController;
use App\Http\Controllers\Api\DashboardController;
use Illuminate\Support\Facades\Route;

Route::post('/login', [AuthController::class, 'login']);
Route::post('/register', [AuthController::class, 'register']);

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/me',      [AuthController::class, 'me']);

    Route::get('/dashboard', [DashboardController::class, 'index']);

    Route::get('/fields',        [FieldController::class, 'index']);
    Route::get('/fields/{field}', [FieldController::class, 'show']);

    // Admin-only routes
    Route::middleware('role.admin')->group(function () {
        Route::get('/users', function (Request $request) {
            $users = \App\Models\User::select('id', 'name', 'role')->get();
            return response()->json(['data' => $users]);
        });
        Route::post('/fields',           [FieldController::class, 'store']);
        Route::put('/fields/{field}',    [FieldController::class, 'update']);
        Route::delete('/fields/{field}', [FieldController::class, 'destroy']);
    });

    // Agent field updates
    Route::post('/fields/{field}/updates', [FieldUpdateController::class, 'store']);
    Route::get('/fields/{field}/updates',  [FieldUpdateController::class, 'index']);
});
