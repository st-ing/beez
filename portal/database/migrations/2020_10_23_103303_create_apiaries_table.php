<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateApiariesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('apiaries', function (Blueprint $table) {
            $table->id();
            $table->string('name', 255);
            $table->string('address', 45)->nullable();
            $table->decimal('latitude', 10,6)->nullable();
            $table->decimal('longitude', 10,6)->nullable();
            $table->polygon('area')->default(null)->nullable();
            $table->decimal('altitude',10,0)->nullable();
            $table->string('description', 255)->nullable();
            $table->enum('type_of_env', ['natural', 'urban', 'agriculture', 'other'])->nullable();
            $table->string('flora_type', 255)->nullable();
            $table->enum('sun_exposure', ['low', 'medium', 'high'])->nullable();
            $table->tinyInteger('migrate')->default(0);
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
        Schema::dropIfExists('apiaries');
    }
}
