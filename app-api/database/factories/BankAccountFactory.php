<?php

namespace Database\Factories;

use App\Models\AccountType;
use App\Models\BankAccount;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<BankAccount>
 */
class BankAccountFactory extends Factory
{
    protected $model = BankAccount::class;

    public function definition(): array
    {
        return [
            'user_id' => User::factory(),
            'code' => str_pad((string) fake()->numberBetween(0, 99_999_999), 8, '0', STR_PAD_LEFT),
            'nickname' => fake()->words(2, true),
            'balance' => fake()->randomFloat(2, 5000, 12_000),
            'type_id' => AccountType::query()->inRandomOrder()->value('id') ?? 1,
        ];
    }
}
