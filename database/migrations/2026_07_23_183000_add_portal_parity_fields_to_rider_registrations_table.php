<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (app()->runningUnitTests()) {
            return;
        }

        Schema::connection('mssql')->table('rider_registrations', function (Blueprint $table) {
            $table->string('first_name')->nullable()->after('rider_name');
            $table->string('last_name')->nullable()->after('first_name');
            $table->string('visa_category')->nullable()->after('weight');
            $table->string('eid')->nullable()->after('visa_category');
            $table->boolean('register_season')->default(true)->after('eid');
            $table->boolean('register_fei')->default(false)->after('register_season');
        });
    }

    public function down(): void
    {
        if (app()->runningUnitTests()) {
            return;
        }

        Schema::connection('mssql')->table('rider_registrations', function (Blueprint $table) {
            $table->dropColumn([
                'first_name',
                'last_name',
                'visa_category',
                'eid',
                'register_season',
                'register_fei',
            ]);
        });
    }
};
