<?php

namespace App\Services\Soap;

class ShowJumpingCriteriaService extends BaseSoapClient
{
    protected function getWsdlUrl(): string
    {
        return config('services.soap.jumping_criteria_url') . '?WSDL';
    }

    public function isRiderEligible(string $riderId, string $eventId, string $classId, string $horseId): object
    {
        return $this->call('IsRiderEligible', [
            'RiderID' => $riderId,
            'EventID' => $eventId,
            'ClassID' => $classId,
            'HorseID' => $horseId,
        ]);
    }

    public function isHorseEligible(string $horseId, string $eventId, string $classId): object
    {
        return $this->call('IsHorseEligible', [
            'HorseID' => $horseId,
            'EventID' => $eventId,
            'ClassID' => $classId,
        ]);
    }

    public function validateRiderHorseCombination(array $params): array
    {
        $riderResult = $this->isRiderEligible(
            (string) $params['rider_id'],
            (string) $params['event_id'],
            (string) $params['class_id'],
            (string) $params['horse_id'],
        );

        $horseResult = $this->isHorseEligible(
            (string) $params['horse_id'],
            (string) $params['event_id'],
            (string) $params['class_id'],
        );

        return [
            'riderEligible' => $this->parseEligibilityResult($riderResult->IsRiderEligibleResult ?? null),
            'horseEligible' => $this->parseEligibilityResult($horseResult->IsHorseEligibleResult ?? null),
            'riderDetails' => $riderResult->IsRiderEligibleResult ?? null,
            'horseDetails' => $horseResult->IsHorseEligibleResult ?? null,
        ];
    }

    protected function parseEligibilityResult(?string $result): bool
    {
        if ($result === null) {
            return false;
        }

        return in_array(strtolower(trim($result)), ['true', '1', 'yes', 'eligible', 'ok'], true);
    }
}
