<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <link rel="icon" type="image/png" href="{{ asset('images/beez.png') }}">
        <title>bee•z link</title>
        <!-- Styles -->
        <link href="{{ asset('/css/app.css') }}" rel="stylesheet">
        <meta name="csrf-token" content="{{ csrf_token() }}">
        <meta name="version" content="{{ env('APP_VERSION') }}">
    </head>
    <body id='page-top'>
            <div id="react-content">
            </div>
    </body>
    <script type="text/javascript" src="../js/app.js"></script>
</html>
