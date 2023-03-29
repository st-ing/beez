<?php

namespace Tests\Feature\Http\Controllers;

use App\Plan;
use App\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Illuminate\Support\Facades\Http;
use Tests\TestCase;

class PlanControllerTest extends TestCase
{
  use RefreshDatabase, WithFaker;

  public function login()
  {
    $user = factory(User::class)->create();

    $this->post(route('login'), [
      'email' => $user->email,
      'password' => 'password'
    ]);

    $this->assertAuthenticatedAs($user);
  }

  /**
   * This test checks if endpoint /plan that returns all plans is valid response.
   * @test
   */
  public function get_plans()
  {
    $this->login();

    $response = $this->get('/plan');

    $response->assertStatus(200);
  }

  /**
   * This test checks if endpoint plan/{id} that returns plan is valid response.
   * @test
   */
  public function get_plan()
  {
    $this->login();

    $response = $this->get('/plan/1');

    $response->assertStatus(200);
  }



  /**
   * This test validates the response if empty array is forwarded to the '/plan' endpoint
   * @test
   */
  public function add_plan_returns_error()
  {
    $this->login();

    $response = $this->post('/plan', []);

    $response->assertStatus(302);

    $response->assertSessionHasErrors(['title']);
  }

  /**
   * This test will add, edit and delete one Plan from database, in order to check if POST /plan,
   * PUT /plan/{id} and DELETE /plan/{id} works correctly.
   * @test
   */

  public function add_edit_delete_plan()
  {
    /**
     *  Login because user need to be authenticated.
     */
    $this->login();
    /**
     *      ADD Plan
     */

    $data = array(
      'title' => 'Summer plan',
      'description' => 'description of plan',
      'start_date' => '2021-06-04',
      'stop_date' => '2021-06-06',
      'user_id' => 1,
      'template'=>0,
    );
    $response = $this->post('/plan',$data);
    $response->assertHeader('content-type', 'application/json');

    $testPlan = Plan::where('title', $data['title'])->first();

    $this->assertEquals('Summer plan',$testPlan->title);

    $response->assertStatus(201);

    /**
     *      EDIT Plan
     */

    $edited = array(
      'title' => 'Summer plan edited',
      'description' => 'description of plan',
      'start_date' => '2021-05-05',
      'stop_date' => '2021-06-06',
      'user_id' => 1,
      'template'=>0,
      'updated_at' => $testPlan->updated_at
    );

    $response = $this->call('PUT', '/plan/1',$edited);

    $response->assertHeader('content-type', 'application/json');

    $editedPlan = Plan::where('id', 1)->first();

    $this->assertEquals('Summer plan edited',$editedPlan->title);
    $this->assertEquals('2021-05-05',$editedPlan->start_date);

    /**
     *      DELETE Plan
     */

    $response = $this->call('DELETE', '/plan/1');
    $deletedPlan = Plan::where('id', 1)->first();
    $this->assertNull($deletedPlan);

    $response->assertStatus(200);

  }
}
