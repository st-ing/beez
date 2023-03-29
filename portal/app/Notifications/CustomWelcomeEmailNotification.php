<?php

namespace App\Notifications;

use App\Setting;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Config;
use Illuminate\Support\Facades\URL;

class CustomWelcomeEmailNotification extends Notification
{
  /**
   * The callback that should be used to build the mail message.
   *
   * @var \Closure|null
   */
  public static $toMailCallback;
  private $bccToSystemKey = 'notification.email.bcc_to_system';

  /**
   * Get the notification's channels.
   *
   * @param  mixed  $notifiable
   * @return array|string
   */
  public function via($notifiable)
  {
    return ['mail'];
  }

  /**
   * Build the mail representation of the notification.
   *
   * @param  mixed  $notifiable
   * @return \Illuminate\Notifications\Messages\MailMessage
   */
  public function toMail($notifiable)
  {
    $verificationUrl = $this->verificationUrl($notifiable);

    if (static::$toMailCallback) {
      return call_user_func(static::$toMailCallback, $notifiable, $verificationUrl);
    }

    $mailMessage = (new MailMessage)
      ->subject(trans('email.welcome.subject'))
      ->greeting(trans('email.welcome.greeting'))
      ->line(trans('email.welcome.line.1'))
      ->line(trans('email.welcome.line.2'))
      ->line(trans('email.welcome.line.3'))
      ->line(trans('email.welcome.line.4'))
      ->action(trans('email.welcome.button'), $verificationUrl)
      ->line(trans('email.welcome.outline'));
    if (Setting::where('key', $this->bccToSystemKey)->first())
      $mailMessage = $mailMessage->bcc('buzz@beez.link', 'bee•z');
    return $mailMessage;
  }

  /**
   * Get the verification URL for the given notifiable.
   *
   * @param  mixed  $notifiable
   * @return string
   */
  protected function verificationUrl($notifiable)
  {
    return URL::temporarySignedRoute(
      'verification.verify',
      Carbon::now()->addMinutes(Config::get('auth.verification.expire', 60)),
      [
        'id' => $notifiable->getKey(),
        'hash' => sha1($notifiable->getEmailForVerification()),
      ]
    );
  }

  /**
   * Set a callback that should be used when building the notification mail message.
   *
   * @param  \Closure  $callback
   * @return void
   */
  public static function toMailUsing($callback)
  {
    static::$toMailCallback = $callback;
  }
}
