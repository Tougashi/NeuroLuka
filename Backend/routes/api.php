<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Auth\RegisteredUserController;
use App\Http\Controllers\Auth\AuthenticatedSessionController;
use App\Http\Controllers\Auth\ForgotPasswordController;
use App\Http\Controllers\API\WoundAnalysisController;
use App\Models\WoundRecord;

// Authentication Routes
Route::post('/register', [RegisteredUserController::class, 'store']);
Route::post('/login', [AuthenticatedSessionController::class, 'store']);
Route::post('/forgot-password', [ForgotPasswordController::class, 'sendResetLinkEmail']);
Route::post('/reset-password', [ForgotPasswordController::class, 'resetPassword']);

// Protected Routes
Route::middleware(['auth:sanctum'])->group(function () {
    // User Profile
    Route::get('/user', function (Request $request) {
        return $request->user();
    });

    // Wound Analysis
    Route::post('/analyze', [WoundAnalysisController::class, 'analyze']);

    // History routes
    Route::get('/history', function (Request $request) {
        return WoundRecord::where('user_id', $request->user()->id)
            ->orderBy('created_at', 'desc')
            ->get();
    });

    // Authentication
    Route::post('/logout', [AuthenticatedSessionController::class, 'destroy']);
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
