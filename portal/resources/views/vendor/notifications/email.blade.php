@component('mail::message')
{{-- Greeting --}}
@isset($greeting)
# <p style=" text-transform:uppercase; margin-bottom: 60px; text-align: center; font: normal normal normal 35px/38px Nunito, sans-serif; letter-spacing: -0.1px; color: #8B6A11;" >{{ $greeting }}</p>
@endisset

{{-- Intro Lines --}}
@foreach ($introLines as $line)
  <p style="text-align: center; font: normal normal normal 24px/40px Nunito, sans-serif; letter-spacing: -1.03px; color: #8B6A11;">{{ $line }}</p>

@endforeach

{{-- Action Button --}}
@isset($actionText)
@component('mail::button', ['url' => $actionUrl])
{{ $actionText }}
@endcomponent
@endisset

{{-- Outro Lines --}}
@foreach ($outroLines as $line)
  <p style="text-align: center; font: normal normal normal 18px/21px Nunito, sans-serif; letter-spacing: -0.77px; color: #8B6A11;" >{{ $line }}</p>

@endforeach

{{-- Salutation --}}
@if (! empty($salutation))
{{ $salutation }}
@endif

@endcomponent
