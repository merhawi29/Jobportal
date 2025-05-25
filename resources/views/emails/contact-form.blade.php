@component('mail::message')
# New Contact Form Submission

You have received a new message from the contact form.

**Name:** {{ $name }}  
**Email:** {{ $email }}  
**Subject:** {{ $subject }}

**Message:**  
{{ $messageContent }}

@component('mail::panel')
This email was sent from the JobPortal contact form.
@endcomponent

Thanks,<br>
{{ config('app.name') }}
@endcomponent 