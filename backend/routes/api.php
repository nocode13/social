<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\ChatController;

Route::prefix('auth')->group(function () {
  Route::post('login', [AuthController::class, 'login'])->name('login');
  Route::post('register', [AuthController::class, 'register']);
});

Route::middleware('auth:api')->group(function () {

  // Auth routes
  Route::prefix('auth')->group(function () {
    Route::post('logout', [AuthController::class, 'logout']);
    Route::post('refresh', [AuthController::class, 'refresh']);
  });

  // User routes
  Route::prefix('users')->group(function () {
    Route::get('', [UserController::class, 'findAll']);
    Route::get('me', [UserController::class, 'me']);
  });

  // Chat routes
  Route::prefix('chats')->group(function () {
    Route::get('', [ChatController::class, 'findAll']);
    Route::get('{id}', [ChatController::class, 'findOne']);
    Route::post('', [ChatController::class, 'create']);
  });
});
