<?php

use App\Http\Controllers\Api\V1\CustomerController;
use App\Http\Controllers\Api\V1\InvoiceController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;


Route::group(['prefix' => 'v1', 'namespace' => 'App\Http\Controllers\Api\V1', 'middleware' => 'auth:sanctum'], function () {
  Route::apiResource('customers', CustomerController::class);
  Route::apiResource('invoices', InvoiceController::class);

  Route::post('invoices/bulk', ['uses' => 'InvoiceController@bulkStore']);
});
