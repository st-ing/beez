<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;


class Plan extends Model
{
  use SoftDeletes;

  protected $fillable = ['name','description','start_date','stop_date','user_id','template'];

  /**
   * Scope that returns all template operations
   * @param  \Illuminate\Database\Eloquent\Builder  $query
   * @return \Illuminate\Database\Eloquent\Builder
   */
  public function scopeTemplate($query)
  {
    return $query->where('template', '=','1');
  }

  /**
   * Get the operations for the plan.
   * @return  \Illuminate\Database\Eloquent\Relations\HasMany
   */
  public function operations()
  {
    return $this->hasMany('App\Operation');
  }
}
