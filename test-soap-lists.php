<?php
// Test fetching City and Division lists

$wsdl = 'http://wsdev.emiratesequestrian.ae/webservices/WSCommons.asmx?WSDL';

$client = new SoapClient($wsdl, ['trace' => 1, 'cache_wsdl' => WSDL_CACHE_NONE]);

echo "=== Fetching City List ===\n";
try {
    $result = $client->getCityList();
    echo "✓ Success\n";
    if (isset($result->getCityListResult->any)) {
        echo "Result format: XML string\n";
        $xml = simplexml_load_string($result->getCityListResult->any);
        echo "Cities found: " . count($xml->Table ?? []) . "\n";
        foreach (($xml->Table ?? []) as $index => $city) {
            if ($index < 5) {
                echo "  - {$city->CityNameEN} (ID: {$city->CityID})\n";
            }
        }
    } else {
        print_r($result);
    }
} catch (SoapFault $e) {
    echo "✗ Failed: {$e->getMessage()}\n";
}

echo "\n=== Fetching Division List ===\n";
try {
    $result = $client->getJumpingDivisionLevelList();
    echo "✓ Success\n";
    if (isset($result->getJumpingDivisionLevelListResult->any)) {
        echo "Result format: XML string\n";
        $xml = simplexml_load_string($result->getJumpingDivisionLevelListResult->any);
        echo "Divisions found: " . count($xml->Table ?? []) . "\n";
        foreach (($xml->Table ?? []) as $index => $div) {
            if ($index < 5) {
                echo "  - {$div->DivisionLevelName} (ID: {$div->DivisionLevelID})\n";
            }
        }
    } else {
        print_r($result);
    }
} catch (SoapFault $e) {
    echo "✗ Failed: {$e->getMessage()}\n";
}
