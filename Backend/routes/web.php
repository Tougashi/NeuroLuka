<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;


Route::get('/', function () {
    return view('welcome');
});

//route untuk login
Route::post('/login', [AuthController::class, 'login']);
//route untuk proses login
Route::get('/login', [AuthController::class, 'showLogin'])->name('login');

//route untuk register
Route::post('/register', [AuthController::class, 'register']);
//route untuk proses register
Route::get('/register', [AuthController::class, 'showRegister'])->name('register');

//route untuk loguot
Route::post('/logout', [AuthController::class, 'logout'])->name('logout');
