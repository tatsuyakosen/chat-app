<?php

namespace App\Events;

use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;
use App\Models\Group;
use App\Models\GroupMessage;

class NewMessage implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;
    
    public $message;
    public $group;

    /**
     * Create a new event instance.
     *
     * @param string $message
     * @param Group $group
     */
    public function __construct($message, Group $group)
    {
        $this->message = $message;
        $this->group = $group;
    }

    /**
     * イベントがブロードキャストされるチャンネルを取得
     *
     * @return \Illuminate\Broadcasting\Channel
     */
    public function broadcastOn(): Channel
    {
        // グループ固有のチャンネルに変更
        return new Channel('group.' . $this->group->id);
    }

    /**
     * ブロードキャストするデータを指定
     *
     * @return array
     */
    public function broadcastWith(): array
    {
        return [
            'message' => $this->message,
        ];
    }
}
