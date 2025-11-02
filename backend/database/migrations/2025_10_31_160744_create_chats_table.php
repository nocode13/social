<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('chats', function (Blueprint $table) {
            $table->id();
            $table->enum('type', ['dm', 'group'])->default('dm')->index();
            $table->string('name')->nullable();
            $table->text('description')->nullable();
            $table->string('avatar')->nullable();
            $table->foreignId('created_by')->nullable()->constrained('users');
            $table->timestamp('last_message_at')->nullable()->index();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('chats');
    }
};
