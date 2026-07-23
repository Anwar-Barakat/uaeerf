<?php

require __DIR__.'/vendor/autoload.php';

$app = require_once __DIR__.'/bootstrap/app.php';
$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();

use Illuminate\Support\Facades\DB;
use App\Models\UserProfile;

echo "=== MSSQL Integration Test ===\n\n";

echo "1. Test Connection\n";
try {
    DB::connection('mssql')->getPdo();
    echo "   ✓ Connected to MSSQL\n\n";
} catch (Exception $e) {
    echo "   ✗ Connection failed: " . $e->getMessage() . "\n";
    exit(1);
}

echo "2. List Tables\n";
try {
    $tables = DB::connection('mssql')->select("
        SELECT TABLE_SCHEMA, TABLE_NAME
        FROM INFORMATION_SCHEMA.TABLES
        WHERE TABLE_TYPE = 'BASE TABLE'
        ORDER BY TABLE_NAME
    ");
    foreach ($tables as $table) {
        echo "   - {$table->TABLE_SCHEMA}.{$table->TABLE_NAME}\n";
    }
    echo "\n";
} catch (Exception $e) {
    echo "   ✗ Failed: " . $e->getMessage() . "\n\n";
}

echo "3. UserProfile Schema\n";
try {
    $columns = DB::connection('mssql')->select("
        SELECT COLUMN_NAME, DATA_TYPE, IS_NULLABLE
        FROM INFORMATION_SCHEMA.COLUMNS
        WHERE TABLE_NAME = 'UserProfile'
        ORDER BY ORDINAL_POSITION
    ");

    if (empty($columns)) {
        echo "   ⚠ UserProfile table not found\n\n";
    } else {
        foreach ($columns as $col) {
            $null = $col->IS_NULLABLE === 'YES' ? 'NULL' : 'NOT NULL';
            echo "   {$col->COLUMN_NAME}: {$col->DATA_TYPE} {$null}\n";
        }
        echo "\n";
    }
} catch (Exception $e) {
    echo "   ✗ Failed: " . $e->getMessage() . "\n\n";
}

echo "4. ClassEntriesWeb Schema\n";
try {
    $columns = DB::connection('mssql')->select("
        SELECT COLUMN_NAME, DATA_TYPE, IS_NULLABLE
        FROM INFORMATION_SCHEMA.COLUMNS
        WHERE TABLE_NAME = 'ClassEntriesWeb'
        ORDER BY ORDINAL_POSITION
    ");

    if (empty($columns)) {
        echo "   ⚠ ClassEntriesWeb table not found\n\n";
    } else {
        foreach ($columns as $col) {
            $null = $col->IS_NULLABLE === 'YES' ? 'NULL' : 'NOT NULL';
            echo "   {$col->COLUMN_NAME}: {$col->DATA_TYPE} {$null}\n";
        }
        echo "\n";
    }
} catch (Exception $e) {
    echo "   ✗ Failed: " . $e->getMessage() . "\n\n";
}

echo "5. Test UserProfile Model\n";
try {
    $count = UserProfile::count();
    echo "   ✓ UserProfile model works\n";
    echo "   Records: {$count}\n\n";
} catch (Exception $e) {
    echo "   ✗ Failed: " . $e->getMessage() . "\n\n";
}

echo "6. Test Insert (dry run)\n";
try {
    $testData = [
        'Email' => 'test_' . time() . '@test.local',
        'Password' => bcrypt('test123'),
        'FullName' => 'Test User',
        'MobileNumber' => '+971501234567',
        'City' => 'Dubai',
        'Country' => 'AE',
        'RegistrationDate' => now(),
        'Status' => 'Active',
    ];

    echo "   Test data prepared:\n";
    echo "   Email: {$testData['Email']}\n";
    echo "   Name: {$testData['FullName']}\n";
    echo "   ✓ Ready for insert (skipped in dry run)\n\n";
} catch (Exception $e) {
    echo "   ✗ Failed: " . $e->getMessage() . "\n\n";
}

echo "=== Test Complete ===\n";
echo "MSSQL connection working ✓\n";
