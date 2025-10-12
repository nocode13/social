<?php

use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return view('welcome');
});

Route::get('/setup', function () {
    $credentials = [
        'email' => 'admin@admin.com',
        'password' => 'password',
    ];

    $user = \App\Models\User::firstOrCreate(
        ['email' => $credentials['email']],
        [
            'name' => 'Admin',
            'password' => Hash::make($credentials['password']),
        ]
    );

    Auth::login($user);

    $adminToken = $user->createToken('admin-token', ['create', 'update', 'delete']);
    $updateToken = $user->createToken('update-token', ['create', 'update']);
    $basicToken = $user->createToken('basic-token');

    return [
        'admin' => $adminToken->plainTextToken,
        'update' => $updateToken->plainTextToken,
        'basic' => $basicToken->plainTextToken,
    ];
});
