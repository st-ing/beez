<?php

namespace Tests\Feature\Http\Controllers;

use App\Operation;
use App\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;

class OperationsControllerTest extends TestCase
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
   * This test checks if endpoint /operation/{id} that returns all operations with owner with same {id} is valid.
   * @test
   */
  public function get_operations()
  {
    $this->login();
    $response = $this->get('/operation');
    $response->assertStatus(200);
  }

  /**
   * This test checks if endpoint /operation/{id} that returns operation with {id} is valid response.
   * @test
   */
  public function get_operation()
  {
    $this->login();
    $response = $this->get('/operation/1');
    $response->assertStatus(200);
  }

  /**
   * This test validates the response if empty array is forwarded to the '/operation' endpoint
   * @test
   */
  public function add_operation_returns_error()
  {
    $this->login();

    $response = $this->post('/operation', []);

    $response->assertStatus(302);

    $response->assertSessionHasErrors(['name','type','template']);

  }

  /**
   * This test will add, edit and delete one operation from database, in order to check if POST /operation,
   * PUT /operation/{id} and DELETE /operation/{id} works correctly.
   * @test
   */
  public function add_edit_delete_operation()
  {
    $this->login();
    /**
     *      ADD operation
     */

    $data = array(
      'name' => 'NewOperation',
      'template' => 0,
      'type' => 'harvest',
      'user_id' => 1
      );

    $response = $this->post('/operation', $data);

    $response->assertHeader('content-type', 'application/json');


    $operation = Operation::where('id', 1)->first();

    $this->assertEquals('NewOperation',$operation->name);

    $response->assertStatus(201);

    /**
     *      EDIT operation
     */

    $response = $this->withHeaders([
      'content-type' => 'application/json',
    ])->json('PUT', '/operation/1', ['name'=>'NoviOperationEditovan','user_id'=>1,'type'=>'harvest','template'=>0,'updated_at'=>$operation->updated_at]);

    $response->assertHeader('content-type', 'application/json');

    $operation = Operation::where('id', 1)->first();

    $this->assertEquals('NoviOperationEditovan',$operation->name);

    /**
     *      DELETE operation
     */

    $response = $this->call('DELETE', '/operation/1');

    $operation = Operation::where('id', 1)->first();

    $this->assertNull($operation);

    $response->assertStatus(200);
  }
  /**
   * This test will add planned finished started and template operation to database, in order to check if get /operation/planned,
   * get /operation/ongoing, get /operation/finished, get /operation/template works correctly.
   * @test
   *
   */
  public function add_operation_check_routes()
  {
    $this->login();

    $data = array(
      'name' => 'Planned operation',
      'status' => 'planned',
      'template' => 0,
      'type' => 'harvest',
      'user_id' => 1
    );

    $response = $this->post('/operation', $data);

    $response->assertHeader('content-type', 'application/json');

    $testOperation = $this->call('GET','/operation/planned')->decodeResponseJson();

    $this->assertEquals('Planned operation',$testOperation['0']['name']);

    $response->assertStatus(201);

    $data = array(
      'name' => 'Started operation',
      'status' => 'started',
      'template' => 0,
      'type' => 'harvest',
      'user_id' => 1
    );

    $response = $this->post('/operation', $data);

    $response->assertHeader('content-type', 'application/json');

    $testOperation = $this->get('/operation/ongoing')->decodeResponseJson();

    $this->assertEquals('Started operation',$testOperation['0']['name']);

    $response->assertStatus(201);

    $data = array(
      'name' => 'Finished operation',
      'status' => 'done',
      'template' => 0,
      'type' => 'harvest',
      'user_id' => 1
    );

    $response = $this->post('/operation', $data);
    $response->assertHeader('content-type', 'application/json');

    $testOperation = $this->get('/operation/finished')->decodeResponseJson();

    $this->assertEquals('Finished operation',$testOperation['0']['name']);

    $response->assertStatus(201);

    $data = array(
      'name' => 'Template operation',
      'template' => 1,
      'type' => 'harvest',
      'user_id' => 1
    );

    $response = $this->post('/operation', $data);

    $response->assertHeader('content-type', 'application/json');

    $testOperation = $this->get('/operation/template')->decodeResponseJson();

    $this->assertEquals('Template operation',$testOperation['0']['name']);

    $response->assertStatus(201);
  }

}
