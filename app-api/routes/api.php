<?php

use Illuminate\Support\Facades\Route;

Route::post('login', [App\Http\Controllers\AuthController::class, 'login']);
Route::get('checkToken', [App\Http\Controllers\AuthController::class, 'checkToken']);
Route::get('logout',[App\Http\Controllers\AuthController::class,'logout']);
Route::post('register',[App\Http\Controllers\AuthController::class, 'register']);

Route::middleware('auth:sanctum')->prefix('bank')->group(function () {
    Route::get('accounts', [App\Http\Controllers\BankController::class, 'accounts']);
    Route::post('accounts', [App\Http\Controllers\BankController::class, 'store']);
    Route::post('send-money', [App\Http\Controllers\BankController::class, 'sendMoney']);
    Route::post('pay-bill', [App\Http\Controllers\BankController::class, 'payBill']);
    Route::get('accounts/{account}/transactions', [App\Http\Controllers\BankController::class, 'transactions']);
});

// /user/changePassword
// PUT                  vs.      PATCH
// entire model updated - specific field updates
Route::prefix('user')->group(function () {
    Route::patch('changePassword', [App\Http\Controllers\AuthController::class, 'changePassword']);
});
