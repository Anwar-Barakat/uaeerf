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
            $table->string('weight')->nullable()->after('po_box');
        });
    }

    public function down(): void
    {
        if (app()->runningUnitTests()) {
            return;
        }

        Schema::connection('mssql')->table('rider_registrations', function (Blueprint $table) {
            $table->dropColumn('weight');
        });
    }
};
