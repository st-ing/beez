<?php

namespace Tests\Feature\Http\Controllers;

use App\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Illuminate\Support\Facades\Http;
use Tests\TestCase;

class HomeControllerTest extends TestCase
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
     * This test checks if endpoint /all-users that returns all users is valid response.
     * @test
     */
    public function get_users()
    {
        $this->login();

        $response = $this->get('/all-users');

        $response->assertStatus(200);
    }

    /**
     * This test checks if endpoint get-user/{id} that returns user is valid response.
     * @test
     */
    public function get_user()
    {
        $this->login();

        $response = $this->get('/get-user/1');

        $response->assertStatus(200);
    }

    /**
     * This test checks if endpoint /get/verified that returns user if user is verified and false if user is not.
     * @test
     */
    public function get_user_verified()
    {
        $this->login();

        $response = $this->post('/get/verified');
        $response->assertStatus(200);
    }

    /**
     * This test checks if endpoint /change-password that returns user if password is changed.
     * @test
     */
    public function change_password()
    {
        $this->login();

        $data = array(
          'current_password' => 'password',
          'new_password' => 'newPassword',
          'new_confirm_password' => 'newPassword',
        );

        $response = $this->post('/change-password', $data);
        $response->assertStatus(200);
    }
    /**
     * This test validates the response if empty array is forwarded to the '/add-user' endpoint
     * @test
     */
    public function add_user_returns_error()
    {
        $this->login();

        $response = $this->post('/add-user', []);

        $response->assertStatus(302);

        $response->assertSessionHasErrors(['name','email','password']);
    }

    /**
     * This test will add, edit and delete one User from database, in order to check if POST /add-user,
     * PUT /update-user/{id} and DELETE /user/{id} works correctly.
     * @test
     */

    public function add_edit_delete_user()
    {
        /**
         *  Login because user need to be authenticated.
         */
        $this->login();
        /**
         *      ADD USER
         */

        $data = array(
            'name' => 'UserTest1',
            'email' => 'testemail@gmail.com',
            'password' => 'password',
            'role' => 'regular',
            'address' => 'testAddress'
        );
        $response = $this->post('/add-user',$data);

        $response->assertHeader('content-type', 'application/json');

        $testUser = User::where('name', $data['name'])->first();

        $this->assertEquals('UserTest1',$testUser->name);

        $response->assertStatus(201);

        /**
         *      EDIT USER
         */

        $edited = array(
            'name' => 'EditedUser',
            'email' => 'test@mail.com',
            'role' => 'admin',
            'address' => 'testAddress2'
        );

        $response = $this->call('PUT', '/update-user/1',$edited);

        $response->assertHeader('content-type', 'application/json');

        $editedUser = User::where('id', 1)->first();

        $this->assertEquals('EditedUser',$editedUser->name);
        $this->assertEquals('test@mail.com',$editedUser->email);
        $this->assertEquals('admin',$editedUser->role);

        /**
         *      DELETE USER
         */

        $response = $this->call('DELETE', '/user/1');

        /**
         * Check if user deleted_at is set
         */
        $userDeleted =  User::withTrashed()->where('id', 1)->first();
        $this->assertNotNull($userDeleted->deleted_at);

        /**
         * Check if user is soft deleted
         */
        $deletedUser = User::where('id', 1)->first();
        $this->assertNull($deletedUser);

        $response->assertStatus(200);

        /**
         * Restore user
         */
        $response = $this->call('GET', 'user-restore/1');
        $userDeleted =  User::where('id', 1)->first();
        $this->assertNotNull($userDeleted);
        $this->assertNull($userDeleted->deleted_at);
        $response->assertStatus(200);
    }
}
