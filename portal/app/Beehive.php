<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use MatanYadaev\EloquentSpatial\Objects\Point;
use Illuminate\Database\Eloquent\SoftDeletes;


class Beehive extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'name', 'description', 'type','num_honey_frames','num_pollen_frames','num_brood_frames','num_empty_frames','apiary_id','owner_id','source_of_swarm','queen_color','installation_date','owner_id'
    ];
  protected $casts = [
    'location' => Point::class,
  ];

  /**
   * @return \Illuminate\Database\Eloquent\Relations\HasMany
   */
    public function operations()
    {
        return $this->hasMany('App\Operation');
    }

  /**
   * @return \Illuminate\Database\Eloquent\Relations\BelongsToMany
   */
    public function apiaries()
    {
        return $this->belongsToMany('App\Apiary','beehive_in_apiary')->withPivot('from', 'until');;
    }

  public function node()
  {
    return $this->hasOne('App\Node','beehive_id');
  }
}
