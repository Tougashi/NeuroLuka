<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Reset Password - NeuroLuka</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; margin: 0; padding: 20px;">
    <div style="max-width: 600px; margin: 0 auto; background: #fff; padding: 20px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
        <h2 style="color: #008080; margin-bottom: 20px;">Reset Password NeuroLuka</h2>

        <p>Anda menerima email ini karena kami menerima permintaan reset password untuk akun Anda.</p>

        <div style="margin: 30px 0;">
            <a href="{{ $url }}"
               style="background: #008080;
                      color: #ffffff;
                      padding: 12px 30px;
                      text-decoration: none;
                      border-radius: 5px;
                      display: inline-block;">
                Reset Password
            </a>
        </div>

        <p>Link reset password ini akan kadaluarsa dalam 60 menit.</p>

        <p>Jika Anda tidak meminta reset password, abaikan email ini.</p>

        <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">

        <p style="color: #666; font-size: 12px;">Jika Anda mengalami masalah dengan tombol di atas, copy dan paste URL berikut ke browser Anda:<br>
        {{ $url }}</p>
    </div>
</body>
</html>
