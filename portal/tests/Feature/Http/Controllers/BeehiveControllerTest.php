<?php

namespace Tests\Feature\Http\Controllers;

use App\Beehive;
use App\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;

class BeehiveControllerTest extends TestCase
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
     * This test checks if endpoint api/beehives/{id} that returns all beehives with owner with same {id} is valid response.
     * @test
     */

    public function get_beehives()
    {
        $response = $this->get('api/beehives/1');
        $response->assertStatus(200);
    }

    /**
     * This test checks if endpoint api/beehive/{id} that returns beehive with {id} is valid response.
     * @test
     */

    public function get_beehive()
    {
        $response = $this->get('api/beehive/1');
        $response->assertStatus(200);
    }

    /**
     * This test checks if endpoint api/apiary-beehives/{id} that returns all beehives within same apiary is valid response.
     * @test
     */

    public function get_beehives_of_apiary()
    {
        $response = $this->get('api/apiary-beehives/1');
        $response->assertStatus(200);
    }

    /**
     * This test validates the response if empty array is forwarded to the '/api/beehive' endpoint
     * @test
     */
    public function add_beehive_returns_error()
    {
        $response = $this->post('/api/beehive', []);

        $response->assertStatus(302);

        $response->assertSessionHasErrors(['name', 'latitude','longitude','owner_id']);
    }

    /**
     * This test will add, edit and delete one Beehive from database, in order to check if POST api/beehive,
     * PUT api/beehive/{id} and DELETE api/beehive/{id} works correctly.
     * @test
     */

    public function add_edit_delete_beehive()
    {
        $this->login();

        /**
         *      ADD BEEHIVE
         */

        $data = array(
            'name' => 'something',
            'latitude' => 40,
            'longitude' => 40,
            'owner_id' => 1,
        );
        $response = $this->call('POST', '/api/beehive',$data);

        $response->assertHeader('content-type', 'application/json');

        $beehive = Beehive::where('name', $data['name'])->first();

        $this->assertEquals('something',$beehive->name);

        $response->assertStatus(201);

        /**
         *      EDIT BEEHIVE
         */

        $edited = array(
            'name' => 'EditedBeehive',
            'latitude' => 50,
            'longitude' => 50,
            'owner_id' => 1,
            'updated_at' => $beehive->updated_at
        );

        $response = $this->call('PUT', '/api/beehive/1',$edited);

        $response->assertHeader('content-type', 'application/json');

        $beehive = Beehive::where('id', 1)->first();

        $this->assertEquals('EditedBeehive',$beehive->name);
        $this->assertEquals(50,$beehive->longitude);
        $this->assertEquals(50,$beehive->latitude);

        /**
         *      DELETE BEEHIVE
         */

        $response = $this->call('DELETE', '/api/beehive/1');

        $beehive = Beehive::where('id', 1)->first();

        $this->assertNull($beehive);

        $response->assertStatus(200);

    }

}
