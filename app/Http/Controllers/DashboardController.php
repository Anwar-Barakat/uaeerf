<?php

namespace App\Http\Controllers;

use App\Repositories\DashboardRepository;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Inertia\Inertia;
use Inertia\Response;
use Throwable;

class DashboardController extends Controller
{
    public function __construct(private readonly DashboardRepository $dashboard)
    {
    }

    public function index(Request $request): Response
    {
        $userId = $request->user()->id;

        try {
            $stats = $this->dashboard->statsForUser($userId);
            $activity = $this->dashboard->monthlyActivityForUser($userId);
        } catch (Throwable $e) {
            // DB unreachable or tables not migrated yet — degrade gracefully.
            report($e);

            $stats = [
                'activeRegistrations' => 0,
                'competitionEntries' => 0,
                'renewals' => 0,
            ];

            $activity = [];
            for ($i = 5; $i >= 0; $i--) {
                $activity[] = [
                    'month' => Carbon::now()->startOfMonth()->subMonths($i)->format('M'),
                    'registrations' => 0,
                    'entries' => 0,
                ];
            }
        }

        return Inertia::render('dashboard', [
            'stats' => $stats,
            'activity' => $activity,
        ]);
    }
}
