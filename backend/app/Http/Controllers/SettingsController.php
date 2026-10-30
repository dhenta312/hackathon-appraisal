<?php

namespace App\Http\Controllers;

use App\Models\AnswerChoice;
use App\Models\Component;
use App\Models\JobRole;
use App\Models\Period;
use App\Models\Question;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class SettingsController extends Controller
{
    // ------------------------------------------------------------
    // Periods
    // ------------------------------------------------------------

    public function periods(): JsonResponse
    {
        return response()->json([
            'periods' => Period::orderByDesc('start_date')->get(),
        ]);
    }

    public function storePeriod(Request $request): JsonResponse
    {
        $data = $request->validate([
            'name' => ['required', 'string'],
            'start_date' => ['required', 'date'],
            'end_date' => ['required', 'date', 'after_or_equal:start_date'],
        ]);

        $period = Period::create([...$data, 'is_open' => false]);

        return response()->json(['period' => $period], 201);
    }

    public function togglePeriod(Request $request, int $periodId): JsonResponse
    {
        $period = Period::findOrFail($periodId);

        if ($period->is_open) {
            $period->update(['is_open' => false]);
        } else {
            // Hanya satu periode yang boleh terbuka.
            Period::where('id', '!=', $period->id)->update(['is_open' => false]);
            $period->update(['is_open' => true]);
        }

        return response()->json(['period' => $period->fresh()]);
    }

    // ------------------------------------------------------------
    // Questions
    // ------------------------------------------------------------

    public function questions(): JsonResponse
    {
        return response()->json([
            'questions' => Question::with(['component', 'jobRole', 'choices'])
                ->orderBy('id')
                ->get(),
            'components' => Component::orderBy('id')->get(),
            'roles' => JobRole::orderBy('id')->get(),
        ]);
    }

    public function storeQuestion(Request $request): JsonResponse
    {
        $data = $request->validate([
            'text' => ['required', 'string'],
            'component_id' => ['required', 'integer', 'exists:components,id'],
            'job_role_id' => ['nullable', 'integer', 'exists:job_roles,id'],
            'sort_order' => ['nullable', 'integer'],
        ]);

        $question = Question::create($data);

        return response()->json(['question' => $question], 201);
    }

    public function updateQuestion(Request $request, int $questionId): JsonResponse
    {
        $question = Question::findOrFail($questionId);

        $data = $request->validate([
            'text' => ['required', 'string'],
            'component_id' => ['required', 'integer', 'exists:components,id'],
            'job_role_id' => ['nullable', 'integer', 'exists:job_roles,id'],
            'sort_order' => ['nullable', 'integer'],
        ]);

        $question->update($data);

        return response()->json(['question' => $question]);
    }

    public function destroyQuestion(int $questionId): JsonResponse
    {
        Question::findOrFail($questionId)->delete();

        return response()->json(['message' => 'Pertanyaan dihapus']);
    }

    // ------------------------------------------------------------
    // Answer choices
    // ------------------------------------------------------------

    public function storeChoice(Request $request, int $questionId): JsonResponse
    {
        $data = $request->validate([
            'label' => ['required', 'string'],
            'point_value' => ['required', 'integer', 'min:0'],
            'sort_order' => ['nullable', 'integer'],
        ]);

        $choice = AnswerChoice::create([...$data, 'question_id' => $questionId]);

        return response()->json(['choice' => $choice], 201);
    }

    public function updateChoice(Request $request, int $choiceId): JsonResponse
    {
        $choice = AnswerChoice::findOrFail($choiceId);

        $data = $request->validate([
            'label' => ['required', 'string'],
            'point_value' => ['required', 'integer', 'min:0'],
            'sort_order' => ['nullable', 'integer'],
        ]);

        $choice->update($data);

        return response()->json(['choice' => $choice]);
    }

    public function destroyChoice(int $choiceId): JsonResponse
    {
        AnswerChoice::findOrFail($choiceId)->delete();

        return response()->json(['message' => 'Pilihan jawaban dihapus']);
    }

    // ------------------------------------------------------------
    // Components (weights / scoring)
    // ------------------------------------------------------------

    public function components(): JsonResponse
    {
        return response()->json([
            'components' => Component::orderBy('id')->get(),
        ]);
    }

    public function updateComponent(Request $request, int $componentId): JsonResponse
    {
        $component = Component::findOrFail($componentId);

        $data = $request->validate([
            'name' => ['required', 'string'],
            'weight' => ['required', 'integer', 'min:0', 'max:100'],
        ]);

        $component->update($data);

        return response()->json(['component' => $component]);
    }
}
