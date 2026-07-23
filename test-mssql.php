<?php
// Quick MSSQL connection test using pdo_dblib (FreeTDS)
$host = 'wsdev.emiratesequestrian.ae';
$port = '50441';
$database = 'EEFRegistration';
$username = 'eeftest';
$password = 'UAE123!@#';

try {
    // pdo_dblib DSN format
    $dsn = "dblib:host={$host}:{$port};dbname={$database}";
    echo "Attempting connection to: {$dsn}\n";

    $pdo = new PDO($dsn, $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    echo "✓ Connection successful\n\n";

    // Test query: list tables in EEFRegistration schema
    $stmt = $pdo->query("SELECT TABLE_SCHEMA, TABLE_NAME FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_TYPE = 'BASE TABLE' ORDER BY TABLE_SCHEMA, TABLE_NAME");
    $tables = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo "=== Available Tables ===\n";
    foreach ($tables as $table) {
        echo "{$table['TABLE_SCHEMA']}.{$table['TABLE_NAME']}\n";
    }

    echo "\n=== UserProfile table structure ===\n";
    $stmt = $pdo->query("SELECT COLUMN_NAME, DATA_TYPE, CHARACTER_MAXIMUM_LENGTH, IS_NULLABLE FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'UserProfile' ORDER BY ORDINAL_POSITION");
    $columns = $stmt->fetchAll(PDO::FETCH_ASSOC);
    foreach ($columns as $col) {
        $len = $col['CHARACTER_MAXIMUM_LENGTH'] ? "({$col['CHARACTER_MAXIMUM_LENGTH']})" : '';
        echo "{$col['COLUMN_NAME']}: {$col['DATA_TYPE']}{$len} " . ($col['IS_NULLABLE'] === 'YES' ? 'NULL' : 'NOT NULL') . "\n";
    }

    echo "\n=== ClassEntriesWeb table structure ===\n";
    $stmt = $pdo->query("SELECT COLUMN_NAME, DATA_TYPE, CHARACTER_MAXIMUM_LENGTH, IS_NULLABLE FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'ClassEntriesWeb' ORDER BY ORDINAL_POSITION");
    $columns = $stmt->fetchAll(PDO::FETCH_ASSOC);
    foreach ($columns as $col) {
        $len = $col['CHARACTER_MAXIMUM_LENGTH'] ? "({$col['CHARACTER_MAXIMUM_LENGTH']})" : '';
        echo "{$col['COLUMN_NAME']}: {$col['DATA_TYPE']}{$len} " . ($col['IS_NULLABLE'] === 'YES' ? 'NULL' : 'NOT NULL') . "\n";
    }

} catch (PDOException $e) {
    echo "✗ Connection failed: " . $e->getMessage() . "\n";
    exit(1);
}
