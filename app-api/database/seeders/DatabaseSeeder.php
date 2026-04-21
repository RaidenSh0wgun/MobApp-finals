<?php

namespace Database\Seeders;

use App\Models\AccountType;
use App\Models\BankAccount;
use App\Models\BankTransaction;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    public function run(): void
    {
        User::factory()->create([
            'username' => 'admin',
            'email' => 'admin@example.com',
            'contact_number' => '09171234567',
            'password' => Hash::make('password$'),
        ]);

        User::factory(10)->create();

        $users = User::all();

        $typeIds = AccountType::query()->pluck('id')->all();

        foreach ($users as $index => $user) {
            $account = BankAccount::create([
                'user_id' => $user->id,
                'code' => str_pad((string) fake()->numberBetween(0, 99_999_999), 8, '0', STR_PAD_LEFT),
                'nickname' => 'Account ' . ($index + 1),
                'balance' => fake()->randomFloat(2, 5000, 12_000),
                'type_id' => fake()->randomElement($typeIds ?: [1]),
            ]);

            BankTransaction::create([
                'account_id' => $account->id,
                'description' => 'Initial deposit',
                'amount' => $account->balance,
                'created_at' => now(),
            ]);

            BankTransaction::create([
                'account_id' => $account->id,
                'description' => 'Service fee',
                'amount' => -rand(200, 1200),
                'created_at' => now(),
            ]);
        }
    }
}
