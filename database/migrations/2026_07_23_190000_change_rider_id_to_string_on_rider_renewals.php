<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        if (app()->runningUnitTests()) {
            return;
        }

        DB::connection('mssql')->statement('ALTER TABLE rider_renewals ALTER COLUMN rider_id NVARCHAR(20) NOT NULL');
    }

    public function down(): void
    {
        if (app()->runningUnitTests()) {
            return;
        }

        DB::connection('mssql')->statement('ALTER TABLE rider_renewals ALTER COLUMN rider_id INT NOT NULL');
    }
};
