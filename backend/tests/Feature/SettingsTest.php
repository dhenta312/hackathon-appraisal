<?php

namespace Tests\Feature;

use App\Models\Component;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class SettingsTest extends TestCase
{
    use RefreshDatabase;

    public function test_settings_return_403_for_a_non_admin(): void
    {
        $this->seed();
        Sanctum::actingAs($this->userByEmail('andi@example.com'));

        $this->getJson('/api/settings/periods')->assertForbidden();
    }

    public function test_admin_can_list_periods(): void
    {
        $this->seed();
        Sanctum::actingAs($this->userByEmail('fajar@example.com'));

        $this->getJson('/api/settings/periods')
            ->assertOk()
            ->assertJsonPath('periods.0.name', '2026-Q4');
    }

    public function test_admin_can_update_a_component_weight(): void
    {
        $this->seed();
        Sanctum::actingAs($this->userByEmail('fajar@example.com'));
        $component = Component::where('code', 'soft_skill')->firstOrFail();

        $this->putJson("/api/settings/components/{$component->id}", [
            'name' => 'Soft Skill',
            'weight' => 20,
        ])->assertOk();

        $this->assertDatabaseHas('components', [
            'id' => $component->id,
            'weight' => 20,
        ]);
    }

    private function userByEmail(string $email): User
    {
        return User::where('email', $email)->firstOrFail();
    }
}
