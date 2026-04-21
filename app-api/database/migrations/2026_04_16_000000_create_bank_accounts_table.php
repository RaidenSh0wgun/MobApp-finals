<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('accounts', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->string('code', 8)->unique();
            $table->string('nickname');
            $table->decimal('balance', 12, 2);
            $table->foreignId('type_id')->constrained('account_types');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('accounts');
    }
};
