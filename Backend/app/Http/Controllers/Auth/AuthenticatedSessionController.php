<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class AuthenticatedSessionController extends Controller
{
    public function store(LoginRequest $request)
    {
        try {
            $request->authenticate();
            $request->session()->regenerate();

            return response()->json([
                'message' => 'Login successful',
                'user' => Auth::user()
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Email atau password salah'
            ], 401);
        }
    }

    public function destroy(Request $request)
    {
        Auth::guard('web')->logout();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return response()->json([
            'message' => 'Logged out successfully'
        ]);
    }
}
