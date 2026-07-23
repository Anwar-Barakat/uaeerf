<?php

namespace App\Repositories;

use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;

class DashboardRepository
{
    /**
     * Completed-record counts for the given user.
     *
     * @return array{activeRegistrations:int, competitionEntries:int, renewals:int}
     */
    public function statsForUser(int $userId): array
    {
        return [
            'activeRegistrations' => $this->countCompleted('rider_registrations', $userId),
            'competitionEntries' => $this->countCompleted('show_jumping_entries', $userId),
            'renewals' => $this->countCompleted('rider_renewals', $userId),
        ];
    }

    /**
     * Completed registrations & entries bucketed by month for the last N months.
     *
     * @return array<int, array{month:string, registrations:int, entries:int}>
     */
    public function monthlyActivityForUser(int $userId, int $months = 6): array
    {
        $activity = [];

        for ($i = $months - 1; $i >= 0; $i--) {
            $start = Carbon::now()->startOfMonth()->subMonths($i);
            $end = (clone $start)->endOfMonth();

            $activity[] = [
                'month' => $start->format('M'),
                'registrations' => $this->countCompletedBetween('rider_registrations', $userId, $start, $end),
                'entries' => $this->countCompletedBetween('show_jumping_entries', $userId, $start, $end),
            ];
        }

        return $activity;
    }

    private function countCompleted(string $table, int $userId): int
    {
        return DB::table($table)
            ->where('user_id', $userId)
            ->where('status', 'completed')
            ->count();
    }

    private function countCompletedBetween(string $table, int $userId, Carbon $start, Carbon $end): int
    {
        return DB::table($table)
            ->where('user_id', $userId)
            ->where('status', 'completed')
            ->whereBetween('created_at', [$start, $end])
            ->count();
    }
}
