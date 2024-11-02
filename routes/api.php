<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\GroupController;
use App\Http\Controllers\MessageController;

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/groups', [GroupController::class, 'getGroups']);
    Route::get('/groups/{group}/messages', [GroupController::class, 'getGroupMessages']);
    Route::post('/send-group-message', [GroupController::class, 'sendGroupMessage']);
    Route::post('/groups', [GroupController::class, 'createGroup']);
    Route::put('/groups/{group}', [GroupController::class, 'updateGroup']); // グループ名更新用のPUTルート
    Route::delete('/groups/{group}', [GroupController::class, 'deleteGroup']); // グループ削除用のDELETEルート
    Route::get('/groups/{group}/members', [GroupController::class, 'getMembers']); // グループのメンバー取得
});

Route::post('/groups/{group}/invite', [GroupController::class, 'inviteUser']);
Route::get('/invitations', [GroupController::class, 'getInvitations']);
Route::post('/groups/{group}/accept', [GroupController::class, 'acceptInvitation']);
Route::post('/groups/{group}/decline', [GroupController::class, 'declineInvitation']);
Route::delete('/messages/{message}', [MessageController::class, 'deleteMessage']);
