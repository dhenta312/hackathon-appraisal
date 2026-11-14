<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AuthTest extends TestCase
{
    use RefreshDatabase;

    public function test_login_returns_a_token_and_user_payload(): void
    {
        $this->seed();

        $response = $this->postJson('/api/login', [
            'email' => 'andi@example.com',
            'password' => 'password',
        ]);

        $response->assertOk()
            ->assertJsonStructure(['token', 'user' => ['id', 'name', 'team_id', 'job_role_id', 'is_admin']]);

        $this->assertNotSame('', (string) $response->json('token'));
        $this->assertSame('Andi', $response->json('user.name'));
        $this->assertFalse($response->json('user.is_admin'));
    }

    public function test_the_returned_token_authenticates_protected_requests(): void
    {
        $this->seed();

        $token = $this->postJson('/api/login', [
            'email' => 'andi@example.com',
            'password' => 'password',
        ])->json('token');

        $this->withToken($token)->getJson('/api/team')->assertOk();
    }

    public function test_login_returns_401_for_a_wrong_password(): void
    {
        $this->seed();

        $this->postJson('/api/login', [
            'email' => 'andi@example.com',
            'password' => 'salah',
        ])->assertUnauthorized()
            ->assertJsonPath('message', 'Kredensial tidak valid');
    }

    public function test_login_requires_email_and_password(): void
    {
        $this->postJson('/api/login', [])
            ->assertUnprocessable()
            ->assertJsonValidationErrors(['email', 'password']);
    }
}
