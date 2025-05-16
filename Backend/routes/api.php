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

// Public Routes
Route::post('/analyze', function (Request $request) {
    // Logika analisis luka
    return response()->json([
        'size' => '4.2 cm',
        'recoveryTime' => '10 - 14 days',
        'healingProgress' => 'Early stage healing. Signs of initial scabbing present.',
        'recommendation' => 'Keep the area clean and dry. Apply antiseptic ointment twice daily.'
    ]);
});

// Protected Routes
Route::middleware(['auth:sanctum'])->group(function () {
    Route::get('/user', function (Request $request) {
        return $request->user();
    });
    Route::post('/logout', [AuthenticatedSessionController::class, 'destroy']);

    // History routes
    Route::post('/history', function (Request $request) {
        // Simpan hasil analisis ke database
        return response()->json(['message' => 'History saved successfully']);
    });

    Route::get('/history', function (Request $request) {
        // Ambil riwayat analisis user
        return response()->json([
            'histories' => []
        ]);
    });

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
