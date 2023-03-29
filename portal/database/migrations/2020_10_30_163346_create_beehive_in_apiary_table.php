<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateBeehiveInApiaryTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('beehive_in_apiary', function (Blueprint $table) {
            $table->foreignId('apiary_id')->constrained();
            $table->foreignId('beehive_id')->constrained();
            $table->dateTime('from', 0);
            $table->dateTime('until', 0)->nullable();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
      Schema::dropIfExists('beehive_in_apiary');
    }
}
