<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class BankAccount extends Model
{
    use HasFactory;

    protected $table = 'accounts';
    public $timestamps = false;

    protected $fillable = [
        'user_id',
        'code',
        'nickname',
        'balance',
        'type_id',
    ];

    public function type()
    {
        return $this->belongsTo(AccountType::class, 'type_id');
    }

    public function transactions()
    {
        return $this->hasMany(BankTransaction::class, 'account_id');
    }
}
