<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\GroupController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/groups', [GroupController::class, 'getGroups']);
    Route::get('/groups/{group}/messages', [GroupController::class, 'getGroupMessages']);
    Route::post('/send-group-message', [GroupController::class, 'sendGroupMessage']);
    Route::post('/groups', [GroupController::class, 'createGroup']); // 追加済みの `POST` ルート
    Route::get('/users', [GroupController::class, 'getUsers']); // ユーザー一覧取得のルート
});

Route::post('/groups/{group}/invite', [GroupController::class, 'inviteUser']);
Route::get('/invitations', [GroupController::class, 'getInvitations']);
Route::post('/groups/{group}/accept', [GroupController::class, 'acceptInvitation']);
Route::post('/groups/{group}/decline', [GroupController::class, 'declineInvitation']);
