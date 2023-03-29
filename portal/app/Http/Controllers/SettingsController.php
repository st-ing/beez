<?php

namespace App\Http\Controllers;

use App\Http\Requests\SettingRequest;
use App\Setting;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class SettingsController extends Controller
{
  public function allSettings(Request $request){
    return Setting::all();
  }

  public function settingsByKey($key){
    $setting =  Setting::where('key', $key)->where('scope', Auth::id())->first();
    return $setting ?? Setting::where('key', $key)->where('scope', null)->first();
  }

  public function user(Request $request,$userId){
    return Setting::all()->where('scope',$userId);
  }

  public function system(Request $request){
    return Setting::all()->where('scope','=',NULL);
  }

  public function store(SettingRequest $request){
    $setting = new Setting();
    $setting->key = $request->key;
    $setting->value = $request->value;
    $setting->scope = $request->scope;
    $setting->save();
    return $setting;
  }

  public function update(SettingRequest $request, $id ){
    $setting = Setting::findOrFail($id);
    $setting->update($request->all());

    return $setting;
  }

  public function delete(Request $request, $id){
    $setting = Setting::findOrFail($id);
    $setting->delete();

    return $setting;
  }

  public function show($id) {
    return Setting::find($id);
  }

}
