<?php
// Test fetching common lists (City, Division) via WSCommons

$authWsdl = 'http://wsdev.emiratesequestrian.ae/webservices/WSAuthentication.asmx?WSDL';
$commonsWsdl = 'http://wsdev.emiratesequestrian.ae/webservices/WSCommons.asmx?WSDL';

echo "=== Step 1: Authenticate ===\n";
$authClient = new SoapClient($authWsdl, ['trace' => 1, 'cache_wsdl' => WSDL_CACHE_NONE]);
$authResponse = $authClient->Login([
    'username' => 'WS_TEST',
    'password' => 'TEST@0123'
]);
echo "Auth: " . $authResponse->LoginResult->Message . "\n\n";

echo "=== Step 2: List WSCommons Functions ===\n";
$commonsClient = new SoapClient($commonsWsdl, ['trace' => 1, 'cache_wsdl' => WSDL_CACHE_NONE]);
$functions = $commonsClient->__getFunctions();
foreach ($functions as $func) {
    if (strpos($func, 'City') !== false || strpos($func, 'Division') !== false) {
        echo "  {$func}\n";
    }
}

echo "\n=== Step 3: Attempt to fetch cities ===\n";
try {
    // Try GetCities or similar - need to find exact function name
    $result = $commonsClient->GetCities();
    echo "✓ GetCities successful\n";
    print_r($result);
} catch (SoapFault $e) {
    echo "GetCities failed: {$e->getMessage()}\n";
    echo "Trying GetAllCities...\n";
    try {
        $result = $commonsClient->GetAllCities();
        echo "✓ GetAllCities successful\n";
        print_r($result);
    } catch (SoapFault $e2) {
        echo "GetAllCities also failed: {$e2->getMessage()}\n";
        echo "\nAll WSCommons functions:\n";
        foreach ($commonsClient->__getFunctions() as $f) {
            echo "  {$f}\n";
        }
    }
}
