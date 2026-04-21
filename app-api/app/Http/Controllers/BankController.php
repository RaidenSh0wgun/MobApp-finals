<?php

namespace App\Http\Controllers;

use App\Models\AccountType;
use App\Models\BankAccount;
use App\Models\BankTransaction;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;

class BankController extends Controller
{
    public function accounts()
    {
        $accounts = BankAccount::with(['transactions', 'type'])
            ->where('user_id', request()->user()->id)
            ->get()
            ->map(fn (BankAccount $account) => [
                'id' => $account->id,
                'code' => $account->code,
                'nickname' => $account->nickname,
                'balance' => $account->balance,
                'account_type' => $account->type?->name,
                'user_id' => $account->user_id,
                'type_id' => $account->type_id,
                'transactions' => $account->transactions,
            ]);

        return $this->Ok($accounts);
    }

    public function store()
    {
        $validator = Validator::make(request()->all(), [
            'code' => ['required', 'string', 'max:8', 'regex:/^\d+$/', 'unique:accounts,code'],
            'nickname' => 'required|string|max:255',
            'balance' => 'required|numeric|min:5000',
            'account_type' => 'required|string|in:Checking,Savings,Time Deposit',
        ]);

        if ($validator->fails()) {
            return $this->BadRequest($validator);
        }

        $data = $validator->validated();
        $accountType = AccountType::where('name', $data['account_type'])->first();

        if (!$accountType) {
            return $this->Error('Invalid account type.');
        }

        $account = DB::transaction(function () use ($data, $accountType) {
            $created = BankAccount::create([
                'user_id' => request()->user()->id,
                'code' => $data['code'],
                'nickname' => $data['nickname'],
                'balance' => $data['balance'],
                'type_id' => $accountType->id,
            ]);

            BankTransaction::create([
                'account_id' => $created->id,
                'description' => 'Initial deposit',
                'amount' => $created->balance,
            ]);

            $created->load(['transactions', 'type']);

            return [
                'id' => $created->id,
                'code' => $created->code,
                'nickname' => $created->nickname,
                'balance' => $created->balance,
                'account_type' => $created->type?->name,
                'user_id' => $created->user_id,
                'type_id' => $created->type_id,
                'transactions' => $created->transactions,
            ];
        });

        return $this->Ok($account, 'Account created.');
    }

    public function transactions(BankAccount $account)
    {
        if (request()->user()->id !== $account->user_id) {
            return $this->Unauthorized('Access denied');
        }

        return $this->Ok($account->transactions()->get());
    }

    public function sendMoney()
    {
        $validator = Validator::make(request()->all(), [
            'from_account_id' => 'required|integer|exists:accounts,id',
            'to_account_id' => 'required|integer|exists:accounts,id|different:from_account_id',
            'amount' => 'required|numeric|min:500',
        ]);

        if ($validator->fails()) {
            return $this->BadRequest($validator);
        }

        $data = $validator->validated();
        $userId = request()->user()->id;
        $amount = (float) $data['amount'];

        $result = DB::transaction(function () use ($data, $userId, $amount) {
            $from = BankAccount::where('id', $data['from_account_id'])->where('user_id', $userId)->first();
            $to = BankAccount::where('id', $data['to_account_id'])->where('user_id', $userId)->first();

            if (!$from || !$to) {
                return ['ok' => false, 'message' => 'Invalid account selection.'];
            }

            if ((float) $from->balance < $amount) {
                return ['ok' => false, 'message' => 'Insufficient balance.'];
            }

            $from->balance = (float) $from->balance - $amount;
            $to->balance = (float) $to->balance + $amount;
            $from->save();
            $to->save();

            BankTransaction::create([
                'account_id' => $from->id,
                'description' => 'Transfer to ' . $to->nickname . ' (' . $to->code . ')',
                'amount' => -$amount,
                'created_at' => now(),
            ]);

            BankTransaction::create([
                'account_id' => $to->id,
                'description' => 'Transfer from ' . $from->nickname . ' (' . $from->code . ')',
                'amount' => $amount,
                'created_at' => now(),
            ]);

            return [
                'ok' => true,
                'data' => [
                    'from_account_id' => $from->id,
                    'to_account_id' => $to->id,
                    'amount' => $amount,
                    'from_balance' => $from->balance,
                    'to_balance' => $to->balance,
                ],
            ];
        });

        if (!$result['ok']) {
            return $this->Error($result['message']);
        }

        return $this->Ok($result['data'], 'Transfer successful.');
    }

    public function payBill()
    {
        $validator = Validator::make(request()->all(), [
            'from_account_id' => 'required|integer|exists:accounts,id',
            'company' => 'required|string|max:255',
            'amount' => 'required|numeric|min:500',
        ]);

        if ($validator->fails()) {
            return $this->BadRequest($validator);
        }

        $data = $validator->validated();
        $userId = request()->user()->id;
        $amount = (float) $data['amount'];

        $result = DB::transaction(function () use ($data, $userId, $amount) {
            $from = BankAccount::where('id', $data['from_account_id'])->where('user_id', $userId)->first();

            if (!$from) {
                return ['ok' => false, 'message' => 'Invalid account selection.'];
            }

            if ((float) $from->balance < $amount) {
                return ['ok' => false, 'message' => 'Insufficient balance.'];
            }

            $from->balance = (float) $from->balance - $amount;
            $from->save();

            BankTransaction::create([
                'account_id' => $from->id,
                'description' => 'Bill payment to ' . $data['company'],
                'amount' => -$amount,
                'created_at' => now(),
            ]);

            return [
                'ok' => true,
                'data' => [
                    'from_account_id' => $from->id,
                    'amount' => $amount,
                    'from_balance' => $from->balance,
                    'company' => $data['company'],
                ],
            ];
        });

        if (!$result['ok']) {
            return $this->Error($result['message']);
        }

        return $this->Ok($result['data'], 'Bill payment successful.');
    }
}
