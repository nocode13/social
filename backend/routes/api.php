<?php

use Illuminate\Support\Facades\Route;

Route::group([
  'middleware' => 'api',
  'namespace' => 'App\Http\Controllers',
], function () {
  Route::prefix('auth')->group(function () {
    Route::post('login', 'AuthController@login');
    Route::post('register', 'AuthController@register');
  });
});

Route::group([
  'middleware' => ['api', 'auth:api'],
  'namespace' => 'App\Http\Controllers',
], function () {

  Route::prefix('auth')->group(function () {
    Route::post('logout', 'AuthController@logout');
    Route::post('refresh', 'AuthController@refresh');
  });

  Route::prefix('users')->group(function () {
    Route::get('me', 'AuthController@me');
  });
});
