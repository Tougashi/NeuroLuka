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
// <<<<<<< HEAD
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Validation\ValidationException;
use Illuminate\Support\Facades\Validator;

class ForgotPasswordController extends Controller
{
    /**
     * Handle the forgot password request
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    protected function throttleKey(Request $request)
    {
        return Str::transliterate(Str::lower($request->input('email')).'|'.$request->ip());
    }

    public function sendResetLinkEmail(Request $request)
    {
        Log::info('Received forgot password request', ['email' => $request->email]);

        try {
            // Validate request first
            $request->validate([
                'email' => ['required', 'email', 'exists:users'],
            ], [
                'email.required' => 'Email wajib diisi.',
                'email.email' => 'Format email tidak valid.',
                'email.exists' => 'Email tidak terdaftar dalam sistem kami.'
            ]);

            // Check rate limiting
            $key = $this->throttleKey($request);
            if (RateLimiter::tooManyAttempts($key, 5)) {
                $seconds = RateLimiter::availableIn($key);
                throw ValidationException::withMessages([
                    'email' => ['Terlalu banyak permintaan reset password. Silakan coba lagi dalam ' .
                               ceil($seconds / 60) . ' menit.']
                ]);
            }

            // Increment attempt
            RateLimiter::hit($key);

            // Log mail config for debugging
            Log::info('Mail configuration', [
                'mailer' => config('mail.default'),
                'host' => config('mail.mailers.smtp.host'),
                'port' => config('mail.mailers.smtp.port'),
                'encryption' => config('mail.mailers.smtp.encryption'),
                'from_address' => config('mail.from.address'),
                'from_name' => config('mail.from.name')
            ]);

            try {
                $status = Password::sendResetLink(
                    $request->only('email')
                );
            } catch (\Exception $e) {
                Log::error('Error sending reset password email', [
                    'email' => $request->email,
                    'error' => $e->getMessage(),
                    'trace' => $e->getTraceAsString()
                ]);
                throw $e;
            }

            if ($status == Password::RESET_LINK_SENT) {
                // Log success with detailed information
                Log::info('Reset password email sent successfully', [
                    'email' => $request->email,
                    'status' => $status,
                    'time' => now()->toDateTimeString()
                ]);

                // Reset rate limiter on success
                RateLimiter::clear($this->throttleKey($request));

                return response()->json([
                    'status' => 'success',
                    'message' => 'Link reset password telah dikirim ke email Anda. Silakan cek inbox atau folder spam email Anda.'
                ]);
            }

            // Increment the rate limiter
            RateLimiter::hit($this->throttleKey($request));

            // If we reach here, there was an error
            Log::warning('Failed to send reset password email', [
                'email' => $request->email,
                'status' => $status
            ]);

// =======

            throw ValidationException::withMessages([
                'email' => [trans($status)]
            ]);

        } catch (\Exception $e) {
            // Log error
            Log::error('Failed to send reset password email', [
                'email' => $request->email,
                'error' => $e->getMessage()
            ]);

            if ($e instanceof ValidationException) {
                throw $e;
            }

            return response()->json([
                'status' => 'error',

                'message' => 'Terjadi kesalahan saat mengirim email reset password.'
            ], 500);
        }
    }

    public function resetPassword(Request $request)
    {
        $request->validate([
            'token' => 'required',
            'email' => 'required|email',
            'password' => 'required|min:8',
        ], [
            'token.required' => 'Token reset password tidak valid.',
            'email.required' => 'Email wajib diisi.',
            'email.email' => 'Format email tidak valid.',
            'password.required' => 'Password baru wajib diisi.',
            'password.min' => 'Password minimal 8 karakter.',
        ]);

        try {
            $status = Password::reset(
                $request->only('email', 'password', 'token'),
                function ($user, $password) {
                    $user->forceFill([
                        'password' => Hash::make($password)
                    ])->save();

                    // Log successful password reset
                    Log::info('Password reset successful', [
                        'email' => $user->email,
                        'time' => now()->toDateTimeString()
                    ]);

                    event(new \Illuminate\Auth\Events\PasswordReset($user));
                }
            );

            if ($status == Password::PASSWORD_RESET) {
                return response()->json([
                    'status' => 'success',
                    'message' => 'Password berhasil direset.'
                ]);
            }

            throw ValidationException::withMessages([
                'email' => [trans($status)]
            ]);

        } catch (\Exception $e) {
            Log::error('Failed to reset password', [
                'email' => $request->email,
                'error' => $e->getMessage()
            ]);

            return response()->json([
                'status' => 'error',
                'message' => 'Gagal mereset password. ' . $e->getMessage()

            ], 500);
        }
    }
}
