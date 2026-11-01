<?php

namespace Database\Seeders;

use App\Models\AnswerChoice;
use App\Models\Attendance;
use App\Models\Component;
use App\Models\JobRole;
use App\Models\Period;
use App\Models\Question;
use App\Models\Team;
use App\Models\User;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        foreach ([
            ['code' => 'core_value', 'name' => 'Core Value', 'weight' => 10],
            ['code' => 'soft_skill', 'name' => 'Soft Skill', 'weight' => 25],
            ['code' => 'hard_skill', 'name' => 'Hard Skill', 'weight' => 30],
            ['code' => 'growth_innovation', 'name' => 'Growth & Innovation', 'weight' => 15],
            ['code' => 'kehadiran', 'name' => 'Kehadiran & Kedisiplinan', 'weight' => 20],
        ] as $component) {
            Component::create($component);
        }

        foreach (['UX', 'Frontend', 'Backend'] as $roleName) {
            JobRole::create(['name' => $roleName]);
        }

        Period::create([
            'name' => '2026-Q4',
            'start_date' => '2026-11-01',
            'end_date' => '2026-11-30',
            'is_open' => true,
        ]);

        $team = Team::create(['name' => 'Team Alpha']);

        foreach ([
            ['name' => 'Andi', 'email' => 'andi@example.com', 'role' => 'UX', 'is_admin' => false, 'attendance' => 18],
            ['name' => 'Budi', 'email' => 'budi@example.com', 'role' => 'Frontend', 'is_admin' => false, 'attendance' => 19],
            ['name' => 'Citra', 'email' => 'citra@example.com', 'role' => 'Backend', 'is_admin' => false, 'attendance' => 16],
            ['name' => 'Dewi', 'email' => 'dewi@example.com', 'role' => 'UX', 'is_admin' => false, 'attendance' => 20],
            ['name' => 'Eko', 'email' => 'eko@example.com', 'role' => 'Frontend', 'is_admin' => false, 'attendance' => 15],
            ['name' => 'Fajar', 'email' => 'fajar@example.com', 'role' => 'Backend', 'is_admin' => true, 'attendance' => 17],
        ] as $userData) {
            $role = JobRole::where('name', $userData['role'])->firstOrFail();
            $user = User::create([
                'name' => $userData['name'],
                'email' => $userData['email'],
                'password' => 'password',
                'team_id' => $team->id,
                'job_role_id' => $role->id,
                'is_admin' => $userData['is_admin'],
            ]);

            Attendance::create([
                'user_id' => $user->id,
                'period' => '2026-Q4',
                'points' => $userData['attendance'],
            ]);
        }

        $this->seedQuestions();
        $this->seedAnswerChoices();
    }

    /**
     * Seed role-agnostic and role-specific questions.
     */
    private function seedQuestions(): void
    {
        foreach ([
            'core_value' => [
                'Commitment — Menunjukkan komitmen terhadap tanggung jawab dan tujuan organisasi',
                'Adaptive — Mampu beradaptasi dengan perubahan dan situasi baru',
                'Resilience — Tangguh menghadapi tekanan dan mampu bangkit dari kegagalan',
                'Empathy — Memahami dan peduli terhadap perasaan serta kebutuhan orang lain',
            ],
            'soft_skill' => [
                'Komunikasi efektif',
                'Kerja sama tim',
                'Adaptabilitas',
                'Manajemen emosi',
                'Inisiatif dan proaktif',
            ],
            'growth_innovation' => [
                'Kontribusi inovasi — berikan penilaian atas inisiatif, ide segar, atau kontribusi tambahan di luar job description',
            ],
        ] as $componentCode => $texts) {
            $component = Component::where('code', $componentCode)->firstOrFail();
            foreach ($texts as $index => $text) {
                Question::create([
                    'component_id' => $component->id,
                    'job_role_id' => null,
                    'text' => $text,
                    'sort_order' => $index + 1,
                ]);
            }
        }

        $hardSkillComponent = Component::where('code', 'hard_skill')->firstOrFail();

        foreach ([
            'UX' => [
                'Kualitas riset pengguna',
                'Kejelasan wireframe dan prototipe',
                'Konsistensi design system',
                'Empati terhadap kebutuhan pengguna',
            ],
            'Frontend' => [
                'Kualitas dan kebersihan kode',
                'Responsivitas dan performa antarmuka',
                'Penguasaan framework frontend',
                'Integrasi dengan API backend',
            ],
            'Backend' => [
                'Kualitas API dan struktur data',
                'Keamanan dan validasi input',
                'Optimasi query dan performansi',
                'Reliabilitas layanan',
            ],
        ] as $roleName => $texts) {
            $role = JobRole::where('name', $roleName)->firstOrFail();
            foreach ($texts as $index => $text) {
                Question::create([
                    'component_id' => $hardSkillComponent->id,
                    'job_role_id' => $role->id,
                    'text' => $text,
                    'sort_order' => $index + 1,
                ]);
            }
        }
    }

    /**
     * Seed 0–5 answer choices (level descriptor) for every question.
     */
    private function seedAnswerChoices(): void
    {
        $labels = [
            0 => 'Tidak menunjukkan perilaku ini sama sekali',
            1 => 'Jarang menunjukkan; masih perlu banyak pengembangan',
            2 => 'Kadang menunjukkan; konsisten namun perlu bimbingan',
            3 => 'Cukup sering menunjukkan; konsisten pada situasi umum',
            4 => 'Sering menunjukkan; menjadi contoh bagi rekan',
            5 => 'Selalu menunjukkan; menjadi teladan dan menginspirasi',
        ];

        foreach (Question::all() as $question) {
            foreach ($labels as $point => $label) {
                AnswerChoice::create([
                    'question_id' => $question->id,
                    'label' => $label,
                    'point_value' => $point,
                    'sort_order' => $point,
                ]);
            }
        }
    }
}
