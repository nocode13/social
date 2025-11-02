<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Chat extends Model
{
    protected $fillable = [
        'type',
        'name',
        'description',
        'avatar',
        'created_by',
        'last_message_at'
    ];

    public function participants()
    {
        return $this->belongsToMany(
            User::class,
            'chat_participants',
            'chat_id',
            'user_id'
        )->withPivot('role', 'last_read_at', 'muted')
         ->withTimestamps();
    }

    public function chatParticipants()
    {
        return $this->hasMany(ChatParticipant::class);
    }

    public function creator()
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function isGroup()
    {
        return $this->type === 'group';
    }

    public function isDm()
    {
        return $this->type === 'dm';
    }
}
