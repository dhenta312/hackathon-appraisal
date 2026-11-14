<?php

namespace Tests\Feature;

use App\Models\Appeal;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class AppealTest extends TestCase
{
    use RefreshDatabase;

    public function test_employee_can_submit_an_appeal(): void
    {
        $this->seed();
        $andi = $this->userByEmail('andi@example.com');
        Sanctum::actingAs($andi);

        $this->postJson('/api/appeals', ['reason' => 'Mohon tinjau ulang skor soft skill saya'])
            ->assertCreated()
            ->assertJsonPath('appeal.status', 'pending');

        $this->assertDatabaseHas('appeals', [
            'user_id' => $andi->id,
            'period' => '2026-Q4',
            'status' => 'pending',
        ]);
    }

    public function test_appeal_returns_422_without_a_reason(): void
    {
        $this->seed();
        Sanctum::actingAs($this->userByEmail('andi@example.com'));

        $this->postJson('/api/appeals', [])
            ->assertUnprocessable()
            ->assertJsonValidationErrors('reason');
    }

    public function test_admin_can_list_appeals(): void
    {
        $this->seed();
        $andi = $this->userByEmail('andi@example.com');

        Appeal::create([
            'user_id' => $andi->id,
            'period' => '2026-Q4',
            'reason' => 'Banding',
            'status' => 'pending',
        ]);

        Sanctum::actingAs($this->userByEmail('fajar@example.com'));

        $this->getJson('/api/appeals')->assertOk()->assertJsonCount(1, 'appeals');
    }

    public function test_listing_appeals_returns_403_for_a_non_admin(): void
    {
        $this->seed();
        Sanctum::actingAs($this->userByEmail('andi@example.com'));

        $this->getJson('/api/appeals')->assertForbidden();
    }

    private function userByEmail(string $email): User
    {
        return User::where('email', $email)->firstOrFail();
    }
}
