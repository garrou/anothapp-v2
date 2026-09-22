export interface AdminHealthCheck {

    reachable: boolean;

    configured?: boolean;

    latencyMs?: number;

    error?: string;
}

export interface AdminHealth {

    betaseries: AdminHealthCheck;

    mailer: AdminHealthCheck;
}

export interface AdminNewUsersByDay {

    day: string;

    count: number;
}

export interface AdminLoginAttemptLimitEntry {

    userId: string;

    username: string;

    maxedOutCount: number;

    lastAttemptAt: string;
}

export interface AdminAction {

    id: string;

    adminUserId: string;

    action: string;

    targetUserId: string | null;

    createdAt: string;
}

export interface AdminUsersSummary {

    total: number;

    newByDay: AdminNewUsersByDay[];

    pendingDeletions: number;

    anonymized: number;
}

export interface AdminSessionsSummary {

    active: number;

    loginAttemptLimit: AdminLoginAttemptLimitEntry[];
}

export interface AdminDatabaseSizeSnapshot {

    recordedAt: string;

    sizeBytes: number;
}

export interface AdminDatabaseSummary {

    size: string;

    history: AdminDatabaseSizeSnapshot[];
}

export interface AdminServiceCallDay {

    day: string;

    count: number;
}

export interface AdminServiceCallStat {

    total: number;

    history: AdminServiceCallDay[];
}

export interface AdminServiceCalls {

    mailer: AdminServiceCallStat;

    betaseries: AdminServiceCallStat;

    export: AdminServiceCallStat;

    import: AdminServiceCallStat;
}

export interface AdminCatalogSizeSnapshot {

    recordedAt: string;

    shows: number;

    seasons: number;

    episodes: number;
}

export interface AdminCatalogSummary {

    history: AdminCatalogSizeSnapshot[];
}

export interface AdminDashboard {

    users: AdminUsersSummary;

    sessions: AdminSessionsSummary;

    database: AdminDatabaseSummary;

    catalog: AdminCatalogSummary;

    health: AdminHealth;

    recentActions: AdminAction[];

    serviceCalls: AdminServiceCalls;
}

export interface AdminUserSearchResult {

    id: string;

    username: string;

    email: string;
}
