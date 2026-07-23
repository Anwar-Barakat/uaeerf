<?php

namespace App\Http\Controllers;

use App\Repositories\DashboardRepository;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class HistoryController extends Controller
{
    public function __construct(private readonly DashboardRepository $dashboard)
    {
    }

    public function registrations(Request $request): Response
    {
        $userId = $request->user()->id;
        $registrations = $this->dashboard->paginateRegistrations($userId);

        return Inertia::render('history/registrations', [
            'registrations' => $registrations,
        ]);
    }

    public function renewals(Request $request): Response
    {
        $userId = $request->user()->id;
        $renewals = $this->dashboard->paginateRenewals($userId);

        return Inertia::render('history/renewals', [
            'renewals' => $renewals,
        ]);
    }

    public function entries(Request $request): Response
    {
        $userId = $request->user()->id;
        $entries = $this->dashboard->paginateEntries($userId);

        return Inertia::render('history/entries', [
            'entries' => $entries,
        ]);
    }
}
