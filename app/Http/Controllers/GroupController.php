<?php

namespace App\Http\Controllers;

use App\Models\Group;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use App\Events\NewMessage;
use Illuminate\Support\Facades\Auth;

class GroupController extends Controller
{
    public function createGroup(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'user_ids' => 'array',
            'user_ids.*' => 'exists:users,id',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $group = Group::create([
            'name' => $request->name,
            'created_by' => auth()->id(),
        ]);

        $group->users()->attach(auth()->id(), ['accepted' => true]);

        if (!empty($request->user_ids)) {
            $group->users()->attach($request->user_ids, ['accepted' => false]);
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
        $group = Group::find($groupId);

        if (!$group) {
            return response()->json(['error' => 'Group not found'], 404);
        }

        try {
            $messages = $group->messages()->with('user')->get();
            return response()->json($messages);
        } catch (\Exception $e) {
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
            'user_id' => auth()->id(),
        ]);

        event(new NewMessage($message->message, $group));

        return response()->json(['status' => 'Message sent!', 'message' => $message]);
    }

    public function getUserGroups()
    {
        $user = Auth::user();
        $groups = Group::where('created_by', $user->id)
            ->orWhereHas('users', function ($query) use ($user) {
                $query->where('user_id', $user->id);
            })
            ->get();

        return response()->json($groups);
    }

    public function inviteUser(Request $request, Group $group)
    {
        $request->validate([
            'email' => 'required|email|exists:users,email',
        ]);

        $user = User::where('email', $request->email)->first();

        if ($group->users()->where('user_id', $user->id)->exists()) {
            return response()->json(['message' => 'ユーザーはすでにグループに参加しています'], 400);
        }

        $group->users()->attach($user->id, ['accepted' => false]);

        return response()->json(['message' => 'ユーザーがグループに招待されました'], 200);
    }

    public function getInvitations()
    {
        $user = Auth::user();
        $invitations = $user->groups()
            ->wherePivot('accepted', false)
            ->where('created_by', '!=', $user->id)
            ->get();

        return response()->json($invitations);
    }

    public function acceptInvitation($groupId)
    {
        $user = auth()->user();
        $user->groups()->updateExistingPivot($groupId, ['accepted' => true]);

        return response()->json(['message' => 'Invitation accepted.']);
    }

    public function declineInvitation($groupId)
    {
        $user = auth()->user();
        $user->groups()->detach($groupId);

        return response()->json(['message' => 'Invitation declined.']);
    }

    public function updateGroup(Request $request, $id)
    {
        $request->validate([
            'name' => 'required|string|max:255',
        ]);

        $group = Group::find($id);

        if (!$group) {
            return response()->json(['error' => 'Group not found'], 404);
        }

        $group->name = $request->name;
        $group->save();

        return response()->json(['status' => 'Group name updated successfully', 'group' => $group]);
    }

    public function deleteGroup($id)
    {
        $group = Group::find($id);

        if (!$group) {
            return response()->json(['error' => 'Group not found'], 404);
        }

        $group->delete();

        return response()->json(['status' => 'Group deleted successfully']);
    }

    // 新しく追加したメンバー取得メソッド
    public function getMembers($groupId)
    {
        $group = Group::find($groupId);

        if (!$group) {
            return response()->json(['error' => 'Group not found'], 404);
        }

        $members = $group->users()->get();

        return response()->json($members);
    }
}
