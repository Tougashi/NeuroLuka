<?php
use Illuminate\Validation\Rules;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Mail;
use App\Http\Controllers\Auth\RegisteredUserController;
use App\Http\Controllers\Auth\AuthenticatedSessionController;
use App\Http\Controllers\Auth\ForgotPasswordController;
// <<<<<<< HEAD
// =======


// Authentication Routes
Route::post('/register', [RegisteredUserController::class, 'store']);
Route::post('/login', [AuthenticatedSessionController::class, 'store']);
Route::post('/forgot-password', [ForgotPasswordController::class, 'sendResetLinkEmail']);
Route::post('/reset-password', [ForgotPasswordController::class, 'resetPassword']);

// Protected Routes
Route::middleware(['auth:sanctum'])->group(function () {
    Route::get('/user', function (Request $request) {
        return $request->user();
    });
    Route::post('/logout', [AuthenticatedSessionController::class, 'destroy']);

    // Additional protected routes
    Route::middleware(['checkauth'])->group(function () {
        Route::get('/analys', function () {
            return response()->json(['message' => 'Protected route']);
        });
    });
});

Route::post('/data', function (Request $request) {
    // Ambil data dari request
    $name = $request->input('name');
    $description = $request->input('description');

    // Simpan data atau lakukan sesuatu
    return response()->json([
        'message' => 'Data berhasil diterima',
        'data' => [
            'name' => $name,
            'description' => $description,
        ],
    ]);
});
