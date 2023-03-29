<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Localization extends Model
{
    protected $fillable = [
        'language','key_path','translation'
    ];

}
