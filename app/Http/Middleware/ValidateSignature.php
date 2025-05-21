<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Routing\Middleware\ValidateSignature as BaseValidateSignature;
use Illuminate\Support\Facades\Log;

class ValidateSignature extends BaseValidateSignature
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @param  string[]|null  $relative
     * @return \Illuminate\Http\Response|\Illuminate\Http\RedirectResponse
     */
    public function handle($request, Closure $next, ...$args)
    {
        try {
            // Log the signature verification attempt
            Log::info('Validating URL signature', [
                'url' => $request->fullUrl(),
                'query_params' => $request->query(),
                'user_id' => $request->user() ? $request->user()->id : 'guest'
            ]);
            
            // Relax the URL validation by ignoring specific verification parameters
            // that might be added by email clients or security software
            $modifiedRequest = clone $request;
            $queryParams = $modifiedRequest->query();
            
            // Filter out common email tracking parameters
            $ignoredParams = [
                'utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content',
                'fbclid', 'gclid', 'dclid', 'zanpid', 'msclkid',
                'mc_eid', 'mc_cid', 'oly_enc_id', 'oly_anid',
                'nytimed', 'ref', 'source', 'e', 'elqTrackId', 'elq',
                's', 't', 'ct', 'mt', 'n'
            ];
            
            foreach ($ignoredParams as $param) {
                if (isset($queryParams[$param])) {
                    unset($queryParams[$param]);
                }
            }
            
            // Set the cleaned query parameters
            $modifiedRequest->query->replace($queryParams);
            
            // Pass the modified request to the parent middleware
            return parent::handle($modifiedRequest, $next, ...$args);
        } catch (\Exception $e) {
            // Log the error
            Log::error('URL signature validation failed', [
                'url' => $request->fullUrl(),
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            
            // Redirect to the email verification notice page with error message
            if ($request->is('email/verify/*')) {
                return redirect()
                    ->route('verification.notice')
                    ->with('error', 'The verification link is invalid or has expired. Please request a new verification link.');
            }
            
            // For other signed URLs, return 403
            abort(403, 'Invalid signature.');
        }
    }
} 