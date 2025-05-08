<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Password;
use Illuminate\Support\Facades\Log;
use App\Models\User;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class ForgotPasswordController extends Controller
{
    public function sendResetLinkEmail(Request $request)
    {
        $request->validate([
            'email' => ['required', 'email', 'exists:users']
        ], [
            'email.exists' => 'Email tidak terdaftar dalam sistem kami.'
        ]);

        try {
            $status = Password::sendResetLink(
                $request->only('email')
            );

            if ($status == Password::RESET_LINK_SENT) {
                return response()->json([
                    'status' => 'success',
                    'message' => 'Link reset password telah dikirim ke email Anda.'
                ]);
            }

            throw ValidationException::withMessages([
                'email' => [trans($status)]
            ]);

        } catch (\Exception $e) {
            Log::error('Failed to send reset password email', [
                'email' => $request->email,
                'error' => $e->getMessage()
            ]);

            if ($e instanceof ValidationException) {
                throw $e;
            }

            return response()->json([
                'status' => 'error',
                'message' => 'Terjadi kesalahan saat mengirim email. Silakan coba lagi.'
            ], 500);
        }
    }
}
