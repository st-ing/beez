<?php

namespace App\Http\Controllers;

use App\Events\UserMailChanged;
use App\Http\Requests\CreateUserRequest;
use App\Http\Requests\UpdateUserRequest;
use App\Rules\MatchOldPassword;
use App\User;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\App;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;

class HomeController extends Controller
{

    /**
     * Create a new controller instance.
     *
     * @return void
     */
    public function __construct()
    {
        $this->middleware('auth');
    }

    protected function create(array $data)
    {
      return User::create([
        'name' => $data['name'],
        'email' => $data['email'],
        'password' => Hash::make($data['password']),
        'address' => $data['address'],
        'role' => $data['role'],
      ]);
    }
    public function allUsers()
    {
        return User::withTrashed()->where('id', '!=',Auth::id())->get();
    }

    public function getUser($id){
        return User::withTrashed()->findOrFail($id);
    }

    public function delete($id)
    {
        $user = User::findOrFail($id);
        $user->delete();
        return $user;
    }

    public function permanentlyDelete($id)
    {
        $user = User::findOrFail($id);
        if($user->forceDelete()){
            return response()->json(["message" => "User permanently deleted"]);
        }else{
            return response()->json(["message" => "User not deleted"]);
        }
    }

    public function restore($id)
    {
        $user = User::withTrashed()->findOrFail($id);
        $user->restore();
        return $user;
    }

    public function isVerified(){
        if(!Auth::user()->email_verified_at){
            return response()->json(false);
        }else {
            return Auth::user();
        }
    }

    public function hideVideo($id){
      $user = User::withTrashed()->findOrFail($id);
      if ($user->show_video = 1) {
        $user->update([
          $user->show_video = 0
        ]);
      }
      return $user;
    }

    public function store(CreateUserRequest $request){
        App::setLocale($request['locale'] ?? 'en');
        event(new Registered($user = $this->create($request->all())));
        return $user;
    }

    public function update(UpdateUserRequest $request, $id ){
        $user = User::withTrashed()->findOrFail($id);
        App::setLocale($request['locale'] ?? 'en');
        $actualEmail = $user->email;
        $user->name = $request->name;
        $user->address = $request->address;
        $user->email = $request->email;
        $user->role = $request->role;
        $user->update();
        if($actualEmail !== $request->email) {
          $user->email_verified_at = NULL;
          $user->update();
          event(new UserMailChanged($user));
        }
        return $user;
    }

    public function uploadImage(Request $request, $id)
    {
        if ($request->hasFile('image'))
        {
            $user = User::withTrashed()->findOrFail($id);
            $path = $request->file('image')->getRealPath();
            $logo = file_get_contents($path);
            $base64 = base64_encode($logo);
            $user->image = $base64;
            $user->update();
            return $user;
        }
        else
        {
            $user = User::withTrashed()->findOrFail($id);
            return $user;
        }

    }

    public function changePassword(Request $request){
        $request->validate([
            'current_password' => ['required', new MatchOldPassword],
            'new_password' => ['required'],
            'new_confirm_password' => ['required','same:new_password'],
        ]);

        return User::find(auth()->user()->id)->update(['password'=> Hash::make($request->new_password)]);
    }

    /**
     * Show the application dashboard.
     *
     * @return \Illuminate\Contracts\Support\Renderable
     */
    public function index()
    {
      return view('home');
    }

}
