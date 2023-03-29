<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateBeehivesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('beehives', function (Blueprint $table) {
            $table->id();
            $table->char('uid', 36)->nullable();
            $table->string('name', 255);
            $table->string('description', 255)->nullable();
            $table->string('type', 255)->nullable();
            $table->decimal('latitude', 10,6);
            $table->decimal('longitude', 10,6);
            $table->decimal('altitude',10,0)->nullable();
            $table->integer('num_honey_frames')->nullable();
            $table->integer('num_pollen_frames')->nullable();
            $table->integer('num_brood_frames')->nullable();
            $table->integer('num_empty_frames')->nullable();
            $table->string('source_of_swarm',45)->nullable();
            $table->string('queen_color',45)->nullable();
            $table->date('installation_date')->nullable();
            $table->foreignId('apiary_id')->nullable()->constrained();
            $table->foreignId('owner_id')->constrained('users');
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
        Schema::dropIfExists('beehives');
    }
}
