<?php

namespace App\Services\Soap;

use SoapClient;
use SoapFault;
use Illuminate\Support\Facades\Log;

abstract class BaseSoapClient
{
    protected SoapClient $client;
    protected string $wsdlUrl;

    public function __construct()
    {
        $this->wsdlUrl = $this->getWsdlUrl();
        $this->initializeClient();
    }

    abstract protected function getWsdlUrl(): string;

    protected function initializeClient(): void
    {
        try {
            $this->client = new SoapClient($this->wsdlUrl, [
                'trace' => config('app.debug'),
                'exceptions' => true,
                'cache_wsdl' => config('app.env') === 'production' ? WSDL_CACHE_DISK : WSDL_CACHE_NONE,
                'connection_timeout' => 15,
                'soap_version' => SOAP_1_1,
            ]);
        } catch (SoapFault $e) {
            Log::error('SOAP client initialization failed', [
                'wsdl' => $this->wsdlUrl,
                'error' => $e->getMessage(),
            ]);
            throw $e;
        }
    }

    protected function call(string $method, array $parameters = []): mixed
    {
        $this->ensureAuthenticated();

        try {
            $result = $this->client->__soapCall($method, [$parameters]);

            if (config('app.debug')) {
                Log::debug('SOAP call successful', [
                    'method' => $method,
                    'request' => $this->client->__getLastRequest(),
                    'response' => $this->client->__getLastResponse(),
                ]);
            }

            return $result;
        } catch (SoapFault $e) {
            Log::error('SOAP call failed', [
                'method' => $method,
                'parameters' => $parameters,
                'error' => $e->getMessage(),
                'request' => $this->client->__getLastRequest(),
                'response' => $this->client->__getLastResponse(),
            ]);
            throw $e;
        }
    }

    protected function ensureAuthenticated(): void
    {
        if ($this instanceof AuthenticationService) {
            return;
        }

        if (!app(AuthenticationService::class)->authenticateAndCache()) {
            Log::error('SOAP authentication handshake failed', [
                'service' => static::class,
            ]);

            throw new SoapFault('Client', 'SOAP authentication handshake failed');
        }
    }

    public function getFunctions(): array
    {
        return $this->client->__getFunctions();
    }

    public function getTypes(): array
    {
        return $this->client->__getTypes();
    }
}
