<?php
// app/Http/Resources/ChatResource.php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class ChatResource extends JsonResource
{
    public function toArray($request)
    {
        return [
            'id' => $this->id,
            'type' => $this->type,
            'name' => $this->name,
            'description' => $this->description,
            'avatar' => $this->avatar,
            'participants' => $this->when($this->relationLoaded('participants'), function () {
                return $this->participants->map(function ($participant) {
                    return [
                        'id' => $participant->id,
                        'name' => $participant->name,
                        'email' => $participant->email,
                        'username' => $participant->username,
                        'role' => $participant->pivot->role,
                        'last_read_at' => $participant->pivot->last_read_at,
                        'muted' => $participant->pivot->muted,
                        'created_at' => $this->created_at,
                        'updated_at' => $this->updated_at,
                    ];
                });
            }),
            'participant_count' => $this->when($this->isGroup(), $this->participants->count()),
            'created_by' => new UserResource($this->whenLoaded('creator')),
            'last_message_at' => $this->last_message_at,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
