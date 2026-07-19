<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::dropIfExists('reviews');
        Schema::dropIfExists('books');
        Schema::dropIfExists('job_applications');
        Schema::dropIfExists('jobs');
        Schema::dropIfExists('employers');
        Schema::dropIfExists('offers');
        Schema::dropIfExists('listing_images');
        Schema::dropIfExists('listings');
    }

    public function down(): void
    {
        Schema::create('books', function (Blueprint $table) {
            $table->id();
            $table->text('title');
            $table->text('author');
            $table->timestamps();
        });

        Schema::create('reviews', function (Blueprint $table) {
            $table->id();
            $table->text('review');
            $table->unsignedTinyInteger('rating');
            $table->timestamps();
            $table->foreignId('book_id')->constrained()->cascadeOnDelete();
        });

        Schema::create('employers', function (Blueprint $table) {
            $table->id();
            $table->string('company_name');
            $table->foreignId('user_id')->nullable()->constrained();
            $table->timestamps();
        });

        Schema::create('jobs', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->text('description');
            $table->unsignedInteger('salary');
            $table->string('location');
            $table->string('category');
            $table->enum('experience', ['entry', 'intermediate', 'senior']);
            $table->foreignId('employer_id')->constrained();
            $table->timestamps();
        });

        Schema::create('job_applications', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained();
            $table->foreignId('job_id')->constrained();
            $table->unsignedInteger('expected_salary');
            $table->string('cv_path')->nullable();
            $table->timestamps();
        });

        Schema::create('listings', function (Blueprint $table) {
            $table->id();
            $table->unsignedTinyInteger('beds');
            $table->unsignedTinyInteger('baths');
            $table->unsignedSmallInteger('area');
            $table->tinyText('city');
            $table->tinyText('code');
            $table->tinyText('street');
            $table->unsignedInteger('price');
            $table->foreignId('by_user_id')->constrained('users')->cascadeOnDelete();
            $table->timestamp('sold_at')->nullable();
            $table->softDeletes();
            $table->timestamps();
        });

        Schema::create('listing_images', function (Blueprint $table) {
            $table->id();
            $table->string('filename');
            $table->foreignId('listing_id')->constrained('listings')->cascadeOnDelete();
            $table->timestamps();
        });

        Schema::create('offers', function (Blueprint $table) {
            $table->id();
            $table->foreignId('listing_id')->constrained('listings')->cascadeOnDelete();
            $table->foreignId('bidder_id')->constrained('users')->cascadeOnDelete();
            $table->unsignedInteger('amount');
            $table->timestamp('accepted_at')->nullable();
            $table->timestamp('rejected_at')->nullable();
            $table->timestamps();
        });
    }
};
