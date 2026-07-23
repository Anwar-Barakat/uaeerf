<?php
// Test SOAP authentication flow

$wsdl = 'http://wsdev.emiratesequestrian.ae/webservices/WSAuthentication.asmx?WSDL';
$username = 'WS_TEST';
$password = 'TEST@0123';

echo "=== SOAP Client Test ===\n";
echo "WSDL: {$wsdl}\n\n";

try {
    $client = new SoapClient($wsdl, [
        'trace' => 1,
        'exceptions' => true,
        'cache_wsdl' => WSDL_CACHE_NONE,
    ]);

    echo "✓ SOAP Client created\n";
    echo "\n=== Available Functions ===\n";
    foreach ($client->__getFunctions() as $func) {
        echo "  {$func}\n";
    }

    echo "\n=== Attempting Authentication (Login) ===\n";
    $response = $client->Login([
        'username' => $username,
        'password' => $password
    ]);

    echo "✓ Authentication successful\n";
    echo "\nResponse:\n";
    print_r($response);

    // Extract token
    if (isset($response->LoginResult)) {
        $result = $response->LoginResult;
        echo "\n=== Parsed Result ===\n";
        print_r($result);
    }

    echo "\n=== Raw Request ===\n";
    echo $client->__getLastRequest() . "\n";

    echo "\n=== Raw Response ===\n";
    echo $client->__getLastResponse() . "\n";

} catch (SoapFault $e) {
    echo "✗ SOAP Error: {$e->getMessage()}\n";
    echo "Code: {$e->getCode()}\n";
    if (isset($client)) {
        echo "\nLast Request:\n" . $client->__getLastRequest() . "\n";
        echo "\nLast Response:\n" . $client->__getLastResponse() . "\n";
    }
    exit(1);
}
