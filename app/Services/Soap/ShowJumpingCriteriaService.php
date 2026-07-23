<?php

namespace App\Services\Soap;

class ShowJumpingCriteriaService extends BaseSoapClient
{
    protected function getWsdlUrl(): string
    {
        return config('services.soap.jumping_criteria_url') . '?WSDL';
    }

    /**
     * Check if rider is eligible for competition
     */
    public function isRiderEligible(array $params): object
    {
        return $this->call('IsRiderEligible', $params);
    }

    /**
     * Check if horse is eligible for competition
     */
    public function isHorseEligible(array $params): object
    {
        return $this->call('IsHorseEligible', $params);
    }

    /**
     * Extended rider eligibility checking
     */
    public function isRiderEligibleChecking(array $params): object
    {
        return $this->call('IsRiderEligibleChecking', $params);
    }

    /**
     * Extended horse eligibility checking
     */
    public function isHorseEligibleChecking(array $params): object
    {
        return $this->call('IsHorseEligibleChecking', $params);
    }

    /**
     * Validate rider and horse combination
     * Returns ['riderEligible' => bool, 'horseEligible' => bool]
     */
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
        // Parse based on actual WSDL response structure
        // This will need adjustment once we test with real data
        return true;
    }
}
