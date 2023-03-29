<?php

use Illuminate\Support\Facades\Route;
use App\Helpers\ProxyHelperFacade;
use Illuminate\Http\Request;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!c
|
*/

Route::get('/login/google','GoogleLoginController@googleLogin');
Route::get('/sign-up/google','GoogleLoginController@googleRedirect');

Auth::routes(['verify' => true]);

Route::post('/upload-image/{id}', 'HomeController@uploadImage');

Route::get('all-users','HomeController@allUsers');
Route::get('get-user/{id}','HomeController@getUser');
Route::delete('user/{id}','HomeController@delete');
Route::get('user-restore/{id}','HomeController@restore');
Route::post('/get/verified', 'HomeController@isVerified');
Route::put('hide-video/{id}', 'HomeController@hideVideo');
Route::post('add-user','HomeController@store');
Route::put('update-user/{id}','HomeController@update');
Route::delete('permanently-delete/{id}','HomeController@permanentlyDelete');
Route::post('change-password', 'HomeController@changePassword');


Route::get('/settings','SettingsController@allSettings');
Route::get('/settings/key/{key}','SettingsController@settingsByKey');
Route::get('/system/settings','SettingsController@system');
Route::get('/settings/{id}','SettingsController@user')->middleware('admin');
Route::post('/settings','SettingsController@store')->middleware('admin');
Route::put('/settings/{id}','SettingsController@update')->middleware('admin');
Route::delete('/settings/{id}','SettingsController@delete')->middleware('admin');

Route::get('/plan','PlanController@index');
Route::get('/plan/{id}','PlanController@show');


Route::get('plan/operations/{id}','PlanController@planOperations');
Route::get('/plans/templates','PlanController@plansTemplates');
Route::get('/templates/plan/{id}','PlanController@show');
Route::post('/plan','PlanController@store');
Route::post('/plan/initialize/{id}','PlanController@initializePlan');
Route::put('/plan/{id}','PlanController@update');
Route::delete('/plan/{id}','PlanController@delete');

Route::get('/operation','OperationController@index');
Route::get('/operation/planned','OperationController@plannedOperations');
Route::get('/operation/ongoing','OperationController@ongoingOperations');
Route::get('/operation/finished','OperationController@finishedOperations');
Route::get('/operation/template','OperationController@templateOperations');
Route::get('/templates/operation/{id}','OperationController@show');

Route::get('/operation/{id}','OperationController@show');
Route::post('/operation','OperationController@store');
Route::post('/operation/initialize','OperationController@initializeOperation');
Route::put('/operation/{id}','OperationController@update');
Route::delete('/operation/{id}','OperationController@delete');

Route::view('/email/verify','app')->name('verification.notice')->middleware('auth');
Route::view('/panel','app')->name('panel')->middleware('verified');
Route::view('/','app')->name('base')->middleware('guest');
Route::view('/change/password','app')->name('reset.password');

Route::any('/proxy/weather/{slug}', function(Request $request){
  $url = env('OPENWEATHER_API_URL');
  $appid = env('OPENWEATHER_API_KEY');
  $request->merge(['appid' => $appid]);
  $proxy =  ProxyHelperFacade::CreateProxy($request)
    ->preserveQuery(true);
  $response = $proxy->toHost($url, 'proxy/weather');
  return $response;
})->where('slug', '([A-Za-z0-9\-\/]+)');

Route::any("/proxy/graphs/{slug}", function(Request $request){
  $url = env('INFLUX_URL');
  $token = env('INFLUX_TOKEN');
  $proxy =  ProxyHelperFacade::CreateProxy($request)
    ->withHeaders(['Authorization' => 'Token '.$token])
    ->preserveQuery(true);
  $response = $proxy->toHost($url, 'proxy/graphs');
  return $response;
})->where('slug', '([A-Za-z0-9\-\/]+)');

Route::any('/proxy/apm/{slug}', function(Request $request){
  $url = env('APM_URL');
  $proxy =  ProxyHelperFacade::CreateProxy($request)
    ->preserveQuery(true);
  $response = $proxy->toHost($url, 'proxy/apm');
  return $response;
})->where('slug', '([A-Za-z0-9\-\/]+)');

Route::view('/{path?}','app')->name('home');
