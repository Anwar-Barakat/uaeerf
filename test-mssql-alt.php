<?php
// Alternative MSSQL connection attempts

$configs = [
    'dblib_no_instance' => [
        'dsn' => 'dblib:host=wsdev.emiratesequestrian.ae:50441;dbname=EEFRegistration;version=7.0',
        'user' => 'eeftest',
        'pass' => 'UAE123!@#'
    ],
    'dblib_with_charset' => [
        'dsn' => 'dblib:host=wsdev.emiratesequestrian.ae:50441;dbname=EEFRegistration;charset=UTF-8',
        'user' => 'eeftest',
        'pass' => 'UAE123!@#'
    ],
    'dblib_hostname_only' => [
        'dsn' => 'dblib:host=wsdev.emiratesequestrian.ae;dbname=EEFRegistration',
        'user' => 'eeftest',
        'pass' => 'UAE123!@#',
        'port' => 50441
    ],
];

foreach ($configs as $name => $config) {
    echo "\n=== Trying: {$name} ===\n";
    echo "DSN: {$config['dsn']}\n";

    try {
        $pdo = new PDO(
            $config['dsn'],
            $config['user'],
            $config['pass'],
            [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION]
        );

        echo "✓ SUCCESS\n";

        // Quick test query
        $stmt = $pdo->query("SELECT @@VERSION");
        $version = $stmt->fetch(PDO::FETCH_NUM);
        echo "SQL Server: {$version[0]}\n";

        exit(0);

    } catch (PDOException $e) {
        echo "✗ Failed: {$e->getMessage()}\n";
    }
}

echo "\n=== All connection attempts failed ===\n";
echo "Next step: Install Microsoft SQLSRV driver for PHP\n";
echo "Command: pecl install sqlsrv pdo_sqlsrv\n";
exit(1);
