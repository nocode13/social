<?php

namespace App\Http\Controllers;

use App\Http\Resources\ChatResource;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;
use App\Models\Chat;
use App\Models\ChatParticipant;
use App\Http\Traits\ApiResponse;

class ChatController extends Controller
{
    use ApiResponse;
    public function findAll(Request $request)
    {
        $request->validate([
            'per_page' => 'nullable|integer|min:1|max:100',
            'type' => 'nullable|in:dm,group'
        ]);

        $user = Auth::user();
        $perPage = $request->input('per_page', 20);
        $type = $request->input('type');

        $query = Chat::whereHas('participants', function ($query) use ($user) {
            $query->where('user_id', $user->id);
        });

        if ($type) {
            $query->where('type', $type);
        }

        $chats = $query->orderBy('id')->cursorPaginate($perPage);

        return $this->paginatedResponse($chats, 'Chats retrieved successfully');
    }

    public function findOne($id)
    {
        $user = Auth::user();

        $chat = Chat::whereHas('participants', function ($query) use ($user) {
            $query->where('user_id', $user->id);
        })
            ->with('participants')
            ->find($id);

        if (!$chat) {
            return $this->notFoundResponse('Chat not found');
        }

        return $this->successResponse(new ChatResource($chat), 'Chat retrieved successfully');
    }

    public function create(Request $request)
    {
        $validated = $request->validate([
            'type' => 'required|in:dm,group',
            'participant_ids' => 'required|array|min:1|max:50',
            'participant_ids.*' => 'required|integer|distinct|exists:users,id',
            'name' => 'nullable|string|max:255',
            'description' => 'nullable|string',
            'avatar' => 'nullable|string|max:255',
        ]);

        $user = Auth::user();
        $type = $validated['type'];
        $participantIds = $validated['participant_ids'];

        $participantIds = array_diff($participantIds, [$user->id]);
        $participantIds = array_values($participantIds);

        if ($type === 'dm') {
            if (count($participantIds) !== 1) {
                return $this->errorResponse('DM chat must have exactly 1 participant (excluding yourself)', 400);
            }

            // Check if DM chat already exists between these two users
            $otherUserId = $participantIds[0];
            $existingDm = Chat::where('type', 'dm')
                ->whereHas('participants', function ($query) use ($user) {
                    $query->where('user_id', $user->id);
                })
                ->whereHas('participants', function ($query) use ($otherUserId) {
                    $query->where('user_id', $otherUserId);
                })
                ->first();

            if ($existingDm) {
                return $this->errorResponse('DM chat already exists with this user', 409);
            }
        } elseif ($type === 'group') {
            if (count($participantIds) < 1) {
                return $this->errorResponse('Group chat must have at least 1 participant (excluding yourself)', 400);
            }
            if (empty($validated['name'])) {
                return $this->errorResponse('Group chat must have a name', 400);
            }
        }

        DB::beginTransaction();
        try {
            $chat = Chat::create([
                'type' => $type,
                'name' => $validated['name'] ?? null,
                'description' => $validated['description'] ?? null,
                'avatar' => $validated['avatar'] ?? null,
                'created_by' => $user->id,
            ]);

            $participants = [];

            $participants[] = [
                'chat_id' => $chat->id,
                'user_id' => $user->id,
                'role' => 'owner',
                'created_at' => now(),
                'updated_at' => now()
            ];

            foreach ($participantIds as $participantId) {
                $participants[] = [
                    'chat_id' => $chat->id,
                    'user_id' => $participantId,
                    'role' => 'member',
                    'created_at' => now(),
                    'updated_at' => now()
                ];
            }

            ChatParticipant::insert($participants);

            DB::commit();

            $chat->load('participants');

            return $this->successResponse(new ChatResource($chat), 'Chat created successfully', 201);
        } catch (\Exception $e) {
            DB::rollBack();

            return $this->errorResponse('Failed to create chat', 500, [
                'error' => $e->getMessage()
            ]);
        }
    }
}
