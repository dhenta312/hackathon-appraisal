<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class AssessmentApiTest extends TestCase
{
    use RefreshDatabase;

    public function test_unauthenticated_request_returns_401(): void
    {
        $this->getJson('/api/team')->assertUnauthorized();
    }

    public function test_team_lists_all_users_with_self_and_status_flags(): void
    {
        $assessor = $this->loginAs('andi@example.com');

        $members = $this->getJson('/api/team')->assertOk()->json('members');

        $this->assertCount(6, $members);

        $self = collect($members)->firstWhere('id', $assessor->id);
        $this->assertTrue($self['is_self']);
        $this->assertFalse($self['is_teammate']);
        $this->assertSame('not_started', $self['status']);

        $budi = collect($members)->firstWhere('name', 'Budi');
        $this->assertFalse($budi['is_self']);
        $this->assertTrue($budi['is_teammate']);
        $this->assertSame('Frontend', $budi['job_role_name']);
        $this->assertSame('not_started', $budi['status']);
    }

    public function test_template_returns_the_assessed_role_hard_skill_questions(): void
    {
        $this->loginAs('andi@example.com');
        $citra = $this->userByEmail('citra@example.com');

        $response = $this->getJson("/api/assessments/{$citra->id}")->assertOk();

        $components = collect($response->json('components'));

        $this->assertSame(
            ['core_value', 'soft_skill', 'hard_skill', 'growth_innovation'],
            $components->pluck('code')->all(),
        );
        $this->assertSame('Backend', $response->json('assessed.job_role_name'));
        $this->assertFalse($response->json('assessed.is_self'));
        $this->assertCount(4, $components->firstWhere('code', 'hard_skill')['questions']);
    }

    public function test_each_template_question_exposes_its_six_answer_choices(): void
    {
        $this->loginAs('andi@example.com');
        $citra = $this->userByEmail('citra@example.com');

        $components = collect($this->getJson("/api/assessments/{$citra->id}")->json('components'));
        $question = $components->first()['questions'][0];

        $this->assertCount(6, $question['choices']);
        $this->assertSame([0, 1, 2, 3, 4, 5], collect($question['choices'])->pluck('point_value')->all());
    }

    public function test_template_has_no_hard_skill_questions_when_the_assessed_has_no_role(): void
    {
        $assessor = $this->loginAs('andi@example.com');
        $noRole = User::factory()->create(['team_id' => $assessor->team_id, 'job_role_id' => null]);

        $components = collect($this->getJson("/api/assessments/{$noRole->id}")->json('components'));

        $this->assertSame([], $components->firstWhere('code', 'hard_skill')['questions']);
    }

    public function test_saving_a_draft_round_trips_on_reload(): void
    {
        $this->loginAs('andi@example.com');
        $dewi = $this->userByEmail('dewi@example.com');
        $ids = $this->templateQuestionIds($dewi);

        $this->postJson("/api/assessments/{$dewi->id}", [
            'action' => 'draft',
            'relationship' => 'rekan',
            'scores' => [
                ['question_id' => $ids[0], 'value' => 3],
                ['question_id' => $ids[1], 'value' => 4],
            ],
            'reasons' => [
                ['question_id' => $ids[0], 'text' => 'Konsisten membantu'],
            ],
        ])->assertOk()->assertJsonPath('status', 'draft');

        $draft = $this->getJson("/api/assessments/{$dewi->id}")->json('draft');

        $this->assertNotNull($draft);
        $this->assertSame('rekan', $draft['relationship']);
        $this->assertCount(2, $draft['scores']);
        $this->assertCount(1, $draft['reasons']);
    }

    public function test_submitting_all_questions_marks_the_assessment_submitted(): void
    {
        $assessor = $this->loginAs('andi@example.com');
        $dewi = $this->userByEmail('dewi@example.com');
        $ids = $this->templateQuestionIds($dewi);

        $this->postJson("/api/assessments/{$dewi->id}", [
            'action' => 'submit',
            'relationship' => 'rekan',
            'scores' => collect($ids)->map(fn (int $id) => ['question_id' => $id, 'value' => 4])->all(),
            'reasons' => [],
        ])->assertOk()->assertJsonPath('status', 'submitted');

        $this->assertDatabaseHas('assessments', [
            'assessor_id' => $assessor->id,
            'assessed_id' => $dewi->id,
            'period' => '2026-Q4',
            'status' => 'submitted',
        ]);
    }

    public function test_submit_returns_422_when_questions_are_missing(): void
    {
        $this->loginAs('andi@example.com');
        $dewi = $this->userByEmail('dewi@example.com');
        $ids = $this->templateQuestionIds($dewi);
        $partial = collect($ids)->take(count($ids) - 1)
            ->map(fn (int $id) => ['question_id' => $id, 'value' => 3])
            ->all();

        $this->postJson("/api/assessments/{$dewi->id}", [
            'action' => 'submit',
            'scores' => $partial,
            'reasons' => [],
        ])->assertUnprocessable()
            ->assertJsonPath('message', 'Semua pertanyaan harus diisi sebelum mengirim');
    }

    public function test_resubmitting_a_submitted_assessment_returns_409(): void
    {
        $this->loginAs('andi@example.com');
        $dewi = $this->userByEmail('dewi@example.com');
        $ids = $this->templateQuestionIds($dewi);
        $payload = [
            'action' => 'submit',
            'scores' => collect($ids)->map(fn (int $id) => ['question_id' => $id, 'value' => 3])->all(),
            'reasons' => [],
        ];

        $this->postJson("/api/assessments/{$dewi->id}", $payload)->assertOk();
        $this->postJson("/api/assessments/{$dewi->id}", $payload)->assertConflict();
    }

    public function test_empty_reason_text_is_accepted(): void
    {
        $this->loginAs('andi@example.com');
        $dewi = $this->userByEmail('dewi@example.com');
        $ids = $this->templateQuestionIds($dewi);

        $this->postJson("/api/assessments/{$dewi->id}", [
            'action' => 'draft',
            'scores' => [['question_id' => $ids[0], 'value' => 3]],
            'reasons' => [['question_id' => $ids[0], 'text' => '']],
        ])->assertOk();

        $this->assertDatabaseHas('reasons', [
            'question_id' => $ids[0],
            'text' => '',
        ]);
    }

    public function test_uniform_scores_are_flagged(): void
    {
        $flag = $this->submitWithFlag(fn (array $ids) => [
            'scores' => collect($ids)->map(fn (int $id) => ['question_id' => $id, 'value' => 3])->all(),
            'reasons' => [],
        ]);

        $this->assertStringContainsString('skor_seragam', (string) $flag);
    }

    public function test_all_maximum_scores_are_flagged(): void
    {
        $flag = $this->submitWithFlag(fn (array $ids) => [
            'scores' => collect($ids)->map(fn (int $id) => ['question_id' => $id, 'value' => 5])->all(),
            'reasons' => [],
        ]);

        $this->assertStringContainsString('semua_maksimal', (string) $flag);
    }

    public function test_duplicate_reason_texts_are_flagged(): void
    {
        $flag = $this->submitWithFlag(fn (array $ids) => [
            'scores' => collect($ids)->values()->map(fn (int $id, int $index) => [
                'question_id' => $id,
                'value' => $index % 2 === 0 ? 3 : 4,
            ])->all(),
            'reasons' => [
                ['question_id' => $ids[0], 'text' => 'Sama persis'],
                ['question_id' => $ids[1], 'text' => 'Sama persis'],
            ],
        ]);

        $this->assertStringContainsString('alasan_copas', (string) $flag);
    }

    private function loginAs(string $email): User
    {
        $this->seed();
        $user = User::where('email', $email)->firstOrFail();
        Sanctum::actingAs($user);

        return $user;
    }

    private function userByEmail(string $email): User
    {
        return User::where('email', $email)->firstOrFail();
    }

    private function templateQuestionIds(User $assessed): array
    {
        $response = $this->getJson("/api/assessments/{$assessed->id}")->assertOk();

        return collect($response->json('components'))
            ->flatMap(fn (array $component) => $component['questions'])
            ->pluck('id')
            ->all();
    }

    /**
     * @param  callable(array<int>): array{scores: array, reasons: array}  $payload
     */
    private function submitWithFlag(callable $payload): ?string
    {
        $this->loginAs('andi@example.com');
        $dewi = $this->userByEmail('dewi@example.com');
        $ids = $this->templateQuestionIds($dewi);

        $response = $this->postJson("/api/assessments/{$dewi->id}", [
            'action' => 'submit',
            ...$payload($ids),
        ])->assertOk();

        return $response->json('flag');
    }
}
