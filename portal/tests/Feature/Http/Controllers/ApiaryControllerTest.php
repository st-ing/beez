<?php

namespace Tests\Feature\Http\Controllers;

use App\Apiary;
use App\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;

class ApiaryControllerTest extends TestCase
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
     * This test checks if endpoint api/apiaries/{id} that returns all apiaries with owner with same {id} is valid.
     * @test
     */

    public function get_apiaries()
    {
        $response = $this->get('api/apiaries/1');
        $response->assertStatus(200);
    }

    /**
     * This test checks if endpoint api/apiary/{id} that returns apiary with {id} is valid response.
     * @test
     */

    public function get_apiary()
    {
        $response = $this->get('api/apiary/1');
        $response->assertStatus(200);
    }

    /**
     * This test validates the response if empty array is forwarded to the 'api/apiary' endpoint
     * @test
     */

    public function add_apiary_returns_error()
    {
        $response = $this->post('api/apiary', []);

        $response->assertStatus(302);

        $response->assertSessionHasErrors(['name','owner_id','migrate']);

    }

    /**
     * This test will add, edit and delete one Apiary from database, in order to check if POST api/apiary,
     * PUT api/apiary/{id} and DELETE api/apiary/{id} works correctly.
     * @test
     */

    public function add_edit_delete_apiary()
    {

        $this->login();
        /**
         *      ADD APIARY
         */

        $response = $this->withHeaders([
            'content-type' => 'application/json',
        ])->json('POST', '/api/apiary', ['name'=>'NoviApiary','owner_id'=>1,'migrate'=>1]);

        $response->assertHeader('content-type', 'application/json');

        $apiary = Apiary::where('id', 1)->first();

        $this->assertEquals('NoviApiary',$apiary->name);

        $response->assertStatus(201);

        /**
         *      EDIT APIARY
         */

        $response = $this->withHeaders([
            'content-type' => 'application/json',
        ])->json('PUT', '/api/apiary/1', ['name'=>'NoviApiaryEditovan','owner_id'=>1,'migrate'=>0,'updated_at'=>$apiary->updated_at]);

        $response->assertHeader('content-type', 'application/json');

        $apiary = Apiary::where('id', 1)->first();

        $this->assertEquals('NoviApiaryEditovan',$apiary->name);
        $this->assertEquals(0,$apiary->migrate);

        /**
         *      DELETE APIARY
         */

        $response = $this->call('DELETE', '/api/apiary/1');

        $apiary = Apiary::where('id', 1)->first();

        $this->assertNull($apiary);

        $response->assertStatus(200);
    }

}
