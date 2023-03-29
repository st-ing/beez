<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateNodesTable extends Migration
{
  /**
   * Run the migrations.
   *
   * @return void
   */
  public function up()
  {
    Schema::create('nodes', function (Blueprint $table) {
      $table->string('id', 32);
      $table->string('description', 255)->nullable();
      $table->string('claim_key', 32)->nullable();
      $table->string('serial_number', 32)->nullable();
      $table->string('hw_version', 16)->nullable();
      $table->string('fw_version', 16)->nullable();
      $table->date('installed_date')->nullable();
      $table->date('claimed_date')->nullable();
      $table->foreignId('beehive_id')->nullable()->constrained();
      $table->timestamps();
    });
  }

  /**
   * Reverse the migrations.
   *
   * @return void
   */
  public function down()
  {
    Schema::dropIfExists('nodes');
  }
}
