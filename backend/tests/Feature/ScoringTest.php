<?php

namespace Tests\Feature;

use App\Models\Assessment;
use App\Models\Component;
use App\Models\Question;
use App\Models\Score;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Carbon;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class ScoringTest extends TestCase
{
    use RefreshDatabase;

    public function test_component_scores_follow_the_locked_formula(): void
    {
        $this->seed();
        $andi = $this->userByEmail('andi@example.com');
        $citra = $this->userByEmail('citra@example.com');

        $this->createAssessment($andi, $citra, 'submitted', [
            'core_value' => 4,
            'soft_skill' => 3,
            'hard_skill' => 5,
            'growth_innovation' => 2,
        ], '2026-11-14 10:00:00');

        Sanctum::actingAs($citra);
        $response = $this->getJson("/api/results/{$citra->id}")->assertOk();

        $scores = collect($response->json('components'))->pluck('score', 'code');

        $this->assertSame(8.0, (float) $scores['core_value']);
        $this->assertSame(15.0, (float) $scores['soft_skill']);
        $this->assertSame(30.0, (float) $scores['hard_skill']);
        $this->assertSame(6.0, (float) $scores['growth_innovation']);
        $this->assertSame(75.0, (float) $response->json('total'));
        $this->assertSame(16, $response->json('attendance.points'));
        $this->assertSame(20, $response->json('attendance.max'));
    }

    public function test_component_score_is_the_average_across_assessors(): void
    {
        $this->seed();
        $andi = $this->userByEmail('andi@example.com');
        $budi = $this->userByEmail('budi@example.com');
        $citra = $this->userByEmail('citra@example.com');

        $this->createAssessment($andi, $citra, 'submitted', ['core_value' => 4], '2026-11-14 10:00:00');
        $this->createAssessment($budi, $citra, 'submitted', ['core_value' => 2], '2026-11-14 11:00:00');

        Sanctum::actingAs($citra);
        $core = collect($this->getJson("/api/results/{$citra->id}")->json('components'))
            ->firstWhere('code', 'core_value');

        $this->assertCount(2, $core['per_assessor']);
        $this->assertSame('Penilai A', $core['per_assessor'][0]['label']);
        $this->assertSame('Penilai B', $core['per_assessor'][1]['label']);
        $this->assertSame(8.0, (float) $core['per_assessor'][0]['score']);
        $this->assertSame(4.0, (float) $core['per_assessor'][1]['score']);
        $this->assertSame(6.0, (float) $core['score']);
    }

    public function test_draft_assessments_are_excluded_from_scoring(): void
    {
        $this->seed();
        $andi = $this->userByEmail('andi@example.com');
        $budi = $this->userByEmail('budi@example.com');
        $citra = $this->userByEmail('citra@example.com');

        $this->createAssessment($andi, $citra, 'submitted', ['core_value' => 4], '2026-11-14 10:00:00');
        $this->createAssessment($budi, $citra, 'draft', ['core_value' => 1]);

        Sanctum::actingAs($citra);
        $core = collect($this->getJson("/api/results/{$citra->id}")->json('components'))
            ->firstWhere('code', 'core_value');

        $this->assertCount(1, $core['per_assessor']);
        $this->assertSame(8.0, (float) $core['per_assessor'][0]['score']);
        $this->assertSame(8.0, (float) $core['score']);
    }

    public function test_no_submitted_assessor_returns_a_null_total(): void
    {
        $this->seed();
        $citra = $this->userByEmail('citra@example.com');

        Sanctum::actingAs($citra);
        $response = $this->getJson("/api/results/{$citra->id}")->assertOk();

        $this->assertNull($response->json('total'));

        foreach ($response->json('components') as $component) {
            $this->assertNull($component['score']);
            $this->assertSame([], $component['per_assessor']);
        }

        $this->assertSame(16, $response->json('attendance.points'));
    }

    public function test_attendance_points_are_added_from_the_attendance_table(): void
    {
        $this->seed();
        $andi = $this->userByEmail('andi@example.com');
        $citra = $this->userByEmail('citra@example.com');

        $this->createAssessment($andi, $citra, 'submitted', [
            'core_value' => 5,
            'soft_skill' => 5,
            'hard_skill' => 5,
            'growth_innovation' => 5,
        ]);

        Sanctum::actingAs($citra);
        $response = $this->getJson("/api/results/{$citra->id}")->assertOk();

        $this->assertSame(96.0, (float) $response->json('total'));
        $this->assertSame(16, $response->json('attendance.points'));
    }

    public function test_results_of_another_user_return_403(): void
    {
        $this->seed();
        $andi = $this->userByEmail('andi@example.com');
        $citra = $this->userByEmail('citra@example.com');

        Sanctum::actingAs($andi);

        $this->getJson("/api/results/{$citra->id}")->assertForbidden();
    }

    public function test_employee_can_view_own_results(): void
    {
        $this->seed();
        $andi = $this->userByEmail('andi@example.com');

        Sanctum::actingAs($andi);

        $this->getJson("/api/results/{$andi->id}")->assertOk();
    }

    public function test_admin_can_view_any_users_results(): void
    {
        $this->seed();
        $fajar = $this->userByEmail('fajar@example.com');
        $citra = $this->userByEmail('citra@example.com');

        Sanctum::actingAs($fajar);

        $this->getJson("/api/results/{$citra->id}")->assertOk();
    }

    public function test_unauthenticated_request_returns_401(): void
    {
        $this->seed();
        $citra = $this->userByEmail('citra@example.com');

        $this->getJson("/api/results/{$citra->id}")->assertUnauthorized();
    }

    private function userByEmail(string $email): User
    {
        return User::where('email', $email)->firstOrFail();
    }

    /**
     * Create an assessment with one score per question of each named component.
     *
     * @param  array<string, int>  $valueByComponent
     */
    private function createAssessment(
        User $assessor,
        User $assessed,
        string $status,
        array $valueByComponent,
        ?string $submittedAt = null,
    ): Assessment {
        $assessment = Assessment::create([
            'assessor_id' => $assessor->id,
            'assessed_id' => $assessed->id,
            'period' => '2026-Q4',
            'status' => $status,
            'submitted_at' => $status === 'submitted'
                ? Carbon::parse($submittedAt ?? now()->toDateTimeString())
                : null,
        ]);

        foreach ($valueByComponent as $code => $value) {
            $componentId = Component::where('code', $code)->value('id');

            $questionIds = Question::where('component_id', $componentId)
                ->where(function ($query) use ($assessed) {
                    $query->whereNull('job_role_id');
                    if ($assessed->job_role_id) {
                        $query->orWhere('job_role_id', $assessed->job_role_id);
                    }
                })
                ->pluck('id');

            foreach ($questionIds as $questionId) {
                Score::create([
                    'assessment_id' => $assessment->id,
                    'question_id' => $questionId,
                    'value' => $value,
                ]);
            }
        }

        return $assessment;
    }
}
