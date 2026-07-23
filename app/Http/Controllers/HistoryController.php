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
        $search = $request->input('search');
        $registrations = $this->dashboard->paginateRegistrations($userId, $search);

        return Inertia::render('history/registrations', [
            'registrations' => $registrations,
            'filters' => ['search' => $search],
        ]);
    }

    public function renewals(Request $request): Response
    {
        $userId = $request->user()->id;
        $search = $request->input('search');
        $renewals = $this->dashboard->paginateRenewals($userId, $search);

        return Inertia::render('history/renewals', [
            'renewals' => $renewals,
            'filters' => ['search' => $search],
        ]);
    }

    public function entries(Request $request): Response
    {
        $userId = $request->user()->id;
        $search = $request->input('search');
        $entries = $this->dashboard->paginateEntries($userId, $search);

        return Inertia::render('history/entries', [
            'entries' => $entries,
            'filters' => ['search' => $search],
        ]);
    }
}
