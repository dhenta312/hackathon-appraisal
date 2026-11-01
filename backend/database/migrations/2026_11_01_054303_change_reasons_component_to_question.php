<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('reasons', function (Blueprint $table) {
            $table->dropConstrainedForeignId('component_id');
            $table->foreignId('question_id')->nullable()->constrained()->cascadeOnDelete();
        });
    }

    public function down(): void
    {
        Schema::table('reasons', function (Blueprint $table) {
            $table->dropConstrainedForeignId('question_id');
            $table->foreignId('component_id')->nullable()->constrained()->cascadeOnDelete();
        });
    }
};
