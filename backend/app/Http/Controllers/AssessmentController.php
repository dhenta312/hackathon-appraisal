<?php

namespace App\Http\Controllers;

use App\Models\Assessment;
use App\Models\Component;
use App\Models\Period;
use App\Models\Question;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AssessmentController extends Controller
{
    /**
     * List all employees (for 360° assessment) with their assessment status.
     */
    public function team(Request $request): JsonResponse
    {
        $assessor = $request->user();

        $members = User::orderBy('name')
            ->get()
            ->map(fn (User $u) => [
                'id' => $u->id,
                'name' => $u->name,
                'job_role_name' => $u->jobRole?->name,
                'is_self' => $u->id === $assessor->id,
                'is_teammate' => $u->team_id === $assessor->team_id && $u->id !== $assessor->id,
                'status' => $this->assessmentStatus($assessor->id, $u->id),
            ]);

        return response()->json(['members' => $members]);
    }

    /**
     * Return the role-specific template (with answer choices) and any draft.
     */
    public function template(Request $request, int $assessedId): JsonResponse
    {
        $assessor = $request->user();
        $assessed = User::findOrFail($assessedId);

        $components = Component::where('code', '!=', 'kehadiran')
            ->orderBy('id')
            ->get()
            ->map(fn (Component $component) => [
                'id' => $component->id,
                'code' => $component->code,
                'name' => $component->name,
                'weight' => $component->weight,
                'questions' => $component->questions()
                    ->with('choices')
                    ->where(function ($query) use ($assessed) {
                        $query->whereNull('job_role_id');
                        if ($assessed->job_role_id) {
                            $query->orWhere('job_role_id', $assessed->job_role_id);
                        }
                    })
                    ->orderBy('sort_order')
                    ->get()
                    ->map(fn ($question) => [
                        'id' => $question->id,
                        'text' => $question->text,
                        'sort_order' => $question->sort_order,
                        'choices' => $question->choices
                            ->sortBy('sort_order')
                            ->values()
                            ->map(fn ($choice) => [
                                'id' => $choice->id,
                                'label' => $choice->label,
                                'point_value' => $choice->point_value,
                            ]),
                    ]),
            ]);

        return response()->json([
            'assessed' => [
                'id' => $assessed->id,
                'name' => $assessed->name,
                'job_role_name' => $assessed->jobRole?->name,
                'is_self' => $assessed->id === $assessor->id,
            ],
            'components' => $components,
            'draft' => $this->draftPayload($assessor->id, $assessed->id),
        ]);
    }

    /**
     * Save a draft or submit an assessment (360°: any user, including self).
     */
    public function store(Request $request, int $assessedId): JsonResponse
    {
        $assessor = $request->user();
        $assessed = User::findOrFail($assessedId);

        $existing = Assessment::where('assessor_id', $assessor->id)
            ->where('assessed_id', $assessed->id)
            ->where('period', $this->periodName())
            ->first();

        if ($existing && $existing->status === 'submitted') {
            abort(409, 'Penilaian sudah dikirim');
        }

        $data = $request->validate([
            'action' => ['required', 'in:draft,submit'],
            'relationship' => ['nullable', 'string'],
            'scores' => ['array'],
            'scores.*.question_id' => ['required', 'integer'],
            'scores.*.value' => ['required', 'integer', 'between:0,5'],
            'reasons' => ['array'],
            'reasons.*.question_id' => ['required', 'integer'],
            'reasons.*.text' => ['nullable', 'string'],
        ]);

        if ($data['action'] === 'submit') {
            $requiredQuestionIds = $this->templateQuestionIds($assessed);
            $providedQuestionIds = collect($data['scores'])->pluck('question_id')->unique();

            if ($requiredQuestionIds->diff($providedQuestionIds)->isNotEmpty()) {
                return response()->json([
                    'message' => 'Semua pertanyaan harus diisi sebelum mengirim',
                ], 422);
            }
        }

        $submitting = $data['action'] === 'submit';

        $assessment = Assessment::updateOrCreate(
            [
                'assessor_id' => $assessor->id,
                'assessed_id' => $assessed->id,
                'period' => $this->periodName(),
            ],
            [
                'status' => $submitting ? 'submitted' : 'draft',
                'relationship' => $data['relationship'] ?? null,
                'submitted_at' => $submitting ? now() : null,
            ],
        );

        $assessment->scores()->delete();
        foreach ($data['scores'] as $score) {
            $assessment->scores()->create([
                'question_id' => $score['question_id'],
                'value' => $score['value'],
            ]);
        }

        $assessment->reasons()->delete();
        foreach ($data['reasons'] as $reason) {
            $assessment->reasons()->create([
                'question_id' => $reason['question_id'],
                'text' => $reason['text'] ?? '',
            ]);
        }

        return response()->json([
            'id' => $assessment->id,
            'status' => $assessment->status,
        ]);
    }

    /**
     * The name of the currently-open assessment period.
     */
    private function periodName(): string
    {
        return Period::open()?->name ?? '2026-S1';
    }

    /**
     * Collect every question id in the assessed person's role template.
     */
    private function templateQuestionIds(User $assessed): \Illuminate\Support\Collection
    {
        return Question::where(function ($query) use ($assessed) {
            $query->whereNull('job_role_id');
            if ($assessed->job_role_id) {
                $query->orWhere('job_role_id', $assessed->job_role_id);
            }
        })->pluck('id');
    }

    /**
     * Determine the assessment status for a given assessor/assessed pair.
     */
    private function assessmentStatus(int $assessorId, int $assessedId): string
    {
        $assessment = Assessment::where('assessor_id', $assessorId)
            ->where('assessed_id', $assessedId)
            ->where('period', $this->periodName())
            ->first();

        return $assessment?->status ?? 'not_started';
    }

    /**
     * Build the draft payload for a given assessor/assessed pair, or null.
     */
    private function draftPayload(int $assessorId, int $assessedId): ?array
    {
        $assessment = Assessment::where('assessor_id', $assessorId)
            ->where('assessed_id', $assessedId)
            ->where('period', $this->periodName())
            ->where('status', 'draft')
            ->first();

        if (! $assessment) {
            return null;
        }

        return [
            'relationship' => $assessment->relationship,
            'scores' => $assessment->scores->map(fn ($score) => [
                'question_id' => $score->question_id,
                'value' => $score->value,
            ]),
            'reasons' => $assessment->reasons->map(fn ($reason) => [
                'question_id' => $reason->question_id,
                'text' => $reason->text,
            ]),
        ];
    }
}
