<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Illuminate\Http\Request;
use App\Http\Traits\ApiResponse;

class UserController extends Controller
{
    use ApiResponse;
    public function findAll(Request $request)
    {
        $request->validate([
            'username' => 'required|string|max:255',
            'per_page' => 'nullable|integer|min:1|max:100'
        ]);

        $username = $request->input('username');
        $perPage = $request->input('per_page', 20);

        $users = User::where('username', 'like', '%' . $username . '%')
            ->orderBy('id')
            ->cursorPaginate($perPage);

        return $this->paginatedResponse($users, 'Users retrieved successfully');
    }

    public function me()
    {
        return $this->successResponse(Auth::user(), 'User retrieved successfully');
    }
}
