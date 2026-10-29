<?php

use App\Http\Controllers\AssessmentController;
use App\Http\Controllers\AuthController;
use Illuminate\Support\Facades\Route;

Route::post('/login', [AuthController::class, 'login']);

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/team', [AssessmentController::class, 'team']);
    Route::get('/assessments/{assessedId}', [AssessmentController::class, 'template']);
    Route::post('/assessments/{assessedId}', [AssessmentController::class, 'store']);
});
