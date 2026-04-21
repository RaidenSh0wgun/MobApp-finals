<?php

namespace App\Http\Controllers;

use Illuminate\Routing\Attributes\Controllers\Middleware;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;


class AuthController extends Controller
{
    public function login()
    {
        $validator = Validator::make(request()->all(), [
            'username' => 'required',
            'password' => 'required'
        ]);

        if ($validator->fails()) {
            return $this->BadRequest($validator);
        }

        if (!auth()->attempt($validator->validated())) {
            return $this->Unauthorized("Invalid Credentials!");
        }

        $user = auth()->user();
        $token = $user->createToken('app-login')->plainTextToken;
        $user->token = $token;

        return $this->Ok($user, "Login successful!");
    }

    public function register()
    {
        $validator = Validator::make(request()->all(),[
            'username' => 'required|unique:users',
            'password'=> 'required|confirmed',
            'email' => 'required|unique:users',
            'contact_number' => 'nullable|string|max:250',
        ]);

        if($validator->fails()){
            return $this->BadRequest($validator);
        }

        $user = User::create($validator->validated());

        return $this->Ok($user, "Registration successful.");
    }

    #[Middleware('auth:sanctum')]
    public function changePassword()
    {
        $data = request()->all();
        $validator = Validator::make($data,[
            'current_password' => 'required|string',
            "new_password" => 'required|confirmed'
        ]);

        if($validator->fails()){
            return $this->BadRequest($validator);
        }

        $user = request()->user();
        
        if(!Hash::check($data['current_password'],$user->password)){
            return $this->Error('Password entered does not match your current password');
        }
        
        $user->password = Hash::make($data['new_password']);
        $user->save();

        $user->tokens()->delete();
        return $this->Ok([],'Password changed, Login again with your new password');
    }

    #[Middleware('auth:sanctum')]
    public function checkToken(){
        $user = request()->user();
        return $this->Ok($user,'User retrieved.');
    }

    #[Middleware('auth:sanctum')]
    public function logout(){
        request()->user()->tokens()->delete();
        return $this->Ok([], "User logged out successfully.");

    }
}
