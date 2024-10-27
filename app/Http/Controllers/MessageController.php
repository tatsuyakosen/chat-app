<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Events\NewMessage;

class MessageController extends Controller
{
    public function sendMessage(Request $request)
    {
        $message = $request->input('message');

        // イベントをディスパッチ
        event(new NewMessage($message));

        return response()->json(['status' => 'Message sent!']);
    }
}
