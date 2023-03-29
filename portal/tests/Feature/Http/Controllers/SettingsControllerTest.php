<?php

namespace Tests\Feature\Http\Controllers;

use App\Setting;
use App\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;
use Illuminate\Support\Facades\Auth;

class SettingsControllerTest extends TestCase
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
   * This test checks if endpoint /settings returns all valid system settings.
   * @test
   */

  public function get_settings()
  {
    /**
     *  Login because user need to be authenticated.
     */
    $this->login();
    $response = $this->get('/settings');
    $response->assertStatus(200);
  }

  /**
   *
   * This test validates the response if empty array is forwarded to the '/settings' endpoint
   * @test
   */

  public function add_settings_returns_error()
  {
    $response = $this->post('/settings', []);

    $response->assertStatus(302);
  }

  /**
   *
   * This test will add, edit and delete one Setting from database, in order to check if POST /settings,
   * PUT /settings/{id} and DELETE /settings/{id} works correctly.
   *
   * @test
   */

  public function test_add_edit_delete_user()
  {
    /**
     *  Login because user need to be authenticated.
     */
    $this->login();
    /**
     *      ADD Setting
     */

    $data = array(
      'key' => 'ui.table.default_page_size',
      'value' => '50',
      'scope' => 1,
    );

    $response = $this->post('/settings',$data);

    $response->assertHeader('content-type', 'application/json');

    $testSetting = Setting::where('key', $data['key'])->first();

    $this->assertEquals('ui.table.default_page_size',$testSetting->key);

    $response->assertStatus(201);

    /**
     *      EDIT Setting
     */

    $edited = array(
      'key' => 'ui.table.edited',
      'value' => '22',
      'scope' => 1,
    );

    $response = $this->call('PUT', '/settings/1',$edited);

    $response->assertHeader('content-type', 'application/json');

    $editedSetting = Setting::where('id', 1)->first();

    $this->assertEquals('ui.table.edited',$editedSetting->key);
    $this->assertEquals('22',$editedSetting->value);

    /**
     *      DELETE Setting
     */

    $response = $this->call('DELETE', '/settings/1');

    $setting = Setting::where('id', 1)->first();

    $this->assertNull($setting);
    $response->assertStatus(200);

  }

  public function test_setting_for_graphs_with_global_value()
  {
    $this->login();

    /**
     *      ADD Setting
     */

    $data = array(
      'key' => 'ui.graphs.number_of_days',
      'value' => '-7d',
      'scope' => null,
    );

    $response = $this->post('/settings',$data);
    $testSetting = Setting::where('scope', null)->where('key',$data['key'])->first();
    $this->assertEquals('ui.graphs.number_of_days',$testSetting->key);

    /**
     *      GET setting by key
     */

    $key = 'ui.graphs.number_of_days';
    $setting = $this->get("/settings/key/$key");

    $this->assertEquals($setting['key'],$key);
    $setting->assertStatus(200);
    $response->assertStatus(201);
  }

  public function test_get_settings_by_key()
  {
    $this->login();

    /**
     *      ADD setting
     */

    $data = array(
      'key' => 'ui.graphs.number_of_days',
      'value' => '-9d',
      'scope' => Auth::id(),
    );

    $response = $this->post('/settings',$data);
    $response->assertHeader('content-type', 'application/json');

    /**
     *      GET setting by key
     */

    $key = 'ui.graphs.number_of_days';
    $testSetting = $this->get("/settings/key/$key");

    $this->assertEquals($testSetting['key'],$key);
    $testSetting->assertStatus(200);
  }
}
