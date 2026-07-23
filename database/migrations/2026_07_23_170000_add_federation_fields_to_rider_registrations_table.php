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
            $table->string('gender_id')->nullable()->after('nationality');
            $table->string('nationality_id')->nullable()->after('gender_id');
            $table->string('city_id')->nullable()->after('nationality_id');
            $table->string('country_id')->nullable()->after('city_id');
            $table->string('email')->nullable()->after('country_id');
            $table->string('mobile')->nullable()->after('email');
            $table->string('address')->nullable()->after('mobile');
            $table->string('po_box')->nullable()->after('address');
        });
    }

    public function down(): void
    {
        if (app()->runningUnitTests()) {
            return;
        }

        Schema::connection('mssql')->table('rider_registrations', function (Blueprint $table) {
            $table->dropColumn([
                'gender_id',
                'nationality_id',
                'city_id',
                'country_id',
                'email',
                'mobile',
                'address',
                'po_box',
            ]);
        });
    }
};
