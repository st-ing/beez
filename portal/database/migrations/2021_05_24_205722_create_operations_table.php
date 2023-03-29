<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateOperationsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('operations', function (Blueprint $table) {
            $table->id();
            $table->string('name', 255);
            $table->string('description', 1024)->nullable();
            $table->enum('status', ['planned','started','done','canceled'])->nullable();
            $table->string('planning_comments', 4096)->nullable();
            $table->date('planned_date')->nullable();
            $table->date('executed_date')->nullable();
            $table->string('execution_comments', 4096)->nullable();
            $table->enum('type', ['harvest','interventions','analysis','custom']);
            $table->string('harvest_honey', 45)->nullable();
            $table->float('harvest_weight', 8, 2)->nullable();
            $table->integer('harvest_batch_id')->nullable();
            $table->tinyInteger('template')->default(0);
            $table->foreignId('apiary_id')->nullable()->constrained();
            $table->foreignId('user_id')->nullable()->constrained();
            $table->foreignId('plan_id')->nullable()->constrained();
            $table->foreignId('beehive_id')->nullable()->constrained();
            $table->timestamps();
        });
        Schema::table('beehive_in_apiary', function (Blueprint $table) {
          $table->foreignId('operation_id')->nullable()->constrained();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
      Schema::table('beehive_in_apiary', function (Blueprint $table) {
        $table->dropForeign(['operation_id']);
      });
      Schema::dropIfExists('operations');
    }
}
