<?php

use App\Http\Controllers\AssessmentController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\ResultController;
use App\Http\Controllers\SettingsController;
use Illuminate\Support\Facades\Route;

Route::post('/login', [AuthController::class, 'login']);

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/team', [AssessmentController::class, 'team']);
    Route::get('/assessments/{assessedId}', [AssessmentController::class, 'template']);
    Route::post('/assessments/{assessedId}', [AssessmentController::class, 'store']);
    Route::get('/results/{userId}', [ResultController::class, 'show']);
});

Route::middleware(['auth:sanctum', 'admin'])->group(function () {
    Route::get('/settings/periods', [SettingsController::class, 'periods']);
    Route::post('/settings/periods', [SettingsController::class, 'storePeriod']);
    Route::post('/settings/periods/{periodId}/toggle', [SettingsController::class, 'togglePeriod']);

    Route::get('/settings/questions', [SettingsController::class, 'questions']);
    Route::post('/settings/questions', [SettingsController::class, 'storeQuestion']);
    Route::put('/settings/questions/{questionId}', [SettingsController::class, 'updateQuestion']);
    Route::delete('/settings/questions/{questionId}', [SettingsController::class, 'destroyQuestion']);

    Route::post('/settings/questions/{questionId}/choices', [SettingsController::class, 'storeChoice']);
    Route::put('/settings/choices/{choiceId}', [SettingsController::class, 'updateChoice']);
    Route::delete('/settings/choices/{choiceId}', [SettingsController::class, 'destroyChoice']);

    Route::get('/settings/components', [SettingsController::class, 'components']);
    Route::put('/settings/components/{componentId}', [SettingsController::class, 'updateComponent']);
});
