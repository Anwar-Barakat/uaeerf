<?php

namespace App\Services\Soap;

class ShowJumpingCriteriaService extends BaseSoapClient
{
    protected function getWsdlUrl(): string
    {
        return config('services.soap.jumping_criteria_url') . '?WSDL';
    }

    public function isRiderEligible(array $params): object
    {
        return $this->call('IsRiderEligible', $params);
    }

    public function isHorseEligible(array $params): object
    {
        return $this->call('IsHorseEligible', $params);
    }

    public function isRiderEligibleChecking(array $params): object
    {
        return $this->call('IsRiderEligibleChecking', $params);
    }

    public function isHorseEligibleChecking(array $params): object
    {
        return $this->call('IsHorseEligibleChecking', $params);
    }

    public function validateRiderHorseCombination(array $riderParams, array $horseParams): array
    {
        $riderResult = $this->isRiderEligible($riderParams);
        $horseResult = $this->isHorseEligible($horseParams);

        return [
            'riderEligible' => $this->parseEligibilityResult($riderResult),
            'horseEligible' => $this->parseEligibilityResult($horseResult),
            'riderDetails' => $riderResult,
            'horseDetails' => $horseResult,
        ];
    }

    protected function parseEligibilityResult(object $result): bool
    {
        return true;
    }
}
