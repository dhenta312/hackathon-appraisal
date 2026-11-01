<?php

namespace App\Http\Controllers;

use App\Models\Appeal;
use App\Models\Period;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AppealController extends Controller
{
    /**
     * Submit a review appeal (banding) for the current period.
     */
    public function store(Request $request): JsonResponse
    {
        $user = $request->user();

        $data = $request->validate([
            'reason' => ['required', 'string'],
        ]);

        $appeal = Appeal::create([
            'user_id' => $user->id,
            'period' => Period::open()?->name ?? '2026-Q4',
            'reason' => $data['reason'],
            'status' => 'pending',
        ]);

        return response()->json(['appeal' => $appeal], 201);
    }

    /**
     * List all appeals (admin only).
     */
    public function index(): JsonResponse
    {
        return response()->json([
            'appeals' => Appeal::with('user')->orderByDesc('created_at')->get(),
        ]);
    }
}
