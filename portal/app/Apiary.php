<?php

namespace App;

use MatanYadaev\EloquentSpatial\Objects\Polygon;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;


class Apiary extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'name', 'address', 'latitude','longitude','altitude','description','migrate','owner_id','sun_exposure','type_of_env','flora_type','owner_id'
    ];

  protected $casts = [
    'area' => Polygon::class,
  ];

  /**
   * @return \Illuminate\Database\Eloquent\Relations\HasMany
   */
    public function beehives()
    {
        return $this->hasMany('App\Beehive');
    }

  /**
   * @return \Illuminate\Database\Eloquent\Relations\BelongsToMany
   */
    public function manyBeehives(){
        return $this->belongsToMany('App\Beehive', 'beehive_in_apiary')->withPivot('from', 'until');
    }

  /**
   * @return \Illuminate\Database\Eloquent\Relations\HasMany
   */
    public function operations()
    {
      return $this->hasMany('App\Operation');
    }
}
