export type ActivityPoint = {
    month: string;
    registrations: number;
    entries: number;
};

export type Registration = {
    id: number;
    rider_name: string;
    date_of_birth: string;
    status: string;
    tran_ref: string | null;
    created_at: string;
};

export type Renewal = {
    id: number;
    rider_id: number;
    season_id: number;
    status: string;
    tran_ref: string | null;
    created_at: string;
};

export type Entry = {
    id: number;
    rider_id: number;
    horse_id: number;
    event_id: number;
    class_id: number;
    status: string;
    tran_ref: string | null;
    created_at: string;
};

export type PaginatedData<T> = {
    data: T[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    links: Array<{ url: string | null; label: string; active: boolean }>;
};

export type Stats = {
    activeRegistrations: number;
    competitionEntries: number;
    renewals: number;
};
