<?php

namespace App\Notifications;

use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;
use App\Setting;


class CustomGoogleEmailNotification extends Notification
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
    $mailMessage = (new MailMessage)
      ->subject(trans('email.welcome.subject'))
      ->greeting(trans('email.welcome.greeting'))
      ->line(trans('email.welcome.line.1'))
      ->line(trans('email.welcome.line.2'))
      ->line(trans('email.welcome.line.3'))
      ->line(trans('email.welcome.line.4'))
      ->line(trans('email.welcome.outline'));
    if (Setting::where('key', $this->bccToSystemKey)->first())
        $mailMessage = $mailMessage->bcc('buzz@beez.link', 'bee•z');
    return $mailMessage;
  }
}
