<?php

namespace App\Services;

use App\Models\Assessment;
use App\Models\Attendance;
use App\Models\Component;

class ScoringService
{
    /**
     * Compute the appraisal breakdown for a user in a period.
     *
     * @return array{total: float|null, components: array<int, array{code: string, name: string, weight: int, score: float|null, per_assessor: array}>, attendance: array{points: int, max: int}}
     */
    public function compute(int $userId, string $period): array
    {
        $assessments = Assessment::with(['scores.question', 'reasons.question'])
            ->where('assessed_id', $userId)
            ->where('period', $period)
            ->where('status', 'submitted')
            ->orderBy('submitted_at')
            ->orderBy('id')
            ->get();

        $components = Component::where('code', '!=', 'kehadiran')->orderBy('id')->get();

        $componentResults = $components->map(function (Component $component) use ($assessments) {
            $perAssessor = $assessments->values()->map(function (Assessment $assessment, int $index) use ($component) {
                $values = $assessment->scores
                    ->filter(fn ($score) => $score->question?->component_id === $component->id)
                    ->pluck('value');

                $reasons = $assessment->reasons
                    ->filter(fn ($reason) => $reason->question?->component_id === $component->id)
                    ->map(fn ($reason) => [
                        'question_id' => $reason->question_id,
                        'question_text' => $reason->question?->text,
                        'text' => $reason->text,
                    ])
                    ->values();

                return [
                    'label' => 'Penilai ' . chr(65 + $index),
                    'score' => $values->isEmpty()
                        ? null
                        : round($values->avg() / 5 * $component->weight, 1),
                    'reasons' => $reasons,
                ];
            })->values();

            $scores = $perAssessor->pluck('score')->filter(fn ($score) => $score !== null);

            return [
                'code' => $component->code,
                'name' => $component->name,
                'weight' => $component->weight,
                'score' => $scores->isEmpty() ? null : round($scores->avg(), 1),
                'per_assessor' => $perAssessor->toArray(),
            ];
        });

        $assessedTotal = $componentResults->pluck('score')->filter(fn ($score) => $score !== null)->sum();

        $attendance = Attendance::where('user_id', $userId)->where('period', $period)->first();
        $attendancePoints = $attendance?->points ?? 0;

        $total = $assessments->isEmpty()
            ? null
            : round($assessedTotal + $attendancePoints, 1);

        return [
            'total' => $total,
            'components' => $componentResults->toArray(),
            'attendance' => [
                'points' => $attendancePoints,
                'max' => 20,
            ],
        ];
    }
}
