<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Events\NewMessage;
use App\Models\GroupMessage; // GroupMessageモデルをインポート

class MessageController extends Controller
{
    public function sendMessage(Request $request)
    {
        $message = $request->input('message');

        // イベントをディスパッチ
        event(new NewMessage($message));

        return response()->json(['status' => 'Message sent!']);
    }

    public function deleteMessage($id)
    {
        $message = GroupMessage::find($id);

        if (!$message) {
            return response()->json(['error' => 'Message not found'], 404);
        }

        try {
            $message->delete();
            return response()->json(['status' => 'Message deleted successfully']);
        } catch (\Exception $e) {
            \Log::error('Failed to delete message:', [
                'error' => $e->getMessage(),
                'messageId' => $id,
            ]);
            return response()->json(['error' => 'Failed to delete message'], 500);
        }
    }
}
