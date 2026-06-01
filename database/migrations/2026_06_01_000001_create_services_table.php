<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('services', function (Blueprint $table) {
            $table->id();
            $table->string('slug')->unique();
            $table->string('name');
            $table->string('badge')->nullable();
            $table->string('tagline');
            $table->string('promise');
            $table->string('investment');
            $table->string('timeline');
            $table->string('outcome');
            $table->text('best_for');
            $table->text('benefit');
            $table->string('cover')->default('launch');
            $table->string('accent')->default('from-emerald-400/30 to-teal-500/10');
            $table->text('problem');
            $table->text('what_you_get');
            $table->text('why_it_matters');
            $table->json('before')->nullable();
            $table->json('after')->nullable();
            $table->json('deliverables')->nullable();
            $table->json('ai_capabilities')->nullable();
            $table->json('bonuses')->nullable();
            $table->json('guarantees')->nullable();
            $table->boolean('is_published')->default(true);
            $table->unsignedInteger('sort_order')->default(0);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('services');
    }
};
