@extends('errors::minimal')

@section('title', 'Not Found')
@section('code', '404')

@if($exception->getMessage())
  @section('message', $exception->getMessage())
@else
  @section('message', 'Not Found')
@endif
