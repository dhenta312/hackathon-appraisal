<?php

namespace App\Http\Controllers;

use App\Models\Assessment;
use App\Models\Component;
use App\Models\Question;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AssessmentController extends Controller
{
    private const PERIOD = '2026-Q4';

    /**
     * List the caller's teammates with their assessment status.
     */
    public function team(Request $request): JsonResponse
    {
        $assessor = $request->user();

        $members = User::where('team_id', $assessor->team_id)
            ->where('id', '!=', $assessor->id)
            ->get()
            ->map(fn (User $teammate) => [
                'id' => $teammate->id,
                'name' => $teammate->name,
                'job_role_name' => $teammate->jobRole?->name,
                'status' => $this->assessmentStatus($assessor->id, $teammate->id),
            ]);

        return response()->json(['members' => $members]);
    }

    /**
     * Return the role-specific template and any existing draft for a teammate.
     */
    public function template(Request $request, int $assessedId): JsonResponse
    {
        $assessor = $request->user();
        $assessed = $this->resolveTeammate($assessor, $assessedId);

        $components = Component::where('code', '!=', 'presensi')
            ->orderBy('id')
            ->get()
            ->map(fn (Component $component) => [
                'id' => $component->id,
                'code' => $component->code,
                'name' => $component->name,
                'weight' => $component->weight,
                'questions' => $component->questions()
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
                    ]),
            ]);

        return response()->json([
            'assessed' => [
                'id' => $assessed->id,
                'name' => $assessed->name,
                'job_role_name' => $assessed->jobRole?->name,
            ],
            'components' => $components,
            'draft' => $this->draftPayload($assessor->id, $assessed->id),
        ]);
    }

    /**
     * Save a draft or submit an assessment for a teammate.
     */
    public function store(Request $request, int $assessedId): JsonResponse
    {
        $assessor = $request->user();
        $assessed = $this->resolveTeammate($assessor, $assessedId);

        $existing = Assessment::where('assessor_id', $assessor->id)
            ->where('assessed_id', $assessed->id)
            ->where('period', self::PERIOD)
            ->first();

        if ($existing && $existing->status === 'submitted') {
            abort(409, 'Penilaian sudah dikirim');
        }

        $data = $request->validate([
            'action' => ['required', 'in:draft,submit'],
            'scores' => ['array'],
            'scores.*.question_id' => ['required', 'integer'],
            'scores.*.value' => ['required', 'integer', 'between:1,5'],
            'reasons' => ['array'],
            'reasons.*.component_id' => ['required', 'integer'],
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
                'period' => self::PERIOD,
            ],
            [
                'status' => $submitting ? 'submitted' : 'draft',
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
                'component_id' => $reason['component_id'],
                'text' => $reason['text'] ?? '',
            ]);
        }

        return response()->json([
            'id' => $assessment->id,
            'status' => $assessment->status,
        ]);
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
     * Resolve a teammate, forbidding self-assessment or cross-team targets.
     */
    private function resolveTeammate(User $assessor, int $assessedId): User
    {
        $assessed = User::findOrFail($assessedId);

        if ($assessed->team_id !== $assessor->team_id || $assessed->id === $assessor->id) {
            abort(403, 'Bukan anggota tim kamu');
        }

        return $assessed;
    }

    /**
     * Determine the assessment status for a given assessor/teammate pair.
     */
    private function assessmentStatus(int $assessorId, int $assessedId): string
    {
        $assessment = Assessment::where('assessor_id', $assessorId)
            ->where('assessed_id', $assessedId)
            ->where('period', self::PERIOD)
            ->first();

        return $assessment?->status ?? 'not_started';
    }

    /**
     * Build the draft payload for a given assessor/teammate pair, or null.
     */
    private function draftPayload(int $assessorId, int $assessedId): ?array
    {
        $assessment = Assessment::where('assessor_id', $assessorId)
            ->where('assessed_id', $assessedId)
            ->where('period', self::PERIOD)
            ->where('status', 'draft')
            ->first();

        if (! $assessment) {
            return null;
        }

        return [
            'scores' => $assessment->scores->map(fn ($score) => [
                'question_id' => $score->question_id,
                'value' => $score->value,
            ]),
            'reasons' => $assessment->reasons->map(fn ($reason) => [
                'component_id' => $reason->component_id,
                'text' => $reason->text,
            ]),
        ];
    }
}
