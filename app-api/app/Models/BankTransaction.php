<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class BankTransaction extends Model
{
    use HasFactory;

    protected $table = 'transactions';

    public $timestamps = false;

    protected $fillable = [
        'account_id',
        'description',
        'amount',
        'created_at',
    ];

    public function account()
    {
        return $this->belongsTo(BankAccount::class, 'account_id');
    }
}
