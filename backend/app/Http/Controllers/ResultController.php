<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Services\ScoringService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ResultController extends Controller
{
    private const PERIOD = '2026-Q4';

    /**
     * Return the transparent score breakdown for a user.
     */
    public function show(Request $request, ScoringService $scoring, int $userId): JsonResponse
    {
        $viewer = $request->user();
        $subject = User::findOrFail($userId);

        if (! $viewer->is_admin && $viewer->id !== $subject->id) {
            abort(403, 'Tidak diizinkan melihat hasil orang lain');
        }

        return response()->json($scoring->compute($subject->id, self::PERIOD));
    }
}
