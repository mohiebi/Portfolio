<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('case_studies', function (Blueprint $table) {
            $table->string('featured_image_path')->nullable()->after('cover');
            $table->string('project_url')->nullable()->after('featured_image_path');
            $table->string('repository_url')->nullable()->after('project_url');
        });
    }

    public function down(): void
    {
        Schema::table('case_studies', function (Blueprint $table) {
            $table->dropColumn([
                'featured_image_path',
                'project_url',
                'repository_url',
            ]);
        });
    }
};
