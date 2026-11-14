<?php

namespace Tests\Feature;

use App\Models\Attendance;
use App\Models\Component;
use App\Models\Question;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class DataModelTest extends TestCase
{
    use RefreshDatabase;

    public function test_seeder_creates_the_five_components_with_locked_weights(): void
    {
        $this->seed();

        $this->assertSame(5, Component::count());
        $this->assertSame(10, Component::where('code', 'core_value')->value('weight'));
        $this->assertSame(25, Component::where('code', 'soft_skill')->value('weight'));
        $this->assertSame(30, Component::where('code', 'hard_skill')->value('weight'));
        $this->assertSame(15, Component::where('code', 'growth_innovation')->value('weight'));
        $this->assertSame(20, Component::where('code', 'kehadiran')->value('weight'));
    }

    public function test_seeder_creates_six_users_in_one_team_with_roles(): void
    {
        $this->seed();

        $this->assertSame(6, User::count());
        $this->assertSame(1, User::query()->distinct()->count('team_id'));
        $this->assertSame(1, User::where('is_admin', true)->count());
        $this->assertSame(6, User::whereNotNull('job_role_id')->count());
    }

    public function test_hard_skill_questions_are_scoped_per_role(): void
    {
        $this->seed();

        $hardSkillId = Component::where('code', 'hard_skill')->value('id');

        $this->assertSame(12, Question::where('component_id', $hardSkillId)->whereNotNull('job_role_id')->count());
        $this->assertSame(3, Question::where('component_id', $hardSkillId)->whereNotNull('job_role_id')->distinct()->count('job_role_id'));
        $this->assertSame(0, Question::where('component_id', $hardSkillId)->whereNull('job_role_id')->count());
    }

    public function test_shared_components_have_role_agnostic_questions(): void
    {
        $this->seed();

        foreach (['core_value' => 4, 'soft_skill' => 5, 'growth_innovation' => 1] as $code => $expected) {
            $componentId = Component::where('code', $code)->value('id');

            $this->assertSame(
                $expected,
                Question::where('component_id', $componentId)->whereNull('job_role_id')->count(),
                "role-agnostic question count for {$code}",
            );
        }
    }

    public function test_every_question_has_six_answer_choices(): void
    {
        $this->seed();

        $questions = Question::withCount('choices')->get();

        $this->assertSame(22, $questions->count());
        $this->assertSame(132, $questions->sum('choices_count'));

        foreach ($questions as $question) {
            $this->assertSame(6, $question->choices_count, "choices for question {$question->id}");
        }
    }

    public function test_seeder_creates_attendance_for_the_open_period(): void
    {
        $this->seed();

        $this->assertSame(6, Attendance::where('period', '2026-Q4')->count());
    }
}
