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

        // Tambahkan logging untuk setiap email yang dikirim
        if (config('app.debug')) {
            Mail::alwaysTo('farhaneshaputra132@gmail.com'); // Untuk testing
        }

        // Gunakan events untuk logging email
        Mail::extend('log-transport', function () {
            Log::info('Attempting to send email');
        });

        // Handle email failures
        \Illuminate\Support\Facades\Event::listen(
            'Illuminate\Mail\Events\MessageSending',
            function ($event) {
                Log::info('Sending email', [
                    'to' => $event->message->getTo(),
                    'subject' => $event->message->getSubject()
                ]);
            }
        );

        \Illuminate\Support\Facades\Event::listen(
            'Illuminate\Mail\Events\MessageSent',
            function ($event) {
                Log::info('Email sent successfully', [
                    'to' => $event->message->getTo(),
                    'subject' => $event->message->getSubject()
                ]);
            }
        );

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
