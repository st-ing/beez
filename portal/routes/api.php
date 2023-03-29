<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::get('apiaries/{id}','ApiaryController@index');
Route::get('apiary/{id}','ApiaryController@show');
Route::get('apiary/operations/{id}','ApiaryController@apiaryOperations');
Route::get('all-apiaries/{id}','ApiaryController@allApiaries');
Route::post('apiary','ApiaryController@store');
Route::put('apiary/{id}','ApiaryController@update');
Route::delete('apiary/{id}','ApiaryController@delete');

Route::get('beehives/{id}','BeehiveController@index');
Route::get('apiaries-history/{id}','BeehiveController@history');
Route::get('node/{id}','BeehiveController@beehivesNode');
Route::get('beehive/{id}','BeehiveController@show');
Route::get('beehive/operations/{id}','BeehiveController@beehiveOperations');
Route::get('apiary-beehives/{id}','BeehiveController@apiaryBeehives');
Route::post('beehive','BeehiveController@store');
Route::put('beehive/{id}','BeehiveController@update');
Route::delete('beehive/{id}','BeehiveController@delete');

Route::get('/translations/{language}','LocalizationController@fetchTranslations');
Route::get('/measurement-data/{id}','DataController@getData');

Route::middleware('auth:api')->get('/user', function (Request $request) {
    return $request->user();
});
