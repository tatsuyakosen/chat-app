<?php

namespace App\Http\Controllers;

use App\Models\Group;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use App\Events\NewMessage;

class GroupController extends Controller
{
    public function createGroup(Request $request)
    {
        // バリデーション
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'user_ids' => 'array', // ユーザーIDの配列
            'user_ids.*' => 'exists:users,id', // 各IDがusersテーブルに存在するかを確認
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        // グループ作成
        $group = Group::create(['name' => $request->name]);

        // ユーザーをグループに追加
        if (!empty($request->user_ids)) {
            $group->users()->attach($request->user_ids);
        }

        return response()->json(['status' => 'Group created!', 'group' => $group]);
    }

    public function getGroups()
    {
        $groups = Group::with('users')->get();
        return response()->json($groups);
    }

    public function getGroupMessages($groupId)
    {
        // グループが存在するか確認
        $group = Group::find($groupId);

        if (!$group) {
            return response()->json(['error' => 'Group not found'], 404);
        }

        try {
            // グループのメッセージを取得
            $messages = $group->messages()->with('user')->get();

            return response()->json($messages);
        } catch (\Exception $e) {
            // エラーが発生した場合、詳細なエラーログを記録し、500エラーを返す
            \Log::error('Failed to fetch group messages:', [
                'error' => $e->getMessage(),
                'groupId' => $groupId
            ]);

            return response()->json(['error' => 'Failed to fetch group messages'], 500);
        }
    }

    public function sendGroupMessage(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'message' => 'required|string',
            'group_id' => 'required|exists:groups,id',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $group = Group::find($request->group_id);
        $message = $group->messages()->create([
            'message' => $request->message,
            'user_id' => auth()->id(), // 現在ログインしているユーザーID
        ]);

        // イベントをディスパッチ
        event(new NewMessage($message->message, $group));

        return response()->json(['status' => 'Message sent!', 'message' => $message]);
    }

    // 新たに追加: 全ユーザー取得
    public function getUsers()
    {
        $users = User::all();
        return response()->json($users);
    }
}
