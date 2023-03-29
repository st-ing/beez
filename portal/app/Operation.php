<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Operation extends Model
{
  use SoftDeletes;

  protected $fillable = [
    'name', 'description', 'status', 'planning_comments', 'planned_date', 'executed_date',
    'execution_comments', 'type', 'beehive_id', 'harvest_honey', 'harvest_weight',
    'harvest_batch_id', 'template', 'user_id', 'plan_id', 'beehive_id', 'apiary_id','updated_at','created_at'
  ];

  /**
   * Scope that returns all planned operations
   * @param  \Illuminate\Database\Eloquent\Builder  $query
   * @return \Illuminate\Database\Eloquent\Builder
   */
  public function scopePlanned($query)
  {
    return $query->where('status', '=','planned');
  }

  /**
s   * Scope that returns all planned operations
   * @param  \Illuminate\Database\Eloquent\Builder  $query
   * @return \Illuminate\Database\Eloquent\Builder
   */
  public function scopeStarted($query)
  {
    return $query->where('status', '=','started');
  }

  /**
   * Scope that returns all planned operations
   * @param  \Illuminate\Database\Eloquent\Builder  $query
   * @return \Illuminate\Database\Eloquent\Builder
   */
  public function scopeFinished($query)
  {
    return $query->where('status', '=','done');
  }

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
   * Get the plan of operation
   * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
   */
  public function plan()
  {
    return $this->belongsTo('App\Plan');
  }

  /**
   * Get the apiary on witch is operation performed
   * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
   */
  public function apiary()
  {
    return $this->belongsTo('App\Apiary');
  }

  /**
   * Get the beehive on witch is operation performed
   * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
   */
  public function beehive()
  {
   return $this->belongsTo('App\Beehive');
  }

  /**
   * Get the user who is performing operation
   * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
   */
  public function user()
  {
    return $this->belongsTo('App\User');
  }
}
