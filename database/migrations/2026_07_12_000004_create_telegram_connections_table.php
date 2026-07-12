<?php

use App\Models\User;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('telegram_connections', function (Blueprint $table) {
            $table->id();
            $table->foreignIdFor(User::class)->unique()->constrained()->cascadeOnDelete();
            $table->foreignId('telegraph_chat_id')->nullable()->unique()->constrained('telegraph_chats')->nullOnDelete();
            $table->string('telegram_chat_id')->nullable()->unique();
            $table->string('telegram_user_id')->nullable();
            $table->string('telegram_username')->nullable();
            $table->string('link_token_hash')->nullable()->index();
            $table->timestamp('link_token_expires_at')->nullable();
            $table->timestamp('connected_at')->nullable();
            $table->boolean('reminders_enabled')->default(true);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('telegram_connections');
    }
};
