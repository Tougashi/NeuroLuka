<?php

namespace App\Providers;

use Illuminate\Auth\Notifications\ResetPassword;
use Illuminate\Support\ServiceProvider;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Log;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        ResetPassword::createUrlUsing(function (object $notifiable, string $token) {
            return config('app.frontend_url')."/password-reset/$token?email={$notifiable->getEmailForPasswordReset()}";
        });

        // Event listener untuk email yang sedang dikirim
        \Illuminate\Support\Facades\Event::listen(
            'Illuminate\Mail\Events\MessageSending',
            function ($event) {
                Log::info('Sending email', [
                    'to' => $event->message->getTo(),
                    'subject' => $event->message->getSubject()
                ]);
            }
        );

        // Event listener untuk email yang berhasil dikirim
        \Illuminate\Support\Facades\Event::listen(
            'Illuminate\Mail\Events\MessageSent',
            function ($event) {
                Log::info('Email sent successfully', [
                    'to' => $event->message->getTo(),
                    'subject' => $event->message->getSubject()
                ]);
            }
        );

        // Event listener untuk email yang gagal dikirim
        \Illuminate\Support\Facades\Event::listen(
            'Illuminate\Mail\Events\MessageSendingFailed',
            function ($event) {
                Log::error('Failed to send email', [
                    'error' => $event->error->getMessage(),
                    'to' => $event->message->getTo(),
                    'subject' => $event->message->getSubject()
                ]);
            }
        );
    }
}
