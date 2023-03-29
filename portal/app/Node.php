<?php

namespace App;
use Illuminate\Database\Eloquent\Model;


class Node extends Model
{
  public $incrementing = false;
  protected $fillable = [
    'id', 'description', 'claim_key', 'serial_number', 'hw_version', 'fw_version', 'installed_date', 'claimed_date', 'beehive_id'
  ];
}
