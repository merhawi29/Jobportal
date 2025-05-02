<?php

return [
    /*
    |--------------------------------------------------------------------------
    | Email Configuration Guide
    |--------------------------------------------------------------------------
    |
    | This file serves as a guide for configuring email in your application.
    | Copy the necessary settings to your .env file and update with your values.
    |
    */
    
    'guide' => [
        // Mail Driver (smtp, sendmail, mailgun, ses, etc)
        'MAIL_MAILER' => 'smtp',
        
        // SMTP Settings (for SMTP driver)
        'MAIL_HOST' => 'smtp.example.com',
        'MAIL_PORT' => '587',
        'MAIL_USERNAME' => 'merhawinguse29@gmail.com',
        'MAIL_PASSWORD' => 'MBSkokob29@',
        'MAIL_ENCRYPTION' => 'tls',
        
        // "From" Address Settings
        'MAIL_FROM_ADDRESS' => 'merhawinguse29@gmail.com',
        'MAIL_FROM_NAME' => '${APP_NAME}',

        
        // Queue Settings
        'QUEUE_CONNECTION' => 'database', // Or 'sync' for direct sending (no queue)
    ],
    
    'mail_troubleshooting' => [
        '1. Check .env configuration' => 'Make sure all mail-related settings are properly configured in your .env file.',
        '2. Verify mail service' => 'Ensure the mail service provider is working and your account is active.',
        '3. Test with artisan' => 'Run php artisan mail:test to test your mail configuration.',
        '4. Check queue worker' => 'If using queue, ensure queue worker is running: php artisan queue:work',
        '5. Check logs' => 'Review storage/logs/laravel.log for mail-related errors.',
        '6. Try direct sending' => 'Set QUEUE_CONNECTION=sync in .env to bypass queue system for testing.',
        '7. Check spam filters' => 'Emails might be delivered but caught by spam filters.',
    ],
]; 