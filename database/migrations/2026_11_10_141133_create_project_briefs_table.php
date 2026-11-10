<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('project_briefs', function (Blueprint $table) {
            $table->id();

            // Step 1: about the client
            $table->string('name', 120);
            $table->string('email');
            $table->string('company', 160)->nullable();
            $table->string('website_url')->nullable();
            $table->text('business_description');

            // Step 2: project and goals
            $table->string('project_type', 40);
            $table->json('goals');
            $table->text('audience');
            $table->string('primary_action')->nullable();
            $table->text('competitors')->nullable();

            // Step 3: scope and content
            $table->json('pages');
            $table->json('features');
            $table->text('extra_requirements')->nullable();
            $table->json('languages');
            $table->string('other_language', 120)->nullable();
            $table->string('content_readiness', 40)->nullable();
            $table->string('domain_status', 40)->nullable();

            // Step 4: brand and design direction
            $table->json('brand_assets');
            $table->json('attachments');
            $table->json('styles');
            $table->string('brand_words')->nullable();
            $table->string('colour_preferences', 500)->nullable();
            $table->string('colour_mode', 40)->nullable();
            $table->string('typography', 40)->nullable();
            $table->json('liked_sites');
            $table->text('disliked_sites')->nullable();

            // Step 5: budget, timeline and contact
            $table->string('budget', 40);
            $table->string('timeline', 40);
            $table->string('deadline_note')->nullable();
            $table->string('support', 40)->nullable();
            $table->string('preferred_contact', 40);
            $table->string('phone', 40)->nullable();
            $table->text('notes')->nullable();

            $table->string('locale', 8)->default('en');
            $table->timestamp('consented_at');
            $table->timestamp('reviewed_at')->nullable();
            $table->timestamps();

            $table->index('created_at');
            $table->index('reviewed_at');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('project_briefs');
    }
};
