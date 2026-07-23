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
        return DB::connection('mssql')->table($table)
            ->where('user_id', $userId)
            ->where('status', 'completed')
            ->count();
    }

    private function countCompletedBetween(string $table, int $userId, Carbon $start, Carbon $end): int
    {
        return DB::connection('mssql')->table($table)
            ->where('user_id', $userId)
            ->where('status', 'completed')
            ->whereBetween('created_at', [$start, $end])
            ->count();
    }

    public function recentRegistrations(int $userId, int $limit = 5): array
    {
        return DB::connection('mssql')->table('rider_registrations')
            ->where('user_id', $userId)
            ->orderBy('created_at', 'desc')
            ->limit($limit)
            ->get(['id', 'rider_name', 'date_of_birth', 'status', 'tran_ref', 'created_at'])
            ->map(fn($row) => (array) $row)
            ->toArray();
    }

    public function recentRenewals(int $userId, int $limit = 5): array
    {
        return DB::connection('mssql')->table('rider_renewals')
            ->where('user_id', $userId)
            ->orderBy('created_at', 'desc')
            ->limit($limit)
            ->get(['id', 'rider_id', 'season_id', 'status', 'tran_ref', 'created_at'])
            ->map(fn($row) => (array) $row)
            ->toArray();
    }

    public function recentEntries(int $userId, int $limit = 5): array
    {
        return DB::connection('mssql')->table('show_jumping_entries')
            ->where('user_id', $userId)
            ->orderBy('created_at', 'desc')
            ->limit($limit)
            ->get(['id', 'rider_id', 'horse_id', 'event_id', 'class_id', 'status', 'tran_ref', 'created_at'])
            ->map(fn($row) => (array) $row)
            ->toArray();
    }

    public function paginateRegistrations(int $userId, int $perPage = 10)
    {
        return DB::connection('mssql')->table('rider_registrations')
            ->where('user_id', $userId)
            ->orderBy('created_at', 'desc')
            ->paginate($perPage, ['id', 'rider_name', 'date_of_birth', 'status', 'tran_ref', 'created_at']);
    }

    public function paginateRenewals(int $userId, int $perPage = 10)
    {
        return DB::connection('mssql')->table('rider_renewals')
            ->where('user_id', $userId)
            ->orderBy('created_at', 'desc')
            ->paginate($perPage, ['id', 'rider_id', 'season_id', 'status', 'tran_ref', 'created_at']);
    }

    public function paginateEntries(int $userId, int $perPage = 10)
    {
        return DB::connection('mssql')->table('show_jumping_entries')
            ->where('user_id', $userId)
            ->orderBy('created_at', 'desc')
            ->paginate($perPage, ['id', 'rider_id', 'horse_id', 'event_id', 'class_id', 'status', 'tran_ref', 'created_at']);
    }
}
