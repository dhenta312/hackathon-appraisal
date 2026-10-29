<?php

namespace Database\Seeders;

use App\Models\Attendance;
use App\Models\Component;
use App\Models\JobRole;
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
            ['code' => 'presensi', 'name' => 'Presensi', 'weight' => 20],
        ] as $component) {
            Component::create($component);
        }

        foreach (['UX', 'Frontend', 'Backend'] as $roleName) {
            JobRole::create(['name' => $roleName]);
        }

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
    }

    /**
     * Seed role-agnostic and role-specific questions.
     */
    private function seedQuestions(): void
    {
        foreach ([
            'core_value' => [
                'Menunjukkan integritas dalam bekerja',
                'Bertanggung jawab atas hasil kerja',
                'Kolaborasi dan saling mendukung dalam tim',
            ],
            'soft_skill' => [
                'Komunikasi yang efektif',
                'Kerja sama dalam tim',
                'Adaptasi terhadap perubahan',
                'Manajemen waktu',
                'Inisiatif dan proaktif',
            ],
            'growth_innovation' => [
                'Kemauan untuk belajar hal baru',
                'Kontribusi ide atau inovasi',
                'Berbagi pengetahuan kepada tim',
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
}
